import { FlatList, StyleSheet, Text } from 'react-native';
import TutorialCard from './TutorialCard';
import { useCallback } from 'react';

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
    onDelete?: (tutorialId: string) => void;
    onUpdate?: (tutorialId: string, tutorialData: any) => Promise<void>;
}

export default function TutorialList({ tutorials, loading, onLike, onPress, onDelete, onUpdate }: TutorialListProps) {
    const renderItem = useCallback(({ item }: { item: Tutorial }) => (
        <TutorialCard
            tutorial={item}
            onLike={onLike}
            onPress={onPress}
            onDelete={onDelete}
            onUpdate={onUpdate}
        />
    ), [onLike, onPress, onDelete, onUpdate]);

    const keyExtractor = useCallback((item: Tutorial) => item.id, []);

    if (loading) {
        return <Text style={styles.loadingText}>Chargement...</Text>;
    }

    if (tutorials.length === 0) {
        return <Text style={styles.emptyText}>Aucun tutoriel pour le moment</Text>;
    }

    return (
        <FlatList
            data={tutorials}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
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
