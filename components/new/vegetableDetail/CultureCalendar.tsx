import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";
import { MONTHS_SHORT } from "../../../utils/month";
import type { MonthRange } from "../../../types/types";

function TimelineBar({
  label,
  fullLabel,
  range,
  style,
}: {
  label: string;
  fullLabel: string;
  range: MonthRange;
  style: any;
}) {
  if (!range) return null;
  const leftPct = (range.start / 12) * 100;
  const widthPct = ((range.end - range.start + 1) / 12) * 100;
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => Alert.alert(fullLabel)}
      style={[
        styles.timelineBar,
        style,
        { left: `${leftPct}%`, width: `${widthPct}%` },
      ]}
    >
      <Text style={styles.timelineBarText}>{label}</Text>
    </TouchableOpacity>
  );
}

export function CultureCalendar({
  sowingRange,
  plantationRange,
  harvestRange,
}: {
  sowingRange: MonthRange;
  plantationRange: MonthRange;
  harvestRange: MonthRange;
}) {
  return (
    <View style={styles.calendar}>
      <View style={styles.monthsRow}>
        {MONTHS_SHORT.map((m, idx) => (
          <Text key={`${m}-${idx}`} style={styles.monthText}>
            {m}
          </Text>
        ))}
      </View>

      <View style={styles.timelineTrack}>
        <TimelineBar
          label="S"
          fullLabel="Semis"
          range={sowingRange}
          style={styles.timelineSowing}
        />
        <TimelineBar
          label="P"
          fullLabel="Plantation"
          range={plantationRange}
          style={styles.timelinePlantation}
        />
        <TimelineBar
          label="R"
          fullLabel="Récolte"
          range={harvestRange}
          style={styles.timelineHarvest}
        />
      </View>
    </View>
  );
}
