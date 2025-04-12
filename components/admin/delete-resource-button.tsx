"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import { toast } from "@/hooks/use-toast"

interface DeleteResourceButtonProps {
  resourceId: string
  resourceName: string
  onDelete: (id: string) => void
}

export function DeleteResourceButton({ resourceId, resourceName, onDelete }: DeleteResourceButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      // In a real implementation, this would call a server action or API
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      onDelete(resourceId)
      setOpen(false)
      toast({
        title: "Resource deleted",
        description: `${resourceName} has been successfully deleted.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete resource. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setOpen(true)}
        className="bg-red-500/90 hover:bg-red-600 h-8 w-8 md:w-auto md:px-3"
      >
        <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
        <span className="hidden md:inline ml-2">Delete</span>
      </Button>

      <ConfirmationDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Resource"
        description={`Are you sure you want to delete "${resourceName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete Resource"
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  )
}
