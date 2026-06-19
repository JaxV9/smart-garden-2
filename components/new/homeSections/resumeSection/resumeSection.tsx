import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useTasks } from '@/hooks/useTasks';
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/contexts/language.context';

export const ResumeSection = () => {
    const { gardenVegetables, gardenInfo } = useGardenContext();
    const { activityStreak } = useUserContext();
    const { tasks } = useTasks();
    const { t } = useTranslation();
    const { loadGardenInfo } = useGardenInfo();

    const [weatherData, setWeatherData] = useState<{
        temp: number;
        humidity: number;
        code: number;
        cityName: string;
    } | null>(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);

    const completedTasksCount = tasks.filter(task => task.completed).length;

    useEffect(() => {
        loadGardenInfo();
    }, []);

    useEffect(() => {
        if (!gardenInfo.location) {
            setWeatherData(null);
            return;
        }

        const fetchWeather = async () => {
            setWeatherLoading(true);
            setWeatherError(null);
            try {
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(gardenInfo.location)}&count=1&language=fr&format=json`;
                const geoRes = await fetch(geoUrl);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    setWeatherError("Ville non trouvée");
                    setWeatherLoading(false);
                    return;
                }

                const { latitude, longitude, name } = geoData.results[0];

                const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`;
                const weatherRes = await fetch(weatherUrl);
                const weatherJson = await weatherRes.json();

                if (weatherJson.current) {
                    setWeatherData({
                        temp: weatherJson.current.temperature_2m,
                        humidity: weatherJson.current.relative_humidity_2m,
                        code: weatherJson.current.weather_code,
                        cityName: name,
                    });
                } else {
                    setWeatherError("Erreur météo");
                }
            } catch (e) {
                console.error("Failed to fetch weather:", e);
                setWeatherError("Erreur de connexion");
            } finally {
                setWeatherLoading(false);
            }
        };

        fetchWeather();
    }, [gardenInfo.location]);

    const getWeatherConfig = (code: number) => {
        if (code === 0) return { icon: 'sunny' as const, label: 'Ensoleillé', color: '#F59E0B', bgColor: '#FFFBEB' };
        if (code >= 1 && code <= 3) return { icon: 'partly-sunny' as const, label: 'Partiellement nuageux', color: '#6B7280', bgColor: '#F3F4F6' };
        if (code === 45 || code === 48) return { icon: 'cloudy' as const, label: 'Brouillard', color: '#9CA3AF', bgColor: '#F9FAFB' };
        if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
            return { icon: 'rainy' as const, label: 'Pluie', color: '#3B82F6', bgColor: '#EFF6FF' };
        }
        if ((code >= 56 && code <= 57) || (code >= 66 && code <= 67) || (code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            return { icon: 'snow' as const, label: 'Neige', color: '#10B981', bgColor: '#ECFDF5' };
        }
        if (code >= 95) return { icon: 'thunderstorm' as const, label: 'Orage', color: '#7C3AED', bgColor: '#F5F3FF' };
        return { icon: 'cloudy' as const, label: 'Nuageux', color: '#6B7280', bgColor: '#F3F4F6' };
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
        >
            <View style={styles.welcomeCard}>
                <View style={styles.welcomeLeft}>
                    <Text style={styles.welcomeTitle}>{t('home_welcome_title')}</Text>
                    <Text style={styles.welcomeSubtitle}>{t('home_welcome_subtitle')}</Text>
                </View>
                <View style={styles.welcomeIconContainer}>
                    <Ionicons name="sunny" size={32} color="#F59E0B" />
                </View>
            </View>

            {/* Weather Card */}
            {gardenInfo.location ? (
                <View style={styles.weatherCard}>
                    {weatherLoading ? (
                        <View style={styles.weatherCenter}>
                            <ActivityIndicator size="small" color="#5A7F54" />
                            <Text style={styles.weatherLoadingText}>Chargement de la météo pour {gardenInfo.location}...</Text>
                        </View>
                    ) : weatherError ? (
                        <View style={styles.weatherErrorContainer}>
                            <Ionicons name="cloud-offline-outline" size={24} color="#EF4444" />
                            <Text style={styles.weatherErrorText}>Météo indisponible ({weatherError})</Text>
                        </View>
                    ) : weatherData ? (
                        <View style={styles.weatherRow}>
                            <View style={styles.weatherMain}>
                                <Text style={styles.weatherCity}>{weatherData.cityName}</Text>
                                <Text style={styles.weatherTemp}>{Math.round(weatherData.temp)}°C</Text>
                                <Text style={styles.weatherDesc}>{getWeatherConfig(weatherData.code).label}</Text>
                            </View>
                            <View style={styles.weatherRight}>
                                <View style={[styles.weatherIconBg, { backgroundColor: getWeatherConfig(weatherData.code).bgColor }]}>
                                    <Ionicons
                                        name={getWeatherConfig(weatherData.code).icon}
                                        size={32}
                                        color={getWeatherConfig(weatherData.code).color}
                                    />
                                </View>
                                <View style={styles.weatherHumidityRow}>
                                    <Ionicons name="water" size={14} color="#3B82F6" />
                                    <Text style={styles.weatherHumidityVal}>{weatherData.humidity}% d'humidité</Text>
                                </View>
                            </View>
                        </View>
                    ) : null}
                </View>
            ) : (
                <Pressable
                    onPress={() => router.push('/profile/garden-info')}
                    style={styles.weatherPlaceholderCard}
                >
                    <View style={styles.weatherPlaceholderLeft}>
                        <Text style={styles.weatherPlaceholderTitle}>Météo indisponible</Text>
                        <Text style={styles.weatherPlaceholderSub}>
                            Renseignez la localisation de votre potager dans vos paramètres pour afficher la météo locale.
                        </Text>
                    </View>
                    <View style={styles.weatherPlaceholderIconContainer}>
                        <Ionicons name="location-outline" size={24} color="#5A7F54" />
                    </View>
                </Pressable>
            )}

            <Text style={styles.sectionHeaderTitle}>{t('home_dashboard')}</Text>
            
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#EBF6EB' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{gardenVegetables.length}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(46, 125, 50, 0.12)' }]}>
                            <Ionicons name="leaf" size={16} color="#2E7D32" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_plants')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#E6F8F3' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#00796B' }]}>{completedTasksCount}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(0, 121, 107, 0.12)' }]}>
                            <Ionicons name="checkmark-done" size={16} color="#00796B" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_tasks')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#FFF3F2' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#C62828' }]}>{activityStreak}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(198, 40, 40, 0.12)' }]}>
                            <Ionicons name="flame" size={16} color="#C62828" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_streak')}</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#F0F4FF' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#1565C0' }]}>1</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(21, 101, 192, 0.12)' }]}>
                            <Ionicons name="radio" size={16} color="#1565C0" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_sensors')}</Text>
                </View>
            </View>

            <Text style={styles.sectionHeaderTitle}>{t('home_tools')}</Text>

            <View style={styles.toolsList}>
                <Pressable onPress={() => router.replace('/taches')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#EBF6EB' }]}>
                        <Ionicons name="checkbox" size={22} color="#2E7D32" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_tasks_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_tasks_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/calendar')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#E6F8F3' }]}>
                        <Ionicons name="calendar" size={22} color="#00796B" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_calendar_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_calendar_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/capteurs')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#F0F4FF' }]}>
                        <Ionicons name="hardware-chip" size={22} color="#1565C0" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_sensors_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_sensors_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/plan')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#FFFDF0' }]}>
                        <Ionicons name="map" size={22} color="#D97706" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_plan_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_plan_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 40,
    },
    welcomeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    welcomeLeft: {
        flex: 1,
        paddingRight: 12,
    },
    welcomeTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
    },
    welcomeIconContainer: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFBEB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sectionHeaderTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#374151',
        marginBottom: 12,
        letterSpacing: 0.2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: '47%',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.03)',
    },
    statHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
    },
    statIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    toolsList: {
        gap: 12,
    },
    toolCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    toolIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    toolTextWrapper: {
        flex: 1,
    },
    toolTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 3,
    },
    toolSubtitle: {
        fontSize: 12,
        color: '#6B7280',
    },
    weatherCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    weatherCenter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 10,
    },
    weatherLoadingText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    weatherErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 4,
    },
    weatherErrorText: {
        fontSize: 13,
        color: '#EF4444',
        fontWeight: '600',
    },
    weatherRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    weatherMain: {
        flex: 1,
    },
    weatherCity: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    weatherTemp: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
    },
    weatherDesc: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginTop: 2,
    },
    weatherRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    weatherIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    weatherHumidityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    weatherHumidityVal: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4B5563',
    },
    weatherPlaceholderCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    weatherPlaceholderLeft: {
        flex: 1,
        paddingRight: 12,
    },
    weatherPlaceholderTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#4B5563',
        marginBottom: 4,
    },
    weatherPlaceholderSub: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 16,
    },
    weatherPlaceholderIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EBF6EB',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
