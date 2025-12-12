import React from "react";
import { View, Text } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";

export function VegetableMeta({
  name,
  family,
  scientific,
}: {
  name: string;
  family: string;
  scientific: string;
}) {
  return (
    <>
      <Text style={styles.title}>{name}</Text>
      <View style={styles.subRow}>
        {!!family && <Text style={styles.subText}>{family}</Text>}
        {!!scientific && <Text style={styles.dot}>•</Text>}
        {!!scientific && <Text style={styles.subText}>{scientific}</Text>}
      </View>
    </>
  );
}
