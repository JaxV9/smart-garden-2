import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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
                <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    backBtn: {
        paddingRight: 4,
    },
});