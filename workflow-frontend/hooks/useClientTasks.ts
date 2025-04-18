// hooks/useClientTasks.ts
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"

export function useClientTasks() {
  const [clientTasks, setClientTasks] = useState<Record<number, any[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAllClientTasks = async () => {
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

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch tasks")
        }

        // Group tasks by clientId
        const tasksByClient = data.tasks.reduce((acc: Record<number, any[]>, task: any) => {
          if (task.clientId) {
            if (!acc[task.clientId]) {
              acc[task.clientId] = []
            }
            acc[task.clientId].push(task)
          }
          return acc
        }, {})

        setClientTasks(tasksByClient)
      } catch (err: any) {
        setError(err.message || "Unexpected error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllClientTasks()
  }, [])

  const getTasksForClient = (clientId: number) => {
    return clientTasks[clientId] || []
  }

  return { getTasksForClient, isLoading, error }
}