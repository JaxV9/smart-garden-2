import AppHeader from '@/components/new/ui/AppHeader';
import { VegetableCard } from '@/components/new/vegetablesList/vegetable/vegetable';
import { VegetablesList } from '@/components/new/vegetablesList/vegetableList';
import { useVegetablesContext } from '@/contexts/vegetables.context';
import { useVegetable } from '@/hooks/useVegetable';
import { Vegetable } from '@/models/models';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/contexts/language.context';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type FilterKey = 'category' | 'difficulty' | 'sowing' | 'plantation' | 'harvest';

const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

interface AppliedFilters {
  categories: string[];
  difficulties: string[];
  sowingMonths: string[];
  sowingNow: boolean;
  plantationMonths: string[];
  plantationNow: boolean;
  harvestMonths: string[];
  harvestNow: boolean;
}

const getCurrentMonthFrench = () => {
  const monthsFr = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre',
  ];
  const currentMonthIndex = new Date().getMonth();
  return monthsFr[currentMonthIndex];
};

export default function Index() {
  const { t } = useTranslation();
  const { vegetablesContext } = useVegetablesContext();
  const { loadVegetables } = useVegetable();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    categories: [],
    difficulties: [],
    sowingMonths: [],
    sowingNow: false,
    plantationMonths: [],
    plantationNow: false,
    harvestMonths: [],
    harvestNow: false,
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);
  const [selectedSowingMonths, setSelectedSowingMonths] = useState<string[]>([]);
  const [sowingNow, setSowingNow] = useState(false);
  const [selectedPlantationMonths, setSelectedPlantationMonths] = useState<string[]>([]);
  const [plantationNow, setPlantationNow] = useState(false);
  const [selectedHarvestMonths, setSelectedHarvestMonths] = useState<string[]>([]);
  const [harvestNow, setHarvestNow] = useState(false);

  useEffect(() => {
    if (vegetablesContext.length === 0) {
      loadVegetables();
    }
  }, [vegetablesContext.length]);

  const dynamicCategories = useMemo(() => {
    const cats = vegetablesContext.flatMap((veg) => veg.category ?? []);
    return [...new Set(cats.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [vegetablesContext]);

  const dynamicDifficulties = useMemo(() => {
    const diffs = vegetablesContext.map((veg) => veg.difficulty);
    return [...new Set(diffs.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  }, [vegetablesContext]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    count += appliedFilters.categories.length;
    count += appliedFilters.difficulties.length;
    count += appliedFilters.sowingMonths.length;
    if (appliedFilters.sowingNow) count += 1;
    count += appliedFilters.plantationMonths.length;
    if (appliedFilters.plantationNow) count += 1;
    count += appliedFilters.harvestMonths.length;
    if (appliedFilters.harvestNow) count += 1;
    return count;
  }, [appliedFilters]);

  const modalFiltersCount = useMemo(() => {
    let count = 0;
    count += selectedCategories.length;
    count += selectedDifficulties.length;
    count += selectedSowingMonths.length;
    if (sowingNow) count += 1;
    count += selectedPlantationMonths.length;
    if (plantationNow) count += 1;
    count += selectedHarvestMonths.length;
    if (harvestNow) count += 1;
    return count;
  }, [
    selectedCategories,
    selectedDifficulties,
    selectedSowingMonths,
    sowingNow,
    selectedPlantationMonths,
    plantationNow,
    selectedHarvestMonths,
    harvestNow,
  ]);

  const filteredVegetables = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const currentMonthFr = getCurrentMonthFrench();

    return vegetablesContext.filter((vegetable: Vegetable) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        vegetable.name.toLowerCase().includes(normalizedQuery);

      const matchesCategory =
        appliedFilters.categories.length === 0 ||
        appliedFilters.categories.some((cat) => (vegetable.category ?? []).includes(cat));

      const matchesDifficulty =
        appliedFilters.difficulties.length === 0 ||
        appliedFilters.difficulties.includes(vegetable.difficulty);

      const matchesSowingNow =
        !appliedFilters.sowingNow ||
        vegetable.sowing?.map((s) => s.toLowerCase()).includes(currentMonthFr.toLowerCase());
      const matchesSowingMonths =
        appliedFilters.sowingMonths.length === 0 ||
        appliedFilters.sowingMonths.some((m) =>
          vegetable.sowing?.map((s) => s.toLowerCase()).includes(m.toLowerCase())
        );

      const matchesPlantationNow =
        !appliedFilters.plantationNow ||
        vegetable.plantation?.map((p) => p.toLowerCase()).includes(currentMonthFr.toLowerCase());
      const matchesPlantationMonths =
        appliedFilters.plantationMonths.length === 0 ||
        appliedFilters.plantationMonths.some((m) =>
          vegetable.plantation?.map((p) => p.toLowerCase()).includes(m.toLowerCase())
        );

      const matchesHarvestNow =
        !appliedFilters.harvestNow ||
        vegetable.harvest?.map((h) => h.toLowerCase()).includes(currentMonthFr.toLowerCase());
      const matchesHarvestMonths =
        appliedFilters.harvestMonths.length === 0 ||
        appliedFilters.harvestMonths.some((m) =>
          vegetable.harvest?.map((h) => h.toLowerCase()).includes(m.toLowerCase())
        );

      return (
        matchesSearch &&
        matchesCategory &&
        matchesDifficulty &&
        matchesSowingNow &&
        matchesSowingMonths &&
        matchesPlantationNow &&
        matchesPlantationMonths &&
        matchesHarvestNow &&
        matchesHarvestMonths
      );
    });
  }, [searchQuery, appliedFilters, vegetablesContext]);

  const handleOpenFilters = () => {
    setSelectedCategories([...appliedFilters.categories]);
    setSelectedDifficulties([...appliedFilters.difficulties]);
    setSelectedSowingMonths([...appliedFilters.sowingMonths]);
    setSowingNow(appliedFilters.sowingNow);
    setSelectedPlantationMonths([...appliedFilters.plantationMonths]);
    setPlantationNow(appliedFilters.plantationNow);
    setSelectedHarvestMonths([...appliedFilters.harvestMonths]);
    setHarvestNow(appliedFilters.harvestNow);
    setIsFilterModalVisible(true);
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      categories: [...selectedCategories],
      difficulties: [...selectedDifficulties],
      sowingMonths: [...selectedSowingMonths],
      sowingNow: sowingNow,
      plantationMonths: [...selectedPlantationMonths],
      plantationNow: plantationNow,
      harvestMonths: [...selectedHarvestMonths],
      harvestNow: harvestNow,
    });
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedSowingMonths([]);
    setSowingNow(false);
    setSelectedPlantationMonths([]);
    setPlantationNow(false);
    setSelectedHarvestMonths([]);
    setHarvestNow(false);
  };

  const handleClearAll = () => {
    setAppliedFilters({
      categories: [],
      difficulties: [],
      sowingMonths: [],
      sowingNow: false,
      plantationMonths: [],
      plantationNow: false,
      harvestMonths: [],
      harvestNow: false,
    });
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleDifficulty = (diff: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const toggleSowingMonth = (month: string) => {
    setSelectedSowingMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const togglePlantationMonth = (month: string) => {
    setSelectedPlantationMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const toggleHarvestMonth = (month: string) => {
    setSelectedHarvestMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  return (
    <View style={styles.screen}>
      <AppHeader title={t('tab_documentation')} showNotifications={true} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput
              placeholder={t('doc_search_placeholder', 'Rechercher...')}
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.roundFilterButton,
              activeFiltersCount > 0 && styles.roundFilterButtonActive,
            ]}
            activeOpacity={0.8}
            onPress={handleOpenFilters}
          >
            <Ionicons
              name="options-outline"
              size={22}
              color={activeFiltersCount > 0 ? '#FFFFFF' : '#2F6F3A'}
            />
          </TouchableOpacity>
        </View>

        {activeFiltersCount > 0 && (
          <View style={styles.filterSubRow}>
            <Text style={styles.filterCountSubtext}>
              {activeFiltersCount} {activeFiltersCount > 1 ? t('doc_filters_selected') : t('doc_filters_selected_single')}
            </Text>
            <TouchableOpacity onPress={handleClearAll} style={styles.resetTextBtn}>
              <Text style={styles.resetText}>{t('doc_filters_reset')}</Text>
            </TouchableOpacity>
          </View>
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
          <Text style={styles.empty}>{t('doc_empty')}</Text>
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
              <View style={{ width: 24 }} />
              <Text style={styles.modalTitle}>
                {t('doc_filters_title')}{modalFiltersCount > 0 ? ` (${modalFiltersCount})` : ''}
              </Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>{t('doc_filter_category')}</Text>
                <View style={styles.modalOptionsWrap}>
                  {dynamicCategories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => toggleCategory(cat)}
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
                          {t('cat_' + cat.replace(/\s+/g, '_').toLowerCase(), cat)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>{t('doc_filter_difficulty')}</Text>
                <View style={styles.modalOptionsWrap}>
                  {dynamicDifficulties.map((diff) => {
                    const isSelected = selectedDifficulties.includes(diff);
                    return (
                      <Pressable
                        key={diff}
                        onPress={() => toggleDifficulty(diff)}
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
                          {t('diff_' + diff.toLowerCase(), diff)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>{t('doc_filter_sowing_period')}</Text>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                  onPress={() => setSowingNow((prev) => !prev)}
                >
                  <Ionicons
                    name={sowingNow ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={sowingNow ? '#5A7F54' : '#9CA3AF'}
                  />
                  <Text style={styles.checkboxLabel}>{t('doc_filter_sowing_now')}</Text>
                </TouchableOpacity>

                <View style={styles.modalOptionsWrap}>
                  {MONTHS.map((month) => {
                    const isSelected = selectedSowingMonths.includes(month);
                    return (
                      <Pressable
                        key={`sowing-${month}`}
                        onPress={() => toggleSowingMonth(month)}
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
                          {t('month_' + month.toLowerCase(), month)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>{t('doc_filter_planting_period')}</Text>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                  onPress={() => setPlantationNow((prev) => !prev)}
                >
                  <Ionicons
                    name={plantationNow ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={plantationNow ? '#5A7F54' : '#9CA3AF'}
                  />
                  <Text style={styles.checkboxLabel}>{t('doc_filter_planting_now')}</Text>
                </TouchableOpacity>

                <View style={styles.modalOptionsWrap}>
                  {MONTHS.map((month) => {
                    const isSelected = selectedPlantationMonths.includes(month);
                    return (
                      <Pressable
                        key={`plant-${month}`}
                        onPress={() => togglePlantationMonth(month)}
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
                          {t('month_' + month.toLowerCase(), month)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              <View style={styles.modalFilterSection}>
                <Text style={styles.modalFilterLabel}>{t('doc_filter_harvest_period')}</Text>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  activeOpacity={0.8}
                  onPress={() => setHarvestNow((prev) => !prev)}
                >
                  <Ionicons
                    name={harvestNow ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={harvestNow ? '#5A7F54' : '#9CA3AF'}
                  />
                  <Text style={styles.checkboxLabel}>{t('doc_filter_harvest_now')}</Text>
                </TouchableOpacity>

                <View style={styles.modalOptionsWrap}>
                  {MONTHS.map((month) => {
                    const isSelected = selectedHarvestMonths.includes(month);
                    return (
                      <Pressable
                        key={`harvest-${month}`}
                        onPress={() => toggleHarvestMonth(month)}
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
                          {t('month_' + month.toLowerCase(), month)}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <View style={{ height: 32 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalResetButton}
                activeOpacity={0.7}
                onPress={handleResetFilters}
              >
                <Text style={styles.modalResetButtonText}>{t('doc_filters_reset')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalApplyButton}
                activeOpacity={0.8}
                onPress={handleApplyFilters}
              >
                <Text style={styles.modalApplyButtonText}>{t('doc_filters_apply')}</Text>
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
    backgroundColor: '#F9FAFB',
  },
  header: {
    height: 92,
    paddingTop: 44,
    paddingHorizontal: 18,
    backgroundColor: '#5A7F54',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  searchBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  roundFilterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#CFE0CB',
    backgroundColor: '#ECF3EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundFilterButtonActive: {
    backgroundColor: '#5A7F54',
    borderColor: '#5A7F54',
  },
  filterSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -4,
    paddingHorizontal: 4,
  },
  filterCountSubtext: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  resetTextBtn: {
    paddingVertical: 2,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A7F54',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalFilterSection: {
    marginBottom: 24,
    gap: 12,
  },
  modalFilterLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  checkboxLabel: {
    fontSize: 14,
    fontWeight: '600',
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
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  modalFilterChipSelected: {
    backgroundColor: '#EBF6EB',
    borderColor: 'rgba(90, 127, 84, 0.2)',
  },
  modalFilterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  modalFilterChipTextSelected: {
    color: '#5A7F54',
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
    backgroundColor: '#FFFFFF',
  },
  modalResetButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  modalResetButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
  },
  modalApplyButton: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#5A7F54',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5A7F54',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  modalApplyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  empty: {
    marginTop: 32,
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 15,
  },
});
