import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";

export function PlantCard({ name, imageUri }: { name: string; imageUri?: string }) {
  return (
    <View style={styles.plantCard}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.plantImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.plantImage, styles.plantPlaceholder]}>
          <Text style={styles.plantPlaceholderText}>
            {(name?.[0] ?? "?").toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.plantName} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}