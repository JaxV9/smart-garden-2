import { ResumeSection } from "@/components/new/homeSections/resumeSection/resumeSection";
import { PlantsSection } from "@/components/new/homeSections/plantsSection/plantsSection";
import { HomeSection } from "@/components/new/navGardenSection/navbar";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { useGarden } from "@/hooks/useGarden";
import { useVegetable } from "@/hooks/useVegetable";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Header  } from "@/components/new/header/header";

export default function Index() {
  const [currentSection, setCurrentSection] = useState<HomeSection>("resume");
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

  return (
    <View style={styles.container}>
      <Header/>
      <View style={styles.gap16}>
        <View style={styles.headerBtnContainer}>
          <Pressable
            onPress={() => setCurrentSection("resume")}
            style={
              currentSection === "resume"
                ? styles.headerBtnSelected
                : styles.headerBtn
            }
          >
            <Text style={styles.headerTxtBtn}>Résumé</Text>
          </Pressable>
          <Pressable
            onPress={() => setCurrentSection("plants")}
            style={
              currentSection === "plants"
                ? styles.headerBtnSelected
                : styles.headerBtn
            }
          >
            <Text style={styles.headerTxtBtn}>Mes plantes</Text>
          </Pressable>
        </View>
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
  gap16: {
    paddingHorizontal: 8,
    paddingTop: 16,
    gap: 16,
  },
  gap8: {
    gap: 8,
  },
  title: {
    fontSize: 22,
  },
  headerBtnContainer: {
    flexDirection: "row",
    gap: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
    backgroundColor: "#F9FAFB",
  },
  headerBtnSelected: {
    backgroundColor: "#61b4586f",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#5B8E55",
  },
  headerBtn: {
    backgroundColor: "#F1F1F1",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTxtBtn: {
    fontSize: 18,
  },
});

