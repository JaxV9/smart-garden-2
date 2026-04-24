import { useUserContext } from '@/contexts/user.context';
import { useUser } from '@/hooks/useUser';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGardenContext } from '@/contexts/garden.context';
import { useGardenInfo } from '@/hooks/useGardenInfo';
import { Header } from "@/components/new/header/header";

const DEFAULT_AVATAR = require('@/assets/images/avatar.png');

const LEVEL_LABELS: Record<string, string> = {
  beginner: 'Débutant.e',
  amateur: 'Amateur.trice',
  advanced: 'Avancé.e',
  enthusiast: 'Passionné.e',
};

export default function ProfileScreen() {
  const { user } = useUserContext();
  const { logout, updateUser } = useUser();
  const { gardenInfo } = useGardenContext();
  const { loadGardenInfo } = useGardenInfo();

  const avatarSource = user?.avatarUri ? { uri: user.avatarUri } : DEFAULT_AVATAR;

  // state for the logout popup
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  useEffect(() => {
    loadGardenInfo();
  }, []);

  const gardenName = gardenInfo.name ?? 'Mon Jardin';
  const gardenLocation = gardenInfo.location ?? '—';
  const gardenSections = gardenInfo.sections?.length
    ? gardenInfo.sections
    : ['Potager principal'];

  const handlePersonalInfosPress = () => {
    router.push('../profile/personal-info');
  };

  const handleLogoutPress = () => {
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
    <View style={{ flex: 1 }}>
      <Header />
      <View style={styles.container}>
        {/* Title*/}
        <Text style={styles.title}>
          Mon <Text style={styles.titleHighlight}>Profil</Text>
        </Text>

        {/* Profile card*/}
        <View style={styles.profileCard}>
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.profileTexts}>
            <Text style={styles.name}>{user?.name || ''}</Text>
            <Text style={styles.email}>{user?.email || ''}</Text>
            <Text style={styles.level}>
              {user?.level ? (LEVEL_LABELS[user.level] ?? user.level) : '—'}
            </Text>
          </View>
        </View>

        {/* Block: personal info + logout*/}
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
 
        {/* Block: Confidentialité */}
        <View style={styles.blockCard}>
          <View style={styles.gardenHeader}>
            <View style={styles.gardenHeaderLeft}>
              <View style={styles.iconCircle}>
                <Feather name="eye-off" size={18} color={COLORS.greenDark} />
              </View>
              <Text style={styles.gardenTitle}>Profil Privé</Text>
            </View>
            <Switch
              value={user?.isPrivate || false}
              onValueChange={(val) => updateUser({ isPrivate: val })}
              trackColor={{ false: "#e5e5e5", true: COLORS.greenDark }}
              thumbColor={"#ffffff"}
            />
          </View>
          <Text style={[styles.infoLabel, { marginLeft: 52, marginTop: -4 }]}>
            Masquer vos statistiques aux autres utilisateurs
          </Text>
        </View>

        {/* Block: Garden information */}
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

        {/* DISCONNECT MODAL */}
        <Modal
          visible={isLogoutModalVisible}
          transparent
          animationType="fade"
          onRequestClose={handleCancelLogout}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
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

              {/* Red button */}
              <TouchableOpacity
                style={styles.modalLogoutButton}
                activeOpacity={0.8}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalLogoutButtonText}>SE DÉCONNECTER</Text>
              </TouchableOpacity>

              {/* Cancel button */}
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
    </View>
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

  /* -------- MODAL LOGOUT -------- */
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
