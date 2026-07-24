import { getTimeAgo } from '@/utils/dateFormatter';
import { useUserContext } from '@/contexts/user.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text,
    TextInput, TouchableOpacity, TouchableWithoutFeedback, View
} from 'react-native';
import { useTranslation } from '@/contexts/language.context';

interface Tag {
    tag: { id?: string; name: string };
}

interface Topic {
    id: string;
    title: string;
    tags: Tag[];
    author: { id: string; name?: string };
    createdAt: string;
    _count: { comments: number };
    viewCount: number;
}

interface AllTag {
    id: string;
    name: string;
}

interface TopicCardProps {
    topic: Topic;
    onPress: () => void;
    onDelete?: (topicId: string) => void;
    onUpdate?: (topicId: string, title: string, content: string, tagIds: string[]) => Promise<void>;
    allTags?: AllTag[];
}

export default function TopicCard({ topic, onPress, onDelete, onUpdate, allTags = [] }: TopicCardProps) {
    const router = useRouter();
    const { user } = useUserContext();
    const { t, language } = useTranslation();
    const [menuVisible, setMenuVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [editTitle, setEditTitle] = useState(topic.title);
    const [editContent, setEditContent] = useState('');
    const [editTagIds, setEditTagIds] = useState<string[]>(
        topic.tags.map(t => t.tag.id).filter(Boolean) as string[]
    );
    const [saving, setSaving] = useState(false);
    const isOwner = user?.id === topic.author.id;

    const getTagStyle = (tagName: string) => {
        const tagStyles: Record<string, any> = {
            'Maladies': styles.tagMaladies,
            'Résolu': styles.tagResolu,
            'Récolte': styles.tagRecolte,
            'Plantation': styles.tagPlantation,
            'Arrosage': styles.tagArrosage,
        };
        return tagStyles[tagName] || {};
    };

    const handleDelete = () => {
        setMenuVisible(false);
        Alert.alert(
            t('forum_delete_confirm_title'),
            t('forum_delete_confirm_desc'),
            [
                { text: t('forum_save_btn') ? 'Cancel' : 'Annuler', style: 'cancel' }, // Generic cancel fallback or localizable, simple custom strings
                { text: t('forum_menu_delete'), style: 'destructive', onPress: () => onDelete?.(topic.id) },
            ]
        );
    };

    const handleEditOpen = () => {
        setEditTitle(topic.title);
        setEditContent('');
        setEditTagIds(topic.tags.map(t => t.tag.id).filter(Boolean) as string[]);
        setMenuVisible(false);
        setEditVisible(true);
    };

    const toggleTag = (tagId: string) => {
        setEditTagIds(prev => prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]);
    };

    const handleEditSave = async () => {
        if (!editTitle.trim()) return;
        setSaving(true);
        await onUpdate?.(topic.id, editTitle.trim(), editContent.trim(), editTagIds);
        setSaving(false);
        setEditVisible(false);
    };

    return (
        <TouchableOpacity style={styles.topicCard} onPress={onPress}>
            <View style={styles.topicHeader}>
                <View style={styles.topicTagsContainer}>
                    {topic.tags.map((tagRelation, index) => (
                        <View key={index} style={[styles.topicTag, getTagStyle(tagRelation.tag.name)]}>
                            <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                        </View>
                    ))}
                </View>
                {isOwner && (
                    <TouchableOpacity
                        onPress={(e) => { e.stopPropagation(); setMenuVisible(true); }}
                        style={styles.menuButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.topicTitle}>{topic.title}</Text>

            <View style={styles.topicMeta}>
                <TouchableOpacity onPress={() => router.push({ pathname: '/user/[id]', params: { id: topic.author.id } })}>
                    <Text style={styles.topicAuthor}>{t('forum_topic_by')} <Text style={styles.authorName}>{topic.author.name || t('forum_topic_unknown_user')}</Text></Text>
                </TouchableOpacity>
                <Text style={styles.topicTime}>• {getTimeAgo(topic.createdAt, language)}</Text>
            </View>

            <View style={styles.topicStats}>
                <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{topic._count.comments} {t('forum_topic_replies')}</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{topic.viewCount} {t('forum_topic_views')}</Text>
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
                                    <Text style={styles.menuItemText}>{t('forum_menu_edit')}</Text>
                                </TouchableOpacity>
                                <View style={styles.menuDivider} />
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    <Text style={styles.menuItemTextDanger}>{t('forum_menu_delete')}</Text>
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
                                    <Text style={styles.editTitle}>{t('forum_edit_title')}</Text>
                                    <TouchableOpacity onPress={() => setEditVisible(false)}>
                                        <Ionicons name="close" size={24} color="#374151" />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={styles.fieldLabel}>{t('forum_edit_field_title')}</Text>
                                    <TextInput
                                        style={styles.editInput}
                                        value={editTitle}
                                        onChangeText={setEditTitle}
                                        placeholder={t('forum_edit_title_placeholder')}
                                        placeholderTextColor="#9ca3af"
                                    />
 
                                    <Text style={styles.fieldLabel}>{t('forum_edit_field_desc')}</Text>
                                    <TextInput
                                        style={[styles.editInput, styles.editTextArea]}
                                        value={editContent}
                                        onChangeText={setEditContent}
                                        multiline
                                        numberOfLines={5}
                                        textAlignVertical="top"
                                        placeholder={t('forum_edit_desc_placeholder')}
                                        placeholderTextColor="#9ca3af"
                                    />

                                    {allTags.length > 0 && (
                                        <>
                                            <Text style={styles.fieldLabel}>{t('forum_edit_field_tags')}</Text>
                                            <View style={styles.tagsRow}>
                                                {allTags.map(tag => {
                                                    const selected = editTagIds.includes(tag.id);
                                                    return (
                                                        <TouchableOpacity
                                                            key={tag.id}
                                                            onPress={() => toggleTag(tag.id)}
                                                            style={[styles.tagChip, selected && styles.tagChipSelected]}
                                                        >
                                                            <Text style={[styles.tagChipText, selected && styles.tagChipTextSelected]}>{tag.name}</Text>
                                                        </TouchableOpacity>
                                                    );
                                                })}
                                            </View>
                                        </>
                                    )}
 
                                    <TouchableOpacity
                                        style={[styles.editSaveBtn, saving && { opacity: 0.6 }]}
                                        onPress={handleEditSave}
                                        disabled={saving}
                                    >
                                        {saving ? <ActivityIndicator color="white" /> : <Text style={styles.editSaveBtnText}>{t('forum_save_btn')}</Text>}
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    topicCard: {
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
    topicHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 },
    topicTagsContainer: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', flex: 1 },
    topicTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: '#f3f4f6' },
    tagMaladies: { backgroundColor: '#FEE2E2' },
    tagResolu: { backgroundColor: '#E0F2FE' },
    tagRecolte: { backgroundColor: '#FEF3C7' },
    tagPlantation: { backgroundColor: '#EBF6EB' },
    tagArrosage: { backgroundColor: '#E0E7FF' },
    topicTagText: { fontSize: 11, fontWeight: '700', color: '#374151' },
    menuButton: { padding: 4, marginLeft: 8 },
    topicTitle: { fontSize: 18, fontWeight: '800', color: '#1F2937', marginBottom: 8, lineHeight: 24 },
    topicMeta: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    topicAuthor: { fontSize: 13, fontWeight: '500', color: '#6B7280' },
    authorName: { fontWeight: '700', color: '#5A7F54' },
    topicTime: { fontSize: 13, color: '#9CA3AF', marginLeft: 5 },
    topicStats: { flexDirection: 'row', gap: 20, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
    statItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    statText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
    // Menu
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
    menuCard: {
        backgroundColor: 'white', borderRadius: 12, padding: 8, minWidth: 200,
        shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 8,
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
    fieldLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 4 },
    editInput: {
        backgroundColor: '#f9fafb', borderRadius: 12, padding: 14, fontSize: 15,
        color: '#111827', borderWidth: 1, borderColor: '#e5e7eb', marginBottom: 14,
    },
    editTextArea: { minHeight: 110, paddingTop: 12 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    tagChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6', borderWidth: 2, borderColor: 'transparent' },
    tagChipSelected: { borderColor: '#5A7F54', backgroundColor: '#EBF6EB' },
    tagChipText: { fontSize: 13, color: '#374151', fontWeight: '500' },
    tagChipTextSelected: { color: '#5A7F54', fontWeight: '700' },
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
