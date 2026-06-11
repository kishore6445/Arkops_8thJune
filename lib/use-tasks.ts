import { useState, useEffect } from "react"
import type { Task } from "@/lib/brand-structure"

// Mock tasks data
const MOCK_TASKS: Task[] = [
  {
    id: "task-1",
    title: "Review Q3 Performance Report",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().split("T")[0],
    owner: "John Doe",
    status: "pending",
    priority: "high",
  },
  {
    id: "task-2",
    title: "Update client presentation",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split("T")[0],
    owner: "Jane Smith",
    status: "pending",
    priority: "medium",
  },
  {
    id: "task-3",
    title: "Complete project documentation",
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString().split("T")[0],
    owner: "Mike Johnson",
    status: "completed",
    priority: "medium",
  },
  {
    id: "task-4",
    title: "Schedule team meeting",
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0],
    owner: "Sarah Wilson",
    status: "pending",
    priority: "low",
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simulate fetching tasks
  useEffect(() => {
    setIsLoading(true)
    // In a real app, this would be an API call
    setTimeout(() => {
      setTasks(MOCK_TASKS)
      setIsLoading(false)
    }, 500)
  }, [])

  const addTask = (task: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title || "",
      dueDate: task.dueDate || "",
      owner: task.owner || "",
      status: task.status || "pending",
      priority: task.priority || "medium",
    }
    setTasks([...tasks, newTask])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const completeTask = (id: string) => {
    updateTask(id, {
      status: tasks.find((t) => t.id === id)?.status === "completed" ? "pending" : "completed",
    })
  }

  return {
    tasks,
    isLoading,
    error,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
  }
}
