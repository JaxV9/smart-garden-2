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
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "@/contexts/language.context";

type FormulaireProps = {
  title: string;
  description: string;
  plantId: string;
  dueDate: string;
  priority: TaskPriority | null;
  editingId: string | null;
  gardenVegetables: GardenVegetable[];
  
  frequency: "ONCE" | "WEEKLY" | "MONTHLY";
  selectedWeekdays: number[];
  selectedMonthDays: number[];

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setPlantId: (v: string) => void;
  setDueDate: (v: string) => void;
  setPriority: (v: TaskPriority | null) => void;
  
  setFrequency: (v: "ONCE" | "WEEKLY" | "MONTHLY") => void;
  setSelectedWeekdays: (v: number[]) => void;
  setSelectedMonthDays: (v: number[]) => void;

  onSave: () => void;
  onCancel?: () => void;

  onPickPlant?: () => void;
  onPickDueDate?: () => void;
};

export function Formulaire(props: FormulaireProps) {
  const { t } = useTranslation();

  const SUGGESTIONS = [
    t('task_sug_watering', 'Arrosage'),
    t('task_sug_sowing', 'Semis'),
    t('task_sug_planting', 'Plantation'),
    t('task_sug_harvesting', 'Récolte'),
    t('task_sug_mulching', 'Paillage'),
    t('task_sug_fertilizing', 'Fertilisation'),
    t('task_sug_transplanting', 'Repiquage'),
    t('task_sug_treatment', 'Traitement'),
    t('task_sug_move', 'Déplacer plante'),
    t('task_sug_remove', 'Retirer plante')
  ];

  const WEEKDAYS = [
    { id: 1, label: t('day_mon_short', 'L') },
    { id: 2, label: t('day_tue_short', 'M') },
    { id: 3, label: t('day_wed_short', 'M') },
    { id: 4, label: t('day_thu_short', 'J') },
    { id: 5, label: t('day_fri_short', 'V') },
    { id: 6, label: t('day_sat_short', 'S') },
    { id: 7, label: t('day_sun_short', 'D') },
  ];

  const {
    title,
    description,
    plantId,
    dueDate,
    priority,
    editingId,
    gardenVegetables,
    frequency,
    selectedWeekdays,
    selectedMonthDays,
    setTitle,
    setDescription,
    setPriority,
    setFrequency,
    setSelectedWeekdays,
    setSelectedMonthDays,
    onSave,
    onCancel,
    onPickPlant,
    onPickDueDate,
  } = props;

  const isEditing = Boolean(editingId);

  const formatDateFriendly = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const [year, month, day] = parts;
    const monthKeys = [
      "month_janvier", "month_février", "month_mars", "month_avril", "month_mai", "month_juin",
      "month_juillet", "month_août", "month_septembre", "month_octobre", "month_novembre", "month_décembre"
    ];
    const monthIndex = parseInt(month, 10) - 1;
    const monthName = monthKeys[monthIndex] ? t(monthKeys[monthIndex]) : month;
    return `${parseInt(day, 10)} ${monthName} ${year}`;
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>{t('task_field_name', 'Nom de la tâche')}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={t('task_placeholder_name', 'Définir la tâche ou choisir une suggestion')}
          placeholderTextColor={PLACEHOLDER}
          value={title}
          onChangeText={setTitle}
        />
        {title.length > 0 && (
          <TouchableOpacity onPress={() => setTitle("")} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {title.trim().length === 0 ? (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsLabel}>{t('task_suggestions', 'Suggestions')}</Text>
          <View style={styles.suggestionsGrid}>
            {SUGGESTIONS.map((sug) => (
              <TouchableOpacity
                key={sug}
                style={styles.suggestionCard}
                onPress={() => setTitle(sug)}
              >
                <Text style={styles.suggestionText}>{sug}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={{ marginTop: 8 }}>
          <Text style={styles.label}>{t('task_field_desc', 'Description (optionnel)')}</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder={t('task_placeholder_desc', 'Ex: Récolter les fruits rouges...')}
            placeholderTextColor={PLACEHOLDER}
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <Text style={styles.label}>{t('task_field_plant', 'Plante concernée (optionnel)')}</Text>
          <Pressable style={styles.select} onPress={onPickPlant}>
            <Text style={[styles.selectText, !plantId && styles.selectPlaceholder]}>
              {plantId
                ? gardenVegetables.find(p => p.gardenVegetableId === plantId)?.name || t('task_unknown_plant', 'Plante inconnue')
                : t('task_select_plant_placeholder', 'Sélectionnez une plante')}
            </Text>
            <Text style={styles.chevron}>▾</Text>
          </Pressable>

          <Text style={styles.label}>{t('task_field_frequency', 'Fréquence')}</Text>
          <View style={styles.freqRow}>
            {(["ONCE", "WEEKLY", "MONTHLY"] as const).map((freq) => {
              const selected = frequency === freq;
              return (
                <TouchableOpacity
                  key={freq}
                  style={[styles.freqBtn, selected && styles.freqBtnActive]}
                  onPress={() => setFrequency(freq)}
                >
                  <Text style={[styles.freqBtnText, selected && styles.freqBtnTextActive]}>
                    {freq === "ONCE" ? t('task_freq_once', '1 seule fois') : freq === "WEEKLY" ? t('task_freq_weekly', 'Toutes les semaines') : t('task_freq_monthly', 'Tous les mois')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {frequency === "ONCE" && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.label}>{t('task_field_date', 'Date')}</Text>
              <Pressable style={styles.select} onPress={onPickDueDate}>
                <Text style={[styles.selectText, !dueDate && styles.selectPlaceholder]}>
                  {dueDate ? formatDateFriendly(dueDate) : t('task_select_date_placeholder', 'Sélectionnez une date')}
                </Text>
                <Ionicons name="calendar-outline" size={16} color="#6F7A80" />
              </Pressable>
            </View>
          )}

          {frequency === "WEEKLY" && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.label}>{t('task_field_weekdays', 'Jours de la semaine')}</Text>
              <View style={styles.weekdaysContainer}>
                {WEEKDAYS.map((day) => {
                  const selected = selectedWeekdays.includes(day.id);
                  return (
                    <TouchableOpacity
                      key={day.id}
                      style={[styles.weekdayCircle, selected && styles.weekdayCircleActive]}
                      onPress={() => {
                        if (selected) {
                          setSelectedWeekdays(selectedWeekdays.filter(d => d !== day.id));
                        } else {
                          setSelectedWeekdays([...selectedWeekdays, day.id]);
                        }
                      }}
                    >
                      <Text style={[styles.weekdayText, selected && styles.weekdayTextActive]}>
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {frequency === "MONTHLY" && (
            <View style={{ marginTop: 6 }}>
              <Text style={styles.label}>{t('task_field_monthdays', 'Jours du mois')}</Text>
              <View style={styles.monthDaysGrid}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => {
                  const selected = selectedMonthDays.includes(dayNum);
                  return (
                    <TouchableOpacity
                      key={dayNum}
                      style={[styles.monthDayCell, selected && styles.monthDayCellActive]}
                      onPress={() => {
                        if (selected) {
                          setSelectedMonthDays(selectedMonthDays.filter(d => d !== dayNum));
                        } else {
                          setSelectedMonthDays([...selectedMonthDays, dayNum]);
                        }
                      }}
                    >
                      <Text style={[styles.monthDayText, selected && styles.monthDayTextActive]}>
                        {dayNum}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.actionRow}>
            {onCancel ? (
              <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                <Text style={styles.cancelBtnText}>{t('btn_cancel', 'ANNULER').toUpperCase()}</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity style={styles.primaryBtn} onPress={onSave}>
              <Text style={styles.primaryBtnText}>
                {isEditing ? t('btn_save', 'ENREGISTRER').toUpperCase() : t('task_create_btn', 'CRÉER LA TÂCHE')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const PLACEHOLDER = "#9CA3AF";
const BORDER = "#E4E7EA";
const TEXT = "#1C1C1C";
const GREEN = "#5A8E57";

const styles = StyleSheet.create({
  form: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#6F7A80",
    marginTop: 6,
    marginBottom: 2,
    fontWeight: "700",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    marginBottom: 6,
  },
  input: {
    height: 48,
    fontSize: 14,
    color: TEXT,
    fontWeight: "500",
  },
  clearButton: {
    padding: 6,
  },
  multiline: {
    minHeight: 72,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: TEXT,
    backgroundColor: "#FFFFFF",
    marginBottom: 6,
  },
  select: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 6,
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
  suggestionsContainer: {
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 10,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionCard: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  suggestionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  freqRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  freqBtn: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  freqBtnActive: {
    borderColor: GREEN,
    backgroundColor: "rgba(90,142,87,0.08)",
  },
  freqBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#4B5563",
  },
  freqBtnTextActive: {
    color: GREEN,
    fontWeight: "700",
  },
  weekdaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 8,
  },
  weekdayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  weekdayCircleActive: {
    borderColor: GREEN,
    backgroundColor: GREEN,
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4B5563",
  },
  weekdayTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  monthDaysGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 6,
    marginBottom: 8,
    justifyContent: "flex-start",
  },
  monthDayCell: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: BORDER,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  monthDayCellActive: {
    borderColor: GREEN,
    backgroundColor: GREEN,
  },
  monthDayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4B5563",
  },
  monthDayTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 18,
    marginBottom: 12,
  },
  cancelBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  cancelBtnText: {
    color: "#4B5563",
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  primaryBtn: {
    flex: 2,
    height: 48,
    borderRadius: 12,
    backgroundColor: GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    color: "white",
    fontWeight: "800",
    letterSpacing: 0.6,
  },
});
