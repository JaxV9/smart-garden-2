import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { DEFAULT_SENSOR_PROVISIONING_URL } from "@/constants/smartGardenProvisioning";
import { useSensorProvisioning } from "@/hooks/useSensorProvisioning";

type AddSensorModalProps = {
  visible: boolean;
  onClose: () => void;
  onProvisioned: () => void;
};

export function AddSensorModal({
  visible,
  onClose,
  onProvisioned,
}: AddSensorModalProps) {
  const [sensorBaseUrl, setSensorBaseUrl] = useState(
    DEFAULT_SENSOR_PROVISIONING_URL
  );
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const {
    deviceInfo,
    checking,
    provisioning,
    provisioningStatus,
    error,
    discoverSensor,
    provisionSensor,
    clearDeviceInfo,
    clearError,
  } = useSensorProvisioning();

  useEffect(() => {
    if (visible) {
      return;
    }

    setSensorBaseUrl(DEFAULT_SENSOR_PROVISIONING_URL);
    setWifiSsid("");
    setWifiPassword("");
    setFormError(null);
    clearDeviceInfo();
    clearError();
  }, [clearDeviceInfo, clearError, visible]);

  async function handleCheckSensor() {
    setFormError(null);

    if (!sensorBaseUrl.trim()) {
      setFormError("L'adresse du capteur est requise.");
      return;
    }

    await discoverSensor(sensorBaseUrl);
  }

  async function handleProvision() {
    setFormError(null);

    if (!sensorBaseUrl.trim()) {
      setFormError("L'adresse du capteur est requise.");
      return;
    }

    if (!wifiSsid.trim()) {
      setFormError("Le nom du Wi-Fi est requis.");
      return;
    }

    const result = await provisionSensor({
      sensorBaseUrl: sensorBaseUrl.trim(),
      wifiSsid: wifiSsid.trim(),
      wifiPassword,
    });

    if (result === "Success") {
      onProvisioned();
      onClose();
    }
  }

  const disabled = provisioning || checking || !wifiSsid.trim();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Ajouter un capteur</Text>
            <Pressable onPress={onClose} style={styles.iconButton}>
              <Ionicons name="close" size={22} color="#111827" />
            </Pressable>
          </View>

          <View style={styles.notice}>
            <Ionicons name="wifi-outline" size={20} color="#2F7D32" />
            <Text style={styles.noticeText}>
              Connecte ton téléphone ou simulateur au Wi-Fi du capteur,
              puis vérifie sa connexion locale.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Adresse locale du capteur</Text>
            <View style={styles.inlineRow}>
              <TextInput
                value={sensorBaseUrl}
                onChangeText={(value) => {
                  setSensorBaseUrl(value);
                  clearDeviceInfo();
                }}
                placeholder="http://192.168.4.1"
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.input, styles.inlineInput]}
              />
              <Pressable
                onPress={handleCheckSensor}
                disabled={checking || provisioning}
                style={styles.checkButton}
              >
                {checking ? (
                  <ActivityIndicator size="small" color="#111827" />
                ) : (
                  <Ionicons name="search" size={18} color="#111827" />
                )}
              </Pressable>
            </View>
          </View>

          <View
            style={[
              styles.deviceCard,
              deviceInfo ? styles.deviceCardReady : null,
            ]}
          >
            <Ionicons
              name={deviceInfo ? "checkmark-circle" : "hardware-chip-outline"}
              size={22}
              color={deviceInfo ? "#2F7D32" : "#6B7280"}
            />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>
                {deviceInfo?.name || "Capteur non vérifié"}
              </Text>
              <Text style={styles.deviceMeta}>
                {deviceInfo
                  ? `${deviceInfo.type} · ${deviceInfo.unit}`
                  : "Utilise le bouton de recherche pour lire /device-info."}
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Wi-Fi du jardin</Text>
            <TextInput
              value={wifiSsid}
              onChangeText={setWifiSsid}
              placeholder="Nom du Wi-Fi"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
            <TextInput
              value={wifiPassword}
              onChangeText={setWifiPassword}
              placeholder="Mot de passe"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
              style={styles.input}
            />
          </View>

          {(formError || error) && (
            <Text style={styles.errorText}>{formError || error}</Text>
          )}
          {provisioningStatus && (
            <Text style={styles.statusText}>{provisioningStatus}</Text>
          )}

          <Pressable
            onPress={handleProvision}
            disabled={disabled}
            style={[styles.submitButton, disabled ? styles.submitDisabled : null]}
          >
            {provisioning ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="wifi" size={18} color="#FFFFFF" />
                <Text style={styles.submitText}>Configurer</Text>
              </>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17, 24, 39, 0.35)",
  },
  modal: {
    maxHeight: "88%",
    padding: 18,
    gap: 16,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
  },
  notice: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#F1FAEE",
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 19,
    color: "#374151",
  },
  form: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  inlineRow: {
    flexDirection: "row",
    gap: 8,
  },
  inlineInput: {
    flex: 1,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    fontSize: 16,
    color: "#111827",
  },
  checkButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: "#E7F4E4",
  },
  deviceCard: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  deviceCardReady: {
    borderColor: "#B6DDB0",
    backgroundColor: "#F8FFF6",
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  deviceMeta: {
    fontSize: 13,
    color: "#6B7280",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 14,
  },
  statusText: {
    color: "#2F7D32",
    fontSize: 14,
  },
  submitButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
    backgroundColor: "#2F7D32",
  },
  submitDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
