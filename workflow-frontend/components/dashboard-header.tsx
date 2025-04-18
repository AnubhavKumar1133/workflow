"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const username = user?.username
  const firstName = username?.split("@")[0]
  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-6">
      <Link className="lg:hidden" href="/">
        <span className="font-bold">Workflow</span>
      </Link>
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <span className="hidden lg:inline-block">Workflow</span>
        </Link>
        <Link href="/dashboard" className="text-foreground/60 transition-colors hover:text-foreground">
          Dashboard
        </Link>
        <Link href="/tasks" className="text-foreground/60 transition-colors hover:text-foreground">
          Tasks
        </Link>
        <Link href="/clients" className="text-foreground/60 transition-colors hover:text-foreground">
          Clients
        </Link>
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm font-bold">{firstName || "Guest"}</span>
        <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-1">
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
