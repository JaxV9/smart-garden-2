import { StyleSheet, View } from 'react-native';
import AppHeader from '../ui/AppHeader';

interface ForumHeaderProps {
    notificationCount?: number;
}

export default function ForumHeader({ notificationCount = 0 }: ForumHeaderProps) {
    return (
        <View>
            <AppHeader
                title="Forum"
                showNotifications={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});