import { StyleSheet, View } from 'react-native';
import AppHeader from '../ui/AppHeader';
import { useTranslation } from '@/contexts/language.context';

interface ForumHeaderProps {
    notificationCount?: number;
}

export default function ForumHeader({ notificationCount = 0 }: ForumHeaderProps) {
    const { t } = useTranslation();
    return (
        <View>
            <AppHeader
                title={t('forum_header_title')}
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