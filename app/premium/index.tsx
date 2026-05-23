import AppHeader from '@/components/new/ui/AppHeader';
import { useUserContext } from '@/contexts/user.context';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

const FEATURES = [
    { name: 'Communauté active & Partage', free: 'Oui', ultra: 'Illimité', icon: 'people-outline' },
    { name: 'Suivi métrique des capteurs', free: 'Oui', ultra: 'Temps Réel', icon: 'thermometer-outline' },
    { name: 'Documentation plantes', free: 'Limité (Flouté)', ultra: '100% Complète', icon: 'book-outline' },
    { name: 'Conseils intelligents IA', free: 'Non', ultra: 'Oui', icon: 'bulb-outline' },
    { name: 'Suivi & Planification de tâches', free: 'Non', ultra: 'Oui', icon: 'checkmark-circle-outline' },
    { name: 'Création de plan', free: 'Max 1 plan', ultra: 'Illimité', icon: 'map-outline' },
    { name: 'Multi-potager', free: 'Non', ultra: 'Oui', icon: 'layers-outline' },
    { name: 'Calendrier de plantation complet', free: 'Non', ultra: 'Oui', icon: 'calendar-outline' },
    { name: 'Gestion collaborative', free: 'Non', ultra: 'Oui', icon: 'share-social-outline' },
];

