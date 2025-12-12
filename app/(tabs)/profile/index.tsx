import { useUserContext } from '@/contexts/user.context';
import { useForum, UserStats } from '@/hooks/useForum';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
    const router = useRouter();
    const { user, isLogin, getUser, logout } = useUserContext();
    const { getUserStats } = useForum();
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<UserStats | null>(null);

    useFocusEffect(
        useCallback(() => {
            const loadUserData = async () => {
                if (isLogin) {
                    setLoading(true);
                    try {
                        await getUser();
                        console.log("Chargement des stats...");
                        const userStats = await getUserStats();
                        console.log("Stats reçues:", userStats);
                        
                        if (userStats) {
                            setStats(userStats);
                        } else {
                            console.log("Stats null, mise à 0");
                            setStats({ topicsCount: 0, commentsCount: 0, plantsCount: 0 });
                        }
                    } catch (error) {
                        console.error("Erreur:", error);
                        setStats({ topicsCount: 0, commentsCount: 0, plantsCount: 0 });
                    }
                    setLoading(false);
                }
            };
            loadUserData();
        }, [isLogin])
    );

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel'
                },
                {
                    text: 'Déconnexion',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    if (!isLogin) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil</Text>
                </View>

                <View style={styles.notLoggedInContainer}>
                    <Ionicons name="person-circle-outline" size={100} color="#ccc" />
                    <Text style={styles.notLoggedInTitle}>Non connecté</Text>
                    <Text style={styles.notLoggedInText}>
                        Connectez-vous pour accéder à votre profil
                    </Text>
                    <TouchableOpacity 
                        style={styles.loginButton}
                        onPress={() => router.push('/auth/login')}
                    >
                        <Text style={styles.loginButtonText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#10b981" />
                </View>
            </View>
        );
    }

    console.log("Affichage des stats:", stats); // Debug

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Ionicons name="settings-outline" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Carte profil utilisateur */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={50} color="#10b981" />
                        </View>
                    </View>
                    <Text style={styles.userName}>{user?.name || 'Utilisateur'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                {/* Statistiques - Affichage debug */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="create-outline" size={28} color="#10b981" />
                        <Text style={styles.statNumber}>
                            {stats ? stats.topicsCount : '?'}
                        </Text>
                        <Text style={styles.statLabel}>Topics créés</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="chatbubbles-outline" size={28} color="#10b981" />
                        <Text style={styles.statNumber}>
                            {stats ? stats.commentsCount : '?'}
                        </Text>
                        <Text style={styles.statLabel}>Réponses</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="leaf-outline" size={28} color="#10b981" />
                        <Text style={styles.statNumber}>
                            {stats ? stats.plantsCount : '?'}
                        </Text>
                        <Text style={styles.statLabel}>Plantes</Text>
                    </View>
                </View>

                {/* Menu options */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Mon compte</Text>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/topics')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="document-text-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Mes topics</Text>
                        </View>
                        <View style={styles.menuItemRight}>
                            {stats && stats.topicsCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{stats.topicsCount}</Text>
                                </View>
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/comments')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="chatbubble-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Mes réponses</Text>
                        </View>
                        <View style={styles.menuItemRight}>
                            {stats && stats.commentsCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{stats.commentsCount}</Text>
                                </View>
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/(tabs)/garden')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="leaf-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Mon jardin</Text>
                        </View>
                        <View style={styles.menuItemRight}>
                            {stats && stats.plantsCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{stats.plantsCount}</Text>
                                </View>
                            )}
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Menu paramètres */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Paramètres</Text>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="person-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Modifier le profil</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/notifications')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Notifications</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/profile/privacy')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="lock-closed-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Confidentialité</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Menu aide */}
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    
                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/(tabs)/profile/help')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="help-circle-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Aide</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.menuItem}
                        onPress={() => router.push('/(tabs)/profile/about')}
                    >
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="information-circle-outline" size={24} color="#333" />
                            <Text style={styles.menuItemText}>À propos</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Bouton déconnexion */}
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                    <Text style={styles.logoutButtonText}>Se déconnecter</Text>
                </TouchableOpacity>

                {/* Version */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#10b981',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notLoggedInContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    notLoggedInTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    notLoggedInText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    loginButton: {
        backgroundColor: '#10b981',
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    profileCard: {
        backgroundColor: 'white',
        padding: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e5f5f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#10b981',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000',
        marginBottom: 5,
    },
    userEmail: {
        fontSize: 16,
        color: '#666',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginTop: 8,
        paddingVertical: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-around',
        gap: 10,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#10b981',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    menuSection: {
        backgroundColor: 'white',
        marginTop: 8,
        paddingVertical: 10,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        paddingHorizontal: 20,
        paddingVertical: 10,
        letterSpacing: 0.5,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    menuItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    badge: {
        backgroundColor: '#10b981',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: 'white',
        marginTop: 20,
        marginHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    logoutButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ef4444',
    },
    versionText: {
        textAlign: 'center',
        color: '#999',
        fontSize: 12,
        marginVertical: 30,
    },
});
