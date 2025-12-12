import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";

export function AddToGardenCTA({
  insetsBottom,
  onAdd,
}: {
  insetsBottom: number;
  onAdd: () => void;
}) {
  return (
    <View style={[styles.ctaBar, { paddingBottom: 14 + insetsBottom }]}>
      <TouchableOpacity
        style={styles.ctaButton}
        activeOpacity={0.9}
        onPress={onAdd}
      >
        <Text style={styles.ctaText}>AJOUTER AU JARDIN</Text>
      </TouchableOpacity>
    </View>
  );
}
