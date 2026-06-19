import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View, Modal, TouchableWithoutFeedback, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '@/contexts/user.context';
import { useState } from 'react';

interface TutorialCardProps {
    tutorial: {
        id: string;
        title: string;
        description?: string;
        content?: string;
        type: 'VIDEO' | 'ARTICLE';
        category: string;
        thumbnail?: string;
        videoDuration?: number;
        author: {
            id?: string;
            name?: string;
        };
        createdAt: string;
        viewCount: number;
        _count: {
            likes: number;
        };
        isLikedByUser?: boolean;
    };
    onLike: (tutorialId: string) => void;
    onPress: (tutorialId: string) => void;
    onDelete?: (tutorialId: string) => void;
    onUpdate?: (tutorialId: string, tutorialData: any) => Promise<void>;
}

export default function TutorialCard({ tutorial, onLike, onPress, onDelete, onUpdate }: TutorialCardProps) {
    const router = useRouter();
    const { user } = useUserContext();
    
    const [menuVisible, setMenuVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [editTitle, setEditTitle] = useState(tutorial.title);
    const [editContent, setEditContent] = useState(tutorial.content || tutorial.description || '');
    const [saving, setSaving] = useState(false);
    
    const isOwner = user?.id && tutorial.author.id && user.id === tutorial.author.id;

    const formatDuration = (seconds?: number) => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ASTUCES':
                return '#FEF3C7';
            case 'DIY':
                return '#FFEDD5';
            case 'TECHNIQUES':
                return '#EEF2FF';
            default:
                return '#F3F4F6';
        }
    };

    const handleDelete = () => {
        setMenuVisible(false);
        Alert.alert(
            'Supprimer le tutoriel',
            'Es-tu sûr de vouloir supprimer ce tutoriel ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: () => onDelete?.(tutorial.id) },
            ]
        );
    };

    const handleEditOpen = () => {
        setEditTitle(tutorial.title);
        setEditContent(tutorial.content || tutorial.description || '');
        setMenuVisible(false);
        setEditVisible(true);
    };

    const handleEditSave = async () => {
        if (!editTitle.trim()) return;
        setSaving(true);
        const updateData: any = { title: editTitle.trim() };
        if (tutorial.type === 'ARTICLE') {
            updateData.content = editContent.trim();
        } else {
            updateData.description = editContent.trim();
        }
        await onUpdate?.(tutorial.id, updateData);
        setSaving(false);
        setEditVisible(false);
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(tutorial.id)}
        >
            {/* Thumbnail avec badge type */}
            <View style={styles.thumbnailContainer}>
                {tutorial.thumbnail ? (
                    <Image
                        source={{ uri: tutorial.thumbnail }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.thumbnailPlaceholder}>
                        <Ionicons
                            name={tutorial.type === 'VIDEO' ? 'videocam' : 'document-text'}
                            size={40}
                            color="#999"
                        />
                    </View>
                )}

                {/* Badge type */}
                <View style={[
                    styles.typeBadge,
                    tutorial.type === 'VIDEO' ? styles.videoBadge : styles.articleBadge
                ]}>
                    <Ionicons
                        name={tutorial.type === 'VIDEO' ? 'videocam' : 'document-text'}
                        size={12}
                        color="white"
                    />
                    <Text style={styles.typeBadgeText}>
                        {tutorial.type === 'VIDEO' ? 'Vidéo' : 'Article'}
                    </Text>
                </View>

                {/* Durée pour les vidéos */}
                {tutorial.type === 'VIDEO' && tutorial.videoDuration && (
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>
                            {formatDuration(tutorial.videoDuration)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={styles.title} numberOfLines={2}>
                        {tutorial.title}
                    </Text>
                    {isOwner && (
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); setMenuVisible(true); }} style={styles.menuButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.meta}>
                    <View style={styles.authorContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {tutorial.author.name?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <TouchableOpacity onPress={(e) => { e.stopPropagation(); if(tutorial.author.id) router.push({ pathname: '/user/[id]', params: { id: tutorial.author.id } }); }}>
                            <Text style={styles.authorName}>
                                {tutorial.author.name || 'Utilisateur'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Catégorie */}
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tutorial.category) }]}>
                    <Text style={styles.categoryText}>{tutorial.category}</Text>
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{tutorial.viewCount} vues</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.statItem}
                        onPress={(e) => {
                            e.stopPropagation();
                            onLike(tutorial.id);
                        }}
                    >
                        <Ionicons
                            name={tutorial.isLikedByUser ? "heart" : "heart-outline"}
                            size={16}
                            color={tutorial.isLikedByUser ? "#ef4444" : "#666"}
                        />
                        <Text style={styles.statText}>{tutorial._count.likes}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Menu ⋮ */}
            <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.menuCard}>
                                <TouchableOpacity style={styles.menuItem} onPress={handleEditOpen}>
                                    <Ionicons name="pencil-outline" size={18} color="#374151" />
                                    <Text style={styles.menuItemText}>Modifier le tutoriel</Text>
                                </TouchableOpacity>
                                <View style={styles.menuDivider} />
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    <Text style={styles.menuItemTextDanger}>Supprimer le tutoriel</Text>
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
                                    <Text style={styles.editTitle}>Modifier le tutoriel</Text>
                                    <TouchableOpacity onPress={() => setEditVisible(false)}>
                                        <Ionicons name="close" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                                
                                <Text style={styles.inputLabel}>Titre</Text>
                                <TextInput
                                    style={styles.editInput}
                                    value={editTitle}
                                    onChangeText={setEditTitle}
                                    placeholder="Titre du tutoriel..."
                                    placeholderTextColor="#9ca3af"
                                />

                                <Text style={styles.inputLabel}>{tutorial.type === 'ARTICLE' ? 'Contenu' : 'Description'}</Text>
                                <TextInput
                                    style={[styles.editInput, styles.editTextArea]}
                                    value={editContent}
                                    onChangeText={setEditContent}
                                    multiline
                                    numberOfLines={6}
                                    textAlignVertical="top"
                                    placeholder={tutorial.type === 'ARTICLE' ? "Contenu de l'article..." : "Description de la vidéo..."}
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
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.02,
        shadowRadius: 8,
        elevation: 2,
        overflow: 'hidden',
    },
    thumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    videoBadge: {
        backgroundColor: '#ef4444',
    },
    articleBadge: {
        backgroundColor: '#3b82f6',
    },
    typeBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 20,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    title: {
        flex: 1,
        fontSize: 16,
        fontWeight: '800',
        color: '#1F2937',
        lineHeight: 22,
    },
    menuButton: {
        paddingLeft: 10,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#EBF6EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#5A7F54',
        fontSize: 11,
        fontWeight: '800',
    },
    authorName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#5A7F54',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    stats: {
        flexDirection: 'row',
        gap: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
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
    editCard: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 40, maxHeight: '90%' },
    editHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    editTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6, marginLeft: 4 },
    editInput: {
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        padding: 14,
        fontSize: 15,
        color: '#111827',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        marginBottom: 16,
    },
    editTextArea: { minHeight: 110, paddingTop: 12 },
    editSaveBtn: {
        backgroundColor: '#5A7F54',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    editSaveBtnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
