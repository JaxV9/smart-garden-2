import { VegetableCard } from '@/components/new/vegetablesList/vegetable/vegetable';
import { VegetablesList } from '@/components/new/vegetablesList/vegetableList';
import { useVegetablesContext } from '@/contexts/vegetables.context';
import { useVegetable } from '@/hooks/useVegetable';
import { Vegetable } from '@/models/models';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Header  } from "@/components/new/header/header";
import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type FilterKey = 'category' | 'difficulty' | 'watering' | 'sun_exposure';

const FILTER_LABELS: Record<FilterKey, string> = {
  category: 'Catégorie',
  difficulty: 'Difficulté',
  watering: 'Arrosage',
  sun_exposure: 'Exposition',
};

const FILTER_KEYS: FilterKey[] = ['category', 'difficulty', 'watering', 'sun_exposure'];

export default function Index() {
  const { vegetablesContext } = useVegetablesContext();
  const { loadVegetables } = useVegetable();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<FilterKey, string | null>>({
    category: null,
    difficulty: null,
    watering: null,
    sun_exposure: null,
  });

  useEffect(() => {
    if (vegetablesContext.length === 0) {
      loadVegetables();
    }
  }, [vegetablesContext.length]);

  const filterOptions = useMemo(() => {
    const uniqueSorted = (values: string[]) =>
      [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));

    return {
      category: uniqueSorted(vegetablesContext.flatMap((vegetable) => vegetable.category ?? [])),
      difficulty: uniqueSorted(vegetablesContext.map((vegetable) => vegetable.difficulty)),
      watering: uniqueSorted(vegetablesContext.map((vegetable) => vegetable.watering)),
      sun_exposure: uniqueSorted(vegetablesContext.map((vegetable) => vegetable.sun_exposure)),
    } satisfies Record<FilterKey, string[]>;
  }, [vegetablesContext]);

  const filteredVegetables = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return vegetablesContext.filter((vegetable: Vegetable) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        vegetable.name.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        !selectedFilters.category ||
        (vegetable.category ?? []).includes(selectedFilters.category);

      const matchesDifficulty =
        !selectedFilters.difficulty ||
        vegetable.difficulty === selectedFilters.difficulty;

      const matchesWatering =
        !selectedFilters.watering ||
        vegetable.watering === selectedFilters.watering;

      const matchesSunExposure =
        !selectedFilters.sun_exposure ||
        vegetable.sun_exposure === selectedFilters.sun_exposure;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesWatering &&
        matchesSunExposure
      );
    });
  }, [searchQuery, selectedFilters, vegetablesContext]);

  const activeFiltersCount = FILTER_KEYS.filter((key) => selectedFilters[key]).length;
  const activeFilters = FILTER_KEYS.flatMap((key) =>
    selectedFilters[key]
      ? [{ key, label: FILTER_LABELS[key], value: selectedFilters[key] as string }]
      : []
  );

  const toggleFilter = (key: FilterKey, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: prev[key] === value ? null : value,
    }));
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: null,
      difficulty: null,
      watering: null,
      sun_exposure: null,
    });
  };

  return (
    <View style={styles.screen}>
      <Header/>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Rechercher"
            placeholderTextColor="#111827"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filtersBar}>
          <TouchableOpacity
            style={styles.filtersButton}
            activeOpacity={0.85}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={18} color="#5A7F54" />
            <Text style={styles.filtersButtonText}>
              Filtres
              {activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}
            </Text>
          </TouchableOpacity>

          {activeFiltersCount > 0 && (
            <Pressable onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Réinitialiser</Text>
            </Pressable>
          )}
        </View>

        {activeFilters.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersRow}
          >
            {activeFilters.map((filter) => (
              <View key={`${filter.key}-${filter.value}`} style={styles.activeFilterChip}>
                <Text style={styles.activeFilterChipText}>
                  {filter.label} : {filter.value}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}

        <VegetablesList>
          {filteredVegetables.map((vegetable) => (
            <VegetableCard
              key={vegetable.id}
              vegetable={vegetable}
              callBack={() => router.push(`/vegetable/${vegetable.id}`)}
            />
          ))}
        </VegetablesList>

        {filteredVegetables.length === 0 && (
          <Text style={styles.empty}>Aucune plante trouvée.</Text>
        )}
      </ScrollView>

      <Modal
        visible={isFilterModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtrer la documentation</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalBodyContent}>
              {FILTER_KEYS.map((key) => (
                <View key={key} style={styles.modalFilterSection}>
                  <Text style={styles.modalFilterLabel}>{FILTER_LABELS[key]}</Text>
                  <View style={styles.modalOptionsWrap}>
                    {filterOptions[key].map((option) => {
                      const isSelected = selectedFilters[key] === option;

                      return (
                        <Pressable
                          key={`${key}-${option}`}
                          onPress={() => toggleFilter(key, option)}
                          style={[
                            styles.modalFilterChip,
                            isSelected && styles.modalFilterChipSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalFilterChipText,
                              isSelected && styles.modalFilterChipTextSelected,
                            ]}
                          >
                            {option}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalResetButton} onPress={clearFilters}>
                <Text style={styles.modalResetButtonText}>Réinitialiser</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyButton}
                onPress={() => setIsFilterModalVisible(false)}
              >
                <Text style={styles.modalApplyButtonText}>Fermer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 14,
  },

  searchBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  filtersBar: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filtersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECF3EA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CFE0CB',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filtersButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#355E32',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A7F54',
  },
  clearButton: {
    paddingVertical: 6,
  },
  activeFiltersRow: {
    gap: 10,
    paddingRight: 6,
  },
  activeFilterChip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D8E3D5',
  },
  activeFilterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#355E32',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '82%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalBody: {
    minHeight: 0,
  },
  modalBodyContent: {
    padding: 20,
    gap: 18,
  },
  modalFilterSection: {
    gap: 10,
  },
  modalFilterLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
  },
  modalOptionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  modalFilterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: '#F8FAF8',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  modalFilterChipSelected: {
    backgroundColor: '#5A7F54',
    borderColor: '#5A7F54',
  },
  modalFilterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  modalFilterChipTextSelected: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalResetButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  modalResetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalApplyButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: '#5A7F54',
  },
  modalApplyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  empty: {
    marginTop: 20,
    textAlign: 'center',
    color: '#6B7280',
  },
});
