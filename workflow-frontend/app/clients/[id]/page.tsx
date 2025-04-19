"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Pencil, Trash, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { formatDate } from "@/lib/utils"
import { fetchApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Client {
  id: number
  name: string
  email?: string
  company?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function ClientPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [client, setClient] = useState<Client | null>(null)
  const [editedClient, setEditedClient] = useState<Client | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchClient = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const clientData = await fetchApi(`/api/clients/${id}`)
        setClient(clientData)
        setEditedClient(clientData)
      } catch (err: any) {
        setError(err.message || "Failed to load client")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchClient()
    }
  }, [id])

  const handleInputChange = (field: keyof Client, value: string) => {
    setEditedClient((prev) => ({
      ...(prev || {
        id: client?.id || 0,
        name: client?.name || "",
        email: client?.email || "",
        company: client?.company || "",
        notes: client?.notes || "",
        createdAt: client?.createdAt || new Date().toISOString(),
        updatedAt: client?.updatedAt || new Date().toISOString()
      }),
      [field]: value,
    }))
  }

  const handleSave = async () => {
    if (!editedClient) return

    setIsSaving(true)
    setError(null)
    try {
      const updatedClient = await fetchApi(`/api/clients/${client?.id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedClient.name,
          email: editedClient.email,
          company: editedClient.company,
          notes: editedClient.notes
        }),
      })

      setClient(updatedClient)
      setEditedClient(updatedClient)
      setIsEditing(false)
      router.push('/clients')
    } catch (err: any) {
      setError(err.message || "Failed to update client")
    } finally {
      setIsSaving(false)
    } 
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this client?")) {
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      await fetchApi(`/api/clients/${client?.id}`, {
        method: "DELETE"
      })

      router.push("/clients")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Failed to delete client")
      console.error("Delete error:", err)
    } finally {
      setIsDeleting(false)
    }
  }

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

  if (!client) {
    return <div className="p-8 text-center">Client not found</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex items-center">
          <Link href="/clients">
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Clients
            </Button>
          </Link>
        </div>
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{client.name}</CardTitle>
                <CardDescription>Client details</CardDescription>
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
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Company</h3>
                    <div>{client.company || "Not specified"}</div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                    <div>{client.email || "Not specified"}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="text-sm whitespace-pre-line rounded-md bg-muted p-4">
                    {client.notes || "No notes available"}
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={editedClient?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={editedClient?.company || ""}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedClient?.email || ""}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editedClient?.notes || ""}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    rows={5}
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
