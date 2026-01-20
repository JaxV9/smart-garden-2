import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

interface PostCommentItemProps {
    comment: {
        id: string;
        content: string;
        author: {
            name?: string;
        };
        createdAt: string;
    };
}

export default function PostCommentItem({ comment }: PostCommentItemProps) {
    return (
        <View style={styles.commentItem}>
            <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={16} color="#666" />
            </View>
            <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                    <Text style={styles.commentAuthor}>{comment.author.name || 'Utilisateur'}</Text>
                    <Text style={styles.commentTime}>{getTimeAgo(comment.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{comment.content}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    commentItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    commentTime: {
        fontSize: 12,
        color: '#999',
    },
    commentText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
});
