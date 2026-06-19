import AppHeader from '@/components/new/ui/AppHeader';
import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useTranslation } from '@/contexts/language.context';
import { languageLabels } from '@/constants/translations';
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { useUser } from '@/hooks/useUser';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant.e',
  amateur: 'Amateur.trice',
  advanced: 'Avancé.e',
  enthusiast: 'Passionné.e',
};

import { useTour } from '@/contexts/tour.context';
import { useRef } from 'react';

export default function ProfileScreen() {
  const { user, isPremium } = useUserContext();
  const { logout } = useUser();
  const { t, language, changeLanguage } = useTranslation();
  const { gardenInfo } = useGardenContext();
  const { loadGardenInfo } = useGardenInfo();
  const { registerElement, step } = useTour();

  const scrollRef = useRef<ScrollView>(null);
  const profileCardRef = useRef<View>(null);
  const vipBannerRef = useRef<View>(null);
  const langSelectorRef = useRef<View>(null);
  const gardenInfoRef = useRef<View>(null);

  const measureAll = () => {
    setTimeout(() => {
      profileCardRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('profile_info', { x, y, width: w, height: h });
      });
      vipBannerRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('profile_vip', { x, y, width: w, height: h });
      });
      langSelectorRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('profile_lang_selector', { x, y, width: w, height: h });
      });
      gardenInfoRef.current?.measureInWindow((x, y, w, h) => {
        if (w && h) registerElement('profile_garden_details', { x, y, width: w, height: h });
      });
    }, 320);
  };

  useEffect(() => {
    if (step === 22) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else if (step === 23) {
      scrollRef.current?.scrollTo({ y: 100, animated: true });
    } else if (step === 24) {
      scrollRef.current?.scrollTo({ y: 220, animated: true });
    } else if (step === 25) {
      scrollRef.current?.scrollTo({ y: 340, animated: true });
    }
    measureAll();
  }, [step]);

  const avatarSource = user?.avatarUri
    ? { uri: user.avatarUri }
    : DEFAULT_AVATAR;

  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    loadGardenInfo();
  }, []);

  const gardenName = gardenInfo.name ?? 'Mon Jardin';

  const handlePersonalInfosPress = () => {
    router.push('/profile/personal-info');
  };

  const handleCommunityProfilePress = () => {
    router.push('/profile/community');
  };

  const handleEditGardenPress = () => {
    router.push('/profile/garden-info');
  };

  const handleStartTutorial = async () => {
    await SecureStore.setItemAsync('app_tour_completed', 'false');
    router.replace('/(tabs)/home');
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await logout();
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  return (
    <View style={styles.screen}>

      {/* HEADER */}
      <AppHeader
        title={t('profile_title')}
        showBack={false}
        showNotifications={true}
      />

      {/* CONTENT */}
      <ScrollView 
        ref={scrollRef}
        style={styles.container} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* PROFILE CARD */}
        <View 
          ref={profileCardRef}
          onLayout={measureAll}
          style={styles.profileCard}
        >
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.profileTexts}>
            <Text style={styles.name}>
              {user?.name || ''}
            </Text>

            <Text style={styles.email}>
              {user?.email || ''}
            </Text>

            <Text style={styles.level}>
              {user?.level
                ? (LEVEL_LABELS[user.level] ?? user.level)
                : '—'}
            </Text>
          </View>
        </View>

        {/* PREMIUM PROMOTION BANNER */}
        {!isPremium ? (
          <TouchableOpacity 
            ref={vipBannerRef}
            onLayout={measureAll}
            style={styles.premiumBanner} 
            onPress={() => router.push('/premium' as any)}
            activeOpacity={0.9}
          >
            <View style={styles.premiumBannerLeft}>
              <View style={styles.crownCircle}>
                <Ionicons name="ribbon" size={20} color="#B8860B" />
              </View>
              <View style={styles.premiumBannerTexts}>
                <Text style={styles.premiumBannerTitle}>{t('vip_title')} 👑</Text>
                <Text style={styles.premiumBannerSub}>{t('profile_vip_banner')}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
          </TouchableOpacity>
        ) : (
          <View 
            ref={vipBannerRef}
            onLayout={measureAll}
            style={[styles.premiumBanner, styles.premiumActiveBanner]}
          >
            <View style={styles.premiumBannerLeft}>
              <View style={[styles.crownCircle, { backgroundColor: '#FFFDF0' }]}>
                <Ionicons name="star" size={20} color="#D4AF37" />
              </View>
              <View style={styles.premiumBannerTexts}>
                <Text style={[styles.premiumBannerTitle, { color: '#B8860B' }]}>{t('profile_premium_status_active')}</Text>
                <Text style={styles.premiumBannerSub}>{t('vip_subtitle')}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/premium' as any)}>
              <Text style={styles.manageVipText}>Gérer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ACCOUNT */}
        <View style={styles.blockCard}>
          <TouchableOpacity
            style={styles.row}
            onPress={handlePersonalInfosPress}
          >
            <View style={styles.iconCircle}>
              <Feather
                name="user"
                size={20}
                color="#5A7F54"
              />
            </View>

            <Text style={styles.rowText}>
              {t('profile_personal_info')}
            </Text>

            <Feather
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={handleCommunityProfilePress}
          >
            <View style={styles.iconCircle}>
              <Feather
                name="users"
                size={20}
                color="#5A7F54"
              />
            </View>

            <Text style={styles.rowText}>
              {t('profile_edit')}
            </Text>

            <Feather
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.row}
            onPress={handleStartTutorial}
          >
            <View style={styles.iconCircle}>
              <Feather
                name="help-circle"
                size={20}
                color="#5A7F54"
              />
            </View>

            <Text style={styles.rowText}>
              {t('profile_start_tutorial')}
            </Text>

            <Feather
              name="chevron-right"
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.rowLast]}
            onPress={() => setIsLogoutModalVisible(true)}
          >
            <View style={styles.iconCircle}>
              <Feather
                name="log-out"
                size={20}
                color="#5A7F54"
              />
            </View>

            <Text style={styles.rowText}>
              {t('profile_logout')}
            </Text>
          </TouchableOpacity>
        </View>


        {/* LANGUAGE SELECTOR */}
        <View 
          ref={langSelectorRef}
          onLayout={measureAll}
          style={styles.blockCard}
        >
          <View style={styles.gardenHeader}>
            <View style={styles.gardenHeaderLeft}>
              <View style={styles.iconCircle}>
                <Ionicons
                  name="language-outline"
                  size={18}
                  color="#5A7F54"
                />
              </View>

              <Text style={styles.gardenTitle}>
                {t('profile_language_label')}
              </Text>
            </View>
          </View>

          <View style={styles.languageGrid}>
            {Object.entries(languageLabels).map(([code, label]) => {
              const isSelected = language === code;
              return (
                <TouchableOpacity
                  key={code}
                  style={[
                    styles.languageButton,
                    isSelected && styles.languageButtonActive,
                  ]}
                  onPress={() => changeLanguage(code as any)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      isSelected && styles.languageButtonTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* GARDEN INFO */}
        <View 
          ref={gardenInfoRef}
          onLayout={measureAll}
          style={styles.blockCard}
        >
          <View style={styles.gardenHeader}>
            <View style={styles.gardenHeaderLeft}>
              <View style={styles.iconCircle}>
                <Feather
                  name="settings"
                  size={18}
                  color="#5A7F54"
                />
              </View>

              <Text style={styles.gardenTitle}>
                {t('plan_default_name')}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditGardenPress}
            >
              <Feather
                name="edit-3"
                size={16}
                color="#5A7F54"
              />

              <Text style={styles.editButtonText}>
                {t('btn_edit')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoLine}>
            <Text style={styles.infoLabel}>
              Nom du jardin
            </Text>

            <Text style={styles.infoValue}>
              {gardenName}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={isLogoutModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t('profile_logout')}?
            </Text>

            <TouchableOpacity
              style={styles.modalLogoutButton}
              onPress={handleConfirmLogout}
            >
              <Text style={styles.modalLogoutButtonText}>
                {t('profile_logout').toUpperCase()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleCancelLogout}
            >
              <Text style={styles.modalCancelButtonText}>
                {t('btn_cancel').toUpperCase()}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#5A7F54',
  },

  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: '#F9FAFB',

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  profileCard: {
    flexDirection: 'row',
    backgroundColor: '#EBF6EB',
    padding: 16,
    borderRadius: 20,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    marginRight: 16,
  },

  profileTexts: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },

  level: {
    fontSize: 13,
    color: '#6B7280',
  },

  blockCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF6EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  rowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },

  gardenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  gardenHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gardenTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    gap: 4,
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5A7F54',
  },

  infoLine: {
    marginBottom: 10,
  },

  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCard: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },

  modalLogoutButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: '#D72626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  modalLogoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  modalCancelButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCancelButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  premiumBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FCFAF0',
    borderColor: '#FEF3C7',
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
  },
  premiumActiveBanner: {
    backgroundColor: '#F0F9FF',
    borderColor: '#E0F2FE',
  },
  premiumBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  crownCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumBannerTexts: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#B8860B',
    marginBottom: 2,
  },
  premiumBannerSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  manageVipText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  languageButtonActive: {
    backgroundColor: '#EBF6EB',
    borderColor: '#5A7F54',
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  languageButtonTextActive: {
    color: '#5A7F54',
    fontWeight: '700',
  },
});