"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ChevronLeft, Pencil, Trash, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { formatDate } from "@/lib/utils"
import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { API_BASE_URL } from "@/lib/config"
import {use} from 'react';
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

export default function TaskPage({params}: {params: Promise<{ id: string }>}) {
  const router = useRouter()
  const [task, setTask] = useState<Task | null>(null)
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { id } = use(params);

  useEffect(() => {
    const fetchTask = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const taskData = await fetchApi(`/api/tasks/${id}`)
        if(!taskData){
          router.push("/login")
        }
        setTask(taskData)
        setEditedTask(taskData)
      } catch (err: any) {
        
        setError(err.message || "Failed to load task")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [id])

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!task) {
    return <div className="p-8 text-center">Task not found</div>
  }

  const handleInputChange = (field: Exclude<keyof Task, 'clientId'>, value: string) => {
    setEditedTask((prev) => ({
      ...(prev || {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        description: task.description,
        clientId: task.clientId,
        client: task.client,
        deadline: task.deadline,
        createdAt: task.createdAt,
      }),
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!editedTask) return

    setIsSaving(true)
    setError(null)

    try {
      const updatedTask = await fetchApi(`/api/tasks/${task.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: editedTask.title,
          description: editedTask.description,
          status: editedTask.status,
          priority: editedTask.priority,
          deadline: editedTask.deadline
        }),
      })

      setTask(updatedTask)
      setEditedTask(updatedTask)
      setIsEditing(false)
      router.push("/tasks")
    } catch (err: any) {
      setError(err.message || "Failed to update task")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
  
    setIsDeleting(true);
    setError(null);
  
    try {
      const response = await fetch(API_BASE_URL+`/api/tasks/${task.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete task");
      }
      
      router.push("/tasks");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      inProgress: "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      completed: "bg-green-100 text-green-800 hover:bg-green-100/80",
    }
    return (
      <Badge className={colors[status]} variant="outline">
        {status}
      </Badge>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center">
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{task.title}</CardTitle>
                <CardDescription>
                  {task.client && `Client: ${task.client} •`}Created on {formatDate(task.createdAt || "")}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                      <Trash className="h-4 w-4 mr-1" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                )}
              </div>
            </div>
            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {!isEditing ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                    <div>{getStatusBadge(task.status)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                    <div>{getPriorityBadge(task.priority)}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Deadline</h3>
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      {task.deadline ? formatDate(task.deadline) : "No deadline"}
                    </div>
                  </div>
                  {task.client && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Client</h3>
                      <div>{task.client}</div>
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                  <div className="text-sm whitespace-pre-line rounded-md bg-muted p-4">
                    {task.description || "No description"}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editedTask?.title || ""}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editedTask?.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={editedTask?.priority}
                      onValueChange={(value) => handleInputChange("priority", value)}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={editedTask?.deadline?.split('T')[0] || ""}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={editedTask?.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
