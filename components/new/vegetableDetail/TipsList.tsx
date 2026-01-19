import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../css/vegetableDetailsStyle";

export function TipsList({ tips }: { tips: string[] }) {
  return (
    <View style={styles.tips}>
      {tips.map((tip, idx) => (
        <View key={`${idx}-${tip}`} style={styles.tipRow}>
          <Ionicons name="leaf-outline" size={16} color="#2F6B3B" />
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );
}