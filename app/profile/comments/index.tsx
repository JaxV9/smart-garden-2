import { UserComment, useForum } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@/contexts/language.context';
import { getTimeAgo } from '@/utils/dateFormatter';

export default function MyComments() {
    const router = useRouter();
    const { t, language } = useTranslation();
    const { getUserComments } = useForum();
    const [loading, setLoading] = useState(false);
    const [userComments, setUserComments] = useState<UserComment[]>([]);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                const comments = await getUserComments();
                setUserComments(comments);
                setLoading(false);
            };
            loadData();
        }, [])
    );

    const renderComment = ({ item }: { item: UserComment }) => (
        <TouchableOpacity 
            style={styles.commentCard}
            onPress={() => router.push(`/forum/topic/${item.topicId}`)}
        >
            <View style={styles.topicTagsContainer}>
                {item.topic.tags.map((tagRelation, index) => (
                    <View key={index} style={styles.topicTag}>
                        <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.topicTitle}>{item.topic.title}</Text>
            <Text style={styles.commentContent}>{item.content}</Text>

            <View style={styles.commentMeta}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.commentTime}>{getTimeAgo(item.createdAt, language)}</Text>
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
                <Text style={styles.headerTitle}>{t('profile_my_comments')}</Text>
                <View style={styles.headerRight} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5B8E55" />
                </View>
            ) : userComments.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="chatbubbles-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyTitle}>{t('profile_no_comments')}</Text>
                    <Text style={styles.emptyText}>
                        {t('profile_no_comments_desc')}
                    </Text>
                    <TouchableOpacity 
                        style={styles.browseButton}
                        onPress={() => router.push('/(tabs)/social')}
                    >
                        <Text style={styles.browseButtonText}>{t('profile_browse_forum')}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={userComments}
                    renderItem={renderComment}
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
    browseButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    browseButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    list: {
        padding: 20,
    },
    commentCard: {
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
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 6,
    },
    commentContent: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 10,
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginTop: 4,
    },
    commentTime: {
        fontSize: 13,
        color: '#999',
    },
});
