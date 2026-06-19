// components/new/task/task.tsx
import { useGarden } from "@/hooks/useGarden";
import { useTasks } from "@/hooks/useTasks";
import { TaskPriority, Task as TaskType } from "@/models/models";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState, useRef } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Dimensions,
  FlatList,
} from "react-native";
import { Formulaire } from "./formulaire";
import { useVegetablesContext } from "@/contexts/vegetables.context";
import { useGardenContext } from "@/contexts/garden.context";
import { useRouter } from "expo-router";
import { useNotificationContext } from "@/contexts/notification.context";
import { useTranslation } from "@/contexts/language.context";

const screenWidth = Dimensions.get("window").width;

type TaskOccurrence = {
  isRecurrent: boolean;
  frequency: "ONCE" | "WEEKLY" | "MONTHLY";
  weekdays: number[];
  monthDays: number[];
  completedDates: string[];
};

function parseTaskRecurrence(task: TaskType): TaskOccurrence {
  try {
    if (task.category && task.category.startsWith("{")) {
      const parsed = JSON.parse(task.category);
      if (parsed.hasOwnProperty("frequency")) {
        return {
          isRecurrent: parsed.isRecurrent ?? (parsed.frequency !== "ONCE"),
          frequency: parsed.frequency || "ONCE",
          weekdays: parsed.weekdays || [],
          monthDays: parsed.monthDays || [],
          completedDates: parsed.completedDates || [],
        };
      }
    }
  } catch (e) {
  }
  return {
    isRecurrent: false,
    frequency: "ONCE",
    weekdays: [],
    monthDays: [],
    completedDates: task.completed && task.dueDate ? [task.dueDate] : [],
  };
}

function serializeTaskRecurrence(occ: TaskOccurrence): string {
  return JSON.stringify(occ);
}

function getLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isTaskAssignedToDate(task: TaskType, date: Date): boolean {
  const occ = parseTaskRecurrence(task);
  const dateStr = getLocalDateString(date);

  if (occ.frequency === "ONCE") {
    return task.dueDate ? task.dueDate.slice(0, 10) === dateStr : false;
  }

  if (occ.frequency === "WEEKLY") {
    const day = date.getDay();
    const isoDay = day === 0 ? 7 : day;
    return occ.weekdays.includes(isoDay);
  }

  if (occ.frequency === "MONTHLY") {
    const dayOfMonth = date.getDate();
    return occ.monthDays.includes(dayOfMonth);
  }

  return false;
}

function isTaskCompletedOnDate(task: TaskType, date: Date): boolean {
  const occ = parseTaskRecurrence(task);
  const dateStr = getLocalDateString(date);

  if (occ.frequency === "ONCE") {
    return task.completed;
  }

  return occ.completedDates.includes(dateStr);
}

const isSameDayPlain = (d1: Date, d2: Date) => {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
};

// getDayLetter is defined inside Task component using useTranslation

