import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useRef, useEffect } from 'react';
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
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { useTour } from '@/contexts/tour.context';

export default function GardenInfoScreen() {
  const { gardenInfo, updateGardenInfo } = useGardenContext();
  const { saveGardenInfo } = useGardenInfo();
  const { registerElement, step } = useTour();

  const formRef = useRef<View>(null);

  const measureAll = () => {
    setTimeout(() => {
      formRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('profile_garden_details', { x, y, width: w, height: h });
      });
    }, 320);
  };

  useEffect(() => {
    measureAll();
  }, [step]);

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
        <View 
          ref={formRef}
          onLayout={measureAll}
          style={styles.form}
        >
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
  background: '#F9FAFB',
  textDark: '#1F2937',
  textMuted: '#6B7280',
  inputBg: '#FFFFFF',
  border: '#E5E7EB',
  primary: '#5A7F54',
  icon: '#9CA3AF',
  placeholder: '#9CA3AF',
  chipBg: '#EBF6EB',
  chipText: '#5A7F54',
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
    fontWeight: '800',
    color: COLORS.textDark,
  },
  gardenTitle: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
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
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 50,
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
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(90, 127, 84, 0.08)',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '700',
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
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  addButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '700',
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
