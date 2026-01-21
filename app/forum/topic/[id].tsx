import CommentInput from '@/components/new/forum/topics/CommentInput';
import CommentsList from '@/components/new/forum/topics/CommentsList';
import TopicContent from '@/components/new/forum/topics/TopicContent';
import TopicDetailHeader from '@/components/new/forum/topics/TopicDetailHeader';
import { TopicDetail, useForum } from '@/hooks/useForum';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function TopicDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { loadTopicById, addComment } = useForum();
    
    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadTopicData();
        }, [id])
    );


    const loadTopicData = async () => {
        if (!id) return;
        setLoading(true);
        const data = await loadTopicById(id);
        setTopic(data);
        setLoading(false);
    };


    const handleAddComment = async (text: string) => {
        if (!id || !topic) return;
        
        const newComment = await addComment(id, text);
        
        if (newComment) {
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
    };


    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B8E55" />
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
        >
            <TopicDetailHeader onBack={() => router.back()} />


            <ScrollView style={styles.content}>
                <TopicContent
                    title={topic.title}
                    content={topic.content}
                    tags={topic.tags}
                    author={topic.author}
                    createdAt={topic.createdAt}
                    viewCount={topic.viewCount}
                    commentCount={topic._count.comments}
                />


                <CommentsList comments={topic.comments} />
            </ScrollView>


            <CommentInput onSubmit={handleAddComment} />
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
        backgroundColor: '#5B8E55',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
});
