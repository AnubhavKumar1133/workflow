// app/lib/toast.ts
"use client"

import { toast as sonnerToast } from "sonner"

type ToastOptions = {
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export const toast = (options: ToastOptions) => {
  return sonnerToast(options.title, {
    description: options.description,
    duration: options.duration,
    action: options.action,
  })
}
  