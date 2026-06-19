import ForumHeader from '@/components/new/forum/ForumHeader';
import ForumTabs, { TabType } from '@/components/new/forum/ForumTabs';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppHeader from '@/components/new/ui/AppHeader';
import { useTranslation } from '@/contexts/language.context';

export default function TutosScreen() {
    const router = useRouter();
    const { t } = useTranslation();
    const { tutorials } = useTutorialsContext();
    const { loadTutorials, createTutorial, toggleLike } = useTutorials();

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<TutorialCategory | null>(null);
    const [selectedType, setSelectedType] = useState<TutorialType | null>(null);

    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);

    const [currentTab, setCurrentTab] = useState<TabType>('tutos');

    useEffect(() => {
        loadData();
    }, [selectedCategory, selectedType]);

    useEffect(() => {
        if (currentTab !== 'tutos') {
            router.push('/(tabs)/social');
        }
    }, [currentTab]);

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
            alert(t('tutos_create_error'));
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
        <SafeAreaProvider>
            <View style={styles.container}>
                <AppHeader
                    title={t('tab_documentation')}
                    showBack={true}
                    fallbackRoute="/home"
                />

                <ForumTabs activeTab={currentTab} setCurrentTab={setCurrentTab} />

                <ScrollView
                    style={styles.content}
                    contentContainerStyle={styles.scrollContent}
                >
                    <TouchableOpacity
                        style={styles.createButton}
                        onPress={() => setCreateModalVisible(true)}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text style={styles.createButtonText}>{t('tutos_publish_btn')}</Text>
                    </TouchableOpacity>

                    {/* Barre de recherche */}
                    <View style={styles.searchContainer}>
                        <Ionicons name="search-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('tutos_search_placeholder')}
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
            </View>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    scrollContent: {
        paddingBottom: 100,
        paddingTop: 12,
    },
    createButton: {
        backgroundColor: '#5A7F54',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#5A7F54',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    createButtonText: {
        color: 'white',
        fontSize: 15,
        fontWeight: '700',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 4,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2937',
    },
});
