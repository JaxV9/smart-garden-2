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
    const { loadPosts, createPost, toggleLike, addComment, loadComments, deletePost, updatePost } = useSocial();
    const [loading, setLoading] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);


    // Recharge les données à chaque fois que l'écran est en focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );


    const loadData = async () => {
        setLoading(true);
        await loadPosts();
        setLoading(false);
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

    const handleDelete = async (postId: string) => {
        await deletePost(postId);
    };

    const handleUpdate = async (postId: string, content: string) => {
        await updatePost(postId, content);
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
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
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
        backgroundColor: '#5A7F54',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    createButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
});
