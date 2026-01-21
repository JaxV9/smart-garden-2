import BottomTabBar from '@/components/new/BottomTabBar';
import ForumHeader from '@/components/new/forum/ForumHeader';
import ForumTabs from '@/components/new/forum/ForumTabs';
import CreatePostModal from '@/components/new/social/CreatePostModal';
import PostCommentsModal from '@/components/new/social/PostCommentsModal';
import PostList from '@/components/new/social/PostList';
import { useSocialContext } from '@/contexts/social.context';
import { useSocial } from '@/hooks/useSocial';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function SocialScreen() {
    const { posts } = useSocialContext();
    const { loadPosts, createPost, toggleLike, addComment, loadComments } = useSocial();
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        await loadPosts();
        setLoading(false);
    };

    const handleCreatePost = async (content: string, images: string[]) => {
        const result = await createPost(content, images);
        if (result === 'Success') {
            setCreateModalVisible(false);
        } else {
            alert('Erreur lors de la création du post');
        }
    };

    const handleLike = async (postId: string) => {
        await toggleLike(postId);
    };

    const handleCommentPress = (postId: string) => {
        setSelectedPostId(postId);
        setCommentsModalVisible(true);
    };

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                <ForumHeader notificationCount={27} />
                
                <ForumTabs />

                <ScrollView 
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                >
                    <TouchableOpacity 
                        style={styles.createButton}
                        onPress={() => setCreateModalVisible(true)}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.createButtonText}>Partager une réussite</Text>
                    </TouchableOpacity>

                    <PostList
                        posts={posts}
                        loading={loading}
                        onLike={handleLike}
                        onComment={handleCommentPress}
                    />
                </ScrollView>

                <BottomTabBar activeTab="/forum" />

                <CreatePostModal
                    visible={createModalVisible}
                    onClose={() => setCreateModalVisible(false)}
                    onSubmit={handleCreatePost}
                />

                <PostCommentsModal
                    visible={commentsModalVisible}
                    postId={selectedPostId}
                    onClose={() => {
                        setCommentsModalVisible(false);
                        setSelectedPostId(null);
                    }}
                    onLoadComments={loadComments}
                    onAddComment={addComment}
                />
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    createButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
