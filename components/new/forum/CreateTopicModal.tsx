import { Ionicons } from '@expo/vector-icons';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Tag {
    id: string;
    name: string;
}

interface CreateTopicModalProps {
    visible: boolean;
    tags: Tag[];
    title: string;
    content: string;
    selectedTags: string[];
    onClose: () => void;
    onTitleChange: (text: string) => void;
    onContentChange: (text: string) => void;
    onToggleTag: (tagId: string) => void;
    onSubmit: () => void;
}

export default function CreateTopicModal({
    visible,
    tags,
    title,
    content,
    selectedTags,
    onClose,
    onTitleChange,
    onContentChange,
    onToggleTag,
    onSubmit,
}: CreateTopicModalProps) {
    const getTagStyle = (tagName: string, isSelected: boolean) => {
        if (!isSelected) return {};
        
        const tagStyles: Record<string, any> = {
            'Maladies': styles.tagMaladies,
            'Récolte': styles.tagRecolte,
            'Plantation': styles.tagPlantation,
            'Arrosage': styles.tagArrosage,
        };
        return tagStyles[tagName] || {};
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, styles.createModalContent]}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Poser une question</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.createForm}>
                        <Text style={styles.inputLabel}>Titre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Comment traiter le mildiou ?"
                            value={title}
                            onChangeText={onTitleChange}
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.inputLabel}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Décrivez votre question en détail..."
                            value={content}
                            onChangeText={onContentChange}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />

                        <Text style={styles.inputLabel}>Tags (optionnel)</Text>
                        <View style={styles.tagsSelection}>
                            {tags.map((tag) => (
                                <TouchableOpacity
                                    key={tag.id}
                                    style={[
                                        styles.selectableTag,
                                        selectedTags.includes(tag.id) && styles.selectableTagSelected,
                                        getTagStyle(tag.name, selectedTags.includes(tag.id)),
                                    ]}
                                    onPress={() => onToggleTag(tag.id)}
                                >
                                    <Text
                                        style={[
                                            styles.selectableTagText,
                                            selectedTags.includes(tag.id) && styles.selectableTagTextSelected,
                                        ]}
                                    >
                                        {tag.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
                            <Text style={styles.submitButtonText}>Publier la question</Text>
                        </TouchableOpacity>
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
    createModalContent: {
        maxHeight: '90%',
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
    createForm: {
        padding: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    textArea: {
        minHeight: 120,
        paddingTop: 12,
    },
    tagsSelection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    selectableTag: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectableTagSelected: {
        borderColor: '#333',
    },
    tagMaladies: { backgroundColor: '#bbf7d0' },
    tagRecolte: { backgroundColor: '#fde68a' },
    tagPlantation: { backgroundColor: '#fed7aa' },
    tagArrosage: { backgroundColor: '#ddd6fe' },
    selectableTagText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    selectableTagTextSelected: {
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
