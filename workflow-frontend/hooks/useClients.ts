// lib/useClients.ts
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"

export type Client = {
  id: number
  name: string
  email?: string
  company?: string
  notes?: string
  created_at: string
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true)
      setError(null)

      const token = localStorage.getItem("token")

      if (!token) {
        setError("User not authenticated")
        setIsLoading(false)
        return
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/clients`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch clients")
        }

        setClients(data)
      } catch (err: any) {
        setError(err.message || "Unexpected error")
      } finally {
        setIsLoading(false)
      }
    }

    fetchClients()
  }, [])

  return { clients, isLoading, error }
}

