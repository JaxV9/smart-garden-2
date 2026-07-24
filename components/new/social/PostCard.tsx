import { getTimeAgo } from '@/utils/dateFormatter';
import { useUserContext } from '@/contexts/user.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, Image, Modal, StyleSheet, Text,
    TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import { useTranslation } from '@/contexts/language.context';

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
    const { t, language } = useTranslation();
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
            t('social_delete_title'),
            t('social_delete_confirm'),
            [
                { text: t('social_cancel'), style: 'cancel' },
                { text: t('social_delete'), style: 'destructive', onPress: () => onDelete?.(post.id) },
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
                    <Ionicons name="person" size={20} color="#5A7F54" />
                </View>
                <View style={styles.postHeaderInfo}>
                    <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: post.author.id } })}>
                        <Text style={styles.postAuthor}>{post.author.name || t('social_user_fallback')}</Text>
                    </TouchableOpacity>
                    <Text style={styles.postTime}>{getTimeAgo(post.createdAt, language)}</Text>
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
                                    <Text style={styles.menuItemText}>{t('social_edit')}</Text>
                                </TouchableOpacity>
                                <View style={styles.menuDivider} />
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    <Text style={styles.menuItemTextDanger}>{t('social_delete_title')}</Text>
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
                                    <Text style={styles.editTitle}>{t('social_edit')}</Text>
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
                                    placeholder={t('social_edit_placeholder')}
                                    placeholderTextColor="#9ca3af"
                                />
                                <TouchableOpacity
                                    style={[styles.editSaveBtn, saving && { opacity: 0.6 }]}
                                    onPress={handleEditSave}
                                    disabled={saving}
                                >
                                    {saving ? <ActivityIndicator color="white" /> : <Text style={styles.editSaveBtnText}>{t('social_save')}</Text>}
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
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
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
        backgroundColor: '#EBF6EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postHeaderInfo: { flex: 1 },
    postAuthor: { fontSize: 15, fontWeight: '700', color: '#5A7F54' },
    postTime: { fontSize: 12, color: '#999', marginTop: 2 },
    menuButton: { padding: 4 },
    postContent: { fontSize: 15, lineHeight: 22, color: '#1F2937', marginBottom: 12 },
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
    editSaveBtn: {
        backgroundColor: '#5A7F54',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    editSaveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
