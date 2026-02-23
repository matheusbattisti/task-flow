"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Task, TaskStatus, TaskPriority } from "@/types/task";

const STORAGE_KEY = "task-flow-tasks";

function getInitialTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(getInitialTasks);
  const [filter, setFilter] = useState<"all" | TaskStatus>("all");
  const mounted = typeof window !== "undefined";
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback(
    (title: string, description: string, priority: TaskPriority) => {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title,
        description,
        status: "pending",
        priority,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
    },
    []
  );

  const toggleStatus = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "pending" ? "completed" : "pending" }
          : t
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reorderTasks = useCallback((fromIndex: number, toIndex: number) => {
    setTasks((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  }, []);

  const exportTasks = useCallback(() => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks]);

  const importTasks = useCallback((imported: Task[]) => {
    setTasks((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newTasks = imported.filter((t) => !existingIds.has(t.id));
      return [...newTasks, ...prev];
    });
  }, []);

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return {
    tasks: filtered,
    allTasks: tasks,
    filter,
    setFilter,
    addTask,
    toggleStatus,
    deleteTask,
    reorderTasks,
    exportTasks,
    importTasks,
    counts,
    mounted,
  };
}
