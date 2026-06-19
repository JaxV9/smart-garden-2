import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from '@/contexts/language.context';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: Omit<SearchBarProps, 'placeholder'> & { placeholder?: string }) {
    const { t } = useTranslation();
    const resolvedPlaceholder = placeholder ?? t('forum_search_placeholder');
    return (
        <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color="#666" />
            <TextInput
                style={styles.searchInput}
                placeholder={resolvedPlaceholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#111827"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#e5e5e5',
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
});
