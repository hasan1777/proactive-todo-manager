
import React, { createContext, useContext, useEffect, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/types/task";
import { v4 as uuidv4 } from "uuid";

interface TaskContextType {
  tasks: Task[];
  createTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, completed: boolean) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  clearCompletedTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Local storage key
const TASKS_STORAGE_KEY = "proactive-task-manager-tasks";

interface TaskProviderProps {
  children: React.ReactNode;
}

export function TaskProvider({ children }: TaskProviderProps) {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initialization
    const savedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks, (key, value) => {
          // Convert date strings back to Date objects
          if (key === "createdAt" || key === "dueDate") {
            return value ? new Date(value) : undefined;
          }
          return value;
        });
      } catch (error) {
        console.error("Failed to parse saved tasks:", error);
        return [];
      }
    }
    return [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const createTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
      tags: task.tags || [],
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const setTaskStatus = (id: string, completed: boolean) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, status: completed ? "completed" : "pending" }
          : task
      )
    );
  };

  const reorderTasks = (startIndex: number, endIndex: number) => {
    setTasks((prevTasks) => {
      const result = Array.from(prevTasks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const clearCompletedTasks = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.status !== "completed"));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        createTask,
        updateTask,
        deleteTask,
        setTaskStatus,
        reorderTasks,
        clearCompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
