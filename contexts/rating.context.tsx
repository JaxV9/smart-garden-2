import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  AppState,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import { useTranslation } from "./language.context";

interface RatingContextType {
  showRatingModal: () => void;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

const SECURE_STORE_KEYS = {
  USAGE_SECONDS: "rating_usage_seconds",
  DISMISSED_3M: "rating_dismissed_3m",
  DISMISSED_10M: "rating_dismissed_10m",
  COMPLETED: "rating_completed",
};

const getStoredVal = async (key: string): Promise<string | null> => {
  if (Platform.OS === "web") {
    return typeof window !== "undefined" ? localStorage.getItem(key) : null;
  }
  return await SecureStore.getItemAsync(key);
};

const setStoredVal = async (key: string, val: string): Promise<void> => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, val);
    }
    return;
  }
  await SecureStore.setItemAsync(key, val);
};

export function RatingProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Time tracking states
  const [usageSeconds, setUsageSeconds] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [dismissed3m, setDismissed3m] = useState(false);
  const [dismissed10m, setDismissed10m] = useState(false);

  const appState = useRef(AppState.currentState);
  const lastSavedSeconds = useRef(0);

  // Initialize and load stored values
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const storedSec = await getStoredVal(SECURE_STORE_KEYS.USAGE_SECONDS);
        const stored3m = await getStoredVal(SECURE_STORE_KEYS.DISMISSED_3M);
        const stored10m = await getStoredVal(SECURE_STORE_KEYS.DISMISSED_10M);
        const storedCompleted = await getStoredVal(SECURE_STORE_KEYS.COMPLETED);

        if (storedSec) {
          const sec = parseInt(storedSec, 10);
          setUsageSeconds(sec);
          lastSavedSeconds.current = sec;
        }
        if (stored3m === "true") setDismissed3m(true);
        if (stored10m === "true") setDismissed10m(true);
        if (storedCompleted === "true") setIsCompleted(true);
      } catch (err) {
        console.log("Error loading rating context data", err);
      }
    };
    loadStoredData();
  }, []);

  // Save progress periodically and on app state changes
  const saveProgress = async (currentSec: number) => {
    try {
      await setStoredVal(SECURE_STORE_KEYS.USAGE_SECONDS, currentSec.toString());
      lastSavedSeconds.current = currentSec;
    } catch (err) {
      console.log("Error saving rating progress", err);
    }
  };

  // Run timer when active
  useEffect(() => {
    let interval: any = null;

    const startTimer = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        setUsageSeconds((prev) => {
          const next = prev + 1;
          // Auto-save every 10 seconds
          if (next % 10 === 0) {
            saveProgress(next);
          }
          return next;
        });
      }, 1000);
    };

    const stopTimer = () => {
      if (interval) clearInterval(interval);
    };

    if (AppState.currentState === "active") {
      startTimer();
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        startTimer();
      } else if (nextAppState.match(/inactive|background/)) {
        stopTimer();
        saveProgress(usageSeconds);
      }
      appState.current = nextAppState;
    });

    return () => {
      stopTimer();
      subscription.remove();
    };
  }, [usageSeconds]);

  // Check conditions for automatic prompts
  useEffect(() => {
    if (isCompleted || isModalVisible) return;

    // Condition 1: 3 minutes (180 seconds)
    if (usageSeconds >= 180 && !dismissed3m) {
      setIsModalVisible(true);
      setDismissed3m(true);
      setStoredVal(SECURE_STORE_KEYS.DISMISSED_3M, "true");
    }
    // Condition 2: 10 minutes (600 seconds)
    else if (usageSeconds >= 600 && !dismissed10m) {
      setIsModalVisible(true);
      setDismissed10m(true);
      setStoredVal(SECURE_STORE_KEYS.DISMISSED_10M, "true");
    }
  }, [usageSeconds, dismissed3m, dismissed10m, isCompleted, isModalVisible]);

  const showRatingModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleGoToPlayStore = async () => {
    setIsCompleted(true);
    await setStoredVal(SECURE_STORE_KEYS.COMPLETED, "true");
    setIsModalVisible(false);
    Linking.openURL("https://play.google.com/store/apps/details?id=com.smartgarden_iim");
  };

  return (
    <RatingContext.Provider value={{ showRatingModal }}>
      {children}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {/* Header Close Button */}
            <Pressable style={styles.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </Pressable>

            <View style={{ width: "100%", alignItems: "center" }}>
              {/* Premium Gold Star Badge Icon */}
              <View style={styles.iconBadge}>
                <Ionicons name="star" size={38} color="#FBBF24" />
              </View>

              {/* Title */}
              <Text style={styles.title}>
                {t("rating_title", "Aimez-vous Smart Garden ?")}
              </Text>

              {/* Subtitle */}
              <Text style={styles.subtitle}>
                {t(
                  "rating_subtitle",
                  "Prenez un instant pour évaluer l'application ! Votre soutien nous aide à faire grandir notre potager commun."
                )}
              </Text>

              <View style={styles.actionContainer}>
                <Pressable
                  style={styles.rateBtn}
                  onPress={handleGoToPlayStore}
                >
                  <Ionicons name="logo-google-playstore" size={18} color="#FFFFFF" />
                  <Text style={styles.rateBtnText}>
                    {t("rating_rate_now", "Noter sur le Play Store")}
                  </Text>
                </Pressable>
              </View>

              <Pressable style={styles.laterBtn} onPress={handleClose}>
                <Text style={styles.laterBtnText}>
                  {t("rating_later", "Plus tard")}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </RatingContext.Provider>
  );
}

export function useRating() {
  const context = useContext(RatingContext);
  if (context === undefined) {
    throw new Error("useRating must be used within a RatingProvider");
  }
  return context;
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: Math.min(width - 40, 360),
    alignItems: "center",
    position: "relative",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 4,
  },
  iconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FBBF24",
    marginBottom: 16,
    marginTop: 8,
    shadowColor: "#FBBF24",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 6,
  },
  actionContainer: {
    width: "100%",
  },
  rateBtn: {
    backgroundColor: "#5B8E55",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#5B8E55",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  rateBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  laterBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginTop: 8,
  },
  laterBtnText: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
  },
});
