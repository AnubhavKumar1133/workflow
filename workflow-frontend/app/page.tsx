import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <span className="font-bold text-xl">Workflow</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/dashboard">
            Dashboard
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/tasks">
            Tasks
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/clients">
            Clients
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Manage Your Tasks with Workflow
                </h1>
                <p className="mx-auto max-w-[900px] text-gray-500 md:text-xl dark:text-gray-400">
                  The ultimate task management solution for team leaders, project managers, and freelancers.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">©This Website was built by ©Anubhav Kumar</p> 
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="https://in.linkedin.com/in/anubhav-kumar-b8129124b">
            LinkedIn
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="https://github.com/AnubhavKumar1133">
            Github
          </Link>
        </nav>
      </footer>
    </div>
  )
}
