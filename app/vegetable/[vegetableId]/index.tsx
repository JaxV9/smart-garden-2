import { useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";

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
import { useUser } from "@/hooks/useUser";

export default function Index() {
  const { vegetableId } = useLocalSearchParams<{ vegetableId: string }>();
  const vm = useVegetableDetails(vegetableId);

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
        <Text style={styles.emptyText}>Chargement…</Text>
      </View>
    );
  }

  if (vm.state === "error") {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Erreur de chargement : {vm.error}</Text>
      </View>
    );
  }

  if (vm.state === "not_found") {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Plante introuvable.</Text>
      </View>
    );
  }

  return (
    <vm.SafeArea style={styles.safeArea}>
      <vm.Scroll
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
          <VegetableMeta
            name={vm.vegetable.name}
            family={vm.family}
            scientific={vm.scientific}
          />

          <Text style={styles.h2}>Description</Text>
          <Text style={styles.description}>{vm.vegetable.description}</Text>

          <Text style={styles.h2}>Caractéristiques</Text>
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon="calendar-outline"
              title="Saison"
              value={vm.season || "—"}
              variant="neutral"
            />
            <FeatureCard
              icon="water-outline"
              title="Arrosage"
              value={vm.watering || "—"}
              variant="mint"
            />
            <FeatureCard
              icon="thermometer-outline"
              title="Température"
              value={vm.temp || "—"}
              variant="rose"
            />
            <FeatureCard
              icon="sunny-outline"
              title="Soleil"
              value={vm.sun || "—"}
              variant="sand"
            />
          </View>

          <Text style={styles.h2}>Calendrier de culture</Text>
          <CultureCalendar
            sowingRange={vm.sowingRange}
            plantationRange={vm.plantationRange}
            harvestRange={vm.harvestRange}
          />

          <Text style={styles.h2}>Conseils</Text>
          <TipsList tips={vm.advices} />

          {vm.affinityPlants.length > 0 && (
            <>
              <Text style={styles.h2}>Plantes amies</Text>
              <PlantGrid plants={vm.affinityPlants} prefix="a" />
            </>
          )}

          {vm.enemyPlants.length > 0 && (
            <>
              <Text style={styles.h2}>Plantes ennemies</Text>
              <PlantGrid plants={vm.enemyPlants} prefix="e" />
            </>
          )}
        </View>
      </vm.Scroll>
      {
        isInGarden(vm.vegetable) ?
          <GardenSheetCTA
            insetsBottom={vm.insets.bottom} text={'RETIRER DU JARDIN'}
            callback={() => removeVegetablesFromGardenHandle(vm.vegetable.id)} isAlert={true}
          />
          :
          <GardenSheetCTA
            insetsBottom={vm.insets.bottom} text={'AJOUTER AU JARDIN'}
            callback={() => addVegetableToGarden(vm.vegetable)} isAlert={false}
          />
      }

    </vm.SafeArea>
  );
}