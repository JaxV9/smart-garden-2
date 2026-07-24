import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from '@/contexts/language.context';

interface TopicStatsProps {
    viewCount: number;
    commentCount: number;
}

export default function TopicStats({ viewCount, commentCount }: TopicStatsProps) {
    const { t } = useTranslation();
    return (
        <View style={styles.topicStats}>
            <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={18} color="#666" />
                <Text style={styles.statText}>{viewCount} {t('forum_topic_views')}</Text>
            </View>
            <View style={styles.statItem}>
                <Ionicons name="chatbubble-outline" size={18} color="#666" />
                <Text style={styles.statText}>{commentCount} {t('forum_topic_replies')}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topicStats: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
});
