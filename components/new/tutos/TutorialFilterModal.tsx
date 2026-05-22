import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

type TutorialCategory = 'ASTUCES' | 'DIY' | 'TECHNIQUES';
type TutorialType = 'VIDEO' | 'ARTICLE';

interface TutorialFilterModalProps {
    visible: boolean;
    selectedCategory: TutorialCategory | null;
    selectedType: TutorialType | null;
    onClose: () => void;
    onApply: (category: TutorialCategory | null, type: TutorialType | null) => void;
}

export default function TutorialFilterModal({
    visible,
    selectedCategory,
    selectedType,
    onClose,
    onApply,
}: TutorialFilterModalProps) {
    const [tempCategory, setTempCategory] = useState<TutorialCategory | null>(selectedCategory);
    const [tempType, setTempType] = useState<TutorialType | null>(selectedType);

    const categories: (TutorialCategory | null)[] = [null, 'ASTUCES', 'DIY', 'TECHNIQUES'];
    const types: (TutorialType | null)[] = [null, 'VIDEO', 'ARTICLE'];

    const getCategoryLabel = (category: TutorialCategory | null) => {
        if (!category) return 'Toutes catégories';
        return category;
    };

    const getTypeLabel = (type: TutorialType | null) => {
        if (!type) return 'Tous types';
        return type === 'VIDEO' ? 'Vidéos' : 'Articles';
    };

    const handleApply = () => {
        onApply(tempCategory, tempType);
    };

    const handleReset = () => {
        setTempCategory(null);
        setTempType(null);
        onApply(null, null);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalOverlay}>
                    <TouchableWithoutFeedback onPress={() => {}}>
                        <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Filtrer les tutoriels</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalBody}>
                        {/* Catégories */}
                        <Text style={styles.sectionTitle}>Catégorie</Text>
                        <View style={styles.optionsContainer}>
                            {categories.map((category) => (
                                <TouchableOpacity
                                    key={category || 'all-categories'}
                                    style={[
                                        styles.filterOption,
                                        tempCategory === category && styles.filterOptionActive,
                                    ]}
                                    onPress={() => setTempCategory(category)}
                                >
                                    <Text
                                        style={[
                                            styles.filterOptionText,
                                            tempCategory === category && styles.filterOptionTextActive,
                                        ]}
                                    >
                                        {getCategoryLabel(category)}
                                    </Text>
                                    {tempCategory === category && (
                                        <Ionicons name="checkmark" size={20} color="#5B8E55" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Types */}
                        <Text style={styles.sectionTitle}>Type</Text>
                        <View style={styles.optionsContainer}>
                            {types.map((type) => (
                                <TouchableOpacity
                                    key={type || 'all-types'}
                                    style={[
                                        styles.filterOption,
                                        tempType === type && styles.filterOptionActive,
                                    ]}
                                    onPress={() => setTempType(type)}
                                >
                                    <View style={styles.filterOptionContent}>
                                        {type && (
                                            <Ionicons
                                                name={type === 'VIDEO' ? 'videocam' : 'document-text'}
                                                size={20}
                                                color={tempType === type ? '#5B8E55' : '#666'}
                                            />
                                        )}
                                        <Text
                                            style={[
                                                styles.filterOptionText,
                                                tempType === type && styles.filterOptionTextActive,
                                            ]}
                                        >
                                            {getTypeLabel(type)}
                                        </Text>
                                    </View>
                                    {tempType === type && (
                                        <Ionicons name="checkmark" size={20} color="#5B8E55" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    <View style={styles.modalFooter}>
                        <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
                            <Text style={styles.resetButtonText}>Réinitialiser</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                            <Text style={styles.applyButtonText}>Appliquer</Text>
                        </TouchableOpacity>
                    </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
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
        maxHeight: '80%',
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
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
        marginTop: 8,
    },
    optionsContainer: {
        gap: 10,
        marginBottom: 20,
    },
    filterOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    filterOptionActive: {
        backgroundColor: '#f0fdf4',
        borderColor: '#5B8E55',
    },
    filterOptionContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    filterOptionText: {
        fontSize: 15,
        color: '#666',
    },
    filterOptionTextActive: {
        color: '#5B8E55',
        fontWeight: '500',
    },
    modalFooter: {
        flexDirection: 'row',
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        alignItems: 'center',
    },
    resetButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    applyButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#5B8E55',
        alignItems: 'center',
    },
    applyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: 'white',
    },
});
