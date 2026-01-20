import { FlatList, StyleSheet, Text } from 'react-native';
import TutorialCard from './TutorialCard';

interface Tutorial {
    id: string;
    title: string;
    type: 'VIDEO' | 'ARTICLE';
    category: string;
    thumbnail?: string;
    videoDuration?: number;
    author: {
        name?: string;
    };
    createdAt: string;
    viewCount: number;
    _count: {
        likes: number;
    };
    isLikedByUser?: boolean;
}

interface TutorialListProps {
    tutorials: Tutorial[];
    loading: boolean;
    onLike: (tutorialId: string) => void;
    onPress: (tutorialId: string) => void;
}

export default function TutorialList({ tutorials, loading, onLike, onPress }: TutorialListProps) {
    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    if (tutorials.length === 0) {
        return <Text style={styles.emptyText}>Aucun tutoriel pour le moment</Text>;
    }

    return (
        <FlatList
            data={tutorials}
            renderItem={({ item }) => (
                <TutorialCard
                    tutorial={item}
                    onLike={onLike}
                    onPress={onPress}
                />
            )}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    loadingText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 16,
        marginTop: 40,
    },
    list: {
        paddingBottom: 20,
    },
});
