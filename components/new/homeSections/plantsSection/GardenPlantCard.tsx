import React from "react";
import { Image, Text, View } from "react-native";
import { gardenPlantCardStyles as s } from "@/css/gardenPlantCardStyle";

type Props = {
  name: string;
  imageUri?: string;
};

export function GardenPlantCard({ name, imageUri }: Props) {
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [imageUri]);

  return (
    <View style={s.card}>
      {imageUri && !hasError ? (
        <Image
          source={{ uri: imageUri }}
          style={s.image}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
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
