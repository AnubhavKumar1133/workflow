"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { fetchApi } from "@/lib/api"
import { Task } from "@/lib/data"

interface Client {
  id: string
  name: string
  company: string
  email: string
}

export function ClientList({ clients }: { clients: Client[] }) {
  const [clientTasks, setClientTasks] = useState<Record<string, { total: number; completed: number; inProgress: number; pending: number }>>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchClientTasks = async () => {
      if (!clients || clients.length === 0) {
        setIsLoading(false)
        return
      }

      const tasksData: Record<string, { total: number; completed: number; inProgress: number; pending: number }> = {}
      setIsLoading(true)

      try {
        // Fetch tasks for each client
        for (const client of clients) {
          const clientTasksData = await fetchApi(`/api/clients/${client.id}/tasks`)

          // Count tasks by status
          const total = clientTasksData.length
          const completed: number = clientTasksData.filter((task: Task) => task.status === "completed").length
          const inProgress = clientTasksData.filter((task: { status: string }) => task.status === "inProgress").length
          const pending = clientTasksData.filter((task: { status: string }) => task.status === "pending").length

          tasksData[client.id] = { total, completed, inProgress, pending }
        }

        setClientTasks(tasksData)
      } catch (error) {
        console.error("Error fetching client tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClientTasks()
  }, [clients])

  if (isLoading) {
    return <div className="text-center py-4">Loading client data...</div>
  }

  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No clients found</div>
      ) : (
        clients.map((client) => {
          const taskCounts = clientTasks[client.id] || { total: 0, completed: 0, inProgress: 0, pending: 0 }

          return (
            <div key={client.id} className="flex flex-col space-y-2 rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{client.name}</h3>
                  <p className="text-sm text-muted-foreground">{client.company}</p>
                  <p className="text-sm text-muted-foreground">{client.email}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="outline" className="bg-gray-100">
                    {taskCounts.total} total tasks
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {taskCounts.pending > 0 && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    {taskCounts.pending} pending
                  </Badge>
                )}
                {taskCounts.inProgress > 0 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {taskCounts.inProgress} in progress
                  </Badge>
                )}
                {taskCounts.completed > 0 && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {taskCounts.completed} completed
                  </Badge>
                )}
              </div>
              <div className="flex justify-end">
                <Link href={`/clients/${client.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
