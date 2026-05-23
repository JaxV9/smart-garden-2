import { Task } from '@/components/new/task/task';
import AppHeader from '@/components/new/ui/AppHeader';
import { useUserContext } from '@/contexts/user.context';
import { useTranslation } from '@/contexts/language.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';

export default function Index() {
    const { isPremium } = useUserContext();
    const { t } = useTranslation();
    const router = useRouter();

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.92)).current;

    useEffect(() => {
        if (!isPremium) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 650,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 7,
                    tension: 35,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isPremium]);

    return (
        <View style={styles.container}>
            <AppHeader
                title="Tâches"
                showBack={true}
                fallbackRoute="/home"
            />
            
            <View style={{ flex: 1 }}>
                <Task />

                {!isPremium && (
                    <Animated.View style={[StyleSheet.absoluteFillObject, { opacity: fadeAnim }]}>
                        <BlurView intensity={65} tint="light" style={StyleSheet.absoluteFill} />
                        <Animated.View style={[styles.lockedContainer, { transform: [{ scale: scaleAnim }] }]}>
                            <View style={styles.lockBadge}>
                                <Ionicons name="ribbon" size={48} color="#D4AF37" />
                            </View>
                            <Text style={styles.lockedTitle}>{t('tasks_locked_title')}</Text>
                            <Text style={styles.lockedSub}>{t('tasks_locked_sub')}</Text>
                            
                            <View style={styles.miniFeatures}>
                                <View style={styles.featureRow}>
                                    <Ionicons name="checkmark-circle" size={16} color="#5A7F54" />
                                    <Text style={styles.featureText}>{t('tasks_locked_feat_1')}</Text>
                                </View>
                                <View style={styles.featureRow}>
                                    <Ionicons name="checkmark-circle" size={16} color="#5A7F54" />
                                    <Text style={styles.featureText}>{t('tasks_locked_feat_2')}</Text>
                                </View>
                                <View style={styles.featureRow}>
                                    <Ionicons name="checkmark-circle" size={16} color="#5A7F54" />
                                    <Text style={styles.featureText}>{t('tasks_locked_feat_3')}</Text>
                                </View>
                            </View>

                            <TouchableOpacity 
                                style={styles.unlockBtn}
                                onPress={() => router.push('/premium' as any)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.unlockBtnText}>{t('tasks_locked_btn')}</Text>
                            </TouchableOpacity>
                            </Animated.View>
                    </Animated.View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    lockedContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    lockBadge: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#FFFDF0',
        borderColor: '#FEF3C7',
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    lockedTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 12,
        textAlign: 'center',
    },
    lockedSub: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    miniFeatures: {
        alignSelf: 'stretch',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 12,
        marginBottom: 28,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    featureText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#334155',
    },
    unlockBtn: {
        backgroundColor: '#D4AF37',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#D4AF37',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    unlockBtnText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '800',
    },
});