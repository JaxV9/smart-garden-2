import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PostCardProps {
    post: {
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
    };
    onLike: (postId: string) => void;
    onComment: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <View style={styles.postHeaderInfo}>
                    <Text style={styles.postAuthor}>{post.author.name || 'Utilisateur'}</Text>
                    <Text style={styles.postTime}>{getTimeAgo(post.createdAt)}</Text>
                </View>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.images.length > 0 && (
                <View style={styles.imagesContainer}>
                    <Image
                        source={{ uri: post.images[0] }}
                        style={styles.postImage}
                        resizeMode="cover"
                    />
                </View>
            )}

            <View style={styles.postActions}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onLike(post.id)}
                >
                    <Ionicons
                        name={post.isLikedByUser ? "heart" : "heart-outline"}
                        size={22}
                        color={post.isLikedByUser ? "#ef4444" : "#666"}
                    />
                    <Text style={styles.actionText}>{post._count.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onComment(post.id)}
                >
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.actionText}>{post._count.comments}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    postCard: {
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
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
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
    postHeaderInfo: {
        flex: 1,
    },
    postAuthor: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    postTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
    postContent: {
        fontSize: 15,
        lineHeight: 22,
        color: '#333',
        marginBottom: 12,
    },
    imagesContainer: {
        marginBottom: 12,
    },
    postImage: {
        width: '100%',
        height: 250,
        borderRadius: 12,
    },
    postActions: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    actionText: {
        fontSize: 14,
        color: '#666',
    },
});
