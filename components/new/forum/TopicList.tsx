import { FlatList, StyleSheet, Text } from 'react-native';
import TopicCard from './TopicCard';

interface TopicListProps {
    topics: any[];
    loading: boolean;
    onTopicPress: (topicId: string) => void;
}

export default function TopicList({ topics, loading, onTopicPress }: TopicListProps) {
    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    return (
        <FlatList
            data={topics}
            renderItem={({ item }) => (
                <TopicCard topic={item} onPress={() => onTopicPress(item.id)} />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.topicsList}
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
});
