import CreateTutorialModal from '@/components/new/tutos/CreateTutorialModal';
import TutorialFilterButton from '@/components/new/tutos/TutorialFilterButton';
import TutorialFilterModal from '@/components/new/tutos/TutorialFilterModal';
import TutorialList from '@/components/new/tutos/TutorialList';
import { useTutorialsContext } from '@/contexts/tutorials.context';
import { TutorialCategory, TutorialType, useTutorials } from '@/hooks/useTutorials';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export const TrueTutos = () => {
    const router = useRouter();
    const { tutorials } = useTutorialsContext();
    const { loadTutorials, createTutorial, toggleLike } = useTutorials();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | null>(null);
    const [selectedType, setSelectedType] = useState<TutorialType | null>(null);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    useEffect(() => {
        loadData();
    }, [selectedCategory, selectedType]);

    const loadData = async () => {
        setLoading(true);
        await loadTutorials(
            selectedCategory || undefined,
            selectedType || undefined
        );
        setLoading(false);
    };

    const handleCreateTutorial = async (tutorialData: any) => {
        const result = await createTutorial(tutorialData);
        if (result === 'Success') {
            setCreateModalVisible(false);
        } else {
            alert('Erreur lors de la création du tutoriel');
        }
    };

    const handleLike = async (tutorialId: string) => {
        await toggleLike(tutorialId);
    };

    const handleTutorialPress = (tutorialId: string) => {
        // Navigation vers la page de détail du tutoriel
        router.push({
            pathname: '/tutos/[id]',
            params: { id: tutorialId }
        });
    };

    const handleFilterApply = (category: TutorialCategory | null, type: TutorialType | null) => {
        setSelectedCategory(category);
        setSelectedType(type);
        setFilterModalVisible(false);
    };

    const filteredTutorials = tutorials.filter(tutorial =>
        tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setCreateModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="white" />
                    <Text style={styles.createButtonText}>Publier un tutoriel</Text>
                </TouchableOpacity>

                {/* Barre de recherche */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#666" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un tutoriel..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#111827"
                    />
                </View>

                {/* Bouton de filtres */}
                <TutorialFilterButton
                    selectedCategory={selectedCategory}
                    selectedType={selectedType}
                    onPress={() => setFilterModalVisible(true)}
                />

                <TutorialList
                    tutorials={filteredTutorials}
                    loading={loading}
                    onLike={handleLike}
                    onPress={handleTutorialPress}
                />
            </ScrollView>

            {/* Modal de filtres */}
            <TutorialFilterModal
                visible={filterModalVisible}
                selectedCategory={selectedCategory}
                selectedType={selectedType}
                onClose={() => setFilterModalVisible(false)}
                onApply={handleFilterApply}
            />

            <CreateTutorialModal
                visible={createModalVisible}
                onClose={() => setCreateModalVisible(false)}
                onSubmit={handleCreateTutorial}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    createButton: {
        backgroundColor: '#5B8E55',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
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
