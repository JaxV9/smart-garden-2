import CreatePostModal from '@/components/new/social/CreatePostModal';
import PostCommentsModal from '@/components/new/social/PostCommentsModal';
import PostList from '@/components/new/social/PostList';
import { useSocialContext } from '@/contexts/social.context';
import { useSocial } from '@/hooks/useSocial';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';


export const SocialFeedTab = () => {
    const { posts } = useSocialContext();
    const { loadPosts, createPost, toggleLike, addComment, loadComments } = useSocial();
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);


    // Recharge les données à chaque fois que l'écran est en focus
    useFocusEffect(
        useCallback(() => {
            console.log('🔄 [TrueSocial] Rechargement des posts');
            loadData();
        }, [])
    );


    const loadData = async () => {
        setLoading(true);
        await loadPosts();
        setLoading(false);
        console.log('✅ [TrueSocial] Posts rechargés');
    };


    const handleCreatePost = async (content: string, images: string[]) => {
        const result = await createPost(content, images);
        if (result === 'Success') {
            setCreateModalVisible(false);
            // Recharger les posts après création
            await loadData();
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


    const handleCloseCommentsModal = async () => {
        setCommentsModalVisible(false);
        setSelectedPostId(null);
        // Recharger les posts pour mettre à jour le compteur de commentaires
        await loadData();
    };


    return (
        <>
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


            <CreatePostModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSubmit={handleCreatePost}
            />


            <PostCommentsModal
                visible={commentsModalVisible}
                postId={selectedPostId}
                onClose={handleCloseCommentsModal}
                onLoadComments={loadComments}
                onAddComment={addComment}
            />
        </>
    );
}


const styles = StyleSheet.create({
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
