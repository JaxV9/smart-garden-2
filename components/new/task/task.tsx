// components/new/task/task.tsx
import { useGarden } from "@/hooks/useGarden";
import { useTasks } from "@/hooks/useTasks";
import { TaskPriority, Task as TaskType } from "@/models/models";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
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
} from "react-native";
import { Formulaire } from "./formulaire";

import { useVegetablesContext } from "@/contexts/vegetables.context";

export function Task() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskStatus } = useTasks();
  const { gardenVegetables, loadGardenVegetables } = useGarden();
  const { vegetablesContext } = useVegetablesContext();

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
  const [isDoneExpanded, setIsDoneExpanded] = useState(true);

  useEffect(() => {
    loadGardenVegetables();
  }, []);

  async function onSave() {
    if (!title.trim()) return;

    try {
      if (editingId) {
        await updateTask(editingId, {
          title,
          description: description || undefined,
          category: category || undefined,
          plantId: plantId || undefined,
          dueDate: dueDate || undefined,
          priority: priority || undefined,
          reminder,
        });
        setEditingId(null);
      } else {
        const payload: Partial<Omit<TaskType, "id" | "createdAt" | "userId">> =
          { title };

        if (description.trim()) payload.description = description;
        if (category.trim()) payload.category = category;
        if (plantId) (payload as any).plantId = plantId;
        if (dueDate) payload.dueDate = dueDate;
        if (priority) payload.priority = priority;
        if (reminder) payload.reminder = reminder;

        console.log("Task onSave create payload", payload);

        await createTask(payload as any);
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
    setShowForm(false);
  }

  const tasksToDo = tasks.filter(
    (t: TaskType & { completed?: boolean }) => !t.completed,
  );
  const tasksDone = tasks.filter(
    (t: TaskType & { completed?: boolean }) => t.completed,
  );

  function openCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPlantId(null);
    setDueDate("");
    setPriority(null);
    setReminder(false);
    setShowForm(true);
  }

  function openEdit(item: TaskType) {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setPlantId(item.plant?.id ?? null);
    setDueDate(
      item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "",
    );
    setPriority(item.priority ?? null);
    setReminder(item.reminder ?? false);
    setShowForm(true);
  }

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDueDate(selectedDate.toISOString().slice(0, 10));
    }

    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
  };

  const renderTask = ({ item }: { item: TaskType }) => {
    const completed = (item as any).completed;
    const plantName = item.plant
      ? vegetablesContext.find(v => v.id === item.plant?.vegetableId)?.name || item.plant.vegetableId
      : "";

    return (
      <View key={item.id} style={[styles.card, completed && styles.cardDone]}>
        <View style={styles.cardLeft}>
          <TouchableOpacity
            onPress={() => {
              console.log("🖱️ Clic coche pour tâche:", item.id, item.title);  // ← DEBUG
              toggleTaskStatus(item);
            }}
            activeOpacity={0.7}
            style={[
              styles.checkbox,
              completed && styles.checkboxDone,
            ]}
          >
            {completed && <Text style={{ color: '#16A34A', textAlign: 'center' }}>✓</Text>}
          </TouchableOpacity>
          <View style={styles.cardText}>
            <Text
              style={[
                styles.cardTitle,
                completed && styles.cardTitleDone,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            {!!item.description && (
              <Text
                style={[
                  styles.cardSubtitle,
                  completed && styles.cardSubtitleDone,
                ]}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            )}
            <View style={styles.chipsRow}>
              {!!item.plant && (
                <View style={[styles.chip, styles.chipPlant]}>
                  <Text style={styles.chipText}>{plantName}</Text>
                </View>
              )}
              {!!item.priority && (
                <View
                  style={[
                    styles.chip,
                    item.priority === "HIGH"
                      ? styles.chipHigh
                      : item.priority === "MEDIUM"
                        ? styles.chipMedium
                        : styles.chipLow,
                  ]}
                >
                  <Text style={styles.chipText}>
                    {item.priority === "HIGH"
                      ? "Haute"
                      : item.priority === "MEDIUM"
                        ? "Moyenne"
                        : "Basse"}
                  </Text>
                </View>
              )}
              {!!item.dueDate && (
                <View style={[styles.chip, styles.chipDate]}>
                  <Text style={styles.chipText}>
                    {new Date(item.dueDate).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <View style={styles.cardRight}>
          <TouchableOpacity
            onPress={() =>
              setMenuTaskId((prev) => (prev === item.id ? null : item.id))
            }
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.moreIcon}>⋮</Text>
          </TouchableOpacity>

          {menuTaskId === item.id && (
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setMenuTaskId(null);
                  openEdit(item);
                }}
              >
                <Text style={styles.menuItemText}>Modifier la tâche</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={async () => {
                  setMenuTaskId(null);
                  await deleteTask(item.id);
                }}
              >
                <Text style={[styles.menuItemText, styles.menuDeleteText]}>
                  Supprimer la tâche
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const handlePickDueDate = () => {
    setShowDatePicker(true);
  };

  const handlePickPlant = () => {
    setShowPlantPicker(true);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading && <ActivityIndicator style={{ marginVertical: 8 }} />}

        <Text style={styles.sectionTitle}>
          À faire ({tasksToDo.length})
        </Text>

        {tasksToDo.map((item) => renderTask({ item }))}

        {tasksToDo.length === 0 && !loading && (
          <Text style={styles.emptyText}>Aucune tâche à faire.</Text>
        )}

        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => setIsDoneExpanded(!isDoneExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.sectionHeaderLeft}>
            <Ionicons
              name={isDoneExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#374151"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.sectionTitleNoMargin}>
              Terminées ({tasksDone.length})
            </Text>
          </View>
          <View style={styles.headerMoreBtn}>
            <Text style={styles.moreIcon}>⋮</Text>
          </View>
        </TouchableOpacity>

        {isDoneExpanded && (
          <>
            {tasksDone.map((item) => renderTask({ item }))}
            {tasksDone.length === 0 && !loading && (
              <Text style={styles.emptyText}>Aucune tâche terminée.</Text>
            )}
          </>
        )}
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity style={styles.newTaskButton} onPress={openCreate}>
          <Text style={styles.newTaskText}>+ AJOUTER UNE TÂCHE</Text>
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
              <TouchableWithoutFeedback onPress={() => { }}>
                <View style={styles.modalCard}>
                  <View style={styles.bottomSheetHandle} />

                  {showPlantPicker ? (
                    <>
                      <Text style={styles.formHeaderTitle}>
                        Sélectionner une plante
                      </Text>

                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 16 }}
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

                        {gardenVegetables.length === 0 && (
                          <Text style={[styles.emptyText, { textAlign: 'center', marginVertical: 12 }]}>
                            Aucune plante dans votre jardin.
                          </Text>
                        )}

                        <TouchableOpacity
                          style={[styles.closeButton, { marginTop: 12, backgroundColor: '#4B5563' }]}
                          onPress={() => setShowPlantPicker(false)}
                        >
                          <Text style={styles.closeButtonText}>RETOUR</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </>
                  ) : (
                    <>
                      <Text style={styles.formHeaderTitle}>
                        {editingId ? "Modifier la tâche" : "Nouvelle tâche"}
                      </Text>

                      <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 16 }}
                      >
                        <Formulaire
                          title={title}
                          description={description}
                          plantId={plantId || ""}
                          dueDate={dueDate}
                          priority={priority}
                          editingId={editingId}
                          gardenVegetables={gardenVegetables}
                          setTitle={setTitle}
                          setDescription={setDescription}
                          setPlantId={setPlantId}
                          setDueDate={setDueDate}
                          setPriority={setPriority}
                          onSave={onSave}
                          onPickDueDate={handlePickDueDate}
                          onPickPlant={handlePickPlant}
                        />

                        <TouchableOpacity
                          style={styles.closeButton}
                          onPress={() => setShowForm(false)}
                        >
                          <Text style={styles.closeButtonText}>ANNULER</Text>
                        </TouchableOpacity>
                      </ScrollView>
                    </>
                  )}

                  {showDatePicker && (
                    <View style={styles.datePickerContainer}>
                      {Platform.OS === "ios" && (
                        <View style={styles.datePickerHeader}>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.datePickerHeaderCancel}>Annuler</Text>
                          </TouchableOpacity>
                          <Text style={styles.datePickerHeaderTitle}>Date d'échéance</Text>
                          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                            <Text style={styles.datePickerHeaderConfirm}>Valider</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      <DateTimePicker
                        value={dueDate ? new Date(dueDate) : new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        minimumDate={new Date()}
                        onChange={handleDateChange}
                      />
                    </View>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  newTaskButton: {
    height: 48,
    borderRadius: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMoreBtn: {
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 12,
    color: "#111827",
  },
  sectionTitleNoMargin: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  listContent: {
    paddingBottom: 8,
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
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 8,
  },
  cardDone: {
    opacity: 0.7,
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
    borderColor: "#D1D5DB",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxDone: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  cardTitleDone: {
    textDecorationLine: "line-through",
    color: "#6B7280",
  },
  cardSubtitle: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 14,
  },
  cardSubtitleDone: {
    textDecorationLine: "line-through",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  chipPlant: {
    backgroundColor: "#DCFCE7",
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
    backgroundColor: "#E5E7EB",
  },
  chipText: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "500",
  },
  cardRight: {
    marginLeft: 8,
    alignItems: "flex-end",
  },
  moreIcon: {
    fontSize: 20,
    color: "#6B7280",
  },
  menu: {
    position: "absolute",
    top: 32,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 12,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 14,
    color: "#111827",
  },
  menuDeleteText: {
    color: "#DC2626",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    width: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === "ios" ? 40 : 30,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 10,
    elevation: 24,
    maxHeight: "90%",
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
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 18,
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
    fontSize: 16,
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
});