export function Task() {
  const router = useRouter();
  const { addNotification } = useNotificationContext();
  const { t } = useTranslation();

  const getDayLetter = (date: Date) => {
    const day = date.getDay();
    const keys = [
      "day_sun_short",
      "day_mon_short",
      "day_tue_short",
      "day_wed_short",
      "day_thu_short",
      "day_fri_short",
      "day_sat_short"
    ];
    return t(keys[day]);
  };
  const { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { gardenVegetables, loadGardenVegetables } = useGarden();
  const { vegetablesContext } = useVegetablesContext();
  const { gardenInfo } = useGardenContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [reminder, setReminder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [plantId, setPlantId] = useState<string | null>(null);
  const [showPlantPicker, setShowPlantPicker] = useState(false);

  const [frequency, setFrequency] = useState<"ONCE" | "WEEKLY" | "MONTHLY">("ONCE");
  const [selectedWeekdays, setSelectedWeekdays] = useState<number[]>([]);
  const [selectedMonthDays, setSelectedMonthDays] = useState<number[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const [pivotDate] = useState(() => new Date());
  const [weeks, setWeeks] = useState<Date[][]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(10);
  const [dayOffsets, setDayOffsets] = useState<Record<string, number>>({});
  
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);

  const verticalScrollRef = useRef<ScrollView>(null);

  const getStartOfWeek = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getDaysOfWeek = (monday: Date): Date[] => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const generateWeeksList = (pivot: Date) => {
    const currentMonday = getStartOfWeek(pivot);
    const tempWeeks: Date[][] = [];
    for (let w = -10; w <= 10; w++) {
      const monday = new Date(currentMonday);
      monday.setDate(currentMonday.getDate() + w * 7);
      tempWeeks.push(getDaysOfWeek(monday));
    }
    return tempWeeks;
  };

  useEffect(() => {
    loadGardenVegetables();
    setWeeks(generateWeeksList(pivotDate));
  }, []);

  useEffect(() => {
    if (weeks.length > 0 && weeks[activeWeekIndex]) {
      const currentDayOfWeek = selectedDate.getDay();
      const targetDay = weeks[activeWeekIndex].find(d => d.getDay() === currentDayOfWeek);
      if (targetDay && !isSameDayPlain(targetDay, selectedDate)) {
        setSelectedDate(targetDay);
      }
    }
  }, [activeWeekIndex]);

  useEffect(() => {
    const dateStr = getLocalDateString(selectedDate);
    if (dayOffsets[dateStr] !== undefined) {
      const timer = setTimeout(() => {
        verticalScrollRef.current?.scrollTo({ y: dayOffsets[dateStr] - 12, animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, activeWeekIndex]);

  async function handleToggleTaskForDate(task: TaskType, date: Date) {
    const occ = parseTaskRecurrence(task);
    const dateStr = getLocalDateString(date);

    if (occ.frequency === "ONCE") {
      const willBeCompleted = !task.completed;
      await toggleTaskStatus(task);
      if (willBeCompleted) {
        addNotification(
          t("notif_task_done_title"),
          t("notif_task_done_body").replace("{{title}}", task.title),
          "TASK"
        );
      }
    } else {
      let newCompletedDates = [...occ.completedDates];
      const willBeCompleted = !newCompletedDates.includes(dateStr);
      if (newCompletedDates.includes(dateStr)) {
        newCompletedDates = newCompletedDates.filter(d => d !== dateStr);
      } else {
        newCompletedDates.push(dateStr);
      }

      const updatedOcc = { ...occ, completedDates: newCompletedDates };
      const serialized = serializeTaskRecurrence(updatedOcc);

      await updateTask(task.id, {
        category: serialized
      });

      if (willBeCompleted) {
        addNotification(
          t("notif_task_recurrent_title"),
          t("notif_task_recurrent_body").replace("{{title}}", task.title),
          "TASK"
        );
      }
    }
  }

  async function onSave() {
    if (!title.trim()) return;

    const occ: TaskOccurrence = {
      isRecurrent: frequency !== "ONCE",
      frequency,
      weekdays: frequency === "WEEKLY" ? selectedWeekdays : [],
      monthDays: frequency === "MONTHLY" ? selectedMonthDays : [],
      completedDates: editingId ? parseTaskRecurrence(tasks.find(t => t.id === editingId)!).completedDates : []
    };

    const serializedCategory = serializeTaskRecurrence(occ);

    try {
      if (editingId) {
        await updateTask(editingId, {
          title,
          description: description || undefined,
          category: serializedCategory,
          plantId: plantId || undefined,
          dueDate: frequency === "ONCE" ? dueDate : undefined,
          priority: priority || undefined,
          reminder,
        });
        setEditingId(null);
      } else {
        const payload: any = {
          title,
          category: serializedCategory,
          reminder,
        };

        if (description.trim()) payload.description = description;
        if (plantId) payload.plantId = plantId;
        if (frequency === "ONCE" && dueDate) payload.dueDate = dueDate;
        if (priority) payload.priority = priority;

        await createTask(payload);

        addNotification(
          t("notif_task_created_title"),
          t("notif_task_created_body").replace("{{title}}", title),
          "TASK"
        );
      }
    } catch (e) {
      console.log("onSave ERROR", e);
    }

    setTitle("");
    setDescription("");
    setCategory("");
    setPlantId(null);
    setDueDate("");
    setPriority(null);
    setReminder(false);
    setFrequency("ONCE");
    setSelectedWeekdays([]);
    setSelectedMonthDays([]);
    setShowForm(false);
  }

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPlantId(null);
    setDueDate(getLocalDateString(new Date()));
    setPriority(null);
    setReminder(false);
    setFrequency("ONCE");
    setSelectedWeekdays([]);
    setSelectedMonthDays([]);
    setShowForm(true);
  }

  function openEdit(item: TaskType) {
    const occ = parseTaskRecurrence(item);
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setPlantId(item.plant?.id ?? null);
    setDueDate(item.dueDate ?? "");
    setPriority(item.priority ?? null);
    setReminder(item.reminder ?? false);

    setFrequency(occ.frequency);
    setSelectedWeekdays(occ.weekdays);
    setSelectedMonthDays(occ.monthDays);

    setShowForm(true);
  }

  const handleDateChange = (event: any, selectedVal?: Date) => {
    if (selectedVal) {
      setDueDate(getLocalDateString(selectedVal));
    }
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const handlePickDueDate = () => {
    setShowDatePicker(true);
  };

  const handlePickPlant = () => {
    setShowPlantPicker(true);
  };

  const formatBandeauDate = (date: Date): string => {
    const todayVal = new Date();
    const formatDigit = (n: number) => n.toString().padStart(2, "0");
    const dStr = `${formatDigit(date.getDate())}/${formatDigit(date.getMonth() + 1)}/${date.getFullYear().toString().slice(-2)}`;

    if (isSameDayPlain(date, todayVal)) {
      return `${dStr} - ${t('today', "Aujourd'hui")}`;
    }
    return dStr;
  };

  const getItemLayout = (data: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  return (
    <View style={styles.container}>
      <View style={styles.calendarSubHeader}>
        {weeks.length > 0 ? (
          <FlatList
            data={weeks}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={10}
            getItemLayout={getItemLayout}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
              setActiveWeekIndex(index);
            }}
            keyExtractor={(_, idx) => `week-${idx}`}
            renderItem={({ item: weekDays }) => (
              <View style={styles.weekDaysContainer}>
                {weekDays.map((day) => {
                  const isSelected = isSameDayPlain(day, selectedDate);
                  return (
                    <TouchableOpacity
                      key={day.toISOString()}
                      style={[
                        styles.dayBtn,
                        isSelected && styles.dayBtnSelected,
                      ]}
                      onPress={() => setSelectedDate(day)}
                    >
                      <Text style={[styles.dayLetter, isSelected && styles.dayLetterSelected]}>
                        {getDayLetter(day)}
                      </Text>
                      <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                        {day.getDate()}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          />
        ) : null}
      </View>

      <ScrollView
        ref={verticalScrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!!loading && <ActivityIndicator style={{ marginVertical: 8 }} />}

        {weeks[activeWeekIndex] ? (
          weeks[activeWeekIndex].map((day) => {
            const dateStr = getLocalDateString(day);
            const dayTasks = tasks.filter((t) => isTaskAssignedToDate(t, day));

            return (
              <View
                key={dateStr}
                onLayout={(e) => {
                  const y = e.nativeEvent.layout.y;
                  setDayOffsets((prev) => ({ ...prev, [dateStr]: y }));
                }}
                style={styles.daySection}
              >
                <View style={styles.dayBandeau}>
                  <Text style={styles.dayBandeauText}>{formatBandeauDate(day)}</Text>
                </View>

                {dayTasks.length > 0 ? (
                  dayTasks.map((task) => {
                    const isCompleted = isTaskCompletedOnDate(task, day);
                    const plantName = task.plant
                      ? vegetablesContext.find((v) => v.id === task.plant?.vegetableId)?.name || task.plant.vegetableId
                      : "";
                    const occ = parseTaskRecurrence(task);
                    let freqLabel = t('task_freq_once', '1 seule fois');
                    if (occ.frequency === "WEEKLY") freqLabel = t('task_freq_weekly', 'Toutes les semaines');
                    if (occ.frequency === "MONTHLY") freqLabel = t('task_freq_monthly', 'Tous les mois');

                    return (
                      <View key={`${task.id}-${dateStr}`} style={[styles.card, isCompleted && styles.cardDone]}>
                        <View style={styles.cardLeft}>
                          <TouchableOpacity
                            onPress={() => handleToggleTaskForDate(task, day)}
                            activeOpacity={0.7}
                            style={[styles.checkbox, isCompleted && styles.checkboxDone]}
                          >
                            {isCompleted ? <Text style={styles.checkIcon}>✓</Text> : null}
                          </TouchableOpacity>
                          
                          <View style={styles.cardText}>
                            <Text
                              style={[styles.cardTitle, isCompleted && styles.cardTitleDone]}
                              numberOfLines={1}
                            >
                              {task.title}
                            </Text>
                            
                            {task.description ? (
                              <Text
                                style={[styles.cardSubtitle, isCompleted && styles.cardSubtitleDone]}
                                numberOfLines={2}
                              >
                                {task.description}
                              </Text>
                            ) : null}
                            
                            <View style={styles.chipsRow}>
                              {task.plant ? (
                                <View style={[styles.chip, styles.chipPlant]}>
                                  <Text style={styles.chipText}>{plantName}</Text>
                                </View>
                              ) : null}
                              
                              <View style={[styles.chip, styles.chipDate]}>
                                <Ionicons name="repeat-outline" size={12} color="#6F7A80" style={{ marginRight: 4 }} />
                                <Text style={styles.chipText}>{freqLabel}</Text>
                              </View>
                              
                              {task.priority ? (
                                <View
                                  style={[
                                    styles.chip,
                                    task.priority === "HIGH"
                                      ? styles.chipHigh
                                      : task.priority === "MEDIUM"
                                        ? styles.chipMedium
                                        : styles.chipLow,
                                  ]}
                                >
                                  <Text style={styles.chipText}>
                                    {task.priority === "HIGH"
                                      ? t('priority_high', 'Haute')
                                      : task.priority === "MEDIUM"
                                        ? t('priority_medium', 'Moyenne')
                                        : t('priority_low', 'Basse')}
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                          </View>
                        </View>

                        <View style={styles.cardRight}>
                          <TouchableOpacity
                            onPress={() =>
                              setMenuTaskId((prev) => (prev === `${task.id}-${dateStr}` ? null : `${task.id}-${dateStr}`))
                            }
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          >
                            <Ionicons name="ellipsis-vertical" size={18} color="#6B7280" />
                          </TouchableOpacity>

                          {menuTaskId === `${task.id}-${dateStr}` ? (
                            <View style={styles.menu}>
                              <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                  setMenuTaskId(null);
                                  openEdit(task);
                                }}
                              >
                                <Text style={styles.menuItemText}>{t('task_edit', 'Modifier la tâche')}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                  setMenuTaskId(null);
                                  setDeleteConfirmTaskId(task.id);
                                }}
                              >
                                <Text style={[styles.menuItemText, styles.menuDeleteText]}>
                                  {t('task_delete', 'Supprimer la tâche')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : null}
                        </View>
                      </View>
                    );
                  })
                ) : (
                  <Text style={styles.emptyDayText}>{t('task_empty_day', 'Aucune tâche pour ce jour.')}</Text>
                )}
              </View>
            );
          })
        ) : null}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.newTaskButton} onPress={openCreate}>
          <Text style={styles.newTaskText}>{t('task_add_btn', '+ AJOUTER UNE TÂCHE')}</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowForm(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoid}
        >
          <TouchableWithoutFeedback onPress={() => setShowForm(false)}>
            <View style={styles.modalBackdrop}>
              <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalCard}>

                  {showPlantPicker ? (
                    <>
                      <Text style={styles.formHeaderTitle}>
                        {t('task_select_plant', 'Sélectionner une plante')}
                      </Text>

                      <ScrollView
                        style={styles.modalScrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                      >
                        {gardenVegetables.map((plant) => (
                          <TouchableOpacity
                            key={plant.gardenVegetableId}
                            style={styles.pickerItem}
                            onPress={() => {
                              setPlantId(plant.gardenVegetableId);
                              setShowPlantPicker(false);
                            }}
                          >
                            <Ionicons name="leaf-outline" size={16} color="#5A7F54" style={{ marginRight: 10 }} />
                            <Text style={styles.pickerItemText}>{plant.name}</Text>
                          </TouchableOpacity>
                        ))}

                        {gardenVegetables.length === 0 ? (
                          <Text style={[styles.emptyText, { textAlign: 'center', marginVertical: 12 }]}>
                            {t('task_no_plants', 'Aucune plante dans votre jardin.')}
                          </Text>
                        ) : null}

                        <TouchableOpacity
                          style={[styles.closeButton, { marginTop: 12, backgroundColor: '#4B5563' }]}
                          onPress={() => setShowPlantPicker(false)}
                        >
                          <Text style={styles.closeButtonText}>{t('btn_back', 'RETOUR').toUpperCase()}</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </>
                  ) : (
                    <>
                      <Text style={styles.formHeaderTitle}>
                        {editingId ? t('task_edit', 'Modifier la tâche') : t('task_new', 'Nouvelle tâche')}
                      </Text>

                      <ScrollView
                        style={styles.modalScrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                      >
                        <Formulaire
                          title={title}
                          description={description}
                          plantId={plantId || ""}
                          dueDate={dueDate}
                          priority={priority}
                          editingId={editingId}
                          gardenVegetables={gardenVegetables}
                          frequency={frequency}
                          selectedWeekdays={selectedWeekdays}
                          selectedMonthDays={selectedMonthDays}
                          setTitle={setTitle}
                          setDescription={setDescription}
                          setPlantId={setPlantId}
                          setDueDate={setDueDate}
                          setPriority={setPriority}
                          setFrequency={setFrequency}
                          setSelectedWeekdays={setSelectedWeekdays}
                          setSelectedMonthDays={setSelectedMonthDays}
                          onSave={onSave}
                          onCancel={() => setShowForm(false)}
                          onPickDueDate={handlePickDueDate}
                          onPickPlant={handlePickPlant}
                        />
                      </ScrollView>
                    </>
                  )}

                  {showDatePicker ? (
                    <View style={styles.datePickerContainer}>
                      {Platform.OS === "ios" ? (
                        <View style={styles.datePickerHeader}>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.datePickerHeaderCancel}>{t('btn_cancel', 'Annuler')}</Text>
                          </TouchableOpacity>
                          <Text style={styles.datePickerHeaderTitle}>{t('task_due_date', "Date d'échéance")}</Text>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.datePickerHeaderConfirm}>{t('btn_confirm', 'Valider')}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : null}
                      <DateTimePicker
                        value={dueDate ? new Date(dueDate) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        minimumDate={new Date()}
                        onChange={handleDateChange}
                      />
                    </View>
                  ) : null}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={deleteConfirmTaskId !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteConfirmTaskId(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={styles.confirmCard}>
            <Text style={styles.confirmTitle}>{t('task_delete_confirm_title', 'Supprimer la tâche')}</Text>
            <Text style={styles.confirmText}>
              {t('task_delete_confirm_desc', 'Êtes-vous sûr de vouloir supprimer cette tâche définitivement ?')}
            </Text>
            <View style={styles.confirmButtons}>
              <TouchableOpacity
                style={styles.confirmCancelBtn}
                onPress={() => setDeleteConfirmTaskId(null)}
              >
                <Text style={styles.confirmCancelBtnText}>{t('btn_cancel', 'Annuler')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmSubmitBtn}
                onPress={async () => {
                  if (deleteConfirmTaskId) {
                    await deleteTask(deleteConfirmTaskId);
                    setDeleteConfirmTaskId(null);
                  }
                }}
              >
                <Text style={styles.confirmSubmitBtnText}>{t('task_delete', 'Supprimer')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  calendarSubHeader: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  weekDaysContainer: {
    width: screenWidth,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  dayBtn: {
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 99,
  },
  dayBtnSelected: {
    backgroundColor: "#5A7F54",
  },
  dayLetter: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginBottom: 4,
  },
  dayLetterSelected: {
    color: "#FFFFFF",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
  },
  dayNumberSelected: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  daySection: {
    marginBottom: 8,
  },
  dayBandeau: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dayBandeauText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4B5563",
    fontStyle: "italic",
  },
  emptyDayText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  newTaskButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: "#5A7F54",
    alignItems: "center",
    justifyContent: "center",
  },
  newTaskText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyText: {
    color: "#9CA3AF",
    fontStyle: "italic",
    marginVertical: 8,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginHorizontal: 16,
    marginVertical: 6,
  },
  cardDone: {
    opacity: 0.6,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#9CA3AF",
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    borderColor: "#5A7F54",
    backgroundColor: "#E2ECE1",
  },
  checkIcon: {
    color: "#5A7F54",
    fontWeight: "800",
    fontSize: 12,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardTitleDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  cardSubtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
  cardSubtitleDone: {
    textDecorationLine: "line-through",
    color: "#9CA3AF",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  chipPlant: {
    backgroundColor: "#E2ECE1",
  },
  chipHigh: {
    backgroundColor: "#FEE2E2",
  },
  chipMedium: {
    backgroundColor: "#FEF3C7",
  },
  chipLow: {
    backgroundColor: "#E0F2FE",
  },
  chipDate: {
    backgroundColor: "#F3F4F6",
  },
  chipText: {
    fontSize: 11,
    color: "#4B5563",
    fontWeight: "600",
  },
  cardRight: {
    marginLeft: 8,
  },
  menu: {
    position: "absolute",
    top: 24,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 6,
    minWidth: 160,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    zIndex: 99,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  menuDeleteText: {
    color: "#DC2626",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "92%",
    maxHeight: "85%",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 24,
  },
  modalScrollView: {
    flexShrink: 1,
    width: "100%",
  },
  keyboardAvoid: {
    flex: 1,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 16,
  },
  formHeaderTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
  },
  pickerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  pickerItemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  closeButton: {
    marginTop: 12,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  datePickerContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
  },
  datePickerHeaderCancel: {
    color: "#6B7280",
    fontWeight: "600",
    fontSize: 15,
  },
  datePickerHeaderTitle: {
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 16,
  },
  datePickerHeaderConfirm: {
    color: "#5A7F54",
    fontWeight: "700",
    fontSize: 15,
  },
  confirmOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  confirmCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  confirmText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    marginBottom: 24,
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  confirmCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  confirmCancelBtnText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  confirmSubmitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
  },
  confirmSubmitBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
