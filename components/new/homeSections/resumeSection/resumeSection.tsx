import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useTasks } from '@/hooks/useTasks';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const ResumeSection = () => {
    const { gardenVegetables } = useGardenContext();
    const { activityStreak } = useUserContext();
    const { tasks } = useTasks();

    const completedTasksCount = tasks.filter(task => task.completed).length;

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            style={styles.scrollView}
        >
            <View style={styles.welcomeCard}>
                <View style={styles.welcomeLeft}>
                    <Text style={styles.welcomeTitle}>Bonjour ! 👋</Text>
                    <Text style={styles.welcomeSubtitle}>Prêt à prendre soin de vos plantes aujourd'hui ?</Text>
                </View>
                <View style={styles.welcomeIconContainer}>
                    <Ionicons name="sunny" size={32} color="#F59E0B" />
                </View>
            </View>

            <Text style={styles.sectionHeaderTitle}>Tableau de bord</Text>
            
            <View style={styles.statsGrid}>
                <View style={[styles.statCard, { backgroundColor: '#EBF6EB' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#2E7D32' }]}>{gardenVegetables.length}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(46, 125, 50, 0.12)' }]}>
                            <Ionicons name="leaf" size={16} color="#2E7D32" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>Plantes cultivées</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#E6F8F3' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#00796B' }]}>{completedTasksCount}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(0, 121, 107, 0.12)' }]}>
                            <Ionicons name="checkmark-done" size={16} color="#00796B" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>Tâches faites</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#FFF3F2' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#C62828' }]}>{activityStreak}</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(198, 40, 40, 0.12)' }]}>
                            <Ionicons name="flame" size={16} color="#C62828" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>Jours actifs</Text>
                </View>

                <View style={[styles.statCard, { backgroundColor: '#F0F4FF' }]}>
                    <View style={styles.statHeader}>
                        <Text style={[styles.statNumber, { color: '#1565C0' }]}>1</Text>
                        <View style={[styles.statIconBadge, { backgroundColor: 'rgba(21, 101, 192, 0.12)' }]}>
                            <Ionicons name="radio" size={16} color="#1565C0" />
                        </View>
                    </View>
                    <Text style={styles.statLabel}>Capteur connecté</Text>
                </View>
            </View>

            <Text style={styles.sectionHeaderTitle}>Mes outils</Text>

            <View style={styles.toolsList}>
                <Pressable onPress={() => router.replace('/taches')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#EBF6EB' }]}>
                        <Ionicons name="checkbox" size={22} color="#2E7D32" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>Gestion des tâches</Text>
                        <Text style={styles.toolSubtitle}>Planifier et suivre les actions quotidiennes</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/calendar')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#E6F8F3' }]}>
                        <Ionicons name="calendar" size={22} color="#00796B" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>Calendrier</Text>
                        <Text style={styles.toolSubtitle}>Suivi chronologique de l'entretien</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/capteurs')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#F0F4FF' }]}>
                        <Ionicons name="hardware-chip" size={22} color="#1565C0" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>Capteurs intelligents</Text>
                        <Text style={styles.toolSubtitle}>Données de température et d'humidité en direct</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
                </Pressable>

                <Pressable onPress={() => router.replace('/plan')} style={styles.toolCard}>
                    <View style={[styles.toolIconWrapper, { backgroundColor: '#FFFDF0' }]}>
                        <Ionicons name="map" size={22} color="#D97706" />
                    </View>
                    <View style={styles.toolTextWrapper}>
                        <Text style={styles.toolTitle}>Plan du potager</Text>
                        <Text style={styles.toolSubtitle}>Dessiner et organiser la disposition de vos bacs</Text>
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
});
