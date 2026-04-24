import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUserContext } from '@/contexts/user.context';
import { useGarden } from '@/hooks/useGarden';

type PublicProfile = {
    id: string;
    name: string;
    level: string | null;
    createdAt: string;
    isPrivate: boolean;
    stats?: {
        topics: number;
        posts: number;
        gardenVegetable: number;
        tutorials: number;
        comments: number;
    };
    garden?: {
        name: string;
        location: string;
    };
    spaces?: {
        spaceName: string;
    }[];
};

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { getPublicProfile, getUserTopics, getUserPosts, getUserVegetables, deletePost, deleteTopic } = useUser();
    const { removeVegetablesFromGarden } = useGarden();
    const { user } = useUserContext();
    const isOwnProfile = user?.id === id;
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'none' | 'plants' | 'contributions' | 'topics'>('none');

    const [topics, setTopics] = useState<any[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [vegetables, setVegetables] = useState<any[]>([]);
    const [loadingActivity, setLoadingActivity] = useState(false);

    useEffect(() => {
        async function fetchProfile() {
            console.log("Fetching profile for ID:", id);
            setLoading(true);
            const data = await getPublicProfile(id);
            if (data) {
                setProfile(data as PublicProfile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [id]);

    const fetchActivity = async () => {
        setLoadingActivity(true);
        if (activeTab === 'topics') {
            const data = await getUserTopics(id);
            setTopics(data as any[]);
        } else if (activeTab === 'contributions') {
            const data = await getUserPosts(id);
            setPosts(data as any[]);
        } else if (activeTab === 'plants') {
            const data = await getUserVegetables(id);
            setVegetables(data as any[]);
        }
        setLoadingActivity(false);
    };

    useEffect(() => {
        if (activeTab === 'none') return;
        fetchActivity();
    }, [activeTab, id]);

    const handleDeleteTopic = (topicId: string) => {
        Alert.alert(
            "Supprimer le sujet",
            "Es-tu sûr de vouloir supprimer ce sujet ? Cette action est irréversible et supprimera tous les commentaires associés.",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteTopic(topicId);
                        if (success) fetchActivity();
                    }
                }
            ]
        );
    };

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            "Supprimer le post",
            "Es-tu sûr de vouloir supprimer ce post ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Supprimer", 
                    style: "destructive",
                    onPress: async () => {
                        const success = await deletePost(postId);
                        if (success) fetchActivity();
                    }
                }
            ]
        );
    };

    const handleDeleteVegetable = (vegId: string) => {
        Alert.alert(
            "Retirer du jardin",
            "Es-tu sûr de vouloir retirer cette plante de ton jardin ?",
            [
                { text: "Annuler", style: "cancel" },
                { 
                    text: "Retirer", 
                    style: "destructive",
                    onPress: async () => {
                        const success = await removeVegetablesFromGarden({ gardenVegetableId: vegId } as any);
                        if (success === "Success") fetchActivity();
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#5B8E55" />
            </View>
        );
    }

    if (!profile) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={50} color="#ccc" />
                <Text style={styles.errorText}>Utilisateur introuvable</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonDefault}>
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Calculer les contributions s'il y a des stats
    const totalContributions = profile.stats
        ? profile.stats.topics + profile.stats.posts + profile.stats.tutorials + profile.stats.comments
        : 0;

    const initial = profile.name ? profile.name.charAt(0).toUpperCase() : '?';

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profil de {profile.name}</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarLetter}>{initial}</Text>
                    </View>
                    <Text style={styles.name}>{profile.name}</Text>
                    {profile.level && (
                        <View style={styles.levelBadge}>
                            <Ionicons name="ribbon" size={14} color="#5B8E55" />
                            <Text style={styles.levelText}>{profile.level.charAt(0).toUpperCase() + profile.level.slice(1)}</Text>
                        </View>
                    )}
                    <Text style={styles.joinedText}>
                        Membre depuis le {new Date(profile.createdAt).toLocaleDateString()}
                    </Text>
                    {!profile.isPrivate && profile.garden && (
                        <View style={styles.headerGardenInfo}>
                            <Ionicons name="location" size={14} color="#6b7280" />
                            <Text style={styles.headerGardenText}>
                                {profile.garden.name} • {profile.garden.location}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.statsSection}>
                    {profile.isPrivate ? (
                        <View>
                            <View style={[styles.statsGrid, { opacity: 0.3 }]}>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Plantes</Text></View>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Contributions</Text></View>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Sujets</Text></View>
                            </View>

                            <View style={StyleSheet.absoluteFill}>
                                <BlurView intensity={20} style={styles.blurOverlay}>
                                    <View style={styles.privateCard}>
                                        <Ionicons name="lock-closed" size={48} color="#4b5563" />
                                        <Text style={styles.privateTitle}>Profil Privé</Text>
                                        <Text style={styles.privateDesc}>
                                            Cet utilisateur a décidé de rendre son profil privé. Ses statistiques sont masquées.
                                        </Text>
                                    </View>
                                </BlurView>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.statsGrid}>
                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => setActiveTab(activeTab === 'plants' ? 'none' : 'plants')}
                            >
                                <View style={[styles.statIconContainer, { backgroundColor: '#e5f5f0' }]}>
                                    <Ionicons name="leaf" size={24} color="#5B8E55" />
                                </View>
                                <Text style={styles.statNumber}>{profile.stats?.gardenVegetable || 0}</Text>
                                <Text style={styles.statLabel}>Plantes</Text>
                                {activeTab === 'plants' && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => setActiveTab(activeTab === 'contributions' ? 'none' : 'contributions')}
                            >
                                <View style={[styles.statIconContainer, { backgroundColor: '#e0f2fe' }]}>
                                    <Ionicons name="create" size={24} color="#0284c7" />
                                </View>
                                <Text style={styles.statNumber}>{totalContributions}</Text>
                                <Text style={styles.statLabel}>Contributions</Text>
                                {activeTab === 'contributions' && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.statCard}
                                onPress={() => setActiveTab(activeTab === 'topics' ? 'none' : 'topics')}
                            >
                                <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
                                    <Ionicons name="chatbubbles" size={24} color="#d97706" />
                                </View>
                                <Text style={styles.statNumber}>{profile.stats?.topics || 0}</Text>
                                <Text style={styles.statLabel}>Sujets créés</Text>
                                {activeTab === 'topics' && <View style={styles.activeIndicator} />}
                            </TouchableOpacity>
                        </View>
                    )}
                </View>

                {!profile.isPrivate && (profile.garden || (profile.spaces && profile.spaces.length > 0)) && (
                    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                        <View style={styles.gardenInfoCard}>
                            <View style={styles.gardenInfoHeader}>
                                <Ionicons name="home" size={20} color="#5B8E55" />
                                <Text style={styles.gardenInfoTitle}>Son Jardin</Text>
                            </View>
                            {profile.garden && (
                                <View style={styles.gardenDetails}>
                                    <View style={styles.gardenDetailItem}>
                                        <Text style={styles.gardenDetailLabel}>Nom</Text>
                                        <Text style={styles.gardenDetailValue}>{profile.garden.name || 'Jardin sans nom'}</Text>
                                    </View>
                                    <View style={styles.gardenDetailItem}>
                                        <Text style={styles.gardenDetailLabel}>Localisation</Text>
                                        <Text style={styles.gardenDetailValue}>{profile.garden.location || 'Inconnue'}</Text>
                                    </View>
                                </View>
                            )}
                            {profile.spaces && profile.spaces.length > 0 && (
                                <View style={styles.spacesSection}>
                                    <Text style={styles.spacesLabel}>Espaces du jardin</Text>
                                    <View style={styles.spacesChips}>
                                        {profile.spaces.map((space, idx) => (
                                            <View key={idx} style={styles.spaceChip}>
                                                <Text style={styles.spaceChipText}>{space.spaceName}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>
                )}

                {activeTab !== 'none' && (
                    <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
                        <View style={styles.activitySection}>
                            <View style={styles.activityHeader}>
                                <Text style={styles.activityTitle}>
                                    {activeTab === 'plants' && 'Ses Plantes'}
                                    {activeTab === 'contributions' && 'Ses Contributions'}
                                    {activeTab === 'topics' && 'Ses Sujets'}
                                </Text>
                                <TouchableOpacity onPress={() => setActiveTab('none')}>
                                    <Ionicons name="close-circle" size={24} color="#6b7280" />
                                </TouchableOpacity>
                            </View>

                            {loadingActivity ? (
                                <ActivityIndicator size="small" color="#5B8E55" style={{ padding: 20 }} />
                            ) : (
                                <View style={styles.activityList}>
                                    {activeTab === 'topics' && (
                                        topics.length > 0 ? topics.map((topic) => (
                                            <View key={topic.id} style={styles.activityItem}>
                                                <TouchableOpacity
                                                    style={styles.activityItemMain}
                                                    onPress={() => router.push({ pathname: '/forum/topic/[id]', params: { id: topic.id } })}
                                                >
                                                    <Ionicons name="chatbubbles-outline" size={20} color="#5B8E55" />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.activityItemTitle} numberOfLines={1}>{topic.title}</Text>
                                                        <Text style={styles.activityItemMeta}>{topic._count?.comments || 0} réponses</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {isOwnProfile && (
                                                    <TouchableOpacity onPress={() => handleDeleteTopic(topic.id)} style={styles.deleteActionButton}>
                                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )) : <Text style={styles.emptyText}>Aucun sujet créé.</Text>
                                    )}

                                    {activeTab === 'contributions' && (
                                        posts.length > 0 ? posts.map((post) => (
                                            <View key={post.id} style={styles.activityItem}>
                                                <TouchableOpacity
                                                    style={styles.activityItemMain}
                                                    onPress={() => router.push({ pathname: '/social' })}
                                                >
                                                    <Ionicons name="image-outline" size={20} color="#0284c7" />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.activityItemTitle} numberOfLines={1}>{post.content}</Text>
                                                        <Text style={styles.activityItemMeta}>{post._count?.likes || 0} j'aime • {post._count?.comments || 0} com.</Text>
                                                    </View>
                                                </TouchableOpacity>
                                                {isOwnProfile && (
                                                    <TouchableOpacity onPress={() => handleDeletePost(post.id)} style={styles.deleteActionButton}>
                                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )) : <Text style={styles.emptyText}>Aucun post créé.</Text>
                                    )}

                                    {activeTab === 'plants' && (
                                        vegetables.length > 0 ? vegetables.map((veg) => (
                                            <View key={veg.id} style={styles.activityItem}>
                                                <View style={styles.activityItemMain}>
                                                    <Ionicons name="leaf-outline" size={20} color="#5B8E55" />
                                                    <View style={{ flex: 1 }}>
                                                        <Text style={styles.activityItemTitle}>{veg.vegetableId.charAt(0).toUpperCase() + veg.vegetableId.slice(1)}</Text>
                                                        <Text style={styles.activityItemMeta}>Ajoutée le {new Date(veg.createdAt).toLocaleDateString()}</Text>
                                                    </View>
                                                </View>
                                                {isOwnProfile && (
                                                    <TouchableOpacity onPress={() => handleDeleteVegetable(veg.id)} style={styles.deleteActionButton}>
                                                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )) : <Text style={styles.emptyText}>Aucune plante ajoutée.</Text>
                                    )}
                                </View>
                            )}
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    errorText: {
        fontSize: 18,
        color: '#6b7280',
        marginTop: 10,
        marginBottom: 20,
    },
    backButtonDefault: {
        backgroundColor: '#5B8E55',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    header: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        color: '#111827',
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    profileHeader: {
        backgroundColor: 'white',
        alignItems: 'center',
        paddingVertical: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 2,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#5B8E55',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 4,
        borderColor: '#e5f5f0',
    },
    avatarLetter: {
        color: 'white',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    levelBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e5f5f0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 12,
        gap: 6,
    },
    levelText: {
        color: '#5B8E55',
        fontWeight: '600',
        fontSize: 14,
    },
    joinedText: {
        color: '#6b7280',
        fontSize: 14,
    },
    statsSection: {
        padding: 20,
        position: 'relative',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 15,
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '47%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        elevation: 2,
        marginBottom: 5,
    },
    statIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    blurOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        overflow: 'hidden',
    },
    privateCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        width: '90%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    privateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 15,
        marginBottom: 8,
    },
    privateDesc: {
        fontSize: 14,
        color: '#4b5563',
        textAlign: 'center',
        lineHeight: 20,
    },
    gardenInfoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        elevation: 2,
    },
    gardenInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 8,
    },
    gardenInfoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    gardenDetails: {
        gap: 10,
    },
    gardenDetailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    gardenDetailLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    gardenDetailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    headerGardenInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
        gap: 4,
    },
    headerGardenText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    spacesSection: {
        marginTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        paddingTop: 12,
    },
    spacesLabel: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 8,
    },
    spacesChips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    spaceChip: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    spaceChipText: {
        fontSize: 12,
        color: '#374151',
        fontWeight: '500',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: '#5B8E55',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    activitySection: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginTop: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        elevation: 2,
    },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
        paddingBottom: 10,
    },
    activityTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    placeholderActivity: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '500',
    },
    placeholderSubtext: {
        marginTop: 5,
        fontSize: 12,
        color: '#9ca3af',
        textAlign: 'center',
    },
    activityList: {
        gap: 12,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    activityItemMain: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    activityItemTitle: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
        flex: 1,
    },
    activityItemMeta: {
        fontSize: 12,
        color: '#6b7280',
        marginLeft: 10,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9ca3af',
        paddingVertical: 20,
    },
    deleteActionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff1f2',
    },
});
