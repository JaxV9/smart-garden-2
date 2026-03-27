import CreateTopicModal from "@/components/new/forum/CreateTopicModal";
import FilterButton from "@/components/new/forum/FilterButton";
import FilterModal from "@/components/new/forum/FilterModal";
import SearchBar from "@/components/new/forum/SearchBar";
import TopicList from "@/components/new/forum/TopicList";
import { useForumContext } from "@/contexts/forum.context";
import { useForum } from "@/hooks/useForum";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";


export const ForumFeedTab = () => {

    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [newTopicContent, setNewTopicContent] = useState('');
    const [selectedTagsForTopic, setSelectedTagsForTopic] = useState<string[]>([]);


    const { tags, topics } = useForumContext();
    const { loadTags, loadTopics, createTopic } = useForum();


    const selectedTagName = selectedTagId
        ? tags.find(t => t.id === selectedTagId)?.name
        : undefined;

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFilterSelect = async (tagId: string | null) => {
        setSelectedTagId(tagId);
        setFilterModalVisible(false);
        setLoading(true);
        await loadTopics(tagId || undefined);
        setLoading(false);
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
            // Recharger les topics après création
            setLoading(true);
            await loadTopics(selectedTagId || undefined);
            setLoading(false);
        } else {
            alert('Erreur lors de la création du topic');
        }
    };

    // Recharge les données à chaque fois que l'écran est en focus
    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                setLoading(true);
                await loadTags();
                await loadTopics(selectedTagId || undefined);
                setLoading(false);
            };
            loadData();
        }, [selectedTagId])
    );


    return (
        <>
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
        </>
    )
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
