import { useForumContext } from '@/contexts/forum.context';
import { useForum } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Index() {
    const router = useRouter();
    const { tags, topics } = useForumContext();
    const { loadTags, loadTopics, createTopic } = useForum();
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicContent, setNewTopicContent] = useState('');
    const [selectedTagsForTopic, setSelectedTagsForTopic] = useState<string[]>([]);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await loadTags();
            await loadTopics();
            setLoading(false);
        };
        loadData();
    }, []);

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilterSelect = async (tagId: string | null) => {
        setSelectedTagId(tagId);
        setFilterModalVisible(false);
        await loadTopics(tagId || undefined);
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const createdAt = new Date(date);
        const diffInMs = now.getTime() - createdAt.getTime();
        
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        const diffInMonths = Math.floor(diffInDays / 30);
        const diffInYears = Math.floor(diffInDays / 365);
        
        if (diffInMinutes < 1) return "À l'instant";
        if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
        if (diffInHours < 24) return `Il y a ${diffInHours}h`;
        if (diffInDays < 30) return `Il y a ${diffInDays}j`;
        if (diffInMonths < 12) return `Il y a ${diffInMonths} mois`;
        return `Il y a ${diffInYears} an${diffInYears > 1 ? 's' : ''}`;
    };

    const toggleTagSelection = (tagId: string) => {
        if (selectedTagsForTopic.includes(tagId)) {
            setSelectedTagsForTopic(selectedTagsForTopic.filter(id => id !== tagId));
        } else {
            setSelectedTagsForTopic([...selectedTagsForTopic, tagId]);
        }
    };

    const handleCreateTopic = async () => {
        if (!newTopicTitle.trim() || !newTopicContent.trim()) {
            alert('Veuillez remplir le titre et le contenu');
            return;
        }

        const result = await createTopic(newTopicTitle, newTopicContent, selectedTagsForTopic);
        
        if (result === 'Success') {
            setCreateModalVisible(false);
            setNewTopicTitle('');
            setNewTopicContent('');
            setSelectedTagsForTopic([]);
        } else {
            alert('Erreur lors de la création du topic');
        }
    };

    const renderTopic = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={styles.topicCard}
            onPress={() => router.push(`/forum/topic/${item.id}`)}
        >
            <View style={styles.topicTagsContainer}>
                {item.tags.map((tagRelation: any, index: number) => (
                    <View
                        key={index}
                        style={[
                            styles.topicTag,
                            tagRelation.tag.name === 'Maladies' && styles.tagMaladies,
                            tagRelation.tag.name === 'Résolu' && styles.tagResolu,
                            tagRelation.tag.name === 'Récolte' && styles.tagRecolte,
                            tagRelation.tag.name === 'Plantation' && styles.tagPlantation,
                            tagRelation.tag.name === 'Arrosage' && styles.tagArrosage,
                        ]}
                    >
                        <Text style={styles.topicTagText}>{tagRelation.tag.name}</Text>
                    </View>
                ))}
            </View>

            <Text style={styles.topicTitle}>{item.title}</Text>

            <View style={styles.topicMeta}>
                <Text style={styles.topicAuthor}>Par {item.author.name || 'Utilisateur'}</Text>
                <Text style={styles.topicTime}>• {getTimeAgo(item.createdAt)}</Text>
            </View>

            <View style={styles.topicStats}>
                <View style={styles.statItem}>
                    <Ionicons name="chatbubble-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item._count.comments} réponses</Text>
                </View>
                <View style={styles.statItem}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.statText}>{item.viewCount} vues</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>test</Text>
                <View style={styles.notificationBadge}>
                    <Ionicons name="notifications-outline" size={28} color="white" />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>27</Text>
                    </View>
                </View>
            </View>

            {/* Navigation Tabs */}
            <View style={styles.tabs}>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="chatbubbles-outline" size={18} color="#666" />
                    <Text style={styles.tabText}>Social</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tab, styles.tabActive]}>
                    <Ionicons name="people-outline" size={18} color="#000" />
                    <Text style={[styles.tabText, styles.tabTextActive]}>Forum</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab}>
                    <Ionicons name="play-circle-outline" size={18} color="#666" />
                    <Text style={styles.tabText}>Tutos</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Bouton Poser une question */}
                <TouchableOpacity 
                    style={styles.askButton}
                    onPress={() => setCreateModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.askButtonText}>Poser une question</Text>
                </TouchableOpacity>

                {/* Barre de recherche */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher dans le forum..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Filtre par catégories */}
                <TouchableOpacity 
                    style={styles.filterContainer}
                    onPress={() => setFilterModalVisible(true)}
                >
                    <Ionicons name="filter-outline" size={18} color="#333" />
                    <Text style={styles.filterText}>
                        {selectedTagId
                            ? tags.find(t => t.id === selectedTagId)?.name
                            : 'Toutes les catégories'}
                    </Text>
                    <Ionicons name="chevron-down-outline" size={18} color="#333" />
                </TouchableOpacity>

                {/* Liste des topics */}
                {loading ? (
                    <Text style={styles.loadingText}>Chargement...</Text>
                ) : (
                    <FlatList
                        data={filteredTopics}
                        renderItem={renderTopic}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.topicsList}
                    />
                )}
            </ScrollView>

            {/* Modal de filtrage */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={filterModalVisible}
                onRequestClose={() => setFilterModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Filtrer par catégorie</Text>
                            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalList}>
                            <TouchableOpacity
                                style={[
                                    styles.filterOption,
                                    !selectedTagId && styles.filterOptionSelected
                                ]}
                                onPress={() => handleFilterSelect(null)}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    !selectedTagId && styles.filterOptionTextSelected
                                ]}>
                                    Toutes les catégories
                                </Text>
                                {!selectedTagId && (
                                    <Ionicons name="checkmark" size={20} color="#10b981" />
                                )}
                            </TouchableOpacity>

                            {tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag.id}
                                    style={[
                                        styles.filterOption,
                                        selectedTagId === tag.id && styles.filterOptionSelected
                                    ]}
                                    onPress={() => handleFilterSelect(tag.id)}
                                >
                                    <Text style={[
                                        styles.filterOptionText,
                                        selectedTagId === tag.id && styles.filterOptionTextSelected
                                    ]}>
                                        {tag.name}
                                    </Text>
                                    {selectedTagId === tag.id && (
                                        <Ionicons name="checkmark" size={20} color="#10b981" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Modal de création de topic */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createModalVisible}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, styles.createModalContent]}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Poser une question</Text>
                            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.createForm}>
                            <Text style={styles.inputLabel}>Titre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Comment traiter le mildiou ?"
                                value={newTopicTitle}
                                onChangeText={setNewTopicTitle}
                                placeholderTextColor="#999"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Décrivez votre question en détail..."
                                value={newTopicContent}
                                onChangeText={setNewTopicContent}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                placeholderTextColor="#999"
                            />

                            <Text style={styles.inputLabel}>Tags (optionnel)</Text>
                            <View style={styles.tagsSelection}>
                                {tags.map((tag) => (
                                    <TouchableOpacity
                                        key={tag.id}
                                        style={[
                                            styles.selectableTag,
                                            selectedTagsForTopic.includes(tag.id) && styles.selectableTagSelected,
                                            tag.name === 'Maladies' && selectedTagsForTopic.includes(tag.id) && styles.tagMaladies,
                                            tag.name === 'Récolte' && selectedTagsForTopic.includes(tag.id) && styles.tagRecolte,
                                            tag.name === 'Plantation' && selectedTagsForTopic.includes(tag.id) && styles.tagPlantation,
                                            tag.name === 'Arrosage' && selectedTagsForTopic.includes(tag.id) && styles.tagArrosage,
                                        ]}
                                        onPress={() => toggleTagSelection(tag.id)}
                                    >
                                        <Text style={[
                                            styles.selectableTagText,
                                            selectedTagsForTopic.includes(tag.id) && styles.selectableTagTextSelected
                                        ]}>
                                            {tag.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity 
                                style={styles.submitButton}
                                onPress={handleCreateTopic}
                            >
                                <Text style={styles.submitButtonText}>Publier la question</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#10b981',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    notificationBadge: {
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#e5e5e5',
        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 10,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 25,
        alignItems: 'center',
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
    },
    tabActive: {
        backgroundColor: 'white',
    },
    tabText: {
        fontSize: 15,
        color: '#666',
    },
    tabTextActive: {
        color: '#000',
        fontWeight: '600',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    askButton: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    askButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        gap: 10,
    },
    filterText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    topicsList: {
        paddingBottom: 20,
    },
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
    topicTagsContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 10,
        flexWrap: 'wrap',
    },
    topicTag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#e5e5e5',
    },
    tagMaladies: {
        backgroundColor: '#bbf7d0',
    },
    tagResolu: {
        backgroundColor: '#bfdbfe',
    },
    tagRecolte: {
        backgroundColor: '#fde68a',
    },
    tagPlantation: {
        backgroundColor: '#fed7aa',
    },
    tagArrosage: {
        backgroundColor: '#ddd6fe',
    },
    topicTagText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
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
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        maxHeight: '70%',
    },
    createModalContent: {
        maxHeight: '90%',
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
    modalList: {
        paddingHorizontal: 20,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterOptionSelected: {
        backgroundColor: '#f0fdf4',
    },
    filterOptionText: {
        fontSize: 16,
        color: '#333',
    },
    filterOptionTextSelected: {
        color: '#10b981',
        fontWeight: '600',
    },
    createForm: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    textArea: {
        minHeight: 120,
        paddingTop: 12,
    },
    tagsSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    selectableTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectableTagSelected: {
        borderColor: '#333',
    },
    selectableTagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    selectableTagTextSelected: {
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#10b981',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
