import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../css/vegetableDetailsStyle";
import { useTranslation } from "@/contexts/language.context";

export function VegetableHeader({
  imageUri,
  onBack,
  insetsTop,
}: {
  imageUri: string;
  onBack: () => void;
  insetsTop: number;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.coverWrapper}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.cover} />
      ) : (
        <View style={[styles.cover, styles.coverPlaceholder]}>
          <Text style={styles.placeholderText}>{t('doc_image_unavailable', 'Image indisponible')}</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButton, { top: 14 + insetsTop }]}
        accessibilityLabel={t('back') || "Retour"}
        activeOpacity={0.9}
      >
        <Ionicons name="chevron-back" size={22} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}
