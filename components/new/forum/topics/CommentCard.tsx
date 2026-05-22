import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CommentCardProps {
    author: {
        id: string;
        name?: string;
    };
    content: string;
    createdAt: string;
}

export default function CommentCard({ author, content, createdAt }: CommentCardProps) {
    const router = useRouter();

    return (
        <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <View style={styles.commentHeaderInfo}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: author.id } })}>
                        <Text style={[styles.commentAuthor, { color: '#5B8E55', textDecorationLine: 'underline' }]}>{author.name || 'Utilisateur'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.commentTime}>{getTimeAgo(createdAt)}</Text>
                </View>
            </View>
            <Text style={styles.commentContent}>{content}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
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
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
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
});
