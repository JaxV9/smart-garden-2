import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../../css/vegetableDetailsStyle";
import { useTranslation } from "@/contexts/language.context";

const MONTHS_KEYS = [
  'month_janvier',
  'month_février',
  'month_mars',
  'month_avril',
  'month_mai',
  'month_juin',
  'month_juillet',
  'month_août',
  'month_septembre',
  'month_octobre',
  'month_novembre',
  'month_décembre'
];

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
  const { t } = useTranslation();

  const getShortMonthName = (monthKey: string) => {
    const full = t(monthKey);
    if (full.endsWith('月')) {
      return full.replace('月', '');
    }
    return full.charAt(0).toUpperCase();
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.monthsRow}>
        {MONTHS_KEYS.map((mKey, idx) => (
          <Text key={`${mKey}-${idx}`} style={styles.monthText}>
            {getShortMonthName(mKey)}
          </Text>
        ))}
      </View>

      <View style={styles.timelineTrack}>
        <TimelineBar
          label={t('doc_calendar_sowing_short', 'S')}
          fullLabel={t('doc_filter_sowing_period')}
          range={sowingRange}
          style={styles.timelineSowing}
        />
        <TimelineBar
          label={t('doc_calendar_planting_short', 'P')}
          fullLabel={t('doc_filter_planting_period')}
          range={plantationRange}
          style={styles.timelinePlantation}
        />
        <TimelineBar
          label={t('doc_calendar_harvest_short', 'R')}
          fullLabel={t('doc_filter_harvest_period')}
          range={harvestRange}
          style={styles.timelineHarvest}
        />
      </View>
    </View>
  );
}
