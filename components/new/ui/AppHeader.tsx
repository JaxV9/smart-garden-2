import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNotificationContext } from '@/contexts/notification.context';
import { useUserContext } from '@/contexts/user.context';
import { useTranslation } from '@/contexts/language.context';

interface AppHeaderProps {
    title: string;
    showNotifications?: boolean;
    showBack?: boolean;
    onBackPress?: () => void;
    fallbackRoute?: Href;
}

export default function AppHeader({
    title,
    showNotifications = true,
    showBack = false,
    onBackPress,
    fallbackRoute = '/home',
}: AppHeaderProps) {
    const router = useRouter();
    const { t } = useTranslation();
    
    let unreadCount = 0;
    let isPremium = false;
    try {
        const context = useNotificationContext();
        unreadCount = context.unreadCount;
    } catch (e) {
    }
    try {
        const userContext = useUserContext();
        isPremium = userContext.isPremium;
    } catch (e) {
    }

    const handleBack = () => {
        if (onBackPress) return onBackPress();

        if (router.canGoBack?.()) {
            router.back();
        } else {
            router.replace(fallbackRoute);
        }
    };

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {showBack ? (
                    <Pressable onPress={handleBack} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
                    </Pressable>
                ) : (
                    <Ionicons name="leaf-outline" size={20} color="#FFFFFF" />
                )}

                <Text style={styles.headerTitle}>{title}</Text>
            </View>

            {showNotifications && (
                <View style={styles.headerRight}>
                    <Pressable onPress={() => router.push('/premium' as any)} style={styles.vipHeaderBtn}>
                        {isPremium ? (
                            <View style={styles.vipActiveBadge}>
                                <Ionicons name="sparkles" size={10} color="#059669" />
                                <Text style={styles.vipHeaderActiveText}>{t('vip_header_active')}</Text>
                            </View>
                        ) : (
                            <View style={styles.vipHeaderBadge}>
                                <Ionicons name="ribbon" size={10} color="#B45309" />
                                <Text style={styles.vipHeaderText}>{t('vip_header_club')}</Text>
                            </View>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.push('/notifications' as any)} style={styles.notificationBtn}>
                        <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                        {unreadCount > 0 && (
                            <View style={styles.badgeContainer}>
                                <Text style={styles.badgeText}>{unreadCount}</Text>
                            </View>
                        )}
                    </Pressable>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        height: 92,
        paddingTop: 44,
        paddingHorizontal: 18,
        backgroundColor: '#5A7F54',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    backBtn: {
        paddingRight: 4,
    },
    notificationBtn: {
        position: 'relative',
        padding: 4,
    },
    vipHeaderBtn: {
        padding: 2,
    },
    vipHeaderBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#F59E0B',
        gap: 4,
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    vipHeaderText: {
        color: '#B45309',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    vipActiveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#10B981',
        gap: 4,
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    vipHeaderActiveText: {
        color: '#047857',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    badgeContainer: {
        position: 'absolute',
        top: -1,
        right: -1,
        backgroundColor: '#EF4444',
        borderRadius: 9,
        minWidth: 16,
        height: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: '#5A7F54',
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 8,
        fontWeight: '900',
    },
});