// lib/useTasks.ts
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"

export type Task = {
    id: number
    title: string
    description?: string
    due_date: string | null // ISO string or null
    clientId?: number | null
    client?: string | null
    priority: "low" | "medium" | "high"
    status: "pending" | "in_progress" | "completed"
    completed: boolean
    createdAt?: string
    updatedAt?: string
  }

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("token")

      if (!token) {
        setError("User not authenticated")
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()
        console.log("Tasks data:", data) // Debug log   
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch tasks")
        }
        const transformedTasks = data.tasks.map((task: any) => ({
            ...task,
            due_date: task.deadline || null // Map backend's 'deadline' to frontend's 'due_date'
          }));
          
          // Debug: log transformed tasks
          console.log("Transformed tasks:", transformedTasks);
          
          setTasks(transformedTasks);
        //setTasks(data.tasks) // ⬅️ Important: tasks are inside `data.tasks`
      } catch (err: any) {
        setError(err.message || "Unexpected error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  return { tasks, isLoading, error }
}
