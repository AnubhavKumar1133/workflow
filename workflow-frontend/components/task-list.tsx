import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react"

interface Task {
  id: string;
  title: string;
  client: { name: string };
  priority: "high" | "medium" | "low";
  status: "pending" | "in progress" | "completed";
  deadline: string;
}

export function TaskList({ tasks }: { tasks: Task[] }) {
  const getPriorityBadge = (priority: "high" | "medium" | "low") => {
    const colors = {
      high: "bg-red-100 text-red-800 hover:bg-red-100/80",
      medium: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80",
      low: "bg-green-100 text-green-800 hover:bg-green-100/80",
    }
    return (
      <Badge className={colors[priority]} variant="outline">
        {priority}
      </Badge>
    )
  }

  const getStatusBadge = (status: "pending" | "in progress" | "completed") => {
    const colors = {
      pending: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      "in progress": "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      completed: "bg-green-100 text-green-800 hover:bg-green-100/80",
    }
    return (
      <Badge className={colors[status]} variant="outline">
        {status}
      </Badge>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground">No tasks found</div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="flex flex-col space-y-2 rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">Client: {task.client?task.client.name:""}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {getPriorityBadge(task.priority)}
                {getStatusBadge(task.status)}
              </div>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>Due {formatDate(task.deadline)}</span>
            </div>
            <div className="flex justify-end">
              <Link href={`/tasks/${task.id}`}>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
