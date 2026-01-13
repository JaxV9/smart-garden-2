// components/new/task/task.tsx
import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useTasks } from "@/hooks/useTasks";
import { Task as TaskType, TaskPriority } from "@/models/models";
import { Formulaire } from "./formulaire";

export function Task() {
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [plant, setPlant] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority | null>(null);
  const [reminder, setReminder] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  async function onSave() {
    if (!title.trim()) return;

    try {
      if (editingId) {
        await updateTask(editingId, {
          title,
          description: description || undefined,
          category: category || undefined,
          plant: plant || undefined,
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
        if (plant.trim()) payload.plant = plant;
        if (dueDate) payload.dueDate = dueDate;
        if (priority) payload.priority = priority;
        if (reminder) payload.reminder = reminder;

        await createTask(payload as any);
      }
    } catch (e) {
      console.log("onSave ERROR", e);
    }

    setTitle("");
    setDescription("");
    setCategory("");
    setPlant("");
    setDueDate("");
    setPriority(null);
    setReminder(false);
    setShowForm(false);
  }

  const tasksToDo = tasks.filter((t: TaskType & { completed?: boolean }) => !t.completed);
  const tasksDone = tasks.filter((t: TaskType & { completed?: boolean }) => t.completed);


  function openCreate() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPlant("");
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
    setPlant(item.plant ?? "");
    setDueDate(
      item.dueDate ? new Date(item.dueDate).toISOString().slice(0, 10) : "",
    );
    setPriority(item.priority ?? null);
    setReminder(item.reminder ?? false);
    setShowForm(true);
  }

  const renderTask = ({ item }: { item: TaskType }) => {
    const completed = (item as any).completed;

    return (
      <View style={[styles.card, completed && styles.cardDone]}>
        <View style={styles.cardLeft}>
          <View
            style={[
              styles.checkbox,
              completed && styles.checkboxDone,
            ]}
          />

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
                  <Text style={styles.chipText}>{item.plant}</Text>
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.newTaskButton} onPress={openCreate}>
        <Text style={styles.newTaskText}>+ Nouvelle tâche</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator style={{ marginTop: 8 }} />}

      <Text style={styles.sectionTitle}>
        À faire ({tasksToDo.length})
      </Text>
      <FlatList
        data={tasksToDo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderTask}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Aucune tâche à faire.</Text>
          ) : null
        }
      />

      <Text style={styles.sectionTitle}>
        Terminées ({tasksDone.length})
      </Text>
      <FlatList
        data={tasksDone}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={renderTask}
        ListEmptyComponent={
          !loading ? (
            <Text style={styles.emptyText}>Aucune tâche terminée.</Text>
          ) : null
        }
      />

      <Modal
        visible={showForm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Formulaire
              title={title}
              description={description}
              plant={plant}
              dueDate={dueDate}
              priority={priority}
              editingId={editingId}
              setTitle={setTitle}
              setDescription={setDescription}
              setPlant={setPlant}
              setDueDate={setDueDate}
              setPriority={setPriority}
              onSave={onSave}
            />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowForm(false)}
            >
              <Text style={styles.closeButtonText}>ANNULER</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    backgroundColor: "#F3F4F6",
  },
  newTaskButton: {
    height: 48,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  newTaskText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 8,
    marginBottom: 4,
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
    top: 24,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingVertical: 4,
    minWidth: 180,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
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
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "90%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
  closeButton: {
    marginTop: 12,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#6B7280",
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
