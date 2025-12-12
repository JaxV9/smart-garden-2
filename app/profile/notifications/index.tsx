import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function Notifications() {
    const router = useRouter();
    const [pushEnabled, setPushEnabled] = useState(true);
    const [emailEnabled, setEmailEnabled] = useState(false);
    const [commentsEnabled, setCommentsEnabled] = useState(true);
    const [mentionsEnabled, setMentionsEnabled] = useState(true);
    const [updatesEnabled, setUpdatesEnabled] = useState(false);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Paramètres généraux</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="notifications" size={24} color="#10b981" />
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Notifications push</Text>
                                <Text style={styles.settingDescription}>
                                    Recevoir des notifications sur votre appareil
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={pushEnabled}
                            onValueChange={setPushEnabled}
                            trackColor={{ false: '#ccc', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="mail" size={24} color="#10b981" />
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Notifications par email</Text>
                                <Text style={styles.settingDescription}>
                                    Recevoir un résumé quotidien par email
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={emailEnabled}
                            onValueChange={setEmailEnabled}
                            trackColor={{ false: '#ccc', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Activités du forum</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="chatbubble" size={24} color="#10b981" />
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Réponses à mes topics</Text>
                                <Text style={styles.settingDescription}>
                                    Quand quelqu'un répond à vos topics
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={commentsEnabled}
                            onValueChange={setCommentsEnabled}
                            trackColor={{ false: '#ccc', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="at" size={24} color="#10b981" />
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Mentions</Text>
                                <Text style={styles.settingDescription}>
                                    Quand quelqu'un vous mentionne
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={mentionsEnabled}
                            onValueChange={setMentionsEnabled}
                            trackColor={{ false: '#ccc', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Autres</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingInfo}>
                            <Ionicons name="sparkles" size={24} color="#10b981" />
                            <View style={styles.settingText}>
                                <Text style={styles.settingTitle}>Nouveautés et conseils</Text>
                                <Text style={styles.settingDescription}>
                                    Conseils pour mieux utiliser l'app
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={updatesEnabled}
                            onValueChange={setUpdatesEnabled}
                            trackColor={{ false: '#ccc', true: '#10b981' }}
                            thumbColor="#fff"
                        />
                    </View>
                </View>
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
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
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
    section: {
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
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 15,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
});
