// components/new/task/formulaire.tsx
import { GardenVegetable, TaskPriority } from "@/models/models";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormulaireProps = {
  title: string;
  description: string;
  plantId: string;
  dueDate: string;
  priority: TaskPriority | null;
  editingId: string | null;
  gardenVegetables: GardenVegetable[];

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
    gardenVegetables,
    setTitle,
    setDescription,
    setPriority,
    onSave,
    onPickPlant,
    onPickDueDate,
  } = props;

  const isEditing = Boolean(editingId);

  const formatDateFriendly = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const months = [
      "janvier", "février", "mars", "avril", "mai", "juin",
      "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  };

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
          placeholder="Ex: Récolter les fruits rouges..."
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
            {dueDate ? formatDateFriendly(dueDate) : "Sélectionnez une date"}
          </Text>
          <Text style={styles.chevron}>▾</Text>
        </Pressable>

        <Text style={styles.label}>Priorité</Text>
        <View style={styles.chipsRow}>
          {(["LOW", "MEDIUM", "HIGH"] as TaskPriority[]).map((p) => {
            const selected = priority === p;
            let activeStyle = {};
            let activeText = {};

            if (selected) {
              if (p === "LOW") {
                activeStyle = { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' };
                activeText = { color: '#1D4ED8' };
              } else if (p === "MEDIUM") {
                activeStyle = { borderColor: '#F59E0B', backgroundColor: '#FEF3C7' };
                activeText = { color: '#B45309' };
              } else {
                activeStyle = { borderColor: '#EF4444', backgroundColor: '#FEE2E2' };
                activeText = { color: '#B91C1C' };
              }
            }

            return (
              <Pressable
                key={p}
                onPress={() => setPriority(p)}
                style={[styles.chip, activeStyle]}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeText,
                  ]}
                >
                  {p === "LOW" ? "Basse" : p === "MEDIUM" ? "Moyenne" : "Haute"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
          <Text style={styles.primaryBtnText}>
            {isEditing ? "METTRE À JOUR LA TÂCHE" : "CRÉER LA TÂCHE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PLACEHOLDER = "#9CA3AF";
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
