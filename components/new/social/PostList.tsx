import { FlatList, StyleSheet, Text } from 'react-native';
import PostCard from './PostCard';

interface Post {
    id: string;
    content: string;
    images: string[];
    author: {
        name?: string;
    };
    createdAt: string;
    _count: {
        likes: number;
        comments: number;
    };
    isLikedByUser?: boolean;
}

interface PostListProps {
    posts: Post[];
    loading: boolean;
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
}

export default function PostList({ posts, loading, onLike, onComment }: PostListProps) {
    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    if (posts.length === 0) {
        return <Text style={styles.emptyText}>Aucun post pour le moment</Text>;
    }

    return (
        <FlatList
            data={posts}
            renderItem={({ item }) => (
                <PostCard
                    post={item}
                    onLike={onLike}
                    onComment={onComment}
                />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    list: {
        paddingBottom: 20,
    },
});
