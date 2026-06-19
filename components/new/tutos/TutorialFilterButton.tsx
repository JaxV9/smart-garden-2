import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from '@/contexts/language.context';

interface TutorialFilterButtonProps {
    selectedCategory: string | null;
    selectedType: string | null;
    onPress: () => void;
}

export default function TutorialFilterButton({ 
    selectedCategory, 
    selectedType, 
    onPress 
}: TutorialFilterButtonProps) {
    const { t } = useTranslation();
    const getFilterText = () => {
        if (selectedCategory && selectedType) {
            return `${selectedCategory} • ${selectedType === 'VIDEO' ? t('tutos_filter_videos') : t('tutos_filter_articles')}`;
        }
        if (selectedCategory) {
            return selectedCategory;
        }
        if (selectedType) {
            return selectedType === 'VIDEO' ? t('tutos_filter_videos') : t('tutos_filter_articles');
        }
        return t('tutos_all_tutos');
    };

    const hasFilters = selectedCategory || selectedType;

    return (
        <TouchableOpacity style={styles.filterButton} onPress={onPress}>
            <View style={styles.filterContent}>
                <Ionicons 
                    name="filter-outline" 
                    size={18} 
                    color={hasFilters ? '#5B8E55' : '#666'} 
                />
                <Text style={[
                    styles.filterText,
                    hasFilters && styles.filterTextActive
                ]}>
                    {getFilterText()}
                </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
    },
    filterContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    filterText: {
        fontSize: 15,
        color: '#666',
    },
    filterTextActive: {
        color: '#5B8E55',
        fontWeight: '500',
    },
});
