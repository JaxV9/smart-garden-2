import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable, Dimensions, Animated, Easing, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTour, ElementLayout } from '@/contexts/tour.context';

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

    // Simulation states
    const [typedText, setTypedText] = useState('');
    const [simulatedTasks, setSimulatedTasks] = useState([
        { id: '1', title: 'Semer les carottes', completed: true },
        { id: '2', title: 'Arroser les salades', completed: false }
    ]);
    const [plannerTomatoVisible, setPlannerTomatoVisible] = useState(false);

    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(15)).current;
    const dragX = useRef(new Animated.Value(0)).current;
    const dragY = useRef(new Animated.Value(0)).current;
    const dragOpacity = useRef(new Animated.Value(0)).current;

    // Steps details
    const stepTitles = [
        "Bienvenue & Météo ⛅",
        "Vos Plantes 🥬",
        "Tâches Complétées ✅",
        "Série d'Activité 🔥",
        "Capteurs Actifs 📡",
        "Gestion des Tâches 📋",
        "Vos Corvées Quotidiennes 📋",
        "Créer une Tâche ✨",
        "Retour à l'Accueil 🏡",
        "Calendrier Lunaire 📅",
        "Retour à l'Accueil 🏡",
        "Capteurs en Direct 📊",
        "Retour à l'Accueil 🏡",
        "Plan du Potager 🗺️",
        "Ajouter une Plantation 🌱",
        "Recherche & Filtres 🔍",
        "Encyclopédie des Plantes 📖",
        "Fiche de Culture 🌱",
        "Accès Premium Smart 🔒",
        "Fil Communautaire 💬",
        "Le Forum d'Entraide 💬",
        "Tutoriels de Jardinage 📖",
        "Votre Profil 👤",
        "Pass Smart Garden Ultra 👑",
        "Choix de la Langue 🌐",
        "Informations du Jardin 🏡",
        "Modifier le Profil 👤",
        "Niveau d'Expérience 🌱",
        "Confidentialité du Compte 🔒",
        "Résumé des Activités 📈",
        "Configuration Potager 🏡"
    ];

    const stepDescriptions = [
        "Le widget météo en haut à droite s'adapte à votre ville configurée pour vous donner la température et l'ensoleillement en direct afin d'optimiser l'arrosage.",
        "Ce compteur affiche le nombre total de légumes et plantes actuellement actifs dans vos carrés potagers.",
        "Suivez d'un seul coup d'œil le nombre de tâches quotidiennes que vous avez validées aujourd'hui.",
        "Votre série de jours actifs ! Connectez-vous régulièrement et valisez vos tâches pour faire grimper cette flamme.",
        "Affiche le nombre total de capteurs connectés à vos bacs pour suivre la santé de la terre.",
        "L'outil de gestion des tâches vous liste toutes les corvées de la journée (arrosage, taille, engrais). Ouvrons-le pour voir.",
        "Nous voici sur l'écran dédié aux tâches ! C'est ici que vous retrouvez la liste des actions à mener pour le bien-être de vos cultures.",
        "Créer une tâche est un jeu d'enfant : écrivez simplement son intitulé, validez, et elle s'ajoute instantanément à votre calendrier !",
        "Revenons à l'accueil pour découvrir d'autres outils. Regardons maintenant l'outil Calendrier.",
        "Consultez les périodes idéales de semis, plantation et récolte guidées par le cycle lunaire et les saisons sur votre calendrier.",
        "Revenons sur l'accueil pour explorer le panneau de contrôle des capteurs connectés.",
        "Suivez les graphiques d'humidité du sol, de luminosité et de température ambiante reçus par vos capteurs connectés.",
        "Revenons sur l'accueil pour ouvrir l'outil Plan du potager et concevoir votre espace.",
        "Configurez et dessinez virtuellement vos parcelles de potager pour une organisation spatiale optimale sur votre plan.",
        "Glissez une graine de votre sélection et déposez-la sur une case vide pour commencer à cultiver votre nouveau légume !",
        "Parcourez notre riche encyclopédie de plantes. Utilisez la recherche et filtrez par catégorie ou mois pour trouver quoi planter.",
        "Découvrez la liste des légumes disponibles. Vous pouvez cliquer sur une fiche pour en savoir plus.",
        "Sur cette fiche, retrouvez toutes les informations générales de culture : exposition au soleil, arrosage, température idéale et famille botanique.",
        "Les conseils avancés de compagnonnage (plantes amies/ennemies) et le calendrier lunaire détaillé de semis sont des fonctionnalités exclusives de notre Pass Ultra.",
        "Échangez des astuces rapides et des photos de votre potager avec les autres jardiniers sur le fil d'actualité social.",
        "Posez vos questions techniques sur le forum d'entraide ou participez aux discussions sur les maladies, la terre et les astuces de récolte.",
        "Accédez à des guides pas-à-pas et vidéos de formation rédigés par des experts pour apprendre à cultiver comme un pro.",
        "Gérant de compte : gérez vos informations de compte, ajustez votre niveau de jardinage et consultez vos statistiques globales d'activité.",
        "Débloquez tout le potentiel de l'application ! Le Pass Ultra active les conseils IA personnalisés et les capteurs illimités.",
        "Sélectionnez la langue de l'application selon vos préférences. Toutes les traductions s'adaptent instantanément.",
        "Configurez le nom et la structure de votre potager (carrés de terre, bacs connectés, etc.) pour adapter les conseils.",
        "Dans vos informations personnelles, vous pouvez mettre à jour votre pseudo, votre adresse email ou votre nom public.",
        "Ajustez votre niveau de jardinage (débutant, amateur, expert) pour recevoir des recommandations adaptées à vos compétences.",
        "Activez le mode 'Compte Privé' si vous souhaitez masquer vos publications et photos de la galerie publique et de la communauté.",
        "Retrouvez ici le résumé complet de vos contributions : vos publications sur le forum, vos commentaires et vos tutoriels enregistrés.",
        "Précisez l'adresse ou la ville de votre potager pour obtenir des prévisions météo locales extrêmement précises et géolocalisées."
    ];

    // Determine current cutout config based on step
    const getCutoutConfig = (): CutoutConfig | null => {
        let key = '';
        if (step === 0) key = 'home_weather';
        else if (step === 1) key = 'home_stat_plants';
        else if (step === 2) key = 'home_stat_tasks';
        else if (step === 3) key = 'home_stat_streak';
        else if (step === 4) key = 'home_stat_sensors';
        else if (step === 5) key = 'home_tool_tasks';
        else if (step === 6) key = 'taches_main';
        else if (step === 7) key = 'taches_main';
        else if (step === 8) key = 'home_tool_calendar';
        else if (step === 9) key = 'calendar_main';
        else if (step === 10) key = 'home_tool_sensors';
        else if (step === 11) key = 'sensors_main';
        else if (step === 12) key = 'home_tool_plan';
        else if (step === 13) key = 'plan_grid';
        else if (step === 14) key = 'plan_grid';
        else if (step === 15) key = 'plante_filters';
        else if (step === 16) key = 'plante_list';
        else if (step === 17) key = 'vegetable_meta';
        else if (step === 18) key = 'vegetable_lock_overlay';
        else if (step === 19) key = 'social_feed';
        else if (step === 20) key = 'social_feed';
        else if (step === 21) key = 'social_feed';
        else if (step === 22) key = 'profile_info';
        else if (step === 23) key = 'profile_vip';
        else if (step === 24) key = 'profile_lang_selector';
        else if (step === 25) key = 'profile_garden_details';
        else if (step === 26) key = 'personal_pseudo_email';
        else if (step === 27) key = 'personal_level';
        else if (step === 28) key = 'community_private_switch';
        else if (step === 29) key = 'community_interactions';
        else if (step === 30) key = 'profile_garden_details';

        if (!key) return null;

        const layout = elements[key];
        if (layout) {
            return {
                x: Math.max(0, layout.x - 6),
                y: Math.max(0, layout.y - 6),
                width: layout.width + 12,
                height: layout.height + 12
            };
        }

        // Exact fallback coordinates if elements haven't layout-rendered yet
        const leftColX = 20;
        const rightColX = 20 + (SCREEN_WIDTH - 52) / 2 + 12;
        const colWidth = (SCREEN_WIDTH - 52) / 2;

        switch (step) {
            case 0: return { x: 16, y: 180, width: SCREEN_WIDTH - 32, height: 95 };
            case 1: return { x: leftColX, y: 300, width: colWidth, height: 90 };
            case 2: return { x: rightColX, y: 300, width: colWidth, height: 90 };
            case 3: return { x: leftColX, y: 405, width: colWidth, height: 90 };
            case 4: return { x: rightColX, y: 405, width: colWidth, height: 90 };
            case 5: return { x: 20, y: 515, width: SCREEN_WIDTH - 40, height: 75 };
            case 6:
            case 7: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 8: return { x: 20, y: 600, width: SCREEN_WIDTH - 40, height: 75 };
            case 9: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 10: return { x: 20, y: 685, width: SCREEN_WIDTH - 40, height: 75 };
            case 11: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 12: return { x: 20, y: 770, width: SCREEN_WIDTH - 40, height: 75 };
            case 13:
            case 14: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 220 };
            case 15: return { x: 16, y: 108, width: SCREEN_WIDTH - 32, height: 50 };
            case 16: return { x: 16, y: 170, width: SCREEN_WIDTH - 32, height: 350 };
            case 17: return { x: 16, y: 100, width: SCREEN_WIDTH - 32, height: 180 };
            case 18: return { x: 16, y: 290, width: SCREEN_WIDTH - 32, height: 280 };
            case 19:
            case 20:
            case 21: return { x: 16, y: 108, width: SCREEN_WIDTH - 32, height: SCREEN_HEIGHT - 230 };
            case 22: return { x: 20, y: 108, width: SCREEN_WIDTH - 40, height: 100 };
            case 23: return { x: 20, y: 220, width: SCREEN_WIDTH - 40, height: 90 };
            case 24: return { x: 20, y: 320, width: SCREEN_WIDTH - 40, height: 110 };
            case 25: return { x: 20, y: 445, width: SCREEN_WIDTH - 40, height: 120 };
            case 26: return { x: 24, y: 220, width: SCREEN_WIDTH - 48, height: 260 };
            case 27: return { x: 24, y: 490, width: SCREEN_WIDTH - 48, height: 90 };
            case 28: return { x: 20, y: 220, width: SCREEN_WIDTH - 40, height: 80 };
            case 29: return { x: 20, y: 310, width: SCREEN_WIDTH - 40, height: 400 };
            case 30: return { x: 24, y: 150, width: SCREEN_WIDTH - 48, height: 360 };
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
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                })
            ]).start();

            // Run simulated actions depending on step
            if (step === 7) {
                // Task manager typing simulation
                setTypedText('');
                setSimulatedTasks([
                    { id: '1', title: 'Semer les carottes', completed: true },
                    { id: '2', title: 'Arroser les salades', completed: false }
                ]);

                let currentString = '';
                const targetString = 'Arroser les tomates';
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
                                { id: '3', title: 'Arroser les tomates', completed: false }
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
            } else if (step === 14) {
                // Plan simulation drag animation
                setPlannerTomatoVisible(false);
                dragX.setValue(0);
                dragY.setValue(0);
                dragOpacity.setValue(1);

                Animated.sequence([
                    Animated.delay(500),
                    Animated.parallel([
                        Animated.timing(dragX, {
                            toValue: 80,
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
    }, [step, visible]);

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

    const cutout = getCutoutConfig();

    return (
        <View style={styles.overlay} pointerEvents="auto">
            {/* 4-panels cutout for highlighting */}
            {cutout && (
                <>
                    <View style={[styles.panel, { top: 0, left: 0, right: 0, height: cutout.y }]} />
                    <View style={[styles.panel, { top: cutout.y + cutout.height, left: 0, right: 0, bottom: 0 }]} />
                    <View style={[styles.panel, { top: cutout.y, left: 0, width: cutout.x, height: cutout.height }]} />
                    <View style={[styles.panel, { top: cutout.y, left: cutout.x + cutout.width, right: 0, height: cutout.height }]} />
                    <View style={[styles.highlightBorder, { top: cutout.y, left: cutout.x, width: cutout.width, height: cutout.height }]} />
                </>
            )}

            {/* Simulated UI Card for Task Creation (Step 7) */}
            {step === 7 && (
                <View style={styles.simulationContainer}>
                    <View style={styles.simCard}>
                        <View style={styles.simCardHeader}>
                            <Ionicons name="checkbox-outline" size={20} color="#5B8E55" />
                            <Text style={styles.simCardTitle}>Gestion des Tâches</Text>
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
                                    {typedText || "Ajouter une tâche..."}
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

            {/* Simulated UI Card for Garden Plan grid (Step 14) */}
            {step === 14 && (
                <View style={styles.simulationContainer}>
                    <View style={styles.simCard}>
                        <View style={styles.simCardHeader}>
                            <Ionicons name="grid-outline" size={20} color="#5B8E55" />
                            <Text style={styles.simCardTitle}>Plan du Potager</Text>
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
                            <Text style={styles.simSelectorTitle}>Semences :</Text>
                            <View style={styles.simSeedsRow}>
                                <View style={[styles.simSeedBadge, { borderColor: '#EF4444' }]}>
                                    <Text style={styles.simSeedText}>🍅 Tomates</Text>
                                </View>
                                <View style={styles.simSeedBadge}>
                                    <Text style={styles.simSeedText}>🥬 Salades</Text>
                                </View>
                                <View style={styles.simSeedBadge}>
                                    <Text style={styles.simSeedText}>🥕 Carottes</Text>
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
                        <Text style={styles.title}>Visite Guidée de l'App 🌿</Text>
                        <Text style={styles.description}>
                            Découvrez toutes les rubriques et fonctionnalités détaillées de votre potager connecté étape par étape.
                        </Text>
                        <View style={styles.buttonRow}>
                            <Pressable style={[styles.btn, styles.btnSecondary]} onPress={skipTour}>
                                <Text style={styles.btnSecondaryText}>Plus tard</Text>
                            </Pressable>
                            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={nextStep}>
                                <Text style={styles.btnPrimaryText}>C'est parti ! 🚀</Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    // Onboarding step contents
                    <>
                        <View style={styles.header}>
                            <Text style={styles.stepIndicator}>Étape {step + 1} sur {stepTitles.length}</Text>
                            <Pressable onPress={skipTour} style={styles.skipBtn}>
                                <Text style={styles.skipText}>Passer</Text>
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
                                <Text style={styles.navBtnText}>Retour</Text>
                            </Pressable>

                            <Pressable style={[styles.btn, styles.btnPrimary, { minWidth: 100, flex: 0 }]} onPress={nextStep}>
                                <Text style={styles.btnPrimaryText}>
                                    {step === stepTitles.length - 1 ? 'Terminer 🎉' : 'Suivant'}
                                </Text>
                                {step < stepTitles.length - 1 && (
                                    <Ionicons name="arrow-forward" size={16} color="white" style={{ marginLeft: 4 }} />
                                )}
                            </Pressable>
                        </View>

                        {/* Pointing arrows */}
                        {cutout && (
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
