"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, Clock, ListTodo, Users } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { TaskStats } from "@/components/task-stats"
import { ClientList } from "@/components/client-list"
import { DashboardHeader } from "@/components/dashboard-header"
import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import router from "next/router"

export default function DashboardPage() {
  interface DashboardData {
    taskStats: {
      total: number
      pending: number
      inProgress: number
      completed: number
    }
    priorityStats: {
      high: number
      medium: number
      low: number
    }
    clientStats: {
      total: number
      withActiveTasks: number
    }
  }

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [upcomingTasks, setUpcomingTasks] = useState([])
  const [clients, setClients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        if(!localStorage.getItem("token")){
          router.push("/login")
          return
        }
        const stats = await fetchApi("/api/dashboard/stats",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          }
        })
        setDashboardData({
          ...stats,
          priorityStats: {
            high: stats.priorityStats.high || 0,
            medium: stats.priorityStats.medium || 0,
            low: stats.priorityStats.low || 0,
          },
        })
       
        // setDashboardData(stats)
        console.log("Dashboard stats:", stats)
        // Fetch upcoming deadlines
        const upcoming = await fetchApi("/api/dashboard/upcoming")
        console.log("Upcoming tasks:", upcoming)
        setUpcomingTasks(upcoming)

        // Fetch clients
        const clientsData = await fetchApi("/api/clients")
        setClients(clientsData)
        
        setIsLoading(false)
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data")
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>
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

  if (!dashboardData) {
    return <div className="p-8 text-center">No dashboard data available</div>
  }

  const { taskStats, priorityStats, clientStats } = dashboardData
  console.log(taskStats.total)
  console.log(taskStats.completed)
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex gap-2">
            <Link href="/tasks/new">
              <Button>Create New Task</Button>
            </Link>
            <Link href="/clients/new">
              <Button>Create Client</Button>
            </Link>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <ListTodo className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
              <p className="text-xs text-muted-foreground">
                {taskStats.pending} pending, {taskStats.inProgress} in progress
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.completed}</div>
              <p className="text-xs text-muted-foreground">
                {taskStats.total > 0
                  ? `${Math.round((taskStats.completed / taskStats.total) * 100)}% completion rate`
                  : "0% completion rate"}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{priorityStats.high}</div>
              <p className="text-xs text-muted-foreground">
                {priorityStats.high - (taskStats.completed || 0)} still open
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clientStats.total}</div>
              <p className="text-xs text-muted-foreground">{clientStats.withActiveTasks} with active projects</p>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Deadlines</TabsTrigger>
            <TabsTrigger value="stats">Task Statistics</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deadlines</CardTitle>
                <CardDescription>Your tasks with the closest deadlines that need attention.</CardDescription>
              </CardHeader>
              <CardContent>
                <TaskList tasks={upcomingTasks} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Statistics</CardTitle>
                <CardDescription>Overview of your task distribution by status and priority.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <TaskStats taskStats={taskStats} priorityStats={priorityStats} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Overview</CardTitle>
                <CardDescription>All your clients and their associated tasks.</CardDescription>
              </CardHeader>
              <CardContent>
                <ClientList clients={clients} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
