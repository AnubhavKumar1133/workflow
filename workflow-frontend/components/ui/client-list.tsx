import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Task {
  id: number
  title: string
  clientId?: number
  client?: string
  status: string
  priority: string
  deadline?: string
  description: string
  createdAt?: string
}


interface Client {
  id: number
  name: string
  email?: string
  company?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface TaskCounts {
  total: number
  completed: number
  inProgress: number
  pending: number
}

interface ClientListProps {
  clients: Client[]
  tasks: Task[]
}

export function ClientList({ clients, tasks }: ClientListProps) {
  // Count tasks per client
  const getClientTaskCounts = (clientName: string): TaskCounts => {
    const clientTasks = tasks.filter((task) => task.client === clientName)
    return {
      total: clientTasks.length,
      completed: clientTasks.filter((task) => task.status === "completed").length,
      inProgress: clientTasks.filter((task) => task.status === "in progress").length,
      pending: clientTasks.filter((task) => task.status === "pending").length
    }
  }

  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No clients found</div>
      ) : (
        clients.map((client) => {
          const { total, completed, pending, inProgress } = getClientTaskCounts(client.name)
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
                    {total} total tasks
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {pending > 0 && (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800">
                    {pending} pending
                  </Badge>
                )}
                {inProgress > 0 && (
                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                    {inProgress} in progress
                  </Badge>
                )}
                {completed > 0 && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {completed} completed
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