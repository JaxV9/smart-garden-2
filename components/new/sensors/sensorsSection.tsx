import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useFetch } from '@/hooks/useFetch';
import { useNotificationContext } from '@/contexts/notification.context';
import { useUserContext } from '@/contexts/user.context';
import { useRouter } from 'expo-router';

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
  const { addNotification } = useNotificationContext();
  const { isPremium } = useUserContext();
  const router = useRouter();
  const [reading, setReading] = useState<SensorReading | null>(null);
  const [hasData, setHasData] = useState(true);
  const [loading, setLoading] = useState(true);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [hasAlertedLowHumidity, setHasAlertedLowHumidity] = useState(false);

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
      const payload = response.payload as SensorReading;
      setReading(payload);
      
      if (payload) {
        if (payload.value_numeric < 30) {
          if (!hasAlertedLowHumidity) {
            addNotification(
              "🚨 Alerte Soif Extrême !",
              `L'humidité du ${payload.sensor_name || 'Capteur Basilic'} est à ${payload.value_numeric}%. Il crie "De l'eau par pitié !"`,
              "SENSOR"
            );
            setHasAlertedLowHumidity(true);
          }
        } else if (payload.value_numeric > 35) {
          setHasAlertedLowHumidity(false);
        }
      }

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

        {hasData && reading && (
          <View style={[styles.card, styles.adviceCard, !isPremium && styles.lockedAdviceCard]}>
            <View style={styles.adviceHeader}>
              <View style={styles.adviceTitleWrapper}>
                <Ionicons name="bulb" size={20} color="#D4AF37" />
                <Text style={styles.adviceTitle}>Conseils intelligents (IA)</Text>
              </View>
              {!isPremium && (
                <View style={styles.vipBadge}>
                  <Text style={styles.vipBadgeText}>VIP</Text>
                </View>
              )}
            </View>

            {isPremium ? (
              <View style={styles.adviceBody}>
                {reading.value_numeric < 30 ? (
                  <Text style={styles.adviceText}>
                    ⚠️ <Text style={{ fontWeight: 'bold' }}>Humidité critique basse !</Text> Le terreau de votre {reading.sensor_name || 'Basilic'} est trop sec ({reading.value_numeric}%). Il est vivement conseillé d'arroser généreusement (environ 250ml d'eau tiède) pour restaurer l'humidité sans brusquer les racines.
                  </Text>
                ) : reading.value_numeric > 60 ? (
                  <Text style={styles.adviceText}>
                    🌊 <Text style={{ fontWeight: 'bold' }}>Alerte Sur-arrosage !</Text> Le niveau d'humidité est très élevé ({reading.value_numeric}%). Laissez sécher la terre pendant au moins 3 jours pour éviter l'asphyxie racinaire et prévenir le pourrissement.
                  </Text>
                ) : (
                  <Text style={styles.adviceText}>
                    🌿 <Text style={{ fontWeight: 'bold' }}>Humidité optimale !</Text> L'humidité du sol ({reading.value_numeric}%) et la température de ({FAKE_TEMPERATURE}°C) sont parfaites pour le métabolisme de votre plante. Pas besoin d'agir aujourd'hui, continuez ainsi !
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.lockedAdviceBody}>
                <Text style={styles.lockedAdviceSub}>
                  Débloquez des recommandations d'arrosage et des diagnostics personnalisés générés par IA en temps réel.
                </Text>
                <TouchableOpacity 
                  style={styles.unlockBtn}
                  onPress={() => router.push('/premium' as any)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.unlockBtnText}>Activer les conseils IA</Text>
                </TouchableOpacity>
              </View>
            )}
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
