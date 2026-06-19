import { Topic, useForum } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@/contexts/language.context';
import { getTimeAgo } from '@/utils/dateFormatter';

export default function MyTopics() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const { getUserTopics } = useForum();
    const [loading, setLoading] = useState(false);
    const [userTopics, setUserTopics] = useState<Topic[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                const topics = await getUserTopics();
                setUserTopics(topics);
                setLoading(false);
            };
            loadData();
        }, [])
    );

    const renderTopic = ({ item }: { item: Topic }) => (
        <TouchableOpacity 
            style={styles.topicCard}
            onPress={() => router.push(`/forum/topic/${item.id}`)}
        >
            <View style={styles.topicTagsContainer}>
                {item.tags.map((tagRelation, index) => (
                    <View key={index} style={styles.topicTag}>
                        <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.topicTitle}>{item.title}</Text>

            <View style={styles.topicMeta}>
                <Text style={styles.topicTime}>{getTimeAgo(item.createdAt, language)}</Text>
            </View>

            <View style={styles.topicStats}>
                <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item._count.comments} {t('forum_topic_replies')}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item.viewCount} {t('forum_topic_views')}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('profile_my_topics')}</Text>
                <View style={styles.headerRight} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5B8E55" />
                </View>
            ) : userTopics.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="document-text-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyTitle}>{t('profile_no_topics')}</Text>
                    <Text style={styles.emptyText}>
                        {t('profile_no_topics_desc')}
                    </Text>
                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={() => router.push('/(tabs)/social')}
                    >
                        <Text style={styles.createButtonText}>{t('profile_create_topic')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={userTopics}
                    renderItem={renderTopic}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#5B8E55',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    createButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        padding: 20,
    },
    topicCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    topicTagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    topicTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
    },
    topicTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
        lineHeight: 24,
    },
    topicMeta: {
        marginBottom: 12,
    },
    topicTime: {
        fontSize: 14,
        color: '#999',
    },
    topicStats: {
        flexDirection: 'row',
        gap: 20,
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
