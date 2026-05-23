import { PlantsSection } from "@/components/new/homeSections/plantsSection/plantsSection";
import { ResumeSection } from "@/components/new/homeSections/resumeSection/resumeSection";
import AppHeader from "@/components/new/ui/AppHeader";
import { useGardenContext } from "@/contexts/garden.context";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { useGarden } from "@/hooks/useGarden";
import { useVegetable } from "@/hooks/useVegetable";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [currentSection, setCurrentSection] = useState<"resume" | "plants">("resume");

  const { gardenInfo } = useGardenContext();

  const { loadGardenVegetables } = useGarden();
  const { vegetablesContext } = useVegetablesContext();
  const { loadVegetables } = useVegetable();

  useEffect(() => {
    loadVegetables();
  }, []);

  useEffect(() => {
    if (vegetablesContext.length > 0) {
      loadGardenVegetables();
    }
  }, [vegetablesContext]);

  const gardenTitle = gardenInfo?.name ?? "Mon jardin";

  return (
    <View style={styles.container}>
      <AppHeader
        title={gardenTitle}
        showBack={false}
        showNotifications={true}
      />

      <View style={styles.tabsContainer}>
        <Pressable
          onPress={() => setCurrentSection("resume")}
          style={[
            styles.tabBtn,
            currentSection === "resume" && styles.tabBtnSelected,
          ]}
        >
          <Text style={[
            styles.tabText,
            currentSection === "resume" && styles.tabTextSelected
          ]}>
            Résumé
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentSection("plants")}
          style={[
            styles.tabBtn,
            currentSection === "plants" && styles.tabBtnSelected,
          ]}
        >
          <Text style={[
            styles.tabText,
            currentSection === "plants" && styles.tabTextSelected
          ]}>
            Mes plantes
          </Text>
        </Pressable>
      </View>

      {currentSection === "resume" && <ResumeSection />}
      {currentSection === "plants" && <PlantsSection />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  tabBtnSelected: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.1,
  },
  tabTextSelected: {
    color: "#1F2937",
    fontWeight: "800",
  },
});