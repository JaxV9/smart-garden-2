import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFetch } from '@/hooks/useFetch';
import { GardenSensor } from '@/models/models';
import { AddSensorModal } from './AddSensorModal';

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

function displayUnit(unit: string): string {
  return unit === 'C' ? '°C' : unit;
}

export function SensorsSection() {
  const { httpClient } = useFetch(undefined);
  const [sensors, setSensors] = useState<GardenSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pairingVisible, setPairingVisible] = useState(false);
  const [actionSensorId, setActionSensorId] = useState<string | null>(null);

  const loadSensors = useCallback(
    async (showLoader = false) => {
      if (showLoader) {
        setLoading(true);
      }

      try {
        const http = await httpClient;
        const response = await http.get('/api/sensors');

        if (response.status === 'Failure') {
          setError('Impossible de charger les capteurs.');
          setSensors([]);
          return;
        }

        setError(null);
        setSensors(response.payload as GardenSensor[]);
      } catch {
        setError('Impossible de charger les capteurs.');
        setSensors([]);
      } finally {
        setLoading(false);
      }
    },
    [httpClient]
  );

  const toggleSensorCollection = useCallback(
    async (sensor: GardenSensor) => {
      setActionSensorId(sensor.id);
      setError(null);

      try {
        const http = await httpClient;
        const action = sensor.data_collection_enabled ? 'stop' : 'start';
        const response = await http.post(`/api/sensors/${sensor.id}/${action}`, {});

        if (response.status === 'Failure') {
          setError("Impossible de modifier l'état de collecte.");
          return;
        }

        await loadSensors();
      } catch {
        setError("Impossible de modifier l'état de collecte.");
      } finally {
        setActionSensorId(null);
      }
    },
    [httpClient, loadSensors]
  );

  useEffect(() => {
    let isActive = true;

    const loadActiveSensors = async (showLoader = false) => {
      await loadSensors(showLoader);
      if (!isActive) {
        return;
      }
    };

    loadActiveSensors(true);
    const intervalId = setInterval(() => loadActiveSensors(), 5000);

    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [loadSensors]);

  const humiditySensor = useMemo(
    () => sensors.find((sensor) => sensor.type === 'humidity'),
    [sensors]
  );
  const temperatureSensor = useMemo(
    () => sensors.find((sensor) => sensor.type === 'temperature'),
    [sensors]
  );
  const latestUpdatedAt = useMemo(() => {
    const dates = sensors
      .map((sensor) => sensor.latest_reading?.updated_at || sensor.latest_reading?.created_at)
      .filter(Boolean)
      .sort();

    return dates[dates.length - 1];
  }, [sensors]);

  const updatedLabel = (() => {
    if (!latestUpdatedAt) {
      return 'Mis à jour: -';
    }
    const date = new Date(latestUpdatedAt);
    if (Number.isNaN(date.getTime())) {
      return 'Mis à jour: -';
    }
    return `Mis à jour: ${date.toLocaleString('fr-FR')}`;
  })();

  const humidityValue =
    humiditySensor?.latest_reading?.value_numeric === undefined
      ? '-'
      : `${Math.round(humiditySensor.latest_reading.value_numeric)}${displayUnit(humiditySensor.unit)}`;
  const temperatureValue =
    temperatureSensor?.latest_reading?.value_numeric === undefined
      ? '-'
      : `${temperatureSensor.latest_reading.value_numeric.toFixed(1)}${displayUnit(temperatureSensor.unit)}`;
  const sensorTitle = sensors.length === 1 ? sensors[0].name : `${sensors.length} capteurs`;
  const hasSensors = sensors.length > 0;

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.sectionTitle}>Mes capteurs</Text>
          <Pressable style={styles.addButton} onPress={() => setPairingVisible(true)}>
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Ajouter</Text>
          </Pressable>
        </View>

        {loading && !hasSensors && <ActivityIndicator style={styles.loader} />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && !hasSensors && (
          <View style={styles.noDataCard}>
            <Ionicons name="wifi-outline" size={28} color="#2F7D32" />
            <Text style={styles.noDataTitle}>Aucun capteur associé.</Text>
            <Text style={styles.noDataText}>
              Configure un capteur allumé pour afficher ses mesures.
            </Text>
            <Pressable style={styles.emptyAction} onPress={() => setPairingVisible(true)}>
              <Ionicons name="add-circle-outline" size={18} color="#2F7D32" />
              <Text style={styles.emptyActionText}>Ajouter un capteur</Text>
            </Pressable>
          </View>
        )}

        {hasSensors && (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>
                {sensorTitle}
              </Text>
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </View>
            <View style={styles.metricsRow}>
              <MetricCard
                icon="water-outline"
                value={humidityValue}
                label="Humidité"
                backgroundColor="#EAF4FF"
                showPulse={!!humiditySensor?.latest_reading}
                valueColor="#111827"
              />
              <MetricCard
                icon="thermometer-outline"
                value={temperatureValue}
                label="Temp."
                backgroundColor="#FFF2E8"
                showPulse={!!temperatureSensor?.latest_reading}
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

        {hasSensors && (
          <View style={styles.sensorList}>
            {sensors.map((sensor) => (
              <View style={styles.sensorRow} key={sensor.id}>
                <View style={styles.sensorRowIcon}>
                  <Ionicons name="radio-outline" size={18} color="#111827" />
                </View>
                <View style={styles.sensorRowText}>
                  <Text style={styles.sensorRowName}>{sensor.name}</Text>
                  <Text style={styles.sensorRowMeta}>
                    {sensor.type} · {sensor.data_collection_enabled ? 'collecte active' : 'collecte arrêtée'}
                  </Text>
                </View>
                <Pressable
                  onPress={() => toggleSensorCollection(sensor)}
                  disabled={actionSensorId === sensor.id}
                  style={[
                    styles.sensorAction,
                    sensor.data_collection_enabled ? styles.sensorActionStop : null,
                  ]}
                >
                  {actionSensorId === sensor.id ? (
                    <ActivityIndicator size="small" color="#111827" />
                  ) : (
                    <Ionicons
                      name={sensor.data_collection_enabled ? 'pause' : 'play'}
                      size={16}
                      color={sensor.data_collection_enabled ? '#B91C1C' : '#2F7D32'}
                    />
                  )}
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <AddSensorModal
          visible={pairingVisible}
          onClose={() => setPairingVisible(false)}
          onProvisioned={() => loadSensors(true)}
        />
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
    padding: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2F7D32',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#7DCB6B',
    shadowColor: '#111827',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
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
    fontWeight: '600',
    color: '#111827',
  },
  metricLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  updated: {
    fontSize: 16,
    color: '#6B7280',
  },
  noDataCard: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  noDataTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  noDataText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  emptyAction: {
    minHeight: 38,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#B6DDB0',
    borderRadius: 8,
    backgroundColor: '#F1FAEE',
  },
  emptyActionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2F7D32',
  },
  sensorList: {
    gap: 8,
  },
  sensorRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  sensorRowIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  sensorRowText: {
    flex: 1,
  },
  sensorRowName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  sensorRowMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  sensorAction: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B6DDB0',
    borderRadius: 8,
    backgroundColor: '#F1FAEE',
  },
  sensorActionStop: {
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    fontSize: 14,
    color: '#B91C1C',
  },
  loader: {
    marginTop: 8,
    alignSelf: 'center',
  },
});
