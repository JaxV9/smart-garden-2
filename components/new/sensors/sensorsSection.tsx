import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFetch } from '@/hooks/useFetch';

type SensorReading = {
  id: string;
  sensor_id: string;
  sensor_name: string;
  value_numeric: number;
  raw_value: number | null;
  created_at: string;
  recorded_at: string | null;
};

const FAKE_TEMPERATURE = 22;
const FAKE_LIGHT = 85;

type MetricCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
  backgroundColor: string;
  valueColor?: string;
  showPulse?: boolean;
};

function MetricCard({
  icon,
  value,
  label,
  backgroundColor,
  valueColor,
  showPulse,
}: MetricCardProps) {
  return (
    <View style={[styles.metricCard, { backgroundColor }]}>
      <Ionicons name={icon} size={22} color="#111827" />
      <View style={styles.metricValueRow}>
        <Text style={[styles.metricValue, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
        {showPulse && (
          <Ionicons name="pulse-outline" size={16} color="#22C55E" />
        )}
      </View>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

export function SensorsSection() {
  const { httpClient } = useFetch(undefined);
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [hasData, setHasData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    let isActive = true;

    const fetchLatest = async () => {
      if (!hasLoadedOnce) {
        setLoading(true);
      }
      const http = await httpClient;
      const response = await http.get('/api/sensor-readings/latest');

      if (!isActive) {
        return;
      }

      if (response.status === 'Failure') {
        setHasData(false);
        setReading(null);
        if (!hasLoadedOnce) {
          setLoading(false);
        }
        return;
      }

      setHasData(true);
      setReading(response.payload as SensorReading);
      if (!hasLoadedOnce) {
        setLoading(false);
        setHasLoadedOnce(true);
      }
    };

    fetchLatest();
    const intervalId = setInterval(fetchLatest, 1000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [httpClient, hasLoadedOnce]);

  const updatedLabel = (() => {
    if (!reading?.created_at) {
      return 'Mis à jour: -';
    }
    const date = new Date(reading.created_at);
    if (Number.isNaN(date.getTime())) {
      return 'Mis à jour: -';
    }
    return `Mis à jour: ${date.toLocaleString('fr-FR')}`;
  })();

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {loading && <ActivityIndicator style={styles.loader} />}
        {!hasData && (
          <View style={styles.noDataCard}>
            <Text style={styles.noDataText}>Aucune donnée capteur.</Text>
          </View>
        )}
        {hasData && reading && (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>
                {reading.sensor_name || 'Capteur Basilic'}
              </Text>
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                icon="water-outline"
                value={`${reading.value_numeric}%`}
                label="Humidité"
                backgroundColor="#EAF4FF"
                showPulse
                valueColor="#111827"
              />
              <MetricCard
                icon="thermometer-outline"
                value={`${FAKE_TEMPERATURE}°C`}
                label="Temp."
                backgroundColor="#FFF2E8"
              />
              <MetricCard
                icon="sunny-outline"
                value={`${FAKE_LIGHT}%`}
                label="Lumière"
                backgroundColor="#FFF9DB"
              />
            </View>
            <Text style={styles.updated}>{updatedLabel}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    gap: 16,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metricValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  updated: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'right',
  },
  noDataCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  loader: {
    marginTop: 8,
    alignSelf: 'center',
  },
});
