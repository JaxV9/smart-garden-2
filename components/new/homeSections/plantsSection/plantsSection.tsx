import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View, FlatList, Image } from "react-native";
import { router } from "expo-router";

import { useGardenContext } from "@/contexts/garden.context";
import { useGarden } from "@/hooks/useGarden";
import { useVegetablesContext } from "@/contexts/vegetables.context";

import type { GardenVegetable } from "@/models/models";
import { VegetableCard } from "@/components/new/vegetablesList/vegetable/vegetable";
import { useTranslation } from "@/contexts/language.context";

export function PlantsSection() {
  const { gardenVegetables } = useGardenContext();
  const { loadGardenVegetables } = useGarden();
  const { vegetablesContext } = useVegetablesContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (vegetablesContext.length > 0) {
      loadGardenVegetables();
    }
  }, [vegetablesContext.length]);

  const goToPlantDetails = (id: string) => {
    router.push(`/vegetable/${id}`);
  };

  const goToAddVegetable = () => {
    router.push("/(tabs)/plante");
  };

if (!gardenVegetables || gardenVegetables.length === 0) {
    return (
        <View style={styles.emptyContainer}>
        <Image
            source={require("@/assets/images/empty-garden.png")}
            style={styles.emptyImage}
            resizeMode="contain"
        />

        <Text style={styles.emptyText}>
            {t('home_empty_title')}
        </Text>

        <Pressable style={styles.cta} onPress={goToAddVegetable}>
            <Text style={styles.ctaText}>{t('home_add_plant_btn')}</Text>
        </Pressable>
        </View>
    );
}

  return (
    <View style={styles.sectionContainer}>
      <FlatList
        data={gardenVegetables}
        keyExtractor={(item: GardenVegetable) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <VegetableCard
            vegetable={item}
            callBack={() => goToPlantDetails(item.id)}
          />
        )}
      />

      <Pressable style={[styles.cta, { marginTop: 16 }]} onPress={goToAddVegetable}>
        <Text style={styles.ctaText}>{t('home_add_plant_btn')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    marginTop: 12,
  },
  listContent: {
    paddingBottom: 16,
    gap: 14,
    paddingHorizontal: 6,
  },

  emptyContainer: {
    marginTop: 28,
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
emptyImage: {
  width: 220,
  height: 220,
  marginBottom: 24,
},

  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginBottom: 24,
},

  cta: {
    height: 48,
    borderRadius: 8,
    backgroundColor: "#4F8F46",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    alignSelf: "stretch",
    marginHorizontal: 8,
  },
  ctaText: {
    color: "#FFFFFF",
    fontWeight: "700",
    letterSpacing: 0.8,
  },
});
