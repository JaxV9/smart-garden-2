import AppHeader from '@/components/new/ui/AppHeader';
import { NotificationItem, useNotificationContext } from '@/contexts/notification.context';
import { useTranslation } from '@/contexts/language.context';
import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

export default function NotificationsScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const {
        notifications,
        sensorsEnabled,
        setSensorsEnabled,
        tasksEnabled,
        setTasksEnabled,
        communityEnabled,
        setCommunityEnabled,
        markAsRead,
        markAllAsRead,
        clearAll
    } = useNotificationContext();

    const getIconInfo = (type: NotificationItem['type']) => {
        switch (type) {
            case 'SENSOR':
                return { name: 'water', color: '#EF4444', bgColor: '#FEE2E2' };
            case 'TASK':
                return { name: 'checkmark-circle', color: '#5A7F54', bgColor: '#EBF6EB' };
            case 'COMMUNITY':
                return { name: 'chatbubble-ellipses', color: '#3B82F6', bgColor: '#E0F2FE' };
            default:
                return { name: 'notifications', color: '#6B7280', bgColor: '#F3F4F6' };
        }
    };

    const renderItem = ({ item }: { item: NotificationItem }) => {
        const iconInfo = getIconInfo(item.type);

        return (
            <TouchableOpacity
                style={[
                    styles.notificationCard,
                    !item.isRead && styles.unreadCard
                ]}
                onPress={() => markAsRead(item.id)}
                activeOpacity={0.8}
            >
                {!item.isRead && <View style={styles.unreadIndicator} />}

                <View style={[styles.iconContainer, { backgroundColor: iconInfo.bgColor }]}>
                    <Ionicons name={iconInfo.name as any} size={20} color={iconInfo.color} />
                </View>

                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={[styles.cardTitle, !item.isRead && styles.boldText]}>
                            {item.title}
                        </Text>
                        <Text style={styles.timeText}>{getTimeAgo(item.createdAt)}</Text>
                    </View>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.screen}>
            <AppHeader
                title={t('notif_title')}
                showBack={true}
                showNotifications={false}
            />

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.configCard}>
                    <View style={styles.configHeader}>
                        <Ionicons name="settings-outline" size={20} color="#5A7F54" />
                        <Text style={styles.configTitle}>{t('notif_pref_title')}</Text>
                    </View>
                    <Text style={styles.configSub}>{t('notif_pref_sub')}</Text>

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <View style={[styles.miniIcon, { backgroundColor: '#FEE2E2' }]}>
                                <Ionicons name="water-outline" size={16} color="#EF4444" />
                            </View>
                            <View>
                                <Text style={styles.toggleLabel}>{t('notif_sensors_label')}</Text>
                                <Text style={styles.toggleDesc}>{t('notif_sensors_desc')}</Text>
                            </View>
                        </View>
                        <Switch
                            value={sensorsEnabled}
                            onValueChange={setSensorsEnabled}
                            trackColor={{ false: '#E5E7EB', true: '#C2DFBE' }}
                            thumbColor={sensorsEnabled ? '#5A7F54' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <View style={[styles.miniIcon, { backgroundColor: '#EBF6EB' }]}>
                                <Ionicons name="calendar-outline" size={16} color="#5A7F54" />
                            </View>
                            <View>
                                <Text style={styles.toggleLabel}>{t('notif_tasks_label')}</Text>
                                <Text style={styles.toggleDesc}>{t('notif_tasks_desc')}</Text>
                            </View>
                        </View>
                        <Switch
                            value={tasksEnabled}
                            onValueChange={setTasksEnabled}
                            trackColor={{ false: '#E5E7EB', true: '#C2DFBE' }}
                            thumbColor={tasksEnabled ? '#5A7F54' : '#F3F4F6'}
                        />
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.toggleRow}>
                        <View style={styles.toggleInfo}>
                            <View style={[styles.miniIcon, { backgroundColor: '#E0F2FE' }]}>
                                <Ionicons name="chatbubbles-outline" size={16} color="#3B82F6" />
                            </View>
                            <View>
                                <Text style={styles.toggleLabel}>{t('notif_comm_label')}</Text>
                                <Text style={styles.toggleDesc}>{t('notif_comm_desc')}</Text>
                            </View>
                        </View>
                        <Switch
                            value={communityEnabled}
                            onValueChange={setCommunityEnabled}
                            trackColor={{ false: '#E5E7EB', true: '#C2DFBE' }}
                            thumbColor={communityEnabled ? '#5A7F54' : '#F3F4F6'}
                        />
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('notif_alerts_section')}</Text>
                    {notifications.length > 0 && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={markAllAsRead} style={styles.actionBtn}>
                                <Text style={styles.actionBtnText}>{t('notif_action_read_all')}</Text>
                            </TouchableOpacity>
                            <Text style={styles.actionSep}>•</Text>
                            <TouchableOpacity onPress={clearAll} style={styles.actionBtn}>
                                <Text style={styles.actionBtnTextDanger}>{t('notif_action_clear_all')}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconCircle}>
                            <Ionicons name="notifications-off-outline" size={42} color="#5A7F54" />
                        </View>
                        <Text style={styles.emptyTitle}>{t('notif_empty_title')}</Text>
                        <Text style={styles.emptyDesc}>{t('notif_empty_desc')}</Text>
                    </View>
                ) : (
                    <FlatList
                        data={notifications}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                    />
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    container: {
        flex: 1,
        padding: 16,
    },
    configCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
    },
    configHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    configTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
    },
    configSub: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 20,
    },
    toggleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    toggleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    miniIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
    },
    toggleDesc: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
        paddingHorizontal: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtn: {
        paddingVertical: 4,
        paddingHorizontal: 8,
    },
    actionBtnText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5A7F54',
    },
    actionSep: {
        fontSize: 13,
        color: '#D1D5DB',
    },
    actionBtnTextDanger: {
        fontSize: 13,
        fontWeight: '700',
        color: '#EF4444',
    },
    listContainer: {
        gap: 12,
    },
    notificationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 1,
        position: 'relative',
        overflow: 'hidden',
    },
    unreadCard: {
        backgroundColor: '#F3FBF2',
        borderColor: '#C2DFBE',
    },
    unreadIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: '#5A7F54',
    },
    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        flex: 1,
    },
    boldText: {
        fontWeight: '800',
        color: '#1F2937',
    },
    timeText: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    cardDescription: {
        fontSize: 13,
        color: '#4B5563',
        lineHeight: 18,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 48,
        paddingHorizontal: 24,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EBF6EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
});
