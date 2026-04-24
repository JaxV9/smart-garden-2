import { getTimeAgo } from '@/utils/dateFormatter';
import { useUserContext } from '@/contexts/user.context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface Tag {
    tag: {
        name: string;
    };
}

interface Topic {
    id: string;
    title: string;
    tags: Tag[];
    author: {
        id: string;
        name?: string;
    };
    createdAt: string;
    _count: {
        comments: number;
    };
    viewCount: number;
}

interface TopicCardProps {
    topic: Topic;
    onPress: () => void;
    onDelete?: (topicId: string) => void;
}

export default function TopicCard({ topic, onPress, onDelete }: TopicCardProps) {
    const router = useRouter();
    const { user } = useUserContext();
    const [menuVisible, setMenuVisible] = useState(false);
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
            'Supprimer le sujet',
            'Es-tu sûr de vouloir supprimer ce sujet ? Tous les commentaires associés seront également supprimés.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => onDelete?.(topic.id),
                },
            ]
        );
    };

    return (
        <TouchableOpacity style={styles.topicCard} onPress={onPress}>
            <View style={styles.topicHeader}>
                <View style={styles.topicTagsContainer}>
                    {topic.tags.map((tagRelation, index) => (
                        <View
                            key={index}
                            style={[styles.topicTag, getTagStyle(tagRelation.tag.name)]}
                        >
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
                    <Text style={styles.topicAuthor}>Par <Text style={styles.authorName}>{topic.author.name || 'Utilisateur'}</Text></Text>
                </TouchableOpacity>
                <Text style={styles.topicTime}>• {getTimeAgo(topic.createdAt)}</Text>
            </View>

            <View style={styles.topicStats}>
                <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{topic._count.comments} réponses</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{topic.viewCount} vues</Text>
                </View>
            </View>

            {/* Menu modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <TouchableWithoutFeedback>
                            <View style={styles.menuCard}>
                                <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
                                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                    <Text style={styles.menuItemTextDanger}>Supprimer le sujet</Text>
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
    topicCard: {
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
    topicHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    topicTagsContainer: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
        flex: 1,
    },
    topicTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
    },
    tagMaladies: { backgroundColor: '#bbf7d0' },
    tagResolu: { backgroundColor: '#bfdbfe' },
    tagRecolte: { backgroundColor: '#fde68a' },
    tagPlantation: { backgroundColor: '#fed7aa' },
    tagArrosage: { backgroundColor: '#ddd6fe' },
    topicTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    menuButton: {
        padding: 4,
        marginLeft: 8,
    },
    topicTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
        lineHeight: 24,
    },
    topicMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    topicAuthor: {
        fontSize: 14,
        color: '#666',
    },
    authorName: {
        fontWeight: 'bold',
        color: '#5B8E55',
    },
    topicTime: {
        fontSize: 14,
        color: '#999',
        marginLeft: 5,
    },
    topicStats: {
        flexDirection: 'row',
        gap: 20,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
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
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    menuItemTextDanger: {
        fontSize: 15,
        color: '#ef4444',
        fontWeight: '500',
    },
});
