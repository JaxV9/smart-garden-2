import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Tutorial {
    title: string;
    description?: string;
    category: string;
    content?: string;
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

interface TutorialDetailArticleProps {
    tutorial: Tutorial;
    onLike: () => void;
}

export default function TutorialDetailArticle({ tutorial, onLike }: TutorialDetailArticleProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ASTUCES':
                return '#FEF3C7';
            case 'DIY':
                return '#FFEDD5';
            case 'TECHNIQUES':
                return '#EEF2FF';
            default:
                return '#F3F4F6';
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                {/* Catégorie */}
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tutorial.category) }]}>
                    <Text style={styles.categoryText}>{tutorial.category}</Text>
                </View>

                <Text style={styles.title}>{tutorial.title}</Text>

                {/* Auteur */}
                <View style={styles.authorContainer}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={20} color="#5A7F54" />
                    </View>
                    <View style={styles.authorInfo}>
                        <Text style={styles.authorName}>{tutorial.author.name || 'Utilisateur'}</Text>
                        <Text style={styles.publishDate}>{getTimeAgo(tutorial.createdAt)}</Text>
                    </View>
                </View>

                {/* Stats et actions */}
                <View style={styles.statsContainer}>
                    <View style={styles.stats}>
                        <View style={styles.statItem}>
                            <Ionicons name="eye-outline" size={18} color="#666" />
                            <Text style={styles.statText}>{tutorial.viewCount} vues</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.likeButton} onPress={onLike}>
                        <Ionicons
                            name={tutorial.isLikedByUser ? "heart" : "heart-outline"}
                            size={24}
                            color={tutorial.isLikedByUser ? "#ef4444" : "#666"}
                        />
                        <Text style={styles.likeText}>{tutorial._count.likes}</Text>
                    </TouchableOpacity>
                </View>

                {/* Contenu de l'article */}
                <View style={styles.articleContent}>
                    <Text style={styles.articleText}>{tutorial.content}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        minHeight: '100%',
    },
    content: {
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#374151',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1F2937',
        marginBottom: 16,
        lineHeight: 32,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EBF6EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#5A7F54',
    },
    publishDate: {
        fontSize: 13,
        color: '#999',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    stats: {
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
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#F3F4F6',
        borderRadius: 999,
    },
    likeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    articleContent: {
        marginTop: 10,
    },
    articleText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#1F2937',
    },
});
