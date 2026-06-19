import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Animated, ScrollView } from "react-native";
import { useUserContext } from "@/contexts/user.context";
import { useTranslation } from "@/contexts/language.context";
import { useTour } from "@/contexts/tour.context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

import { styles } from "../../../css/vegetableDetailsStyle";
import { useVegetableDetails } from "../../../hooks/useVegetableDetails";

import { useGardenContext } from "@/contexts/garden.context";
import { useGarden } from "@/hooks/useGarden";
import { Vegetable } from "@/models/models";
import { GardenSheetCTA } from "../../../components/new/vegetableDetail/AddToGardenCTA";
import { CultureCalendar } from "../../../components/new/vegetableDetail/CultureCalendar";
import { FeatureCard } from "../../../components/new/vegetableDetail/FeatureCard";
import { PlantGrid } from "../../../components/new/vegetableDetail/PlantGrid";
import { TipsList } from "../../../components/new/vegetableDetail/TipsList";
import { VegetableHeader } from "../../../components/new/vegetableDetail/VegetableHeader";
import { VegetableMeta } from "../../../components/new/vegetableDetail/VegetableMeta";

export default function Index() {
  const router = useRouter();
  const { isPremium } = useUserContext();
  const { t } = useTranslation();
  const { vegetableId } = useLocalSearchParams<{ vegetableId: string }>();
  const vm = useVegetableDetails(vegetableId);

  const { registerElement, step, visible } = useTour();

  const scrollRef = useRef<ScrollView>(null);
  const metaRef = useRef<View>(null);
  const lockRef = useRef<View>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  const measureAll = () => {
    setTimeout(() => {
      metaRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('vegetable_meta', { x, y, width: w, height: h });
      });
      lockRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('vegetable_lock_overlay', { x, y, width: w, height: h });
      });
    }, 320);
  };

  useEffect(() => {
    if (step === 11) {
      scrollRef.current?.scrollTo({ y: 130, animated: true });
    }
    measureAll();
  }, [step]);

  useEffect(() => {
    if (!isPremium && !visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 35,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isPremium, visible]);

  const { addVegetableToGarden, removeVegetablesFromGarden } = useGarden()
  const { gardenVegetables } = useGardenContext()

  function isInGarden(vegetable: Vegetable) {
    if (gardenVegetables.find((gardenVegetable) => gardenVegetable.id === vegetable.id)) {
      return true
    }
    return false
  }

  function removeVegetablesFromGardenHandle(vegetableId: string) {
    const vegetableFromGarden = gardenVegetables.find(gardenVegetable => gardenVegetable.id === vegetableId);
    if (vegetableFromGarden !== undefined) {
      removeVegetablesFromGarden(vegetableFromGarden)
    }
  }

  if (vm.state === "loading") {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('loading')}</Text>
      </View>
    );
  }

  if (vm.state === "error") {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('error_loading')}{vm.error}</Text>
      </View>
    );
  }

  if (vm.state === "not_found") {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('plant_not_found')}</Text>
      </View>
    );
  }

  return (
    <vm.SafeArea style={styles.safeArea}>
      <vm.Scroll
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={vm.contentContainerStyle}
        showsVerticalScrollIndicator={false}
      >
        <VegetableHeader
          imageUri={vm.imageUri}
          onBack={vm.onBack}
          insetsTop={vm.insets.top}
        />

        <View style={styles.sheet}>
          <View 
            ref={metaRef}
            onLayout={measureAll}
          >
            <VegetableMeta
              name={vm.vegetable.name}
              family={vm.family}
              scientific={vm.scientific}
            />
          </View>

          <Text style={styles.h2}>{t('plant_desc')}</Text>
          <Text style={styles.description}>{vm.vegetable.description}</Text>

          <Text style={styles.h2}>{t('plant_features')}</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="calendar-outline"
              title={t('plant_feat_season')}
              value={vm.season || "—"}
              variant="neutral"
            />
            <FeatureCard
              icon="water-outline"
              title={t('plant_feat_watering')}
              value={vm.watering || "—"}
              variant="mint"
            />
            <FeatureCard
              icon="thermometer-outline"
              title={t('plant_feat_temp')}
              value={vm.temp || "—"}
              variant="rose"
            />
            <FeatureCard
              icon="sunny-outline"
              title={t('plant_feat_sun')}
              value={vm.sun || "—"}
              variant="sand"
            />
          </View>

          <View style={{ position: 'relative', marginTop: 24 }}>
            <Text style={[styles.h2, { marginTop: 0 }]}>{t('plant_culture_calendar')}</Text>
            <CultureCalendar
              sowingRange={vm.sowingRange}
              plantationRange={vm.plantationRange}
              harvestRange={vm.harvestRange}
            />

            <Text style={styles.h2}>{t('plant_advice')}</Text>
            <TipsList tips={vm.advices} />

            {vm.affinityPlants.length > 0 && (
              <>
                <Text style={styles.h2}>{t('plant_affinity')}</Text>
                <PlantGrid plants={vm.affinityPlants} prefix="a" />
              </>
            )}

            {vm.enemyPlants.length > 0 && (
              <>
                <Text style={styles.h2}>{t('plant_enemy')}</Text>
                <PlantGrid plants={vm.enemyPlants} prefix="e" />
              </>
            )}

            {!isPremium && !visible && (
              <Animated.View 
                ref={lockRef}
                onLayout={measureAll}
                style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}
              >
                <BlurView intensity={75} tint="light" style={StyleSheet.absoluteFill} />
                <Animated.View style={[styles.lockedContainer, { marginTop: 40, backgroundColor: 'transparent', borderWidth: 0, transform: [{ scale: scaleAnim }] }]}>
                  <Ionicons name="lock-closed" size={36} color="#D4AF37" style={styles.lockIcon} />
                  <Text style={styles.lockedTitle}>{t('plant_locked_title')}</Text>
                  <Text style={styles.lockedSub}>{t('plant_locked_sub')}</Text>
                  <TouchableOpacity 
                    style={styles.unlockBtn}
                    onPress={() => router.push('/premium' as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.unlockBtnText}>{t('plant_locked_btn')}</Text>
                  </TouchableOpacity>
                </Animated.View>
              </Animated.View>
            )}
          </View>
        </View>
      </vm.Scroll>
      {
        isInGarden(vm.vegetable) ?
          <GardenSheetCTA
            insetsBottom={vm.insets.bottom} text={t('plant_remove_garden')}
            callback={() => removeVegetablesFromGardenHandle(vm.vegetable.id)} isAlert={true}
          />
          :
          <GardenSheetCTA
            insetsBottom={vm.insets.bottom} text={t('plant_add_garden')}
            callback={() => addVegetableToGarden(vm.vegetable)} isAlert={false}
          />
      }

    </vm.SafeArea>
  );
}