export default function PremiumScreen() {
    const router = useRouter();
    const { isPremium, setIsPremium } = useUserContext();
    const { updateUser } = useUser();
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const handleSubscribe = async () => {
        if (isPremium) {
            const success = await updateUser({ isPremium: false });
            if (success !== 'Failure') {
                setIsPremium(false);
            }
        } else {
            const success = await updateUser({ isPremium: true });
            if (success !== 'Failure') {
                setIsPremium(true);
                setSuccessModalVisible(true);
            }
        }
    };

    return (
        <View style={styles.screen}>
            <AppHeader title="Smart Club" showBack={true} />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                <View style={styles.heroCard}>
                    <View style={styles.badgeRow}>
                        <View style={styles.vipBadge}>
                            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                            <Text style={styles.vipBadgeText}>MEMBRE D'ÉLITE</Text>
                        </View>
                    </View>
                    <Text style={styles.heroTitle}>Liberez le potentiel de votre potager 🌿</Text>
                    <Text style={styles.heroSub}>
                        Rejoignez des milliers de passionnés et accédez à tous les outils professionnels d'aide à la plantation et diagnostics IA.
                    </Text>
                </View>

                <View style={[styles.planCard, styles.premiumPlanCard]}>
                    <View style={styles.popularBadge}>
                        <Ionicons name="star" size={10} color="#D97706" />
                        <Text style={styles.popularText}>RECOMMANDÉ</Text>
                    </View>

                    <View style={styles.planHeader}>
                        <View>
                            <Text style={styles.premiumName}>Ultra VIP 👑</Text>
                            <Text style={styles.premiumDesc}>Le meilleur de l'application</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.premiumPrice}>6,99 €</Text>
                            <Text style={styles.premiumPeriod}>/ mois</Text>
                        </View>
                    </View>

                    <View style={styles.perksList}>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>Accès total à la documentation des plantes</Text>
                        </View>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>Diagnostics intelligents de capteurs par IA</Text>
                        </View>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>Calendrier de plantation & Tâches illimités</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.subscribeBtn, isPremium && styles.unsubscribeBtn]}
                        onPress={handleSubscribe}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.subscribeBtnText}>
                            {isPremium ? "Suspendre mon abonnement VIP" : "Devenir membre Ultra VIP"}
                        </Text>
                        <Ionicons name="arrow-forward" size={16} color={isPremium ? "#B8860B" : "white"} />
                    </TouchableOpacity>
                </View>

                <View style={[styles.planCard, styles.freePlanCard]}>
                    <View style={styles.planHeader}>
                        <View>
                            <Text style={styles.planName}>Basic Free 🌱</Text>
                            <Text style={styles.planDesc}>Pour débuter calmement</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.planPrice}>0 €</Text>
                            <Text style={styles.planPeriod}>/ éternel</Text>
                        </View>
                    </View>

                    {!isPremium && (
                        <View style={styles.activePlanBadge}>
                            <Ionicons name="checkmark-circle-outline" size={14} color="#6B7280" />
                            <Text style={styles.activePlanText}>Votre offre actuelle</Text>
                        </View>
                    )}
                </View>

                <View style={styles.tableCard}>
                    <Text style={styles.tableTitle}>Tableau comparatif des offres</Text>

                    <View style={styles.tableHeaderRow}>
                        <View style={styles.colFeature} />
                        <View style={styles.colPlan}><Text style={styles.colPlanTitle}>Basic</Text></View>
                        <View style={styles.colPlan}><Text style={[styles.colPlanTitle, styles.goldText]}>VIP</Text></View>
                    </View>

                    {FEATURES.map((feature, idx) => {
                        const isEven = idx % 2 === 0;
                        const isUltraPositive = feature.ultra !== 'Non';
                        const isFreePositive = feature.free !== 'Non' && !feature.free.includes('Limité') && !feature.free.includes('Max');
                        const isFreeWarning = feature.free.includes('Limité') || feature.free.includes('Max');

                        return (
                            <View key={feature.name} style={[styles.tableRow, isEven && styles.evenRow]}>
                                <View style={styles.colFeature}>
                                    <View style={styles.featureNameWrapper}>
                                        <Ionicons name={feature.icon as any} size={15} color="#5A7F54" style={styles.featureIcon} />
                                        <Text style={styles.featureName} numberOfLines={1}>{feature.name}</Text>
                                    </View>
                                </View>

                                <View style={styles.colPlan}>
                                    {isFreeWarning ? (
                                        <View style={styles.badgeWarning}>
                                            <Text style={styles.badgeWarningText}>{feature.free.split(' ')[0]}</Text>
                                        </View>
                                    ) : isFreePositive ? (
                                        <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
                                    ) : (
                                        <Ionicons name="close-circle" size={16} color="#EF4444" />
                                    )}
                                </View>

                                <View style={styles.colPlan}>
                                    {isUltraPositive ? (
                                        <View style={styles.ultraSuccessBadge}>
                                            <Ionicons name="sparkles" size={11} color="#D4AF37" />
                                            <Text style={styles.ultraSuccessText}>{feature.ultra.split(' ')[0]}</Text>
                                        </View>
                                    ) : (
                                        <Ionicons name="close-circle" size={16} color="#EF4444" />
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>

                <Text style={styles.caveatText}>
                    Abonnement mensuel sans engagement de durée. Vous pouvez modifier ou annuler votre offre à tout moment en un simple clic.
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>

            <Modal
                animationType="fade"
                transparent={true}
                visible={successModalVisible}
                onRequestClose={() => setSuccessModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconBg}>
                            <Ionicons name="ribbon" size={48} color="#D4AF37" />
                        </View>
                        <Text style={styles.modalTitle}>Bienvenue au Club VIP ! 🎉</Text>
                        <Text style={styles.modalSub}>
                            Votre abonnement a bien été activé. Vous bénéficiez désormais de l'intégralité des outils, diagnostics et documentations de culture de façon illimitée !
                        </Text>
                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setSuccessModalVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalBtnText}>C'est parti !</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F8FAF7',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    heroCard: {
        backgroundColor: '#EAF2EA',
        borderRadius: 24,
        padding: 22,
        marginTop: 20,
        marginBottom: 16,
    },
    badgeRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    vipBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5A7F54',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    vipBadgeText: {
        color: '#FFFFFF',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#1E293B',
        lineHeight: 26,
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 13,
        color: '#556652',
        lineHeight: 18,
    },
    planCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    premiumPlanCard: {
        borderColor: '#D4AF37',
        borderWidth: 2.5,
        backgroundColor: '#FCFAF0',
        shadowColor: '#D4AF37',
        shadowOpacity: 0.15,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 4,
    },
    freePlanCard: {
        borderColor: '#E2E8F0',
        backgroundColor: '#FFFFFF',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    premiumName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#B8860B',
        marginBottom: 2,
    },
    premiumDesc: {
        fontSize: 12,
        color: '#8A7635',
        fontWeight: '500',
    },
    premiumPrice: {
        fontSize: 24,
        fontWeight: '900',
        color: '#B8860B',
    },
    premiumPeriod: {
        fontSize: 11,
        color: '#B8860B',
        fontWeight: '700',
    },
    planName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 2,
    },
    planDesc: {
        fontSize: 12,
        color: '#64748B',
    },
    planPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#475569',
    },
    planPeriod: {
        fontSize: 11,
        color: '#64748B',
    },
    popularBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 3,
        marginBottom: 12,
    },
    popularText: {
        fontSize: 9,
        fontWeight: '900',
        color: '#D97706',
        letterSpacing: 0.5,
    },
    perksList: {
        gap: 10,
        marginBottom: 20,
        marginTop: 6,
    },
    perkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    perkText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4A3E1B',
        flex: 1,
    },
    subscribeBtn: {
        backgroundColor: '#D4AF37',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    subscribeBtnText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '800',
    },
    unsubscribeBtn: {
        backgroundColor: '#FFFDF0',
        borderColor: '#D4AF37',
        borderWidth: 1.5,
    },
    activePlanBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        gap: 4,
    },
    activePlanText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
    },
    tableCard: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.02,
        shadowRadius: 6,
        elevation: 1,
        marginBottom: 20,
    },
    tableTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 16,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderColor: '#E2E8F0',
        paddingBottom: 10,
        marginBottom: 6,
    },
    colFeature: {
        flex: 2.2,
        justifyContent: 'center',
    },
    colPlan: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    colPlanTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
    },
    goldText: {
        color: '#B8860B',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 11,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#F1F5F9',
    },
    evenRow: {
        backgroundColor: '#F9FAF8',
        borderRadius: 8,
    },
    featureNameWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingRight: 6,
    },
    featureIcon: {
        opacity: 0.8,
    },
    featureName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#334155',
    },
    badgeWarning: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FEF3C7',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 5,
        paddingVertical: 2,
    },
    badgeWarningText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#D97706',
        textAlign: 'center',
    },
    ultraSuccessBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFDF0',
        borderColor: '#FEF3C7',
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        gap: 2,
    },
    ultraSuccessText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#B8860B',
    },
    caveatText: {
        fontSize: 11,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 16,
        paddingHorizontal: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 32,
        alignItems: 'center',
        width: width - 48,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    modalIconBg: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFDF0',
        borderColor: '#FEF3C7',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    modalSub: {
        fontSize: 14,
        color: '#556652',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    modalBtn: {
        backgroundColor: '#5A7F54',
        borderRadius: 16,
        paddingVertical: 14,
        paddingHorizontal: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalBtnText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
