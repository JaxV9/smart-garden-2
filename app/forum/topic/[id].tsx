import { Comment, TopicDetail, useForum } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TopicDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { loadTopicById, addComment } = useForum();
    
    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        loadTopicData();
    }, [id]);

    const loadTopicData = async () => {
        if (!id) return;
        setLoading(true);
        const data = await loadTopicById(id);
        setTopic(data);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !id || !topic) return;
        
        setSubmittingComment(true);
        const newComment = await addComment(id, commentText);
        
        if (newComment) {
            setCommentText('');
            setTopic({
                ...topic,
                comments: [...topic.comments, newComment],
                _count: {
                    comments: topic._count.comments + 1
                }
            });
        } else {
            alert('Erreur lors de l\'ajout du commentaire');
        }
        setSubmittingComment(false);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const createdAt = new Date(date);
        const diffInMs = now.getTime() - createdAt.getTime();
        
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);
        
        if (diffInMinutes < 1) return "À l'instant";
        if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInDays < 30) return `Il y a ${diffInDays}j`;
        if (diffInMonths < 12) return `Il y a ${diffInMonths} mois`;
        return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
    };

    const renderComment = ({ item }: { item: Comment }) => (
        <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <View style={styles.commentHeaderInfo}>
                    <Text style={styles.commentAuthor}>{item.author.name || 'Utilisateur'}</Text>
                    <Text style={styles.commentTime}>{getTimeAgo(item.createdAt)}</Text>
                </View>
            </View>
            <Text style={styles.commentContent}>{item.content}</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
            </View>
        );
    }

    if (!topic) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Topic non trouvé</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backIcon}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Discussion</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                {/* Topic principal */}
                <View style={styles.topicContainer}>
                    <View style={styles.topicTagsContainer}>
                        {topic.tags.map((tagRelation, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.topicTag,
                                    tagRelation.tag.name === 'Maladies' && styles.tagMaladies,
                                    tagRelation.tag.name === 'Résolu' && styles.tagResolu,
                                    tagRelation.tag.name === 'Récolte' && styles.tagRecolte,
                                    tagRelation.tag.name === 'Plantation' && styles.tagPlantation,
                                    tagRelation.tag.name === 'Arrosage' && styles.tagArrosage,
                                ]}
                            >
                                <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.topicTitle}>{topic.title}</Text>

                    <View style={styles.topicMeta}>
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={20} color="#666" />
                        </View>
                        <View>
                            <Text style={styles.topicAuthor}>{topic.author.name || 'Utilisateur'}</Text>
                            <Text style={styles.topicTime}>{getTimeAgo(topic.createdAt)}</Text>
                        </View>
                    </View>

                    <Text style={styles.topicContent}>{topic.content}</Text>

                    <View style={styles.topicStats}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={18} color="#666" />
                            <Text style={styles.statText}>{topic.viewCount} vues</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Ionicons name="chatbubble-outline" size={18} color="#666" />
                            <Text style={styles.statText}>{topic._count.comments} réponses</Text>
                        </View>
                    </View>
                </View>

                {/* Section des commentaires */}
                <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>
                        Réponses ({topic.comments.length})
                    </Text>

                    {topic.comments.length === 0 ? (
                        <View style={styles.noComments}>
                            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
                            <Text style={styles.noCommentsText}>Aucune réponse pour le moment</Text>
                            <Text style={styles.noCommentsSubtext}>Soyez le premier à répondre !</Text>
                        </View>
                    ) : (
                        <FlatList
                            data={topic.comments}
                            renderItem={renderComment}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                        />
                    )}
                </View>
            </ScrollView>

            {/* Input de commentaire fixe en bas */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="Écrire une réponse..."
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    maxLength={500}
                    placeholderTextColor="#999"
                />
                <TouchableOpacity 
                    style={[
                        styles.sendButton,
                        (!commentText.trim() || submittingComment) && styles.sendButtonDisabled
                    ]}
                    onPress={handleAddComment}
                    disabled={!commentText.trim() || submittingComment}
                >
                    {submittingComment ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Ionicons name="send" size={20} color="white" />
                    )}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#10b981',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    header: {
        backgroundColor: '#10b981',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backIcon: {
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
    content: {
        flex: 1,
    },
    topicContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    topicTagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        flexWrap: 'wrap',
    },
    topicTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
    },
    tagMaladies: {
        backgroundColor: '#bbf7d0',
    },
    tagResolu: {
        backgroundColor: '#bfdbfe',
    },
    tagRecolte: {
        backgroundColor: '#fde68a',
    },
    tagPlantation: {
        backgroundColor: '#fed7aa',
    },
    tagArrosage: {
        backgroundColor: '#ddd6fe',
    },
    topicTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    topicTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 16,
        lineHeight: 32,
    },
    topicMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicAuthor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    topicTime: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    topicContent: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        marginBottom: 16,
    },
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
    commentsSection: {
        backgroundColor: 'white',
        marginTop: 8,
        padding: 20,
        minHeight: 200,
    },
    commentsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 16,
    },
    noComments: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noCommentsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        fontWeight: '500',
    },
    noCommentsSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    commentCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    commentHeaderInfo: {
        flex: 1,
    },
    commentAuthor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    commentTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    commentContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
    },
    commentInputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
        gap: 12,
        alignItems: 'flex-end',
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        maxHeight: 100,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#10b981',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
