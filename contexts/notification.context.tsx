import React, { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    type: 'SENSOR' | 'TASK' | 'COMMUNITY';
    createdAt: string;
    isRead: boolean;
}

interface NotificationContextType {
    notifications: NotificationItem[];
    unreadCount: number;
    sensorsEnabled: boolean;
    setSensorsEnabled: (enabled: boolean) => void;
    tasksEnabled: boolean;
    setTasksEnabled: (enabled: boolean) => void;
    communityEnabled: boolean;
    setCommunityEnabled: (enabled: boolean) => void;
    addNotification: (title: string, description: string, type: 'SENSOR' | 'TASK' | 'COMMUNITY') => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
    const [sensorsEnabled, setSensorsEnabled] = useState(true);
    const [tasksEnabled, setTasksEnabled] = useState(true);
    const [communityEnabled, setCommunityEnabled] = useState(true);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        async function requestPermissions() {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                await Notifications.requestPermissionsAsync();
            }
        }
        requestPermissions();
    }, []);

    const triggerLocalPushNotification = async (title: string, body: string) => {
        try {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title,
                    body,
                    sound: true,
                },
                trigger: null,
            });
        } catch (e) {
            console.log('Error triggering push notification:', e);
        }
    };

    const addNotification = (title: string, description: string, type: 'SENSOR' | 'TASK' | 'COMMUNITY') => {
        const isEnabled = 
            (type === 'SENSOR' && sensorsEnabled) ||
            (type === 'TASK' && tasksEnabled) ||
            (type === 'COMMUNITY' && communityEnabled);

        const newNotif: NotificationItem = {
            id: Math.random().toString(),
            title,
            description,
            type,
            createdAt: new Date().toISOString(),
            isRead: false,
        };

        setNotifications(prev => [newNotif, ...prev]);

        if (isEnabled) {
            triggerLocalPushNotification(title, description);
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };



    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            sensorsEnabled,
            setSensorsEnabled,
            tasksEnabled,
            setTasksEnabled,
            communityEnabled,
            setCommunityEnabled,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotificationContext must be used within a NotificationProvider');
    }
    return context;
}
