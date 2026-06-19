import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useTasks } from '@/hooks/useTasks';
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { router } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@/contexts/language.context';
import { useTour } from '@/contexts/tour.context';

export const ResumeSection = () => {
    const { gardenVegetables, gardenInfo } = useGardenContext();
    const { activityStreak } = useUserContext();
    const { tasks } = useTasks();
    const { t } = useTranslation();
    const { loadGardenInfo } = useGardenInfo();
    const { registerElement, step } = useTour();

    const scrollRef = useRef<ScrollView>(null);
    const weatherRef = useRef<View>(null);
    const statPlantsRef = useRef<View>(null);
    const statTasksRef = useRef<View>(null);
    const statStreakRef = useRef<View>(null);
    const statSensorsRef = useRef<View>(null);
    const statsGridRef = useRef<View>(null);
    const toolTasksRef = useRef<View>(null);
    const toolCalendarRef = useRef<View>(null);
    const toolSensorsRef = useRef<View>(null);
    const toolPlanRef = useRef<View>(null);

    const measureAll = () => {
        setTimeout(() => {
            weatherRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_weather', { x, y, width: w, height: h });
            });
            statPlantsRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_stat_plants', { x, y, width: w, height: h });
            });
            statTasksRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_stat_tasks', { x, y, width: w, height: h });
            });
            statStreakRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_stat_streak', { x, y, width: w, height: h });
            });
            statSensorsRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_stat_sensors', { x, y, width: w, height: h });
            });
            statsGridRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_stats_grid', { x, y, width: w, height: h });
            });
            toolTasksRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_tool_tasks', { x, y, width: w, height: h });
            });
            toolCalendarRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_tool_calendar', { x, y, width: w, height: h });
            });
            toolSensorsRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_tool_sensors', { x, y, width: w, height: h });
            });
            toolPlanRef.current?.measureInWindow((x, y, w, h) => {
                if (w && h) registerElement('home_tool_plan', { x, y, width: w, height: h });
            });
        }, 320);
    };

    // Auto-scroll depending on active step
    useEffect(() => {
        if (step >= 0 && step <= 1) {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
        } else if (step === 2) {
            scrollRef.current?.scrollTo({ y: 140, animated: true });
        } else if (step === 4) {
            scrollRef.current?.scrollTo({ y: 220, animated: true });
        } else if (step === 6) {
            scrollRef.current?.scrollTo({ y: 300, animated: true });
        } else if (step === 8) {
            scrollRef.current?.scrollToEnd({ animated: true });
        }
        measureAll();
    }, [step]);

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
                const match = gardenInfo.location.match(/[a-zA-ZÀ-ÿ].*/);
                const cleanedLocation = match ? match[0].trim() : gardenInfo.location.trim();
                const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanedLocation)}&count=1&language=fr&format=json`;
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
        if (code === 0) return { icon: 'sunny' as const, label: t('weather_clear', 'Ensoleillé'), color: '#F59E0B', bgColor: '#FFFBEB' };
        if (code >= 1 && code <= 3) return { icon: 'partly-sunny' as const, label: t('weather_partly_cloudy', 'Partiellement nuageux'), color: '#6B7280', bgColor: '#F3F4F6' };
        if (code === 45 || code === 48) return { icon: 'cloudy' as const, label: t('weather_fog', 'Brouillard'), color: '#9CA3AF', bgColor: '#F9FAFB' };
        if ((code >= 51 && code <= 55) || (code >= 61 && code <= 65) || (code >= 80 && code <= 82)) {
            return { icon: 'rainy' as const, label: t('weather_rain', 'Pluie'), color: '#3B82F6', bgColor: '#EFF6FF' };
        }
        if ((code >= 56 && code <= 57) || (code >= 66 && code <= 67) || (code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
            return { icon: 'snow' as const, label: t('weather_snow', 'Neige'), color: '#10B981', bgColor: '#ECFDF5' };
        }
        if (code >= 95) return { icon: 'thunderstorm' as const, label: t('weather_thunderstorm', 'Orage'), color: '#7C3AED', bgColor: '#F5F3FF' };
        return { icon: 'cloudy' as const, label: t('weather_cloudy', 'Nuageux'), color: '#6B7280', bgColor: '#F3F4F6' };
    };

    return (
        <ScrollView
            ref={scrollRef}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
        >
            <View 
                ref={weatherRef}
                onLayout={measureAll}
                style={styles.welcomeCard}
            >
                <View style={styles.welcomeLeft}>
                    <Text style={styles.welcomeTitle}>{t('home_welcome_title')}</Text>
                    <Text style={styles.welcomeSubtitle}>{t('home_welcome_subtitle')}</Text>
                </View>

                {gardenInfo.location ? (
                    <View style={styles.weatherBlock}>
                        {weatherLoading ? (
                            <ActivityIndicator size="small" color="#5A7F54" />
                        ) : weatherError ? (
                            <View style={styles.weatherErrorContainer}>
                                <Ionicons name="cloud-offline-outline" size={18} color="#EF4444" />
                                <Text style={styles.weatherErrorText}>
                                    {weatherError === "Ville non trouvée" ? t('weather_city_not_found') : weatherError === "Erreur de connexion" ? t('weather_connection_error') : t('weather_error')}
                                </Text>
                            </View>
                        ) : weatherData ? (
                            <View style={styles.weatherMainBlock}>
                                <Text style={styles.weatherCity}>{weatherData.cityName}</Text>
                                <View style={styles.weatherIconTempRow}>
                                    <Ionicons
                                        name={getWeatherConfig(weatherData.code).icon}
                                        size={36}
                                        color={getWeatherConfig(weatherData.code).color}
                                    />
                                    <Text style={styles.weatherTemp}>{Math.round(weatherData.temp)}°C</Text>
                                </View>
                                <Text style={styles.weatherDesc}>{getWeatherConfig(weatherData.code).label}</Text>
                            </View>
                        ) : null}
                    </View>
                ) : (
                    <Pressable
                        onPress={() => router.push('/profile/garden-info')}
                        style={styles.addLocationBtn}
                    >
                        <Ionicons name="location-outline" size={18} color="#5A7F54" />
                        <Text style={styles.addLocationText}>{t('weather_configure_location')}</Text>
                    </Pressable>
                )}
            </View>

            <Text style={styles.sectionHeaderTitle}>{t('home_dashboard')}</Text>
            
            <View 
                ref={statsGridRef}
                onLayout={measureAll}
                style={styles.statsGrid}
            >
                <View 
                    ref={statPlantsRef}
                    onLayout={measureAll}
                    style={[styles.statCard, { backgroundColor: '#EBF6EB' }]}
                >
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{gardenVegetables.length}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(46, 125, 50, 0.12)' }]}>
                            <Ionicons name="leaf" size={16} color="#2E7D32" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_plants')}</Text>
                </View>

                <View 
                    ref={statTasksRef}
                    onLayout={measureAll}
                    style={[styles.statCard, { backgroundColor: '#E6F8F3' }]}
                >
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#00796B' }]}>{completedTasksCount}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(0, 121, 107, 0.12)' }]}>
                            <Ionicons name="checkmark-done" size={16} color="#00796B" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_tasks')}</Text>
                </View>

                <View 
                    ref={statStreakRef}
                    onLayout={measureAll}
                    style={[styles.statCard, { backgroundColor: '#FFF3F2' }]}
                >
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#C62828' }]}>{activityStreak}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(198, 40, 40, 0.12)' }]}>
                            <Ionicons name="flame" size={16} color="#C62828" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>{t('home_stat_streak')}</Text>
                </View>

                <View 
                    ref={statSensorsRef}
                    onLayout={measureAll}
                    style={[styles.statCard, { backgroundColor: '#F0F4FF' }]}
                >
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
                <Pressable 
                    ref={toolTasksRef}
                    onLayout={measureAll}
                    onPress={() => router.replace('/taches')} 
                    style={styles.toolCard}
                >
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#EBF6EB' }]}>
                        <Ionicons name="checkbox" size={22} color="#2E7D32" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_tasks_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_tasks_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable 
                    ref={toolCalendarRef}
                    onLayout={measureAll}
                    onPress={() => router.replace('/calendar')} 
                    style={styles.toolCard}
                >
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#E6F8F3' }]}>
                        <Ionicons name="calendar" size={22} color="#00796B" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_calendar_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_calendar_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable 
                    ref={toolSensorsRef}
                    onLayout={measureAll}
                    onPress={() => router.replace('/capteurs')} 
                    style={styles.toolCard}
                >
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#F0F4FF' }]}>
                        <Ionicons name="hardware-chip" size={22} color="#1565C0" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>{t('home_tool_sensors_title')}</Text>
                        <Text style={styles.toolSubtitle}>{t('home_tool_sensors_subtitle')}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable 
                    ref={toolPlanRef}
                    onLayout={measureAll}
                    onPress={() => router.replace('/plan')} 
                    style={styles.toolCard}
                >
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
        justifyContent: 'center',
        paddingRight: 16,
    },
    welcomeTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    welcomeSubtitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        lineHeight: 18,
    },
    weatherBlock: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    weatherMainBlock: {
        alignItems: 'flex-end',
    },
    weatherCity: {
        fontSize: 11,
        fontWeight: '800',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    weatherIconTempRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    weatherTemp: {
        fontSize: 28,
        fontWeight: '800',
        color: '#1F2937',
    },
    weatherDesc: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6B7280',
        marginTop: 4,
    },
    weatherErrorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    weatherErrorText: {
        fontSize: 12,
        color: '#EF4444',
        fontWeight: '600',
    },
    addLocationBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 6,
    },
    addLocationText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5A7F54',
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
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
    },
    statIconBadge: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 13,
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
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    toolIconWrapper: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    toolTextWrapper: {
        flex: 1,
        justifyContent: 'center',
    },
    toolTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 2,
    },
    toolSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
});
