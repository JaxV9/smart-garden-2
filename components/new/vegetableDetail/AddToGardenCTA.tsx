import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";

export function GardenSheetCTA({
  insetsBottom,
  callback,
  text,
  isAlert
}: {
  insetsBottom: number;
  callback: () => void;
  text: string,
  isAlert: boolean
}) {
  return (
    <View style={[styles.ctaBar, { paddingBottom: 14 + insetsBottom }]}>
      <TouchableOpacity
        style={[styles.ctaButton, isAlert ? styles.red : styles.green]}
        activeOpacity={0.9}
        onPress={callback}
      >
        <Text style={styles.ctaText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}
