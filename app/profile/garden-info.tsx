import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGardenContext } from '@/contexts/garden.context';
import { useGardenInfo } from '../../hooks/useGardenInfo';

export default function GardenInfoScreen() {
  const { gardenInfo, updateGardenInfo } = useGardenContext();
  const { saveGardenInfo } = useGardenInfo();

  const [gardenName, setGardenName] = useState(gardenInfo.name ?? 'Mon Jardin');
  const [location, setLocation] = useState(gardenInfo.location ?? '');
  const [sections, setSections] = useState<string[]>(
    gardenInfo.sections?.length ? gardenInfo.sections : ['Potager principal']
  );
  const [newSection, setNewSection] = useState('');

  const handleGoBack = () => router.back();

  const handleClearGardenName = () => setGardenName('');
  const handleClearLocation = () => setLocation('');
  const handleClearNewSection = () => setNewSection('');

  const handleAddSection = () => {
    const trimmed = newSection.trim();
    if (!trimmed) return;
    if (sections.includes(trimmed)) return;

    setSections((prev) => [...prev, trimmed]);
    setNewSection('');
  };

  const handleSave = async () => {
    // 1) Update local UI
    updateGardenInfo({
      name: gardenName,
      location,
      sections, // UI seulement (pas dans DB)
    });

    // 2) Save in DB (name + location)
    const status = await saveGardenInfo({
      name: gardenName,
      location,
    });

    if (status === "Failure") {
      Alert.alert("Erreur", "Impossible d'enregistrer les informations du jardin.");
      return;
    }

    Alert.alert('Succès', 'Les informations du jardin ont été enregistrées.');
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleGoBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="arrow-left" size={22} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Informations du jardin</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Title */}
        <Text style={styles.gardenTitle}>{gardenName || 'Mon Jardin'}</Text>

        {/* Form */}
        <View style={styles.form}>
          {/* garden name */}
          <View style={styles.field}>
            <Text style={styles.label}>Nom du jardin</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={gardenName}
                onChangeText={setGardenName}
                placeholder="Nom du jardin"
                placeholderTextColor={COLORS.placeholder}
              />
              {gardenName.length > 0 && (
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={handleClearGardenName}
                >
                  <Feather name="x" size={16} color={COLORS.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Location */}
          <View style={styles.field}>
            <Text style={styles.label}>Localisation</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="Ville / Région"
                placeholderTextColor={COLORS.placeholder}
              />
              {location.length > 0 && (
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={handleClearLocation}
                >
                  <Feather name="x" size={16} color={COLORS.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Garden Sections (UI only) */}
          <View style={styles.field}>
            <Text style={styles.label}>Sections du jardin</Text>
            <View style={styles.chipsRow}>
              {sections.map((section) => (
                <View key={section} style={styles.chip}>
                  <Text style={styles.chipText}>{section}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Add a custom section (UI only) */}
          <View style={styles.field}>
            <Text style={styles.label}>Ajouter une section personnalisée</Text>
            <View style={styles.addRow}>
              <View style={[styles.inputWrapper, styles.addInputWrapper]}>
                <TextInput
                  style={styles.input}
                  value={newSection}
                  onChangeText={setNewSection}
                  placeholder="Nom de la section"
                  placeholderTextColor={COLORS.placeholder}
                />
                {newSection.length > 0 && (
                  <TouchableOpacity
                    style={styles.rightIconButton}
                    onPress={handleClearNewSection}
                  >
                    <Feather name="x" size={16} color={COLORS.icon} />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.addButton}
                activeOpacity={0.8}
                onPress={handleAddSection}
              >
                <Text style={styles.addButtonText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>ENREGISTRER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#FFFFFF',
  textDark: '#111827',
  textMuted: '#6B7280',
  inputBg: '#F9FAFB',
  border: '#E5E7EB',
  primary: '#4F8F46',
  icon: '#9CA3AF',
  placeholder: '#9CA3AF',
  chipBg: '#111827',
  chipText: '#FFFFFF',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  gardenTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginBottom: 24,
  },
  form: {
    marginBottom: 32,
    gap: 16,
  },
  field: {
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  rightIconButton: {
    marginLeft: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.chipText,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addInputWrapper: {
    flex: 1,
  },
  addButton: {
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textDark,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  saveButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 1,
  },
});
