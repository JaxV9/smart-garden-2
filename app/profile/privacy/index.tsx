import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Privacy() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Confidentialité</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Données et confidentialité</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="shield-checkmark" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Politique de confidentialité</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="document-text" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Conditions d'utilisation</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="download" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Télécharger mes données</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Compte</Text>

                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="key" size={24} color="#333" />
                            <Text style={styles.menuItemText}>Changer le mot de passe</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, styles.dangerItem]}>
                        <View style={styles.menuItemLeft}>
                            <Ionicons name="trash" size={24} color="#ef4444" />
                            <Text style={[styles.menuItemText, styles.dangerText]}>
                                Supprimer mon compte
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ef4444" />
                    </TouchableOpacity>
                </View>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle" size={24} color="#5B8E55" />
                    <Text style={styles.infoText}>
                        Vos données sont protégées et ne sont jamais partagées avec des tiers sans votre consentement.
                    </Text>
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
        backgroundColor: '#5B8E55',
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
    menuItemText: {
        fontSize: 16,
        color: '#333',
    },
    dangerItem: {
        backgroundColor: '#fff5f5',
    },
    dangerText: {
        color: '#ef4444',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#e5f5f0',
        marginHorizontal: 20,
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
});
