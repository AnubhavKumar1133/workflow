"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Plus, Search, X } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useTasks } from "@/hooks/useTasks"
import { formatDate } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

type Priority = "high" | "medium" | "low"

export default function TasksPage() {
  const { tasks, isLoading, error } = useTasks()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("deadline")
  const [sortOrder, setSortOrder] = useState("asc")
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  const getPriorityBadge = (priority: Priority) => {
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

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-gray-100 text-gray-800 hover:bg-gray-100/80",
      "in progress": "bg-blue-100 text-blue-800 hover:bg-blue-100/80",
      completed: "bg-green-100 text-green-800 hover:bg-green-100/80",
    }
    return (
      <Badge className={colors[status] || "bg-gray-100 text-gray-800"} variant="outline">
        {status}
      </Badge>
    )
  }

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.client?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || task.status === statusFilter
      const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter

      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return sortOrder === "asc"
          ? new Date(a.due_date || 0).getTime() - new Date(b.due_date || 0).getTime()
          : new Date(b.due_date || 0).getTime() - new Date(a.due_date || 0).getTime()
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return sortOrder === "asc"
          ? priorityOrder[a.priority] - priorityOrder[b.priority]
          : priorityOrder[b.priority] - priorityOrder[a.priority]
      } else if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      }
      return 0
    })

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <Link href="/tasks/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Task
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Task Management</CardTitle>
            <CardDescription>
              Manage your tasks, filter by status or priority, and sort by different criteria.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-muted-foreground py-10 text-center">Loading tasks...</div>
            ) : error ? (
              <div className="text-red-500 py-10 text-center">Error: {error}</div>
            ) : (
              <div className="space-y-4">
                {/* Filters for small devices */}
                <div className="md:hidden">
                  <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full mb-2">Filter</Button>
                    </DialogTrigger>
                    <DialogContent className="space-y-4 p-6">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">Filters</h2>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowMobileFilters(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Priorities</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="deadline">Deadline</SelectItem>
                          <SelectItem value="priority">Priority</SelectItem>
                          <SelectItem value="title">Title</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" onClick={toggleSortOrder}>
                        Sort: {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
                      </Button>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Filters for desktop */}
                <div className="hidden md:flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
                  <div className="flex w-full md:w-1/3">
                    <div className="relative w-full">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                      />
                    </div>
                  </div>
                  <div className="flex flex-1 space-x-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="deadline">Deadline</SelectItem>
                        <SelectItem value="priority">Priority</SelectItem>
                        <SelectItem value="title">Title</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={toggleSortOrder}>
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </Button>
                  </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Deadline</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTasks.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No tasks found matching your filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTasks.map((task) => (
                          <TableRow key={task.id}>
                            <TableCell className="font-medium">{task.title}</TableCell>
                            <TableCell>{task.client || "—"}</TableCell>
                            <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                            <TableCell>{getStatusBadge(task.status)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {formatDate(task.due_date)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/tasks/${task.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
