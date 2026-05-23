import AppHeader from '@/components/new/ui/AppHeader';
import { useGardenContext } from '@/contexts/garden.context';
import { useUserContext } from '@/contexts/user.context';
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { useUser } from '@/hooks/useUser';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
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

export default function ProfileScreen() {
  const { user, isPremium } = useUserContext();
  const { logout, updateUser } = useUser();
  const { gardenInfo } = useGardenContext();
  const { loadGardenInfo } = useGardenInfo();

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
        title={'Mon profil'}
        showBack={false}
        showNotifications={true}
      />

      {/* CONTENT */}
      <View style={styles.container}>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
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
            style={styles.premiumBanner} 
            onPress={() => router.push('/premium' as any)}
            activeOpacity={0.9}
          >
            <View style={styles.premiumBannerLeft}>
              <View style={styles.crownCircle}>
                <Ionicons name="ribbon" size={20} color="#B8860B" />
              </View>
              <View style={styles.premiumBannerTexts}>
                <Text style={styles.premiumBannerTitle}>Devenir Smart Garden VIP 👑</Text>
                <Text style={styles.premiumBannerSub}>Activez les tâches, conseils IA & calendrier.</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#D4AF37" />
          </TouchableOpacity>
        ) : (
          <View style={[styles.premiumBanner, styles.premiumActiveBanner]}>
            <View style={styles.premiumBannerLeft}>
              <View style={[styles.crownCircle, { backgroundColor: '#FFFDF0' }]}>
                <Ionicons name="star" size={20} color="#D4AF37" />
              </View>
              <View style={styles.premiumBannerTexts}>
                <Text style={[styles.premiumBannerTitle, { color: '#B8860B' }]}>Membre VIP Ultra actif 👑</Text>
                <Text style={styles.premiumBannerSub}>Vous profitez de toutes les fonctionnalités illimitées.</Text>
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
              Informations personnelles
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
              Profil communautaire
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
              Déconnexion
            </Text>
          </TouchableOpacity>
        </View>

        {/* PRIVACY */}
        <View style={styles.blockCard}>
          <View style={styles.gardenHeader}>
            <View style={styles.gardenHeaderLeft}>
              <View style={styles.iconCircle}>
                <Feather
                  name="eye-off"
                  size={18}
                  color="#5A7F54"
                />
              </View>

              <Text style={styles.gardenTitle}>
                Profil Privé
              </Text>
            </View>

            <Switch
              value={user?.isPrivate || false}
              onValueChange={(val) =>
                updateUser({ isPrivate: val })
              }
              trackColor={{
                false: '#e5e5e5',
                true: '#5A7F54',
              }}
              thumbColor="#ffffff"
            />
          </View>

          <Text style={styles.infoLabel}>
            Masquer vos statistiques aux autres utilisateurs
          </Text>
        </View>

        {/* GARDEN INFO */}
        <View style={styles.blockCard}>
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
                Informations du jardin
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
                Modifier
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

      </View>

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
              Voulez-vous vraiment vous déconnecter ?
            </Text>

            <TouchableOpacity
              style={styles.modalLogoutButton}
              onPress={handleConfirmLogout}
            >
              <Text style={styles.modalLogoutButtonText}>
                SE DÉCONNECTER
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={handleCancelLogout}
            >
              <Text style={styles.modalCancelButtonText}>
                ANNULER
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
});