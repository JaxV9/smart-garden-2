import React from "react";
import { Image, Text, View } from "react-native";
import { gardenPlantCardStyles as s } from "@/css/gardenPlantCardStyle";

type Props = {
  name: string;
  imageUri?: string;
};

export function GardenPlantCard({ name, imageUri }: Props) {
  return (
    <View style={s.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={s.image} resizeMode="cover" />
      ) : (
        <View style={[s.image, s.placeholder]}>
          <Text style={s.placeholderText}>
            {(name?.[0] ?? "?").toUpperCase()}
          </Text>
        </View>
      )}

      <Text style={s.title} numberOfLines={1}>
        {name}
      </Text>
    </View>
  );
}
