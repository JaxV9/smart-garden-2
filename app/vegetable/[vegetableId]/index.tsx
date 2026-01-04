import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

import { useVegetableDetails } from "../../../hooks/useVegetableDetails";
import { styles } from "../../../css/vegetableDetailsStyle";

import { VegetableHeader } from "../../../components/new/vegetableDetail/VegetableHeader";
import { VegetableMeta } from "../../../components/new/vegetableDetail/VegetableMeta";
import { FeatureCard } from "../../../components/new/vegetableDetail/FeatureCard";
import { CultureCalendar } from "../../../components/new/vegetableDetail/CultureCalendar";
import { TipsList } from "../../../components/new/vegetableDetail/TipsList";
import { PlantGrid } from "../../../components/new/vegetableDetail/PlantGrid";
import { AddToGardenCTA } from "../../../components/new/vegetableDetail/AddToGardenCTA";

export default function Index() {
  const { vegetableId } = useLocalSearchParams<{ vegetableId: string }>();
  const vm = useVegetableDetails(vegetableId);

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
          <TipsList tips={vm.conseils} />

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

      <AddToGardenCTA
        insetsBottom={vm.insets.bottom}
        onAdd={() => vm.onAddToGarden(vm.vegetable.id)}
      />
    </vm.SafeArea>
  );
}