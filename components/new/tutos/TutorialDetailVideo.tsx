import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Tutorial {
    title: string;
    description?: string;
    category: string;
    videoUrl?: string;
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

interface TutorialDetailVideoProps {
    tutorial: Tutorial;
    onLike: () => void;
}

export default function TutorialDetailVideo({ tutorial, onLike }: TutorialDetailVideoProps) {
    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'ASTUCES':
                return '#fde68a';
            case 'DIY':
                return '#fed7aa';
            case 'TECHNIQUES':
                return '#ddd6fe';
            default:
                return '#e5e5e5';
        }
    };

    return (
        <View style={styles.container}>
            {/* Vidéo placeholder */}
            <View style={styles.videoContainer}>
                <View style={styles.videoPlaceholder}>
                    <Ionicons name="play-circle" size={64} color="white" />
                    <Text style={styles.videoUrl}>{tutorial.videoUrl}</Text>
                </View>
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                {/* Catégorie */}
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tutorial.category) }]}>
                    <Text style={styles.categoryText}>{tutorial.category}</Text>
                </View>

                <Text style={styles.title}>{tutorial.title}</Text>

                {tutorial.description && (
                    <Text style={styles.description}>{tutorial.description}</Text>
                )}

                {/* Auteur */}
                <View style={styles.authorContainer}>
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={20} color="#666" />
                    </View>
                    <View>
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
    },
    videoContainer: {
        width: '100%',
        height: 220,
        backgroundColor: '#000',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    videoUrl: {
        color: 'white',
        fontSize: 12,
        marginTop: 12,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    content: {
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
        lineHeight: 32,
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#666',
        marginBottom: 20,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarPlaceholder: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
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
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
    },
    likeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
