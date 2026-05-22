import { FlatList, StyleSheet, Text, View } from 'react-native';
import TopicCard from './TopicCard';
import { useCallback } from 'react';

interface TopicListProps {
    topics: any[];
    loading: boolean;
    onTopicPress: (topicId: string) => void;
    onDelete?: (topicId: string) => void;
    onUpdate?: (topicId: string, title: string, content: string, tagIds: string[]) => Promise<void>;
    allTags?: { id: string; name: string }[];
}

export default function TopicList({ topics, loading, onTopicPress, onDelete, onUpdate, allTags }: TopicListProps) {
    const renderItem = useCallback(({ item }: { item: any }) => (
        <TopicCard
            topic={item}
            onPress={() => onTopicPress(item.id)}
            onDelete={onDelete}
            onUpdate={onUpdate}
            allTags={allTags}
        />
    ), [onTopicPress, onDelete, onUpdate, allTags]);

    const keyExtractor = useCallback((item: any) => item.id, []);

    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    const EmptyListMessage = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
        </View>
    );

    return (
        <FlatList
            data={topics}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            contentContainerStyle={styles.topicsList}
            ListEmptyComponent={EmptyListMessage}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={5}
            removeClippedSubviews={true}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    topicsList: {
        paddingBottom: 20,
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
    },
});
