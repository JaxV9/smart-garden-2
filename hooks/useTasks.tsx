// hooks/useTasks.ts
import { useFetch } from "@/hooks/useFetch";
import { Task } from "@/models/models";
import { useEffect, useState } from "react";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const { httpClient } = useFetch(undefined);

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

  async function createTask(
    payload: Omit<Task, "id" | "createdAt" | "userId">,
  ) {
    console.log("useTasks.createTask payload", payload);
    try {
      const http = await httpClient;
      console.log("useTasks.createTask http client ready");

      const response = await http.post("/api/task", payload);
      console.log("useTasks.createTask response", response);

      return response;
    } catch (e) {
      console.log("useTasks.createTask ERROR", e);
      throw e;
    }
  }

  async function updateTask(id: string, updates: Partial<Task>) {
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

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
}
