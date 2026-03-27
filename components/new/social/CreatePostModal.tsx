import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CreatePostModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (content: string, images: string[]) => Promise<void>;
}

export default function CreatePostModal({ visible, onClose, onSubmit }: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert('Veuillez écrire quelque chose');
            return;
        }

        setSubmitting(true);
        await onSubmit(content, images);
        setContent('');
        setImages([]);
        setSubmitting(false);
    };

    const handleClose = () => {
        setContent('');
        setImages([]);
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
                        <Text style={styles.modalTitle}>Partager une réussite</Text>
                        <TouchableOpacity onPress={handleClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        <TextInput
                            style={styles.textArea}
                            placeholder="Partagez vos réussites, vos récoltes..."
                            value={content}
                            onChangeText={setContent}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            placeholderTextColor="#111827"
                        />

                        {images.length > 0 && (
                            <View style={styles.imagesPreview}>
                                {images.map((image, index) => (
                                    <View key={index} style={styles.imagePreviewContainer}>
                                        <Image source={{ uri: image }} style={styles.imagePreview} />
                                        <TouchableOpacity
                                            style={styles.removeImageButton}
                                            onPress={() => setImages(images.filter((_, i) => i !== index))}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#ef4444" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        <TouchableOpacity style={styles.addImageButton}>
                            <Ionicons name="image-outline" size={24} color="#5B8E55" />
                            <Text style={styles.addImageText}>Ajouter une photo</Text>
                        </TouchableOpacity>
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
    textArea: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        minHeight: 150,
        color: '#333',
        marginBottom: 16,
    },
    imagesPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 16,
    },
    imagePreviewContainer: {
        position: 'relative',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addImageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 16,
        backgroundColor: '#f0fdf4',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#5B8E55',
        borderStyle: 'dashed',
    },
    addImageText: {
        fontSize: 16,
        color: '#5B8E55',
        fontWeight: '500',
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
