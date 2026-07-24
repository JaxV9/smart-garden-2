import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";
import { useTranslation } from "@/contexts/language.context";

export function PlantCard({
  id,
  name,
  imageUri,
  onPress,
}: {
  id?: string;
  name: string;
  imageUri?: string;
  onPress?: () => void;
}) {
  const { t } = useTranslation();
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [imageUri]);

  return (
    <Pressable
      style={styles.plantCard}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
    >
      {imageUri && !hasError ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.plantImage}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View style={[styles.plantImage, styles.plantPlaceholder]}>
          <Text style={styles.plantPlaceholderText}>
            {(name?.[0] ?? "?").toUpperCase()}
          </Text>
        </View>
      )}
      <Text style={styles.plantName} numberOfLines={1}>
        {id ? t('veg_name_' + id, name) : name}
      </Text>
    </Pressable>
  );
}
