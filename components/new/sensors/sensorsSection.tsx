import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useFetch } from '@/hooks/useFetch';
import { GardenSensor } from '@/models/models';
import { useNotificationContext } from '@/contexts/notification.context';
import { useUserContext } from '@/contexts/user.context';
import { useTranslation } from '@/contexts/language.context';
import { useTour } from '@/contexts/tour.context';
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
  const { addNotification } = useNotificationContext();
  const { isPremium } = useUserContext();
  const { visible } = useTour();
  const { t } = useTranslation();
  const router = useRouter();
  const isPremiumActive = isPremium || visible;

  const [sensors, setSensors] = useState<GardenSensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pairingVisible, setPairingVisible] = useState(false);
  const [actionSensorId, setActionSensorId] = useState<string | null>(null);
  const [hasAlertedLowHumidity, setHasAlertedLowHumidity] = useState(false);

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

  const humidityReading = humiditySensor?.latest_reading ?? null;

  useEffect(() => {
    if (!humidityReading || !humiditySensor) {
      return;
    }

    if (humidityReading.value_numeric < 30) {
      if (!hasAlertedLowHumidity) {
        addNotification(
          '🚨 Alerte Soif Extrême !',
          `L'humidité du ${humiditySensor.name || 'Capteur Basilic'} est à ${Math.round(
            humidityReading.value_numeric
          )}%. Il crie "De l'eau par pitié !"`,
          'SENSOR'
        );
        setHasAlertedLowHumidity(true);
      }
    } else if (humidityReading.value_numeric > 35) {
      setHasAlertedLowHumidity(false);
    }
  }, [addNotification, hasAlertedLowHumidity, humidityReading, humiditySensor]);

  const latestUpdatedAt = useMemo(() => {
    const dates = sensors
      .map((sensor) => sensor.latest_reading?.updated_at || sensor.latest_reading?.created_at)
      .filter(Boolean)
      .sort();

    return dates[dates.length - 1];
  }, [sensors]);

  const updatedLabel = (() => {
    if (!latestUpdatedAt) {
      return t('sensor_updated_never');
    }

    const date = new Date(latestUpdatedAt);
    if (Number.isNaN(date.getTime())) {
      return t('sensor_updated_never');
    }

    return `${t('sensor_updated_at')}${date.toLocaleString()}`;
  })();

  const humidityValue =
    humidityReading?.value_numeric === undefined
      ? '-'
      : `${Math.round(humidityReading.value_numeric)}${displayUnit(humiditySensor?.unit || '%')}`;

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
              {t('sensor_no_data')}
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
              <Text style={styles.title}>{sensorTitle}</Text>
              <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
            </View>

            <View style={styles.metricsRow}>
              <MetricCard
                icon="water-outline"
                value={humidityValue}
                label={t('sensor_humidity')}
                backgroundColor="#EAF4FF"
                valueColor="#111827"
              />
              <MetricCard
                icon="thermometer-outline"
                value={temperatureValue}
                label={t('sensor_temp')}
                backgroundColor="#FFF2E8"
                showPulse={!!temperatureSensor?.latest_reading}
              />
              <MetricCard
                icon="sunny-outline"
                value={`${FAKE_LIGHT}%`}
                label={t('sensor_light')}
                backgroundColor="#FFF9DB"
              />
            </View>

            <Text style={styles.updated}>{updatedLabel}</Text>
          </View>
        )}

        {hasSensors && humidityReading && (
          <View style={[styles.card, styles.adviceCard, !isPremiumActive && styles.lockedAdviceCard]}>
            <View style={styles.adviceHeader}>
              <View style={styles.adviceTitleWrapper}>
                <Ionicons name="bulb" size={20} color="#D4AF37" />
                <Text style={styles.adviceTitle}>{t('sensor_advice_title')}</Text>
              </View>

              {!isPremiumActive && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipBadgeText}>VIP</Text>
                </View>
              )}
            </View>

            {isPremiumActive ? (
              <View style={styles.adviceBody}>
                {humidityReading.value_numeric < 30 ? (
                  <Text style={styles.adviceText}>{t('sensor_advice_low')}</Text>
                ) : humidityReading.value_numeric > 60 ? (
                  <Text style={styles.adviceText}>{t('sensor_advice_high')}</Text>
                ) : (
                  <Text style={styles.adviceText}>{t('sensor_advice_opt')}</Text>
                )}
              </View>
            ) : (
              <View style={styles.lockedAdviceBody}>
                <Text style={styles.lockedAdviceSub}>{t('sensor_advice_locked_sub')}</Text>
                <TouchableOpacity
                  style={styles.unlockBtn}
                  onPress={() => router.push('/premium' as any)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.unlockBtnText}>{t('sensor_advice_unlock_btn')}</Text>
                </TouchableOpacity>
              </View>
            )}
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
    padding: 20,
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
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  adviceCard: {
    borderColor: '#E2E8F0',
  },
  lockedAdviceCard: {
    backgroundColor: '#FCFAF0',
    borderColor: '#FEF3C7',
    borderWidth: 1.5,
  },
  adviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  adviceTitleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
  },
  vipBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  vipBadgeText: {
    color: '#D97706',
    fontSize: 10,
    fontWeight: '800',
  },
  adviceBody: {
    paddingVertical: 4,
  },
  adviceText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  lockedAdviceBody: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  lockedAdviceSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  unlockBtn: {
    backgroundColor: '#D4AF37',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  unlockBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});