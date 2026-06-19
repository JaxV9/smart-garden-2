import { useGardenContext } from '@/contexts/garden.context';
import { usePlan } from '@/hooks/usePlan';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useUserContext } from '@/contexts/user.context';
import { useTranslation } from '@/contexts/language.context';
import { useTour } from '@/contexts/tour.context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AreaManager } from './areaManager';
import { GardenVegeList } from './gardenVegeList';
import { SaveBtn } from './saveBtn';
import { Space } from './space';
import { Touch } from './touch';
import { ZoomItem } from './zoom';

export const Plan = () => {
    const { gardenVegetables } = useGardenContext()
    const { isPremium } = useUserContext();
    const { visible } = useTour();
    const { t } = useTranslation();
    const router = useRouter();
    const isPremiumActive = isPremium || visible;

    const {
        scale,
        gardenSpaces,
        isUpdatingCel,
        spaceEditing,
        hasGarden,
        isSaving,
        shouldSave,
        toggleSpaceEditor,
        updateCelWithVege,
        editCel,
        setScale,
        addNewSpace,
        updateSpaceName,
        setGardenSpaces,
        closeIsUpdatingCel,
        saveGardenSpaces,
        celData,
        activePlan,
        setActivePlan,
        allPlans,
        activeSpaces,
        addNewPlan,
        deletePlan
    } = usePlan();

    const { gardenInfo } = useGardenContext();
    const defaultPlanName = gardenInfo.name || "Mon Potager";

    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [newPlanName, setNewPlanName] = useState("");

    React.useEffect(() => {
        if (!isPremiumActive && activePlan !== defaultPlanName && allPlans.indexOf(activePlan) > 0) {
            setActivePlan(defaultPlanName);
        }
    }, [isPremiumActive, activePlan, defaultPlanName, allPlans]);

    const handlePressAddPlan = () => {
        if (!isPremiumActive && allPlans.length >= 1) {
            router.push('/premium' as any);
        } else {
            setIsCreateModalVisible(true);
        }
    };

    const handleCreatePlan = () => {
        if (!newPlanName.trim()) return;
        addNewPlan(newPlanName.trim());
        setNewPlanName("");
        setIsCreateModalVisible(false);
    };

    const handleDeletePlan = (plan: string) => {
        Alert.alert(
            t('plan_delete_confirm_title'),
            `${t('plan_delete_confirm_desc')}`,
            [
                { text: t('btn_cancel'), style: "cancel" },
                {
                    text: t('btn_delete'),
                    style: "destructive",
                    onPress: () => deletePlan(plan),
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* PLAN SELECTOR BAR */}
            <View style={styles.selectorWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.planSelectorScroll}
                >
                    {allPlans.map((plan, index) => {
                        const isActive = plan === activePlan;
                        const isLocked = index > 0 && !isPremiumActive;

                        return (
                            <TouchableOpacity
                                key={plan}
                                style={[
                                    styles.planTab,
                                    isActive && styles.activePlanTab,
                                    isLocked && styles.lockedPlanTab
                                ]}
                                onPress={() => {
                                    if (isLocked) {
                                        router.push('/premium' as any);
                                    } else {
                                        setActivePlan(plan);
                                    }
                                }}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.planTabText,
                                    isActive && styles.activePlanTabText,
                                    isLocked && styles.lockedPlanTabText
                                ]}>
                                    {plan}
                                </Text>
                                {isLocked ? (
                                    <Ionicons
                                        name="lock-closed"
                                        size={11}
                                        color="#94A3B8"
                                        style={{ marginLeft: 4 }}
                                    />
                                ) : (
                                    plan !== defaultPlanName && (
                                        <Ionicons
                                            name="star"
                                            size={12}
                                            color={isActive ? "#FFFFFF" : "#D4AF37"}
                                            style={{ marginLeft: 4 }}
                                        />
                                    )
                                )}
                            </TouchableOpacity>
                        );
                    })}

                    <TouchableOpacity
                        style={styles.addPlanBtn}
                        onPress={handlePressAddPlan}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add-circle" size={18} color="#5A7F54" />
                        <Text style={styles.addPlanBtnText}>{t('plan_new_btn')}</Text>
                        {!isPremiumActive && (
                            <Ionicons name="lock-closed" size={10} color="#D4AF37" style={{ marginLeft: 2 }} />
                        )}
                    </TouchableOpacity>
                </ScrollView>

                {allPlans.length > 1 && (
                    <TouchableOpacity
                        style={styles.deletePlanBtn}
                        onPress={() => handleDeletePlan(activePlan)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                )}
            </View>

            <SaveBtn isSaving={isSaving} shouldSave={shouldSave} callback={saveGardenSpaces} />

            <Touch scale={scale} isAbsolute={true}>
                {activeSpaces.map((gardenSpace) => (
                    <Space
                        key={gardenSpace.spaceName}
                        gardenSpace={gardenSpace}
                        scale={scale}
                        editCel={editCel}
                        toggleSpaceEditor={toggleSpaceEditor}
                        updateSpaceName={updateSpaceName}
                        isUpdatingCel={isUpdatingCel}
                    />
                ))}
            </Touch>

            {!hasGarden || activeSpaces.length === 0 ? (
                <View style={styles.newSpaceNotif}>
                    <Text style={styles.newSpaceNotifLabel}>{t('plan_no_spaces')}</Text>
                    <Pressable style={styles.button} onPress={() => addNewSpace()}>
                        <Text style={styles.btnTxt}>{t('plan_add_zone')}</Text>
                    </Pressable>
                </View>
            ) : (
                <>
                    {spaceEditing !== null && (
                        <AreaManager
                            gardenSpaces={gardenSpaces}
                            setGardenSpaces={setGardenSpaces}
                            spaceEditing={spaceEditing}
                            toggleSpaceEditor={toggleSpaceEditor}
                        />
                    )}
                    {isUpdatingCel ? (
                        <GardenVegeList
                            gardenVegetables={gardenVegetables}
                            closeIsUpdatingCel={closeIsUpdatingCel}
                            updateCelWithVege={updateCelWithVege}
                            vegeId={celData?.vegeId}
                        />
                    ) : (
                        <ZoomItem scale={scale} setScale={setScale} />
                    )}
                </>
            )}

            {/* MODAL CREATION DE PLAN */}
            <Modal
                visible={isCreateModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Ionicons name="map-outline" size={24} color="#5A7F54" />
                            <Text style={styles.modalTitle}>{t('plan_new_title')}</Text>
                        </View>
                        <Text style={styles.modalLabel}>{t('plan_new_label')}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={t('plan_new_placeholder')}
                            value={newPlanName}
                            onChangeText={setNewPlanName}
                            placeholderTextColor="#94A3B8"
                            autoFocus={true}
                        />
                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => {
                                    setIsCreateModalVisible(false);
                                    setNewPlanName("");
                                }}
                            >
                                <Text style={styles.cancelBtnText}>{t('btn_cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.confirmBtn]}
                                onPress={handleCreatePlan}
                            >
                                <Text style={styles.confirmBtnText}>{t('btn_confirm')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 28,
        position: 'absolute',
        top: 110,
        left: 0,
        right: 0,
        bottom: 0
    },
    selectorWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderColor: '#E2E8F0',
        zIndex: 200,
        height: 52,
    },
    planSelectorScroll: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingRight: 12,
    },
    planTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activePlanTab: {
        backgroundColor: '#5A7F54',
        borderColor: '#5A7F54',
    },
    planTabText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    activePlanTabText: {
        color: '#FFFFFF',
        fontWeight: '700',
    },
    lockedPlanTab: {
        backgroundColor: '#F8FAFC',
        borderColor: '#E2E8F0',
        opacity: 0.7,
    },
    lockedPlanTabText: {
        color: '#94A3B8',
    },
    addPlanBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        gap: 4,
    },
    addPlanBtnText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#5A7F54',
    },
    deletePlanBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#FEF2F2',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 6,
    },
    newSpaceNotif: {
        position: 'absolute',
        width: '80%',
        gap: 16,
        top: '55%',
        left: '50%',
        transform: [{ translateX: '-50%' }, { translateY: '-50%' }],
        zIndex: 1000,
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
    },
    newSpaceNotifLabel: {
        textAlign: 'center',
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        lineHeight: 20,
    },
    button: {
        height: 46,
        borderRadius: 12,
        backgroundColor: "#5A7F54",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    btnTxt: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "700",
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 340,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1E293B',
    },
    modalLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
        marginBottom: 8,
    },
    modalInput: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        color: '#1E293B',
        backgroundColor: '#F8FAFC',
        marginBottom: 20,
    },
    modalBtnRow: {
        flexDirection: 'row',
        gap: 10,
    },
    modalBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelBtn: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    cancelBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#475569',
    },
    confirmBtn: {
        backgroundColor: '#5A7F54',
    },
    confirmBtnText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});