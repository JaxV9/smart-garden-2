import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
}

export default function TopicCard({ topic, onPress }: TopicCardProps) {
    const router = useRouter();
    
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

    return (
        <TouchableOpacity style={styles.topicCard} onPress={onPress}>
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
});
