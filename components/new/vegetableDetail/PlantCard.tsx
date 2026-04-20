import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";

export function PlantCard({
  name,
  imageUri,
  onPress,
}: {
  name: string;
  imageUri?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      style={styles.plantCard}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
    >
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
    </Pressable>
  );
}
