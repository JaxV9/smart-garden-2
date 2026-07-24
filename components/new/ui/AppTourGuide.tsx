import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Animated, Easing, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTour, ElementLayout } from '@/contexts/tour.context';
import { useTranslation } from '@/contexts/language.context';
import { tourTranslations } from './tourTranslations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;

interface CutoutConfig {
    x: number;
    y: number;
    width: number;
    height: number;
}

export const AppTourGuide = () => {
    const {
        visible,
        step,
        elements,
        nextStep,
        prevStep,
        skipTour
    } = useTour();

    const { t, language } = useTranslation();

    // Get current language resources
    const activeLang = (language && tourTranslations[language]) ? language : 'fr';
    const stepTitles = tourTranslations[activeLang].titles;
    const stepDescriptions = tourTranslations[activeLang].descriptions;

    // Simulation states
    const [typedText, setTypedText] = useState('');
    const [simulatedTasks, setSimulatedTasks] = useState([
        { id: '1', title: t('tour_guide_sim_task1', 'Semer les carottes'), completed: true },
        { id: '2', title: t('tour_guide_sim_task2', 'Arroser les salades'), completed: false }
    ]);
    const [plannerTomatoVisible, setPlannerTomatoVisible] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;
    const dragX = useRef(new Animated.Value(0)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const dragOpacity = useRef(new Animated.Value(0)).current;

    // Smooth cutout animation coordinates
    const cutoutX = useRef(new Animated.Value(SCREEN_WIDTH / 2)).current;
    const cutoutY = useRef(new Animated.Value(SCREEN_HEIGHT / 2)).current;
    const cutoutW = useRef(new Animated.Value(0)).current;
    const cutoutH = useRef(new Animated.Value(0)).current;

    // Determine current cutout config based on step
    const getCutoutConfig = (): CutoutConfig | null => {
        let key = '';
        if (step === 0) key = 'home_weather';
        else if (step === 1) key = 'home_stats_grid';
        else if (step === 2) key = 'home_tool_tasks';
        else if (step === 3) key = 'taches_main';
        else if (step === 4) key = 'home_tool_calendar';
        else if (step === 5) key = 'calendar_main';
        else if (step === 6) key = 'home_tool_sensors';
        else if (step === 7) key = 'sensors_main';
        else if (step === 8) key = 'home_tool_plan';
        else if (step === 9) key = 'plan_grid';
        else if (step === 10) key = 'plante_filters';
        else if (step === 11) key = 'vegetable_meta';
        else if (step === 12) key = 'social_feed';
        else if (step === 13) key = 'social_feed';
        else if (step === 14) key = 'social_feed';
        else if (step === 15) key = 'profile_info';
        else if (step === 16) key = 'profile_lang_selector';
        else if (step === 17) key = 'personal_pseudo_email';
        else if (step === 18) key = 'community_private_switch';
        else if (step === 19) key = 'profile_garden_details';

        if (!key) return null;

        const layout = elements[key];
        if (layout) {
            // Apply slight padding to highlighted area
            return {
                x: Math.max(0, layout.x - 8),
                y: Math.max(0, layout.y - 8),
                width: layout.width + 16,
                height: layout.height + 16
            };
        }

        // Exact fallback coordinates if elements haven't layout-rendered yet
        switch (step) {
            case 0: return { x: 16, y: 215, width: SCREEN_WIDTH - 32, height: 95 };
            case 1: return { x: 16, y: 330, width: SCREEN_WIDTH - 32, height: 195 };
            case 2: return { x: 20, y: 580, width: SCREEN_WIDTH - 40, height: 75 };
            case 3: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 4: return { x: 20, y: 670, width: SCREEN_WIDTH - 40, height: 75 };
            case 5: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 6: return { x: 20, y: 760, width: SCREEN_WIDTH - 40, height: 75 };
            case 7: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 8: return { x: 20, y: 850, width: SCREEN_WIDTH - 40, height: 75 };
            case 9: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 10: return { x: 16, y: 108, width: SCREEN_WIDTH - 32, height: 400 };
            case 11: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 12:
            case 13:
            case 14: return { x: 16, y: 108, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 230 };
            case 15: return { x: 20, y: 108, width: SCREEN_WIDTH - 40, height: 200 };
            case 16: return { x: 20, y: 320, width: SCREEN_WIDTH - 40, height: 250 };
            case 17: return { x: 24, y: 220, width: SCREEN_WIDTH - 48, height: 360 };
            case 18: return { x: 20, y: 220, width: SCREEN_WIDTH - 40, height: 490 };
            case 19: return { x: 24, y: 150, width: SCREEN_WIDTH - 48, height: 360 };
            default: return null;
        }
    };

    const isTooltipTop = () => {
        const cutout = getCutoutConfig();
        if (cutout) {
            return cutout.y > SCREEN_HEIGHT / 2 - 50;
        }
        return false;
    };

    // Determine tooltip placement style
    const getTooltipStyle = () => {
        if (step === -1) {
            return styles.centerCard;
        }
        if (isTooltipTop()) {
            return { position: 'absolute' as const, top: 110 };
        }
        return { position: 'absolute' as const, bottom: 90 };
    };

    // Animate cutout smoothly when step/elements change
    useEffect(() => {
        const target = getCutoutConfig();
        if (target) {
            Animated.parallel([
                Animated.spring(cutoutX, {
                    toValue: target.x,
                    tension: 32,
                    friction: 7,
                    useNativeDriver: false
                }),
                Animated.spring(cutoutY, {
                    toValue: target.y,
                    tension: 32,
                    friction: 7,
                    useNativeDriver: false
                }),
                Animated.spring(cutoutW, {
                    toValue: target.width,
                    tension: 32,
                    friction: 7,
                    useNativeDriver: false
                }),
                Animated.spring(cutoutH, {
                    toValue: target.height,
                    tension: 32,
                    friction: 7,
                    useNativeDriver: false
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(cutoutX, { toValue: SCREEN_WIDTH / 2, duration: 250, useNativeDriver: false }),
                Animated.timing(cutoutY, { toValue: SCREEN_HEIGHT / 2, duration: 250, useNativeDriver: false }),
                Animated.timing(cutoutW, { toValue: 0, duration: 250, useNativeDriver: false }),
                Animated.timing(cutoutH, { toValue: 0, duration: 250, useNativeDriver: false })
            ]).start();
        }
    }, [step, visible, elements]);

    // Animate tooltips and start simulation animations
    useEffect(() => {
        if (visible) {
            // Fade-in tooltip
            fadeAnim.setValue(0);
            slideAnim.setValue(15);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 40,
                    friction: 6,
                    useNativeDriver: true,
                })
            ]).start();

            // Run simulated actions depending on step
            if (step === 3) {
                // Task manager typing simulation
                setTypedText('');
                setSimulatedTasks([
                    { id: '1', title: t('tour_guide_sim_task1', 'Semer les carottes'), completed: true },
                    { id: '2', title: t('tour_guide_sim_task2', 'Arroser les salades'), completed: false }
                ]);

                let currentString = '';
                const targetString = t('tour_guide_sim_task3', 'Arroser les tomates');
                let charIndex = 0;

                const typingInterval = setInterval(() => {
                    if (charIndex < targetString.length) {
                        currentString += targetString[charIndex];
                        setTypedText(currentString);
                        charIndex++;
                    } else {
                        clearInterval(typingInterval);
                        // Simulate addition
                        setTimeout(() => {
                            setTypedText('');
                            setSimulatedTasks(prev => [
                                ...prev,
                                { id: '3', title: targetString, completed: false }
                            ]);
                            // Simulate checkmark completion after addition
                            setTimeout(() => {
                                setSimulatedTasks(prev =>
                                    prev.map(t => t.id === '3' ? { ...t, completed: true } : t)
                                );
                            }, 800);
                        }, 500);
                    }
                }, 80);

                return () => clearInterval(typingInterval);
            } else if (step === 9) {
                // Plan simulation drag animation
                setPlannerTomatoVisible(false);
                dragX.setValue(0);
                dragY.setValue(0);
                dragOpacity.setValue(1);

                Animated.sequence([
                    Animated.delay(500),
                    Animated.parallel([
                        Animated.timing(dragX, {
                            toValue: 0,
                            duration: 1200,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        }),
                        Animated.timing(dragY, {
                            toValue: -110,
                            duration: 1200,
                            easing: Easing.out(Easing.ease),
                            useNativeDriver: true,
                        })
                    ]),
                    Animated.delay(100),
                    Animated.timing(dragOpacity, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    })
                ]).start(() => {
                    setPlannerTomatoVisible(true);
                });
            }
        }
    }, [step, visible, language]);

    if (!visible) return null;

    // Calculate indicator arrow pointing to highlighted elements
    const getArrowLeft = () => {
        const cutout = getCutoutConfig();
        if (cutout) {
            const cx = cutout.x + cutout.width / 2;
            return cx - 20 - 10; // sub card margin offset & half arrow width
        }
        return SCREEN_WIDTH / 2 - 30;
    };

    const isCutoutActive = step !== -1;

    return (
        <View style={styles.overlay} pointerEvents="auto">
            {/* 4-panels cutout for highlighting with smooth animation */}
            {isCutoutActive && (
                <>
                    <Animated.View style={[styles.panel, { top: 0, left: 0, right: 0, height: cutoutY }]} />
                    <Animated.View style={[styles.panel, { top: Animated.add(cutoutY, cutoutH), left: 0, right: 0, bottom: 0 }]} />
                    <Animated.View style={[styles.panel, { top: cutoutY, left: 0, width: cutoutX, height: cutoutH }]} />
                    <Animated.View style={[styles.panel, { top: cutoutY, left: Animated.add(cutoutX, cutoutW), right: 0, height: cutoutH }]} />
                    <Animated.View style={[styles.highlightBorder, { top: cutoutY, left: cutoutX, width: cutoutW, height: cutoutH }]} />
                </>
            )}

            {/* Simulated UI Card for Task Creation (Step 3) */}
            {step === 3 && (
                <View style={styles.simulationContainer}>
                    <View style={styles.simCard}>
                        <View style={styles.simCardHeader}>
                            <Ionicons name="checkbox-outline" size={20} color="#5B8E55" />
                            <Text style={styles.simCardTitle}>{t('home_tool_tasks_title', 'Gestion des Tâches')}</Text>
                        </View>
                        <View style={styles.simTaskList}>
                            {simulatedTasks.map((t) => (
                                <View key={t.id} style={styles.simTaskRow}>
                                    <Ionicons 
                                        name={t.completed ? "checkmark-circle" : "ellipse-outline"} 
                                        size={20} 
                                        color={t.completed ? "#10B981" : "#D1D5DB"} 
                                    />
                                    <Text style={[styles.simTaskText, t.completed && styles.simTaskCompletedText]}>
                                        {t.title}
                                    </Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.simInputRow}>
                            <View style={styles.simInput}>
                                <Text style={styles.simInputText}>
                                    {typedText || t('tour_guide_add_task_placeholder', 'Ajouter une tâche...')}
                                    {typedText.length > 0 && <Text style={styles.typingCursor}>|</Text>}
                                </Text>
                            </View>
                            <View style={styles.simAddBtn}>
                                <Text style={styles.simAddBtnText}>+</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Simulated UI Card for Garden Plan grid (Step 9) */}
            {step === 9 && (
                <View style={styles.simulationContainer}>
                    <View style={styles.simCard}>
                        <View style={styles.simCardHeader}>
                            <Ionicons name="grid-outline" size={20} color="#5B8E55" />
                            <Text style={styles.simCardTitle}>{t('home_tool_plan_title', 'Plan du Potager')}</Text>
                        </View>
                        
                        <View style={styles.simGrid}>
                            <View style={styles.simGridRow}>
                                <View style={styles.simGridCell}>
                                    {plannerTomatoVisible ? (
                                        <Animated.View style={styles.tomatoPlantBadge}>
                                            <Ionicons name="leaf" size={22} color="#EF4444" />
                                        </Animated.View>
                                    ) : null}
                                </View>
                                <View style={styles.simGridCell}>
                                    <Ionicons name="leaf" size={22} color="#10B981" />
                                </View>
                                <View style={styles.simGridCell} />
                            </View>
                            <View style={styles.simGridRow}>
                                <View style={styles.simGridCell} />
                                <View style={styles.simGridCell} />
                                <View style={styles.simGridCell}>
                                    <Ionicons name="leaf" size={22} color="#F59E0B" />
                                </View>
                            </View>
                        </View>

                        {/* Drag animation pointer */}
                        <Animated.View style={[
                            styles.simDragPointer,
                            { 
                                transform: [{ translateX: dragX }, { translateY: dragY }],
                                opacity: dragOpacity
                            }
                        ]}>
                            <Ionicons name="hand-left" size={24} color="#5B8E55" />
                            <View style={styles.dragItemPreview}>
                                <Ionicons name="leaf" size={16} color="#EF4444" />
                            </View>
                        </Animated.View>

                        <View style={styles.simSeedSelector}>
                            <Text style={styles.simSelectorTitle}>{t('tour_guide_seeds_title', 'Semences :')}</Text>
                            <View style={styles.simSeedsRow}>
                                <View style={[styles.simSeedBadge, { borderColor: '#EF4444' }]}>
                                    <Text style={styles.simSeedText}>🍅 {t('tour_guide_tomato', 'Tomates')}</Text>
                                </View>
                                <View style={styles.simSeedBadge}>
                                    <Text style={styles.simSeedText}>🥬 {t('tour_guide_salad', 'Salades')}</Text>
                                </View>
                                <View style={styles.simSeedBadge}>
                                    <Text style={styles.simSeedText}>🥕 {t('tour_guide_carrot', 'Carottes')}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            {/* Tooltip dialog card */}
            <Animated.View style={[styles.card, getTooltipStyle(), { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                {step === -1 ? (
                    // Welcome screen text
                    <>
                        <View style={styles.welcomeIconWrapper}>
                            <Ionicons name="leaf" size={44} color="#5B8E55" />
                        </View>
                        <Text style={styles.title}>{t('tour_guide_welcome_title', "Visite Guidée de l'App 🌿")}</Text>
                        <Text style={styles.description}>
                            {t('tour_guide_welcome_desc', "Découvrez toutes les rubriques et fonctionnalités détaillées de votre potager connecté étape par étape.")}
                        </Text>
                        <View style={styles.buttonRow}>
                            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={skipTour}>
                                <Text style={styles.btnSecondaryText}>{t('tour_guide_later', "Plus tard")}</Text>
                            </Pressable>
                            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={nextStep}>
                                <Text style={styles.btnPrimaryText}>{t('tour_guide_start', "C'est parti ! 🚀")}</Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    // Onboarding step contents
                    <>
                        <View style={styles.header}>
                            <Text style={styles.stepIndicator}>
                                {t('tour_guide_step', 'Étape')} {step + 1} {t('tour_guide_of', 'sur')} {stepTitles.length}
                            </Text>
                            <Pressable onPress={skipTour} style={styles.skipBtn}>
                                <Text style={styles.skipText}>{t('tour_guide_skip', 'Passer')}</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.title}>{stepTitles[step]}</Text>
                        <Text style={styles.description}>{stepDescriptions[step]}</Text>

                        {/* Progress Dots */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dotsScrollContent} style={styles.dotsScroll}>
                            <View style={styles.dotsContainer}>
                                {stepTitles.map((_, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.dot,
                                            step === idx ? styles.dotActive : styles.dotInactive,
                                        ]}
                                    />
                                ))}
                            </View>
                        </ScrollView>

                        <View style={styles.navigationRow}>
                            <Pressable style={styles.navBtn} onPress={prevStep}>
                                <Ionicons name="arrow-back" size={18} color="#6B7280" />
                                <Text style={styles.navBtnText}>{t('tour_guide_back', 'Retour')}</Text>
                            </Pressable>

                            <Pressable style={[styles.btn, styles.btnPrimary, { minWidth: 100, flex: 0 }]} onPress={nextStep}>
                                <Text style={styles.btnPrimaryText}>
                                    {step === stepTitles.length - 1 ? t('tour_guide_finish', 'Terminer 🎉') : t('tour_guide_next', 'Suivant')}
                                </Text>
                                {step < stepTitles.length - 1 && (
                                    <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 4 }} />
                                )}
                            </Pressable>
                        </View>

                        {/* Pointing arrows */}
                        {isCutoutActive && (
                            isTooltipTop() ? (
                                <View style={[styles.arrowDown, { left: getArrowLeft() }]} />
                            ) : (
                                <View style={[styles.arrowUp, { left: getArrowLeft() }]} />
                            )
                        )}
                    </>
                )}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 99999,
    },
    panel: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
    },
    highlightBorder: {
        position: 'absolute',
        borderWidth: 2.5,
        borderColor: '#5B8E55',
        borderStyle: 'dashed',
        borderRadius: 16,
        backgroundColor: 'transparent',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        width: CARD_WIDTH,
        alignSelf: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
        zIndex: 100000,
    },
    centerCard: {
        position: 'absolute',
        top: (SCREEN_HEIGHT - 320) / 2,
    },
    welcomeIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF6EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    stepIndicator: {
        fontSize: 10,
        fontWeight: '700',
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },
    skipBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    skipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    title: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 8,
    },
    description: {
        fontSize: 13,
        lineHeight: 19,
        color: '#4B5563',
        textAlign: 'center',
        marginBottom: 16,
    },
    dotsScroll: {
        width: '100%',
        maxHeight: 16,
        marginBottom: 16,
    },
    dotsScrollContent: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
    },
    dotActive: {
        backgroundColor: '#5B8E55',
        width: 10,
    },
    dotInactive: {
        backgroundColor: '#E5E7EB',
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    navigationRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    btn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    btnPrimary: {
        backgroundColor: '#5B8E55',
        paddingHorizontal: 16,
    },
    btnPrimaryText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '700',
    },
    btnSecondary: {
        backgroundColor: '#F3F4F6',
    },
    btnSecondaryText: {
        color: '#4B5563',
        fontSize: 14,
        fontWeight: '700',
    },
    navBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        gap: 6,
    },
    navBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    arrowDown: {
        position: 'absolute',
        bottom: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: '#FFFFFF',
    },
    arrowUp: {
        position: 'absolute',
        top: -10,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#FFFFFF',
    },
    // Simulation Styles
    simulationContainer: {
        position: 'absolute',
        top: 250,
        left: 20,
        right: 20,
        zIndex: 100000,
    },
    simCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    simCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingBottom: 8,
    },
    simCardTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    simTaskList: {
        gap: 10,
        marginBottom: 14,
    },
    simTaskRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#F9FAFB',
        padding: 10,
        borderRadius: 10,
    },
    simTaskText: {
        fontSize: 13,
        color: '#4B5563',
        fontWeight: '500',
    },
    simTaskCompletedText: {
        textDecorationLine: 'line-through',
        color: '#9CA3AF',
    },
    simInputRow: {
        flexDirection: 'row',
        gap: 8,
    },
    simInput: {
        flex: 1,
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        height: 38,
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    simInputText: {
        fontSize: 12,
        color: '#6B7280',
    },
    typingCursor: {
        color: '#5B8E55',
        fontWeight: 'bold',
    },
    simAddBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#5B8E55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    simAddBtnText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    // Grid Simulation Styles
    simGrid: {
        width: '100%',
        aspectRatio: 1.8,
        backgroundColor: '#EBF6EB',
        borderRadius: 12,
        padding: 10,
        gap: 8,
        marginBottom: 14,
        justifyContent: 'center',
    },
    simGridRow: {
        flexDirection: 'row',
        gap: 8,
        flex: 1,
    },
    simGridCell: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tomatoPlantBadge: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 6,
        borderRadius: 8,
    },
    simDragPointer: {
        position: 'absolute',
        bottom: 70,
        left: 60,
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 100001,
    },
    dragItemPreview: {
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 4,
        marginLeft: -4,
        marginTop: -10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 3,
    },
    simSeedSelector: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 10,
    },
    simSelectorTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 6,
    },
    simSeedsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    simSeedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    simSeedText: {
        fontSize: 11,
        color: '#4B5563',
        fontWeight: '600',
    },
});
