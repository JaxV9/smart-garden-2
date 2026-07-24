import { useUserContext } from '@/contexts/user.context';
import { useUser } from '@/hooks/useUser';
import { useTranslation } from '@/contexts/language.context';
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

import { useTour } from '@/contexts/tour.context';
import { useRef, useEffect } from 'react';

export default function PersonalInfoScreen() {
  const { user } = useUserContext();
  const { updateAvatar, updateUser } = useUser();
  const { registerElement, step } = useTour();
  const { t } = useTranslation();

  const scrollRef = useRef<ScrollView>(null);
  const pseudoEmailRef = useRef<View>(null);
  const levelRef = useRef<View>(null);

  const measureAll = () => {
    setTimeout(() => {
      pseudoEmailRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('personal_pseudo_email', { x, y, width: w, height: h });
      });
      levelRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('personal_level', { x, y, width: w, height: h });
      });
    }, 320);
  };

  useEffect(() => {
    if (step === 17) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
    measureAll();
  }, [step]);

  const [pseudo, setPseudo] = useState<string>(user?.name ?? '');
  const [publicName, setPublicName] = useState<string>(user?.publicName ?? user?.name ?? '');
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
        t('personal_permission_denied'),
        t('personal_photo_permission_desc')
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
  const handleClearPublicName = () => setPublicName('');
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
      Alert.alert(t('error_title' as any) || 'Erreur', t('personal_error_fill_fields'));
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert(t('error_title' as any) || 'Erreur', t('personal_error_pwd_length'));
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(t('error_title' as any) || 'Erreur', t('personal_error_pwd_match'));
      return;
    }

    const status = await updateUser({ password: newPassword });

    if (status === 'Failure') {
      Alert.alert(t('error_title' as any) || 'Erreur', t('personal_error_pwd_failed'));
      return;
    }

    handleClosePasswordModal();
    Alert.alert(t('success_title' as any) || 'Succès', t('personal_success_pwd_updated'));
  };

  const handleSave = async () => {
    const status = await updateUser({
      name: pseudo || user?.name || '',
      publicName: publicName || user?.publicName || pseudo || user?.name || '',
      email: email || user?.email || '',
      level: experience,
    });

    if (status === "Failure") {
      Alert.alert(t('error_title' as any) || 'Erreur', t('personal_error_save_failed'));
      return;
    }

    Alert.alert(t('success_title' as any) || 'Succès', t('personal_success_save'));
  };


  const currentAvatarSource = avatarUri ? { uri: avatarUri } : DEFAULT_AVATAR;

  // ---------- Rendering----------

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
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
          <Text style={styles.headerTitle}>{t('profile_personal_info')}</Text>
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
        <View 
          ref={pseudoEmailRef}
          onLayout={measureAll}
          style={styles.form}
        >
          {/* Pseudo */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('personal_pseudo_label')}</Text>
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
                placeholder={t('personal_pseudo_placeholder')}
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

          {/* Nom public */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('personal_public_name_label')}</Text>
            <View style={styles.inputWrapper}>
              <Feather
                name="user"
                size={18}
                color={COLORS.icon}
                style={styles.leftIcon}
              />
              <TextInput
                style={styles.input}
                value={publicName}
                onChangeText={setPublicName}
                placeholder={t('personal_public_name_placeholder')}
                placeholderTextColor={COLORS.placeholder}
              />
              {publicName.length > 0 && (
                <TouchableOpacity
                  style={styles.rightIconButton}
                  onPress={handleClearPublicName}
                >
                  <Feather name="x" size={16} color={COLORS.icon} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Email */}
          <View style={styles.field}>
            <Text style={styles.label}>{t('personal_email_label')}</Text>
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
                placeholder={t('personal_email_placeholder')}
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
          <View 
            ref={levelRef}
            onLayout={measureAll}
            style={styles.field}
          >
            <Text style={styles.label}>{t('personal_exp_label')}</Text>

            <TouchableOpacity
              style={styles.inputWrapper}
              activeOpacity={0.8}
              onPress={toggleExperienceDropdown}
            >
              <Text style={[styles.input, styles.textOnlyInput]}>
                {t(`profile_level_${experience}` as any)}
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
                        {t(`profile_level_${level}` as any)}
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
                {t('personal_change_pwd_btn')}
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
          <Text style={styles.saveButtonText}>{t('personal_save_btn')}</Text>
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
              <Text style={styles.modalTitle}>{t('personal_pwd_modal_title')}</Text>
              <TouchableOpacity
                onPress={handleClosePasswordModal}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={20} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalField}>
              <Text style={styles.label}>{t('personal_pwd_new_label')}</Text>
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
                  placeholder={t('personal_pwd_new_label')}
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
              <Text style={styles.label}>{t('personal_pwd_confirm_label')}</Text>
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
                  placeholder={t('personal_pwd_confirm_label')}
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
              <Text style={styles.modalPrimaryButtonText}>{t('personal_pwd_submit_btn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    fontWeight: '800',
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
    fontWeight: '700',
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
    fontWeight: '700',
  },
  dropdown: {
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropdownItemActive: {
    backgroundColor: '#EBF6EB',
  },
  dropdownItemText: {
    fontSize: 14,
    color: COLORS.textDark,
  },
  dropdownItemTextActive: {
    fontWeight: '700',
    color: COLORS.primary,
  },
  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
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
    fontWeight: '800',
    color: COLORS.textDark,
  },
  modalField: {
    gap: 6,
  },
  modalPrimaryButton: {
    height: 48,
    borderRadius: 12,
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
