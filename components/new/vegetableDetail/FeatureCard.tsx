import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../css/vegetableDetailsStyle";

export function FeatureCard({
  icon,
  title,
  value,
  variant = "neutral",
}: {
  icon: any;
  title: string;
  value: string;
  variant?: "neutral" | "mint" | "sand" | "rose";
}) {
  const bg =
    variant === "mint"
      ? styles.featureMint
      : variant === "sand"
      ? styles.featureSand
      : variant === "rose"
      ? styles.featureRose
      : styles.featureNeutral;

  return (
    <View style={[styles.feature, bg]}>
      <View style={styles.featureHeader}>
        <Ionicons name={icon} size={16} color="#111827" />
        <Text style={styles.featureTitle}>{title}</Text>
      </View>
      <Text style={styles.featureValue}>{value}</Text>
    </View>
  );
}