import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Tag {
    id: string;
    name: string;
}

interface FilterModalProps {
    visible: boolean;
    tags: Tag[];
    selectedTagId: string | null;
    onClose: () => void;
    onSelectTag: (tagId: string | null) => void;
}

export default function FilterModal({ visible, tags, selectedTagId, onClose, onSelectTag }: FilterModalProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrer par catégorie</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalList}>
                        <TouchableOpacity
                            style={[styles.filterOption, !selectedTagId && styles.filterOptionSelected]}
                            onPress={() => onSelectTag(null)}
                        >
                            <Text style={[styles.filterOptionText, !selectedTagId && styles.filterOptionTextSelected]}>
                                Toutes les catégories
                            </Text>
                            {!selectedTagId && <Ionicons name="checkmark" size={20} color="#10b981" />}
                        </TouchableOpacity>

                        {tags.map((tag) => (
                            <TouchableOpacity
                                key={tag.id}
                                style={[styles.filterOption, selectedTagId === tag.id && styles.filterOptionSelected]}
                                onPress={() => onSelectTag(tag.id)}
                            >
                                <Text style={[styles.filterOptionText, selectedTagId === tag.id && styles.filterOptionTextSelected]}>
                                    {tag.name}
                                </Text>
                                {selectedTagId === tag.id && <Ionicons name="checkmark" size={20} color="#10b981" />}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 20,
        maxHeight: '70%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000',
    },
    modalList: {
        paddingHorizontal: 20,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterOptionSelected: {
        backgroundColor: '#f0fdf4',
    },
    filterOptionText: {
        fontSize: 16,
        color: '#333',
    },
    filterOptionTextSelected: {
        color: '#10b981',
        fontWeight: '600',
    },
});
