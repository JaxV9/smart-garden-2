import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type TutorialCategory = 'ASTUCES' | 'DIY' | 'TECHNIQUES';
type TutorialType = 'VIDEO' | 'ARTICLE';

interface CategoryFilterProps {
    selectedCategory: TutorialCategory | null;
    selectedType: TutorialType | null;
    onCategoryChange: (category: TutorialCategory | null) => void;
    onTypeChange: (type: TutorialType | null) => void;
}

export default function CategoryFilter({
    selectedCategory,
    selectedType,
    onCategoryChange,
    onTypeChange,
}: CategoryFilterProps) {
    const categories: (TutorialCategory | null)[] = [null, 'ASTUCES', 'DIY', 'TECHNIQUES'];
    const types: (TutorialType | null)[] = [null, 'VIDEO', 'ARTICLE'];

    const getCategoryLabel = (category: TutorialCategory | null) => {
        if (!category) return 'Toutes';
        return category;
    };

    const getTypeLabel = (type: TutorialType | null) => {
        if (!type) return 'Tous types';
        return type === 'VIDEO' ? 'Vidéos' : 'Articles';
    };

    return (
        <View style={styles.container}>
            {/* Filtres de catégorie */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Catégorie</Text>
                <View style={styles.filterButtons}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat || 'all'}
                            style={[
                                styles.filterButton,
                                selectedCategory === cat && styles.filterButtonActive,
                            ]}
                            onPress={() => onCategoryChange(cat)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedCategory === cat && styles.filterButtonTextActive,
                                ]}
                            >
                                {getCategoryLabel(cat)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Filtres de type */}
            <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Type</Text>
                <View style={styles.filterButtons}>
                    {types.map((type) => (
                        <TouchableOpacity
                            key={type || 'all'}
                            style={[
                                styles.filterButton,
                                selectedType === type && styles.filterButtonActive,
                            ]}
                            onPress={() => onTypeChange(type)}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedType === type && styles.filterButtonTextActive,
                                ]}
                            >
                                {getTypeLabel(type)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    filterButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    filterButtonActive: {
        backgroundColor: '#10b981',
        borderColor: '#10b981',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    filterButtonTextActive: {
        color: 'white',
    },
});
