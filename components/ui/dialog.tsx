"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps {
  className?: string
  children: React.ReactNode
}

interface DialogHeaderProps {
  className?: string
  children: React.ReactNode
}

interface DialogTitleProps {
  className?: string
  children: React.ReactNode
}

interface DialogDescriptionProps {
  className?: string
  children: React.ReactNode
}

interface DialogTriggerProps {
  className?: string
  children: React.ReactNode
  asChild?: boolean
  onClick?: () => void
}

interface DialogFooterProps {
  className?: string
  children: React.ReactNode
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange?.(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange?.(false)}
      />
      {/* Content */}
      <div className="relative z-50">
        {children}
      </div>
    </div>
  )
}

const DialogContent = ({ className, children }: DialogContentProps) => {
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700",
      className
    )}>
      {children}
    </div>
  )
}

const DialogHeader = ({ className, children }: DialogHeaderProps) => {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  )
}

const DialogTitle = ({ className, children }: DialogTitleProps) => {
  return (
    <h2 className={cn("text-lg font-semibold text-gray-900 dark:text-white", className)}>
      {children}
    </h2>
  )
}

const DialogDescription = ({ className, children }: DialogDescriptionProps) => {
  return (
    <p className={cn("text-sm text-gray-600 dark:text-gray-400", className)}>
      {children}
    </p>
  )
}

const DialogTrigger = ({ className, children, asChild, onClick }: DialogTriggerProps) => {
  if (asChild) {
    return React.cloneElement(children as React.ReactElement, { onClick })
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

const DialogFooter = ({ className, children }: DialogFooterProps) => {
  return (
    <div className={cn("flex justify-end gap-2 mt-6", className)}>
      {children}
    </div>
  )
}

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter }
