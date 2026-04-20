import { useUserContext } from '@/contexts/user.context';
import { useUser } from '@/hooks/useUser';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GardenerLevel } from '@/models/models';

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant.e',
  amateur: 'Amateur.trice',
  advanced: 'Avancé.e',
  enthusiast: 'Passionné.e',
};

export default function PersonalInfoScreen() {
  const { user } = useUserContext();
  const { updateAvatar, updateUser } = useUser();

  const [pseudo, setPseudo] = useState<string>(user?.name ?? '');
  const [email, setEmail] = useState<string>(user?.email ?? '');
  const [experience, setExperience] = useState<GardenerLevel>(
    (user?.level as GardenerLevel) ?? 'beginner'
  );
  const [isExperienceOpen, setIsExperienceOpen] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

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

  const handleSelectExperience = (level: GardenerLevel) => {
    setExperience(level);
    setIsExperienceOpen(false);
  };

  const resetPasswordModal = () => {
    setNewPassword('');
    setConfirmPassword('');
    setIsNewPasswordVisible(false);
    setIsConfirmPasswordVisible(false);
  };

  const handleChangePasswordPress = () => {
    resetPasswordModal();
    setIsPasswordModalVisible(true);
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalVisible(false);
    resetPasswordModal();
  };

  const handleSubmitPasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir les deux champs.');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas.');
      return;
    }

    const status = await updateUser({ password: newPassword });

    if (status === 'Failure') {
      Alert.alert('Erreur', 'Impossible de modifier le mot de passe.');
      return;
    }

    handleClosePasswordModal();
    Alert.alert('Succès', 'Le mot de passe a bien été mis à jour.');
  };

  const handleSave = async () => {
    const status = await updateUser({
      name: pseudo || user?.name || '',
      email: email || user?.email || '',
      level: experience,
    });

    if (status === "Failure") {
      Alert.alert("Erreur", "Impossible d'enregistrer vos informations.");
      return;
    }

    Alert.alert("Succès", "Vos informations ont été mises à jour.");
  };


  const currentAvatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  // ---------- Rendering----------

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

        {/* Avatar + name */}
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

          {/* Experience level */}
          <View style={styles.field}>
            <Text style={styles.label}>Niveau d&apos;expérience</Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              activeOpacity={0.8}
              onPress={toggleExperienceDropdown}
            >
              <Text style={[styles.input, styles.textOnlyInput]}>
                {LEVEL_LABELS[experience] ?? experience}
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
                {(['beginner', 'amateur', 'advanced', 'enthusiast'] as GardenerLevel[]).map(
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
                        {LEVEL_LABELS[level] ?? level}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            )}
          </View>

          <View style={styles.field}>
            <TouchableOpacity
              onPress={handleChangePasswordPress}
              style={styles.changePasswordButton}
              activeOpacity={0.7}
            >
              <Feather name="lock" size={16} color={COLORS.primary} />
              <Text style={styles.changePasswordText}>
                Changer de mot de passe
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save button*/}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.8}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>ENREGISTRER</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={isPasswordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClosePasswordModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Changer le mot de passe</Text>
              <TouchableOpacity
                onPress={handleClosePasswordModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Nouveau mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="lock"
                  size={18}
                  color={COLORS.icon}
                  style={styles.leftIcon}
                />
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Nouveau mot de passe"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!isNewPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={() => setIsNewPasswordVisible((prev) => !prev)}
                >
                  <Feather
                    name={isNewPasswordVisible ? 'eye-off' : 'eye'}
                    size={18}
                    color={COLORS.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <View style={styles.inputWrapper}>
                <Feather
                  name="lock"
                  size={18}
                  color={COLORS.icon}
                  style={styles.leftIcon}
                />
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirmer le mot de passe"
                  placeholderTextColor={COLORS.placeholder}
                  secureTextEntry={!isConfirmPasswordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={() => setIsConfirmPasswordVisible((prev) => !prev)}
                >
                  <Feather
                    name={isConfirmPasswordVisible ? 'eye-off' : 'eye'}
                    size={18}
                    color={COLORS.icon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryButton}
              activeOpacity={0.8}
              onPress={handleSubmitPasswordChange}
            >
              <Text style={styles.modalPrimaryButtonText}>VALIDER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  placeholder: '#111827',
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
    marginTop: 6,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  changePasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.32)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  modalField: {
    gap: 6,
  },
  modalPrimaryButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.4,
  },
});
