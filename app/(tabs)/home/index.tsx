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
          <Text style={styles.tabText}>Résumé</Text>
        </Pressable>

        <Pressable
          onPress={() => setCurrentSection("plants")}
          style={[
            styles.tabBtn,
            currentSection === "plants" && styles.tabBtnSelected,
          ]}
        >
          <Text style={styles.tabText}>Mes plantes</Text>
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
    gap: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  tabBtn: {
    backgroundColor: "#F1F1F1",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  tabBtnSelected: {
    backgroundColor: "#61b4586f",
    borderColor: "#5B8E55",
  },

  tabText: {
    fontSize: 16,
  },
});