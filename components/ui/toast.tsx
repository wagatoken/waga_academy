"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const ToastContext = React.createContext<any>(null);

export const useToast = () => {
  return React.useContext(ToastContext);
};

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full justify-between overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export const ToastProviderWithContext = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  const addToast = (toast: any) => {
    setToasts((prev) => [...prev, toast]);
  };

  React.useEffect(() => {
    const handleAddToast = (event: CustomEvent) => {
      addToast(event.detail);
    };

    window.addEventListener("add-toast", handleAddToast as EventListener);

    return () => {
      window.removeEventListener("add-toast", handleAddToast as EventListener);
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <ToastPrimitives.Provider>
        {children}
        <ToastPrimitives.Viewport className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]" />
        {toasts.map((toast, index) => (
          <ToastPrimitives.Root
            key={index}
            className={cn(
              toastVariants({ variant: toast.variant }),
              "p-4 max-w-md w-full flex flex-col justify-start space-y-2" // Ensure proper spacing and layout
            )}
          >
            {/* Title */}
            <ToastPrimitives.Title className="text-sm font-semibold break-words text-left">
              {toast.title}
            </ToastPrimitives.Title>

            {/* Description */}
            <ToastPrimitives.Description className="text-sm opacity-90 break-words whitespace-normal text-left">
              {toast.description}
            </ToastPrimitives.Description>

            {/* Close Button */}
            <ToastPrimitives.Close
              className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600"
            >
              <X className="h-4 w-4" />
            </ToastPrimitives.Close>
          </ToastPrimitives.Root>
        ))}
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
};

// Export a global toast function
export const toast = (toast: any) => {
  if (typeof window !== "undefined") {
    const event = new CustomEvent("add-toast", { detail: toast });
    window.dispatchEvent(event);
  }
};
