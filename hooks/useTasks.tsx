// hooks/useTasks.ts
import { useEffect, useState } from "react";
import { Task, TaskCreateInput } from "@/models/models";
import { useFetch } from "@/hooks/useFetch";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const { httpClient } = useFetch(undefined); //ici au lieu de undefined tu mets ton localhost sans le / à la fin

  async function fetchTasks() {
    try {
      setLoading(true);
      const http = await httpClient;
      const response = await http.get("/api/task");
      if (response.status !== "Failure") {
        const data = response.payload as { tasks: Task[] };
        setTasks(data.tasks ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function createTask(payload: TaskCreateInput) {
  console.log("useTasks.createTask payload", payload);
  try {
    const http = await httpClient;
    console.log("useTasks.createTask http client ready");

    const response = await http.post("/api/task", payload);
    console.log("useTasks.createTask response", response);

    if (response.status !== "Failure") {
      await fetchTasks();
    }

    return response;
  } catch (e) {
    console.log("useTasks.createTask ERROR", e);
    throw e;
  }
}

  async function updateTask(id: string, updates: Partial<TaskCreateInput>) {
    const http = await httpClient;
    const response = await http.put(`/api/task/${id}`, updates);
    if (response.status !== "Failure") {
      await fetchTasks();
    }
  }

  async function deleteTask(id: string) {
    const http = await httpClient;
    const response = await http.delete(`/api/task/${id}`);
    if (response.status !== "Failure") {
      await fetchTasks();
    }
  }

  async function toggleTaskStatus(task: Task) {
  console.log("🔄 toggleTaskStatus appelé pour:", task.id, task.title);  // ← AJOUTE
  
    try {
      const http = await httpClient;
      console.log("📡 Appel PATCH /toggle pour task", task.id); 
      
      const response = await http.patch(`/api/task/${task.id}/toggle`, {});
      console.log("📡 Réponse toggle:", response); 
      
      if (response.status === "Success") {
        console.log("✅ Toggle succès, recharge tasks");
        await fetchTasks();
      } else {
        console.log("❌ Toggle a échoué:", response);
      }
      
      return response;
    } catch (e) {
      console.log("💥 toggleTaskStatus ERROR:", e); 
      throw e;
    }
  }


  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus };
}
