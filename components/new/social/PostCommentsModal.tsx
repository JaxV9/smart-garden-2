import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import PostCommentItem from './PostCommentItem';

interface Comment {
    id: string;
    content: string;
    author: {
        name?: string;
    };
    createdAt: string;
}

interface PostCommentsModalProps {
    visible: boolean;
    postId: string | null;
    onClose: () => void;
    onLoadComments: (postId: string) => Promise<Comment[]>;
    onAddComment: (postId: string, content: string) => Promise<Comment | null>;
}

export default function PostCommentsModal({
    visible,
    postId,
    onClose,
    onLoadComments,
    onAddComment,
}: PostCommentsModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible && postId) {
            loadComments();
        }
    }, [visible, postId]);

    const loadComments = async () => {
        if (!postId) return;
        setLoading(true);
        const data = await onLoadComments(postId);
        setComments(data);
        setLoading(false);
    };

    const handleAddComment = async () => {
        if (!commentText.trim() || !postId) return;

        setSubmitting(true);
        const newComment = await onAddComment(postId, commentText);
        if (newComment) {
            setComments([...comments, newComment]);
            setCommentText('');
        }
        setSubmitting(false);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Commentaires</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#5B8E55" />
                        </View>
                    ) : (
                        <FlatList
                            data={comments}
                            renderItem={({ item }) => <PostCommentItem comment={item} />}
                            keyExtractor={(item) => item.id}
                            style={styles.commentsList}
                            ListEmptyComponent={
                                <Text style={styles.emptyText}>Aucun commentaire</Text>
                            }
                        />
                    )}

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Ajouter un commentaire..."
                            value={commentText}
                            onChangeText={setCommentText}
                            placeholderTextColor="#111827"
                        />
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                (!commentText.trim() || submitting) && styles.sendButtonDisabled,
                            ]}
                            onPress={handleAddComment}
                            disabled={!commentText.trim() || submitting}
                        >
                            {submitting ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Ionicons name="send" size={20} color="white" />
                            )}
                        </TouchableOpacity>
                    </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
    },
    commentsList: {
        padding: 20,
        maxHeight: 400,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        paddingVertical: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 15,
        color: '#333',
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#5B8E55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
});
