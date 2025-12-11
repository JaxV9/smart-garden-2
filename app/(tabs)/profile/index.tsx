import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUserContext } from '@/contexts/user.context';
import { SafeAreaView } from 'react-native-safe-area-context';

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

export default function ProfileScreen() {
  const { user, logout } = useUserContext();

  const avatarSource = user?.avatarUri
    ? { uri: user.avatarUri }
    : DEFAULT_AVATAR;

  // état pour la popup de déconnexion
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  // Pour l’instant : valeurs en dur pour le jardin
  const gardenName = 'Mon Jardin';
  const gardenLocation = 'Paris';
  const gardenSections = ['Potager principal'];

  const handlePersonalInfosPress = () => {
    router.push('../profile/personal-info');
  };

  const handleLogoutPress = () => {
    // On ouvre la popup au lieu de déconnecter directement
    setIsLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    setIsLogoutModalVisible(false);
    await logout();
  };

  const handleCancelLogout = () => {
    setIsLogoutModalVisible(false);
  };

  const handleEditGardenPress = () => {
    router.push('../profile/garden-info');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Titre */}
        <Text style={styles.title}>
          Mon <Text style={styles.titleHighlight}>Profil</Text>
        </Text>

        {/* Carte profil */}
        <View style={styles.profileCard}>
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.profileTexts}>
            {/* ✅ plus de "Marie" en dur */}
            <Text style={styles.name}>{user?.name || ''}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
            <Text style={styles.level}>Débutante</Text>
          </View>
        </View>

        {/* Bloc : infos perso + déconnexion */}
        <View style={styles.blockCard}>
          <TouchableOpacity
            style={styles.row}
            activeOpacity={0.7}
            onPress={handlePersonalInfosPress}
          >
            <View style={styles.iconCircle}>
              <Feather name="user" size={20} color={COLORS.greenDark} />
            </View>
            <Text style={styles.rowText}>Informations personnelles</Text>
            <Feather name="chevron-right" size={20} color={COLORS.greenDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.row, styles.rowLast]}
            activeOpacity={0.7}
            onPress={handleLogoutPress}
          >
            <View style={styles.iconCircle}>
              <Feather name="log-out" size={20} color={COLORS.greenDark} />
            </View>
            <Text style={styles.rowText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Bloc : informations du jardin */}
        <View style={styles.blockCard}>
          <View style={styles.gardenHeader}>
            <View style={styles.gardenHeaderLeft}>
              <View style={styles.iconCircle}>
                <Feather name="settings" size={18} color={COLORS.greenDark} />
              </View>
              <Text style={styles.gardenTitle}>Informations du jardin</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              activeOpacity={0.7}
              onPress={handleEditGardenPress}
            >
              <Feather name="edit-3" size={16} color={COLORS.greenDark} />
              <Text style={styles.editButtonText}>Modifier</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gardenContent}>
            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Nom du jardin</Text>
              <Text style={styles.infoValue}>{gardenName}</Text>
            </View>

            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Localisation</Text>
              <Text style={styles.infoValue}>{gardenLocation}</Text>
            </View>

            <View style={styles.infoLine}>
              <Text style={styles.infoLabel}>Sections du jardin</Text>
              <View style={styles.chipsRow}>
                {gardenSections.map((section) => (
                  <View key={section} style={styles.chip}>
                    <Text style={styles.chipText}>{section}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 24 }} />

        {/* MODAL DE DÉCONNEXION */}
        <Modal
          visible={isLogoutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              {/* bouton X */}
              <View style={styles.modalHeader}>
                <View style={{ width: 24 }} />
                <Text style={styles.modalTitle}>
                  Voulez-vous vraiment vous déconnecter ?
                </Text>
                <TouchableOpacity
                  onPress={handleCancelLogout}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="x" size={20} color={COLORS.textDark} />
                </TouchableOpacity>
              </View>

              {/* Bouton rouge */}
              <TouchableOpacity
                style={styles.modalLogoutButton}
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalLogoutButtonText}>SE DÉCONNECTER</Text>
              </TouchableOpacity>

              {/* Bouton annuler */}
              <TouchableOpacity
                style={styles.modalCancelButton}
                activeOpacity={0.8}
                onPress={handleCancelLogout}
              >
                <Text style={styles.modalCancelButtonText}>ANNULER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const COLORS = {
  background: '#FFFFFF',
  profileCardBg: '#E4F1DC',
  blockBg: '#FFFFFF',
  border: '#E5E7EB',
  greenDark: '#2F6F3A',
  textDark: '#111827',
  textMuted: '#6B7280',
  chipBg: '#111827',
  chipText: '#FFFFFF',
  iconBg: '#E9F2E3',
  logoutRed: '#D72626',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.textDark,
  },
  titleHighlight: {
    color: COLORS.greenDark,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.profileCardBg,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    alignItems: 'center',
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
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  level: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  blockCard: {
    backgroundColor: COLORS.blockBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.iconBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    color: COLORS.textDark,
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
    fontWeight: '600',
    color: COLORS.textDark,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: '#F9FAFB',
    gap: 4,
  },
  editButtonText: {
    fontSize: 13,
    color: COLORS.greenDark,
  },
  gardenContent: {
    marginTop: 4,
  },
  infoLine: {
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.chipText,
  },

  /* -------- MODAL DECONNEXION -------- */
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  modalTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    paddingHorizontal: 8,
  },
  modalLogoutButton: {
    height: 48,
    borderRadius: 8,
    backgroundColor: COLORS.logoutRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalLogoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  modalCancelButton: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButtonText: {
    color: COLORS.textDark,
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
