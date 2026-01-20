// components/new/task/formulaire.tsx
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { TaskPriority } from "@/models/models";
import { useGarden } from "@/hooks/useGarden";

type FormulaireProps = {
  title: string;
  description: string;
  plantId: string;
  dueDate: string;
  priority: TaskPriority | null;
  editingId: string | null;

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setPlantId: (v: string) => void;
  setDueDate: (v: string) => void;
  setPriority: (v: TaskPriority | null) => void;

  onSave: () => void;
  onCancel?: () => void;

  onPickPlant?: () => void;
  onPickDueDate?: () => void;
};

export function Formulaire(props: FormulaireProps) {
  const {
    title,
    description,
    plantId,
    dueDate,
    priority,
    editingId,
    setTitle,
    setDescription,
    setPriority,
    onSave,
    onPickPlant,
    onPickDueDate,
  } = props;

  const isEditing = Boolean(editingId);

  const { gardenVegetables } = useGarden();

  return (
    <View>
      <View style={styles.form}>
        <Text style={styles.label}>Nom de la tâche</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Arroser, Rempoter..."
          placeholderTextColor={PLACEHOLDER}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Ex: Récolter les fruits rouges foncés légèrement mous au toucher"
          placeholderTextColor={PLACEHOLDER}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Plante concernée</Text>
        <Pressable style={styles.select} onPress={onPickPlant}>
          <Text style={[styles.selectText, !plantId && styles.selectPlaceholder]}>
            {plantId
              ? gardenVegetables.find(p => p.gardenVegetableId === plantId)?.name || "Plante inconnue"
              : "Sélectionnez une plante"}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>

        <Text style={styles.label}>Date d'échéance</Text>
        <Pressable style={styles.select} onPress={onPickDueDate}>
          <Text
            style={[
              styles.selectText,
              !dueDate && styles.selectPlaceholder,
            ]}
          >
            {dueDate || "Sélectionnez une date"}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>

        <Text style={styles.label}>Priorité</Text>
        <View style={styles.chipsRow}>
          {(["LOW", "MEDIUM", "HIGH"] as TaskPriority[]).map((p) => {
            const selected = priority === p;
            return (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selected && styles.chipTextSel,
                  ]}
                >
                  {p}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
          <Text style={styles.primaryBtnText}>
            {isEditing ? "METTRE À JOUR" : "CRÉER LA TÂCHE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PLACEHOLDER = "#9AA3A8";
const BORDER = "#E4E7EA";
const TEXT = "#1C1C1C";
const GREEN = "#5A8E57";

const styles = StyleSheet.create({

  headerRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT,
  },
  closeBtn: {
    position: "absolute",
    right: 0,
    top: -2,
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 26,
    color: "#6C757D",
  },

  form: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#6F7A80",
    marginTop: 6,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: "top",
  },

  select: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectText: {
    fontSize: 14,
    color: TEXT,
  },
  selectPlaceholder: {
    color: PLACEHOLDER,
  },
  chevron: {
    fontSize: 16,
    color: "#6F7A80",
  },

  chipsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  chip: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    borderColor: GREEN,
    backgroundColor: "rgba(90,142,87,0.12)",
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#5C666B",
  },
  chipTextSel: {
    color: GREEN,
  },

  primaryBtn: {
    marginTop: 14,
    backgroundColor: GREEN,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "800",
    letterSpacing: 0.6,
  },
  secondaryBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnText: {
    fontWeight: "800",
    letterSpacing: 0.6,
  },
});
