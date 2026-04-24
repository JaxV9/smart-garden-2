import { getTimeAgo } from '@/utils/dateFormatter';
import { useUserContext } from '@/contexts/user.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, Image, Modal, StyleSheet, Text,
    TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';

interface PostCardProps {
    post: {
        id: string;
        content: string;
        images: string[];
        author: {
            id: string;
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
    onDelete?: (postId: string) => void;
    onUpdate?: (postId: string, content: string) => Promise<void>;
}

export default function PostCard({ post, onLike, onComment, onDelete, onUpdate }: PostCardProps) {
    const router = useRouter();
    const { user } = useUserContext();
    const [menuVisible, setMenuVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [editContent, setEditContent] = useState(post.content);
    const [saving, setSaving] = useState(false);
    const isOwner = user?.id === post.author.id;

    const handleDelete = () => {
        setMenuVisible(false);
        Alert.alert(
            'Supprimer le post',
            'Es-tu sûr de vouloir supprimer ce post ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(post.id) },
            ]
        );
    };

    const handleEditOpen = () => {
        setEditContent(post.content);
        setMenuVisible(false);
        setEditVisible(true);
    };

    const handleEditSave = async () => {
        if (!editContent.trim()) return;
        setSaving(true);
        await onUpdate?.(post.id, editContent.trim());
        setSaving(false);
        setEditVisible(false);
    };

    return (
        <View style={styles.postCard}>
            <View style={styles.postHeader}>
                <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={20} color="#666" />
                </View>
                <View style={styles.postHeaderInfo}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: post.author.id } })}>
                        <Text style={[styles.postAuthor, { color: '#5B8E55', textDecorationLine: 'underline' }]}>{post.author.name || 'Utilisateur'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postTime}>{getTimeAgo(post.createdAt)}</Text>
                </View>

                {isOwner && (
                    <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            {post.images.length > 0 && (
                <View style={styles.imagesContainer}>
                    <Image source={{ uri: post.images[0] }} style={styles.postImage} resizeMode="cover" />
                </View>
            )}

            <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id)}>
                    <Ionicons name={post.isLikedByUser ? 'heart' : 'heart-outline'} size={22} color={post.isLikedByUser ? '#ef4444' : '#666'} />
                    <Text style={styles.actionText}>{post._count.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => onComment(post.id)}>
                    <Ionicons name="chatbubble-outline" size={20} color="#666" />
                    <Text style={styles.actionText}>{post._count.comments}</Text>
                </TouchableOpacity>
            </View>

            {/* Menu ⋮ */}
            <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.menuCard}>
                                <TouchableOpacity style={styles.menuItem} onPress={handleEditOpen}>
                                    <Ionicons name="pencil-outline" size={18} color="#374151" />
                                    <Text style={styles.menuItemText}>Modifier le post</Text>
                                </TouchableOpacity>
                                <View style={styles.menuDivider} />
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    <Text style={styles.menuItemTextDanger}>Supprimer le post</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal d'édition */}
            <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setEditVisible(false)}>
                    <View style={styles.editOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.editCard}>
                                <View style={styles.editHeader}>
                                    <Text style={styles.editTitle}>Modifier le post</Text>
                                    <TouchableOpacity onPress={() => setEditVisible(false)}>
                                        <Ionicons name="close" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                                <TextInput
                                    style={styles.editInput}
                                    value={editContent}
                                    onChangeText={setEditContent}
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    placeholder="Contenu du post..."
                                    placeholderTextColor="#9ca3af"
                                />
                                <TouchableOpacity
                                    style={[styles.editSaveBtn, saving && { opacity: 0.6 }]}
                                    onPress={handleEditSave}
                                    disabled={saving}
                                >
                                    {saving ? <ActivityIndicator color="white" /> : <Text style={styles.editSaveBtnText}>Enregistrer</Text>}
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
    postHeaderInfo: { flex: 1 },
    postAuthor: { fontSize: 15, fontWeight: '600', color: '#333' },
    postTime: { fontSize: 12, color: '#999', marginTop: 2 },
    menuButton: { padding: 4 },
    postContent: { fontSize: 15, lineHeight: 22, color: '#333', marginBottom: 12 },
    imagesContainer: { marginBottom: 12 },
    postImage: { width: '100%', height: 250, borderRadius: 12 },
    postActions: { flexDirection: 'row', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    actionButton: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    actionText: { fontSize: 14, color: '#666' },
    // Menu
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    menuCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 8,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
    menuItemText: { fontSize: 15, color: '#374151', fontWeight: '500' },
    menuItemTextDanger: { fontSize: 15, color: '#ef4444', fontWeight: '500' },
    menuDivider: { height: 1, backgroundColor: '#f3f4f6', marginHorizontal: 8 },
    // Edit modal
    editOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    editCard: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40 },
    editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    editTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    editInput: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        minHeight: 130,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
    },
    editSaveBtn: { backgroundColor: '#5B8E55', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    editSaveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
