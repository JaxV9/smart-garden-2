import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function EmptyComments() {
    return (
        <View style={styles.noComments}>
            <Ionicons name="chatbubbles-outline" size={48} color="#ccc" />
            <Text style={styles.noCommentsText}>Aucune réponse pour le moment</Text>
            <Text style={styles.noCommentsSubtext}>Soyez le premier à répondre !</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    noComments: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    noCommentsText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
        fontWeight: '500',
    },
    noCommentsSubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
});
