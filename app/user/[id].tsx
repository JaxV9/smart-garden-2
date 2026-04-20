import { useUser } from '@/hooks/useUser';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
};

export default function UserProfileScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { getPublicProfile } = useUser();
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true);
            const data = await getPublicProfile(id);
            if (data) {
                setProfile(data as PublicProfile);
            }
            setLoading(false);
        }
        fetchProfile();
    }, [id]);

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
            {/* Header Mince */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profil de {profile.name}</Text>
                <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
                {/* En-tête du profil central */}
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
                </View>

                {/* Section Stats (Floutée si privé) */}
                <View style={styles.statsSection}>
                    {(profile.isPrivate) ? (
                        <>
                            {/* Dummy layout for visual blur effect */}
                            <View style={[styles.statsGrid, { opacity: 0.3 }]}>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Plantes</Text></View>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Contributions</Text></View>
                                <View style={styles.statCard}><Text style={styles.statNumber}>-</Text><Text style={styles.statLabel}>Sujets</Text></View>
                            </View>
                            
                            {/* Overlay privé */}
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
                        </>
                    ) : (
                        <View style={styles.statsGrid}>
                            <View style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: '#e5f5f0' }]}>
                                    <Ionicons name="leaf" size={24} color="#5B8E55" />
                                </View>
                                <Text style={styles.statNumber}>{profile.stats?.gardenVegetable || 0}</Text>
                                <Text style={styles.statLabel}>Plantes</Text>
                            </View>

                            <View style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: '#e0f2fe' }]}>
                                    <Ionicons name="create" size={24} color="#0284c7" />
                                </View>
                                <Text style={styles.statNumber}>{totalContributions}</Text>
                                <Text style={styles.statLabel}>Contributions</Text>
                            </View>

                            <View style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
                                    <Ionicons name="chatbubbles" size={24} color="#d97706" />
                                </View>
                                <Text style={styles.statNumber}>{profile.stats?.topics || 0}</Text>
                                <Text style={styles.statLabel}>Sujets créés</Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
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
});
