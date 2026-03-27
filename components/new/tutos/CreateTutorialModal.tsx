import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreateTutorialModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (tutorialData: any) => Promise<void>;
}

export default function CreateTutorialModal({ visible, onClose, onSubmit }: CreateTutorialModalProps) {
    const [type, setType] = useState<'VIDEO' | 'ARTICLE'>('ARTICLE');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<'ASTUCES' | 'DIY' | 'TECHNIQUES'>('ASTUCES');
    const [videoUrl, setVideoUrl] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            alert('Veuillez entrer un titre');
            return;
        }

        if (type === 'VIDEO' && !videoUrl.trim()) {
            alert('Veuillez entrer une URL de vidéo');
            return;
        }

        if (type === 'ARTICLE' && !content.trim()) {
            alert('Veuillez entrer le contenu de l\'article');
            return;
        }

        setSubmitting(true);
        const tutorialData = {
            title,
            description,
            type,
            category,
            ...(type === 'VIDEO' ? { videoUrl } : { content }),
            images: [],
        };

        await onSubmit(tutorialData);
        resetForm();
        setSubmitting(false);
    };

    const resetForm = () => {
        setType('ARTICLE');
        setTitle('');
        setDescription('');
        setCategory('ASTUCES');
        setVideoUrl('');
        setContent('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Publier un tutoriel</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        {/* Type selection */}
                        <Text style={styles.label}>Type</Text>
                        <View style={styles.typeSelector}>
                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'VIDEO' && styles.typeButtonActive,
                                ]}
                                onPress={() => setType('VIDEO')}
                            >
                                <Ionicons
                                    name="videocam"
                                    size={20}
                                    color={type === 'VIDEO' ? 'white' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        type === 'VIDEO' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    Vidéo
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.typeButton,
                                    type === 'ARTICLE' && styles.typeButtonActive,
                                ]}
                                onPress={() => setType('ARTICLE')}
                            >
                                <Ionicons
                                    name="document-text"
                                    size={20}
                                    color={type === 'ARTICLE' ? 'white' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.typeButtonText,
                                        type === 'ARTICLE' && styles.typeButtonTextActive,
                                    ]}
                                >
                                    Article
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Titre */}
                        <Text style={styles.label}>Titre</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Comment réussir ses tomates"
                            value={title}
                            onChangeText={setTitle}
                            placeholderTextColor="#111827"
                        />

                        {/* Description */}
                        <Text style={styles.label}>Description (optionnel)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Courte description du tutoriel..."
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            textAlignVertical="top"
                            placeholderTextColor="#111827"
                        />

                        {/* Catégorie */}
                        <Text style={styles.label}>Catégorie</Text>
                        <View style={styles.categorySelector}>
                            {['ASTUCES', 'DIY', 'TECHNIQUES'].map((cat) => (
                                <TouchableOpacity
                                    key={cat}
                                    style={[
                                        styles.categoryButton,
                                        category === cat && styles.categoryButtonActive,
                                    ]}
                                    onPress={() => setCategory(cat as any)}
                                >
                                    <Text
                                        style={[
                                            styles.categoryButtonText,
                                            category === cat && styles.categoryButtonTextActive,
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Champs spécifiques au type */}
                        {type === 'VIDEO' ? (
                            <>
                                <Text style={styles.label}>URL de la vidéo</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="https://youtube.com/..."
                                    value={videoUrl}
                                    onChangeText={setVideoUrl}
                                    placeholderTextColor="#111827"
                                    autoCapitalize="none"
                                />
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Contenu</Text>
                                <TextInput
                                    style={[styles.input, styles.contentArea]}
                                    placeholder="Rédigez votre article..."
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    numberOfLines={10}
                                    textAlignVertical="top"
                                    placeholderTextColor="#111827"
                                />
                            </>
                        )}
                    </ScrollView>

                    <TouchableOpacity
                        style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.submitButtonText}>Publier</Text>
                        )}
                    </TouchableOpacity>
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
    modalBody: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        marginTop: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
    },
    textArea: {
        minHeight: 80,
        paddingTop: 12,
    },
    contentArea: {
        minHeight: 200,
        paddingTop: 12,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    typeButtonActive: {
        backgroundColor: '#5B8E55',
        borderColor: '#5B8E55',
    },
    typeButtonText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#666',
    },
    typeButtonTextActive: {
        color: 'white',
    },
    categorySelector: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#e5e5e5',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    categoryButtonActive: {
        backgroundColor: '#5B8E55',
        borderColor: '#5B8E55',
    },
    categoryButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    categoryButtonTextActive: {
        color: 'white',
    },
    submitButton: {
        backgroundColor: '#5B8E55',
        margin: 20,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});
