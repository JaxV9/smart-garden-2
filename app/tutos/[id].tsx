import { useTutorialsContext } from '@/contexts/tutorials.context';
import { useTutorials } from '@/hooks/useTutorials';
import { getTimeAgo } from '@/utils/dateFormatter';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';

interface Tutorial {
    id: string;
    title: string;
    description?: string;
    category: string;
    content?: string;
    videoUrl?: string;
    type: 'ARTICLE' | 'VIDEO';
    author: {
        id?: string;
        name?: string;
    };
    createdAt: string;
    viewCount: number;
    _count: {
        likes: number;
    };
    isLikedByUser?: boolean;
}

// Fonction pour extraire l'ID YouTube d'une URL
const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;

    // Formats supportés:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID

    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

export default function TutorialDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { tutorials } = useTutorialsContext();
    const { toggleLike, incrementViewCount } = useTutorials();

    const [tutorial, setTutorial] = useState<Tutorial | null>(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);

    // Initialisation & incrémentation des vues
    useEffect(() => {
        if (id) {
            incrementViewCount(id).catch(() => {});
        }
    }, [id]);

    // Synchronisation en temps réel avec le Contexte
    useEffect(() => {
        if (id && tutorials.length > 0) {
            const foundTutorial = tutorials.find(t => t.id === id);
            if (foundTutorial) {
                setTutorial(foundTutorial as Tutorial);
            }
            setLoading(false);
        }
    }, [id, tutorials]);

    const handleLike = async () => {
        if (id) {
            await toggleLike(id);
        }
    };

    const onStateChange = useCallback((state: string) => {
        if (state === 'ended') {
            setPlaying(false);
        }
    }, []);

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

    if (loading) {
        return (
            <SafeAreaProvider>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5B8E55" />
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            </SafeAreaProvider>
        );
    }

    if (!tutorial) {
        return (
            <SafeAreaProvider>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
                    <Text style={styles.errorText}>Tutoriel introuvable</Text>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <Text style={styles.backButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaProvider>
        );
    }

    // Extraire l'ID YouTube
    const youtubeVideoId = tutorial.videoUrl ? getYoutubeVideoId(tutorial.videoUrl) : null;

    return (
        <SafeAreaProvider>
            <View style={styles.container}>
                {/* Header avec bouton retour */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.headerButton}
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Tutoriel</Text>
                    <View style={styles.headerButton} />
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                >
                    {/* Vidéo YouTube si c'est un tutoriel vidéo */}
                    {tutorial.type === 'VIDEO' && youtubeVideoId && (
                        <View style={styles.videoContainer}>
                            <YoutubePlayer
                                height={220}
                                play={playing}
                                videoId={youtubeVideoId}
                                onChangeState={onStateChange}
                            />
                        </View>
                    )}

                    {/* Message si pas de vidéo valide */}
                    {tutorial.type === 'VIDEO' && !youtubeVideoId && (
                        <View style={styles.noVideoContainer}>
                            <Ionicons name="videocam-off-outline" size={48} color="#999" />
                            <Text style={styles.noVideoText}>URL vidéo invalide</Text>
                        </View>
                    )}

                    {/* Contenu */}
                    <View style={styles.content}>
                        {/* Catégorie */}
                        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(tutorial.category) }]}>
                            <Text style={styles.categoryText}>{tutorial.category}</Text>
                        </View>

                        <Text style={styles.title}>{tutorial.title}</Text>

                        {/* Auteur */}
                        <TouchableOpacity
                            style={styles.authorContainer}
                            onPress={() => {
                                if (tutorial.author?.id) {
                                    router.push({
                                        pathname: '/user/[id]',
                                        params: { id: tutorial.author.id }
                                    });
                                }
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={20} color="#666" />
                            </View>
                            <View style={styles.authorInfo}>
                                <Text style={styles.authorName}>{tutorial.author?.name || 'Utilisateur'}</Text>
                                <Text style={styles.publishDate}>{getTimeAgo(tutorial.createdAt)}</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Stats et actions */}
                        <View style={styles.statsContainer}>
                            <View style={styles.stats}>
                                <View style={styles.statItem}>
                                    <Ionicons name="eye-outline" size={18} color="#666" />
                                    <Text style={styles.statText}>{tutorial.viewCount} vues</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
                                <Ionicons
                                    name={tutorial.isLikedByUser ? "heart" : "heart-outline"}
                                    size={24}
                                    color={tutorial.isLikedByUser ? "#ef4444" : "#666"}
                                />
                                <Text style={styles.likeText}>{tutorial._count?.likes || 0}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Description */}
                        {tutorial.description && (
                            <View style={styles.descriptionContainer}>
                                <Text style={styles.descriptionTitle}>Description</Text>
                                <Text style={styles.descriptionText}>{tutorial.description}</Text>
                            </View>
                        )}

                        {/* Contenu principal */}
                        {tutorial.content && (
                            <View style={styles.articleContent}>
                                <Text style={styles.contentTitle}>Contenu</Text>
                                <Text style={styles.articleText}>{tutorial.content}</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        height: '100%'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        marginTop: 64
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    backButton: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#5B8E55',
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    videoContainer: {
        width: '100%',
        backgroundColor: '#000',
        paddingVertical: 10,
    },
    noVideoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    noVideoText: {
        marginTop: 12,
        fontSize: 14,
        color: '#999',
    },
    content: {
        backgroundColor: 'white',
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
        backgroundColor: '#e5e5e5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorInfo: {
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#5B8E55',
        textDecorationLine: 'underline',
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
        borderBottomColor: '#f0f0f0',
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
    descriptionContainer: {
        marginBottom: 20,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#666',
    },
    articleContent: {
        marginTop: 10,
    },
    contentTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    articleText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#333',
    },
});
