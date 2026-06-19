import AppHeader from '@/components/new/ui/AppHeader';
import { useTranslation } from '@/contexts/language.context';
import { useUserContext } from '@/contexts/user.context';
import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

// Détecter si on tourne dans l'application Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Chargement dynamique de react-native-iap pour éviter le crash dans Expo Go
let IAP: any = null;
if (!isExpoGo) {
    try {
        IAP = require('react-native-iap');
    } catch (e) {
        console.warn("Impossible de charger react-native-iap", e);
    }
}

const FEATURES = [
    { key: 'vip_perk_community', free: 'word_yes', ultra: 'word_unlimited', icon: 'people-outline' },
    { key: 'vip_perk_sensors', free: 'word_yes', ultra: 'word_real_time', icon: 'thermometer-outline' },
    { key: 'vip_perk_docs', free: 'word_limited', ultra: 'word_complete', icon: 'book-outline' },
    { key: 'vip_perk_advice', free: 'word_no', ultra: 'word_yes', icon: 'bulb-outline' },
    { key: 'vip_perk_tasks', free: 'word_no', ultra: 'word_yes', icon: 'checkmark-circle-outline' },
    { key: 'vip_perk_plans', free: 'word_max_1_plan', ultra: 'word_unlimited', icon: 'map-outline' },
    { key: 'vip_perk_multi_gardens', free: 'word_no', ultra: 'word_yes', icon: 'layers-outline' },
    { key: 'vip_perk_calendar', free: 'word_no', ultra: 'word_yes', icon: 'calendar-outline' },
    { key: 'vip_perk_collaboration', free: 'word_no', ultra: 'word_yes', icon: 'share-social-outline' },
];

const SUB_SKU = 'com.smartgarden_iim.ultra_vip'; // Identifiant de l'abonnement dans Google Play Console

