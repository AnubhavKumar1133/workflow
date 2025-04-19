"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Plus, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { useClients } from "@/hooks/useClients"
import { useClientTasks } from "@/hooks/useClientTasks" // 👈 New hook

export default function ClientsPage() {
  const { clients, isLoading, error } = useClients()
  const { getTasksForClient, isLoading: tasksLoading, error: tasksError } = useClientTasks()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients?.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company?.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || []

  const getClientTaskCounts = (clientId: number) => {
    const clientTasks = getTasksForClient(clientId)
    const total = clientTasks.length
    const completed = clientTasks.filter((task) => task.status === "completed").length
    const inProgress = clientTasks.filter((task) => task.status === "in progress").length
    const pending = clientTasks.filter((task) => task.status === "pending").length
    return { total, completed, inProgress, pending }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Clients</h1>
          <Link href="/clients/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Client
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Client Management</CardTitle>
            <CardDescription>View and manage all your clients and their associated tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex w-full md:w-1/3">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10"
                  />
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Tasks</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Loading clients...
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-destructive">
                          Error loading clients.
                        </TableCell>
                      </TableRow>
                    ) : filteredClients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No clients found matching your search
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredClients.map((client) => {
                        const { total, pending, inProgress } = getClientTaskCounts(client.id)
                        return (
                          <TableRow key={client.id}>
                            <TableCell className="font-medium">{client.name}</TableCell>
                            <TableCell>{client.company}</TableCell>
                            <TableCell>{client.email}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="outline" className="bg-gray-100">
                                  {total} {total > 0 ? ":-": ""}
                                </Badge>
                                
                                {pending > 0 && (
                                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    {pending} pending,
                                  </Badge>
                                )}
                                {inProgress > 0 && (
                                  <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                    {inProgress} in progress
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Link href={`/clients/${client.id}`}>
                                <Button variant="ghost" size="sm">
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="text-center text-sm  mt-4">
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            Go back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
