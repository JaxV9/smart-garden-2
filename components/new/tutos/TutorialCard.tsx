import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TutorialCardProps {
    tutorial: {
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
    };
    onLike: (tutorialId: string) => void;
    onPress: (tutorialId: string) => void;
}

export default function TutorialCard({ tutorial, onLike, onPress }: TutorialCardProps) {
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '';
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    };

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
        <TouchableOpacity
            style={styles.card}
            onPress={() => onPress(tutorial.id)}
        >
            {/* Thumbnail avec badge type */}
            <View style={styles.thumbnailContainer}>
                {tutorial.thumbnail ? (
                    <Image
                        source={{ uri: tutorial.thumbnail }}
                        style={styles.thumbnail}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.thumbnailPlaceholder}>
                        <Ionicons
                            name={tutorial.type === 'VIDEO' ? 'videocam' : 'document-text'}
                            size={40}
                            color="#999"
                        />
                    </View>
                )}

                {/* Badge type */}
                <View style={[
                    styles.typeBadge,
                    tutorial.type === 'VIDEO' ? styles.videoBadge : styles.articleBadge
                ]}>
                    <Ionicons
                        name={tutorial.type === 'VIDEO' ? 'videocam' : 'document-text'}
                        size={12}
                        color="white"
                    />
                    <Text style={styles.typeBadgeText}>
                        {tutorial.type === 'VIDEO' ? 'Vidéo' : 'Article'}
                    </Text>
                </View>

                {/* Durée pour les vidéos */}
                {tutorial.type === 'VIDEO' && tutorial.videoDuration && (
                    <View style={styles.durationBadge}>
                        <Text style={styles.durationText}>
                            {formatDuration(tutorial.videoDuration)}
                        </Text>
                    </View>
                )}
            </View>

            {/* Contenu */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={2}>
                    {tutorial.title}
                </Text>

                <View style={styles.meta}>
                    <View style={styles.authorContainer}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {tutorial.author.name?.charAt(0).toUpperCase() || 'U'}
                            </Text>
                        </View>
                        <Text style={styles.authorName}>
                            {tutorial.author.name || 'Utilisateur'}
                        </Text>
                    </View>
                </View>

                {/* Catégorie */}
                <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tutorial.category) }]}>
                    <Text style={styles.categoryText}>{tutorial.category}</Text>
                </View>

                {/* Stats */}
                <View style={styles.stats}>
                    <View style={styles.statItem}>
                        <Ionicons name="eye-outline" size={16} color="#666" />
                        <Text style={styles.statText}>{tutorial.viewCount} vues</Text>
                    </View>

                    <TouchableOpacity
                        style={styles.statItem}
                        onPress={(e) => {
                            e.stopPropagation();
                            onLike(tutorial.id);
                        }}
                    >
                        <Ionicons
                            name={tutorial.isLikedByUser ? "heart" : "heart-outline"}
                            size={16}
                            color={tutorial.isLikedByUser ? "#ef4444" : "#666"}
                        />
                        <Text style={styles.statText}>{tutorial._count.likes}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
        overflow: 'hidden',
    },
    thumbnailContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    thumbnailPlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    typeBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    videoBadge: {
        backgroundColor: '#ef4444',
    },
    articleBadge: {
        backgroundColor: '#3b82f6',
    },
    typeBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    durationBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    durationText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
        lineHeight: 22,
    },
    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    authorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatarPlaceholder: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#5B8E55',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    authorName: {
        fontSize: 14,
        color: '#666',
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    stats: {
        flexDirection: 'row',
        gap: 16,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 14,
        color: '#666',
    },
});
