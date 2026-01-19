import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface ForumHeaderProps {
    notificationCount?: number;
}

export default function ForumHeader({ notificationCount = 0 }: ForumHeaderProps) {
    return (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Forum</Text>
            <View style={styles.notificationBadge}>
                <Ionicons name="notifications-outline" size={28} color="white" />
                {notificationCount > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{notificationCount}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#10b981',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    notificationBadge: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
