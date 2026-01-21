import CreateTopicModal from '@/components/new/forum/CreateTopicModal';
import FilterButton from '@/components/new/forum/FilterButton';
import FilterModal from '@/components/new/forum/FilterModal';
import ForumHeader from '@/components/new/forum/ForumHeader';
import ForumTabs from '@/components/new/forum/ForumTabs';
import SearchBar from '@/components/new/forum/SearchBar';
import TopicList from '@/components/new/forum/TopicList';
import { useForumContext } from '@/contexts/forum.context';
import { useForum } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

    const selectedTagName = selectedTagId 
        ? tags.find(t => t.id === selectedTagId)?.name 
        : undefined;

    return (
        <View style={styles.container}>
            <ForumHeader notificationCount={27} />
            
            <ForumTabs activeTab="forum" />

            <ScrollView style={styles.content}>
                <TouchableOpacity 
                    style={styles.askButton}
                    onPress={() => setCreateModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.askButtonText}>Poser une question</Text>
                </TouchableOpacity>

                <SearchBar 
                    value={searchQuery} 
                    onChangeText={setSearchQuery} 
                />

                <FilterButton
                    selectedTagName={selectedTagName}
                    onPress={() => setFilterModalVisible(true)}
                />

                <TopicList
                    topics={filteredTopics}
                    loading={loading}
                    onTopicPress={(topicId) => router.push(`/forum/topic/${topicId}`)}
                />
            </ScrollView>

            <FilterModal
                visible={filterModalVisible}
                tags={tags}
                selectedTagId={selectedTagId}
                onClose={() => setFilterModalVisible(false)}
                onSelectTag={handleFilterSelect}
            />

            <CreateTopicModal
                visible={createModalVisible}
                tags={tags}
                title={newTopicTitle}
                content={newTopicContent}
                selectedTags={selectedTagsForTopic}
                onClose={() => setCreateModalVisible(false)}
                onTitleChange={setNewTopicTitle}
                onContentChange={setNewTopicContent}
                onToggleTag={toggleTagSelection}
                onSubmit={handleCreateTopic}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    askButton: {
        backgroundColor: '#5B8E55',
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
});
