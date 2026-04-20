import React from "react";
import { View } from "react-native";
import { router } from "expo-router";
import { styles } from "../../../css/vegetableDetailsStyle";
import type { PlantRef } from "../../../types/types";
import { PlantCard } from "./PlantCard";

export function PlantGrid({
  plants,
  prefix,
}: {
  plants: PlantRef[];
  prefix: string;
}) {
  return (
    <View style={styles.plantsGrid}>
      {plants.map((p) => (
        <PlantCard
          key={`${prefix}-${p.name}`}
          name={p.name}
          imageUri={p.image}
          onPress={
            p.id
              ? () =>
                  router.push({
                    pathname: "/vegetable/[vegetableId]",
                    params: { vegetableId: p.id },
                  })
              : undefined
          }
        />
      ))}
    </View>
  );
}
