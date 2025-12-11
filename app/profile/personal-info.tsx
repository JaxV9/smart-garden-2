// app/profile/personal-info.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/contexts/user.context';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

type ExperienceLevel = 'Débutant' | 'Intermédiaire' | 'Expert';

export default function PersonalInfoScreen() {
  const { user, updateAvatar, updateUser } = useUserContext(); // 🔹 on récupère updateUser ici

  const [pseudo, setPseudo] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [experience, setExperience] = useState<ExperienceLevel>('Débutant');
  const [password, setPassword] = useState<string>(''); // champ vide
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);

  const [avatarUri, setAvatarUri] = useState<string | undefined>(
    user?.avatarUri ?? undefined
  );

  // ---------- Actions ----------

  const handleGoBack = () => {
    router.back();
  };

  const handleChangeAvatar = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission refusée',
        "Nous avons besoin de l’accès aux photos pour changer votre avatar."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (result.canceled) return;

    const uri = result.assets[0].uri;
    setAvatarUri(uri);
    updateAvatar(uri);
  };

  const handleClearPseudo = () => setPseudo('');
  const handleClearEmail = () => setEmail('');

  const toggleExperienceDropdown = () => {
    setIsExperienceOpen((prev) => !prev);
  };

  const handleSelectExperience = (level: ExperienceLevel) => {
    setExperience(level);
    setIsExperienceOpen(false);
  };

  const handleChangePasswordPress = () => {
    Alert.alert(
      'Info',
      'Changer de mot de passe à faire plus tard.'
    );
  };

  const handleSave = () => {
    // Met à jour le User dans le contexte
    updateUser({
      name: pseudo || user?.name || '',
      email: email || user?.email || '',
    });

    console.log('Saving personal infos (front):', {
      pseudo,
      email,
      experience,
      password: password || undefined,
      avatarUri,
    });

    Alert.alert('Succès', 'Vos informations ont été mises à jour.');
  };

  const currentAvatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  // ---------- Rendu ----------

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
          <Text style={styles.headerTitle}>Informations personnelles</Text>
          <View style={{ width: 22 }} />
        </View>

        {/* Avatar + nom */}
        <TouchableOpacity
          style={styles.avatarContainer}
          activeOpacity={0.8}
          onPress={handleChangeAvatar}
        >
          <Image source={currentAvatarSource} style={styles.avatar} />
          <Text style={styles.avatarName}>
            {pseudo || user?.name || ''}
          </Text>
        </TouchableOpacity>

        {/* Champs */}
        <View style={styles.form}>
          {/* Pseudo */}
          <View style={styles.field}>
            <Text style={styles.label}>Pseudo</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="user"
                size={18}
                color={COLORS.icon}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                value={pseudo}
                onChangeText={setPseudo}
                placeholder="Votre pseudo"
                placeholderTextColor={COLORS.placeholder}
              />
              {pseudo.length > 0 && (
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={handleClearPseudo}
                >
                  <Feather name="x" size={16} color={COLORS.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="mail"
                size={18}
                color={COLORS.icon}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Votre email"
                placeholderTextColor={COLORS.placeholder}
              />
              {email.length > 0 && (
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={handleClearEmail}
                >
                  <Feather name="x" size={16} color={COLORS.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Niveau d'expérience */}
          <View style={styles.field}>
            <Text style={styles.label}>Niveau d&apos;expérience</Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              activeOpacity={0.8}
              onPress={toggleExperienceDropdown}
            >
              <Text style={[styles.input, styles.textOnlyInput]}>
                {experience}
              </Text>
              <Feather
                name={isExperienceOpen ? 'chevron-up' : 'chevron-down'}
                size={18}
                color={COLORS.icon}
                style={styles.rightIcon}
              />
            </TouchableOpacity>

            {isExperienceOpen && (
              <View style={styles.dropdown}>
                {(['Débutant', 'Intermédiaire', 'Expert'] as ExperienceLevel[]).map(
                  (level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.dropdownItem,
                        experience === level && styles.dropdownItemActive,
                      ]}
                      onPress={() => handleSelectExperience(level)}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          experience === level && styles.dropdownItemTextActive,
                        ]}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>

          {/* Mot de passe*/}
          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="key"
                size={18}
                color={COLORS.icon}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true} 
                placeholder="●●●●●●●●"
                placeholderTextColor={COLORS.placeholder}
              />
              <Feather
                name="eye"
                size={18}
                color={COLORS.icon}
                style={styles.rightIconButton}
              />
            </View>

            <TouchableOpacity
              onPress={handleChangePasswordPress}
              style={styles.changePasswordButton}
              activeOpacity={0.7}
            >
              <Text style={styles.changePasswordText}>
                Changer de mot de passe
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bouton ENREGISTRER */}
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
    marginBottom: 24,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    marginBottom: 8,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  form: {
    marginBottom: 32,
    gap: 14,
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
  leftIcon: {
    marginRight: 6,
  },
  rightIcon: {
    marginLeft: 'auto',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
  },
  textOnlyInput: {
    paddingVertical: 0,
  },
  rightIconButton: {
    marginLeft: 6,
  },
  changePasswordButton: {
    marginTop: 10,
    alignSelf: 'center', 
  },
  changePasswordText: {
    fontSize: 13,
    color: COLORS.textMuted,    
    textAlign: 'center',         
    textDecorationLine: 'underline',  
    fontWeight: '400',
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  dropdownItemActive: {
    backgroundColor: '#E0F2E9',
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  dropdownItemTextActive: {
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton: {
    height: 52,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 1,
  },
});
