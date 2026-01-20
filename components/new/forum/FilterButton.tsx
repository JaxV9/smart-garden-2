import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FilterButtonProps {
    selectedTagName?: string;
    onPress: () => void;
}

export default function FilterButton({ selectedTagName, onPress }: FilterButtonProps) {
    return (
        <TouchableOpacity style={styles.filterContainer} onPress={onPress}>
            <Ionicons name="filter-outline" size={18} color="#333" />
            <Text style={styles.filterText}>
                {selectedTagName || 'Toutes les catégories'}
            </Text>
            <Ionicons name="chevron-down-outline" size={18} color="#333" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        gap: 10,
    },
    filterText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
