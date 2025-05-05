"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { toast } from "@/hooks/use-toast";

interface DeleteButtonProps {
  entityId: string; // ID of the entity to delete
  entityName: string; // Name of the entity to display in the confirmation dialog
  onDelete: (id: string) => Promise<void>; // Callback to handle the delete action
  entityType?: string; // Optional: Type of the entity (e.g., "Resource", "Event")
}

export function DeleteButton({ entityId, entityName, onDelete, entityType = "Item" }: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(entityId); // Call the provided delete handler
      setOpen(false);
      toast({
        title: `${entityType} Deleted`,
        description: `${entityName} has been successfully deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${entityType.toLowerCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

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
        title={`Delete ${entityType}`}
        description={`Are you sure you want to delete "${entityName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText={`Delete ${entityType}`}
        cancelText="Cancel"
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