export default function PremiumScreen() {
    const router = useRouter();
    const { isPremium, setIsPremium } = useUserContext();
    const { updateUser } = useUser();
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [iapConnected, setIapConnected] = useState(false);
    const [subscriptionProduct, setSubscriptionProduct] = useState<any>(null);

    useEffect(() => {
        if (isExpoGo || !IAP) {
            console.log('Running in Expo Go: real Google Play billing is disabled, using local simulation.');
            return;
        }

        let purchaseUpdateSubscription: any;
        let purchaseErrorSubscription: any;

        const initBilling = async () => {
            try {
                const connected = await IAP.initConnection();
                setIapConnected(connected);
                console.log('Google Play Billing connection:', connected);

                if (connected) {
                    const subs = await IAP.getSubscriptions({ skus: [SUB_SKU] });
                    console.log('Fetched subscriptions from Google Play:', subs);
                    if (subs && subs.length > 0) {
                        setSubscriptionProduct(subs[0]);
                    }
                }
            } catch (error) {
                console.warn('Google Play Billing init failed:', error);
            }
        };

        purchaseUpdateSubscription = IAP.purchaseUpdatedListener(async (purchase: any) => {
            const receipt = purchase.transactionReceipt;
            if (receipt) {
                try {
                    await IAP.finishTransaction({ purchase, isConsumable: false });
                    console.log('Google Play transaction acknowledged:', purchase.transactionId);

                    const success = await updateUser({ isPremium: true });
                    if (success !== 'Failure') {
                        setIsPremium(true);
                        setSuccessModalVisible(true);
                    } else {
                        Alert.alert("Erreur", "L'achat a réussi mais l'enregistrement de votre profil premium a échoué.");
                    }
                } catch (err) {
                    console.error('Acknowledgement/Database update failed:', err);
                } finally {
                    setLoading(false);
                }
            }
        });

        purchaseErrorSubscription = IAP.purchaseErrorListener((error: any) => {
            console.warn('Purchase process error:', error);
            setLoading(false);
            if (error.code !== 'E_USER_CANCELLED') {
                Alert.alert("Achat échoué", "Le processus d'achat a été interrompu ou a échoué.");
            }
        });

        initBilling();

        return () => {
            if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
            if (purchaseErrorSubscription) purchaseErrorSubscription.remove();
            IAP.endConnection();
        };
    }, []);

    // Helper pour récupérer le prix localisé (0,00 € par défaut pour la phase de test)
    const getSubscriptionPrice = () => {
        if (!subscriptionProduct) return "0,00 €";
        const offerDetails = subscriptionProduct.subscriptionOfferDetails?.[0];
        const pricePhase = offerDetails?.pricingPhases?.pricingPhaseList?.[0];
        if (pricePhase?.formattedPrice) {
            return pricePhase.formattedPrice;
        }
        return subscriptionProduct.localizedPrice || "0,00 €";
    };

    const handleSubscribe = async () => {
        if (isExpoGo || !IAP) {
            // Mode de simulation pour Expo Go
            setLoading(true);
            setTimeout(async () => {
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
                setLoading(false);
            }, 1000);
            return;
        }

        if (isPremium) {
            Alert.alert(
                t('prem_unsubscribe') || "Gérer l'abonnement",
                "Pour vous désabonner ou modifier vos options de facturation, veuillez vous rendre sur l'application Google Play Store dans la rubrique 'Paiements et abonnements'.",
                [
                    { text: "Annuler", style: "cancel" },
                    {
                        text: "Ouvrir Google Play",
                        onPress: () => {
                            const url = `https://play.google.com/store/account/subscriptions?package=com.jaxv9.smartgardenpie&sku=${SUB_SKU}`;
                            import('react-native').then(({ Linking }) => {
                                Linking.openURL(url).catch(err => console.error("Impossible d'ouvrir Google Play", err));
                            });
                        }
                    }
                ]
            );
        } else {
            setLoading(true);
            try {
                const offerToken = subscriptionProduct?.subscriptionOfferDetails?.[0]?.offerToken;
                if (offerToken) {
                    await IAP.requestSubscription({
                        sku: SUB_SKU,
                        subscriptionOffers: [{ sku: SUB_SKU, offerToken }]
                    });
                } else {
                    await IAP.requestSubscription({ sku: SUB_SKU });
                }
            } catch (error: any) {
                setLoading(false);
                console.warn('Purchase initiation failed:', error);
                if (error.code !== 'E_USER_CANCELLED') {
                    Alert.alert("Erreur", "Impossible de démarrer le paiement Google Play.");
                }
            }
        }
    };

    return (
        <View style={styles.screen}>
            <AppHeader title={t('prem_title')} showBack={true} />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {isExpoGo && (
                    <View style={styles.demoBanner}>
                        <Ionicons name="information-circle-outline" size={16} color="#B45309" />
                        <Text style={styles.demoBannerText}>
                            Mode Expo Go : Paiements réels désactivés (simulation active pour les tests).
                        </Text>
                    </View>
                )}

                <View style={styles.heroCard}>
                    <View style={styles.badgeRow}>
                        <View style={styles.vipBadge}>
                            <Ionicons name="sparkles" size={12} color="#FFFFFF" />
                            <Text style={styles.vipBadgeText}>{t('prem_elite')}</Text>
                        </View>
                    </View>
                    <Text style={styles.heroTitle}>{t('prem_hero_title')}</Text>
                    <Text style={styles.heroSub}>
                        {t('prem_hero_sub')}
                    </Text>
                </View>

                <View style={[styles.planCard, styles.premiumPlanCard]}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <View style={[styles.popularBadge, { marginBottom: 0 }]}>
                            <Ionicons name="star" size={10} color="#D97706" />
                            <Text style={styles.popularText}>{t('prem_recommended')}</Text>
                        </View>
                        {isPremium && (
                            <View style={[styles.activePlanBadge, { backgroundColor: '#FFFDF0', borderColor: '#FEF3C7', borderWidth: 1 }]}>
                                <Ionicons name="ribbon" size={12} color="#D4AF37" />
                                <Text style={[styles.activePlanText, { color: '#B8860B' }]}>{t('vip_current_offer')}</Text>
                            </View>
                        )}
                    </View>

                    <View style={styles.planHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.premiumName}>Ultra VIP 👑</Text>
                            <Text style={styles.premiumDesc}>{t('prem_best')}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                                <Text style={styles.strikethroughPrice}>6,99 €</Text>
                                <Text style={styles.premiumPrice}>{getSubscriptionPrice()}</Text>
                            </View>
                            <Text style={styles.premiumPeriod}>{t('prem_month')}</Text>
                        </View>
                    </View>

                    <View style={styles.testPhaseBadge}>
                        <Ionicons name="gift-outline" size={14} color="#059669" style={{ marginRight: 4 }} />
                        <Text style={styles.testPhaseText}>
                            Offert pendant la phase de test bêta !
                        </Text>
                    </View>

                    <View style={styles.perksList}>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>{t('vip_perk_docs')}</Text>
                        </View>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>{t('vip_perk_advice')}</Text>
                        </View>
                        <View style={styles.perkRow}>
                            <Ionicons name="checkmark-circle" size={18} color="#D4AF37" />
                            <Text style={styles.perkText}>{t('vip_perk_calendar')}</Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.subscribeBtn, isPremium && styles.unsubscribeBtn, loading && { opacity: 0.7 }]}
                        onPress={handleSubscribe}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={isPremium ? "#B8860B" : "white"} size="small" />
                        ) : (
                            <>
                                <Text style={[styles.subscribeBtnText, isPremium && { color: '#B8860B' }]}>
                                    {isPremium ? t('prem_unsubscribe') : t('prem_subscribe')}
                                </Text>
                                <Ionicons name="arrow-forward" size={16} color={isPremium ? "#B8860B" : "white"} />
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={[styles.planCard, styles.freePlanCard]}>
                    <View style={styles.planHeader}>
                        <View>
                            <Text style={styles.planName}>{t('prem_basic')}</Text>
                            <Text style={styles.planDesc}>{t('prem_basic_desc')}</Text>
                        </View>
                        <View style={styles.priceContainer}>
                            <Text style={styles.planPrice}>0 €</Text>
                            <Text style={styles.planPeriod}>{t('prem_forever')}</Text>
                        </View>
                    </View>

                    {!isPremium && (
                        <View style={styles.activePlanBadge}>
                            <Ionicons name="checkmark-circle-outline" size={14} color="#6B7280" />
                            <Text style={styles.activePlanText}>{t('prem_active')}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.tableCard}>
                    <Text style={styles.tableTitle}>{t('prem_table_title')}</Text>

                    <View style={styles.tableHeaderRow}>
                        <View style={styles.colFeature} />
                        <View style={styles.colPlan}><Text style={styles.colPlanTitle}>{t('word_basic')}</Text></View>
                        <View style={styles.colPlan}><Text style={[styles.colPlanTitle, styles.goldText]}>{t('word_vip')}</Text></View>
                    </View>

                    {FEATURES.map((feature, idx) => {
                        const isEven = idx % 2 === 0;
                        const isUltraPositive = feature.ultra !== 'word_no';
                        const isFreePositive = feature.free === 'word_yes';
                        const isFreeWarning = feature.free !== 'word_yes' && feature.free !== 'word_no';

                        return (
                            <View key={feature.key} style={[styles.tableRow, isEven && styles.evenRow]}>
                                <View style={styles.colFeature}>
                                    <View style={styles.featureNameWrapper}>
                                        <Ionicons name={feature.icon as any} size={15} color="#5A7F54" style={styles.featureIcon} />
                                        <Text style={styles.featureName} numberOfLines={1}>{t(feature.key)}</Text>
                                    </View>
                                </View>

                                <View style={styles.colPlan}>
                                    {isFreeWarning ? (
                                        <View style={styles.badgeWarning}>
                                            <Text style={styles.badgeWarningText}>{t(feature.free)}</Text>
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
                                            <Text style={styles.ultraSuccessText}>{t(feature.ultra)}</Text>
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
                    {t('prem_caveat')}
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
                        <Text style={styles.modalTitle}>{t('prem_welcome_success')}</Text>
                        <Text style={styles.modalSub}>
                            {t('prem_success_sub')}
                        </Text>
                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setSuccessModalVisible(false)}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.modalBtnText}>{t('prem_letsgo')}</Text>
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
    strikethroughPrice: {
        fontSize: 16,
        color: '#94A3B8',
        textDecorationLine: 'line-through',
        fontWeight: '600',
        marginTop: 4,
    },
    testPhaseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginTop: 12,
        marginBottom: 4,
        alignSelf: 'flex-start',
    },
    testPhaseText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#047857',
    },
    demoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        borderColor: '#F59E0B',
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
        marginTop: 16,
        marginBottom: 8,
        gap: 8,
    },
    demoBannerText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#D97706',
        flex: 1,
    },
});
