"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useClients } from "@/hooks/useClients"
import { API_BASE_URL } from "@/lib/config"
import { create } from "domain"

export default function  NewTaskPage() {
  const {clients} = useClients();
  const router = useRouter();
  const [newTask, setNewTask] = useState({
    title: "",
    client: "",
    description: "",
    status: "pending",
    priority: "medium",
    deadline: new Date().toISOString().split("T")[0],
  })

  interface Task {
    title: string;
    client: string;
    description: string;
    status: "pending" | "in progress" | "completed";
    priority: "high" | "medium" | "low";
    deadline: string;
  }

  const handleInputChange = (field: keyof Task, value: string) => {
    setNewTask({
      ...newTask,
      [field]: value,
    });
  };

  // In your new task page
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...newTask, 
        deadline: newTask.deadline || null, // Send null if empty
      }),
    });

    const data = await response.json();
    console.log("Creation response:", data); // Debug log
    router.push("/tasks"); // Redirect to tasks page after creation
  } catch (error) {
    console.error("Creation error:", error);
  }
};

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
            <CardTitle className="text-2xl">Create New Task</CardTitle>
            <CardDescription>Add a new task to your workflow</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client">Client</Label>
                <Select value={newTask.client} onValueChange={(value) => handleInputChange("client", value)} required>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.name}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newTask.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newTask.priority} onValueChange={(value) => handleInputChange("priority", value)}>
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
                  value={newTask.deadline}
                  onChange={(e) => handleInputChange("deadline", e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  rows={5}
                  value={newTask.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <Button variant="outline" type="button" onClick={() => router.push("/tasks")}>
                Cancel
              </Button>
              <Button type="submit">Create Task</Button>
            </CardFooter>
          </form>
        </Card>
      </main>
    </div>
  )
}
