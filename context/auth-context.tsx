"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

type AuthContextType = {
  user: any | null
  profile: any | null
  isLoading: boolean
  signUp: (values: any) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updateProfile: (values: any) => Promise<{ error: string | null; data: any | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseInitialized, setSupabaseInitialized] = useState(false)
  const [supabase, setSupabase] = useState<any>(null)
  const router = useRouter()

  // Initialize Supabase client safely
  useEffect(() => {
    try {
      const supabaseClient = getSupabaseBrowserClient()
      setSupabase(supabaseClient)
      setSupabaseInitialized(true)
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!supabaseInitialized || !supabase) return

    const fetchUser = async () => {
      setIsLoading(true)

      try {
        // Check active session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("Error fetching session:", sessionError)
          setIsLoading(false)
          return
        }

        if (!session) {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
          return
        }

        // Set the user from the session
        setUser(session.user)

        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        } else {
          setProfile(profileData)
        }
      } catch (error) {
        console.error("Unexpected error during auth check:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        setUser(session.user)

        // Call the profile fetch asynchronously
        fetchProfile(session.user.id)
    } else {
        setUser(null)
        setProfile(null)
    }
    // Refresh the page on auth state change to update server components
    if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh()
    }
})

  // Define the async function to fetch profile data
  const fetchProfile = async (userId) => {
      try {
          const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single()

          if (profileError) {
              console.error("Error fetching profile:", profileError)
          } else {
              setProfile(profileData)
          }
      } catch (error) {
          console.error("Unexpected error fetching profile:", error)
      }
  }

// Cleanup the subscription when no longer needed
return () => {
    data.subscription.unsubscribe()
}
  }, [supabase, supabaseInitialized, router])

  const signUp = async (values: any) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      const { first_name, last_name, email, password, interest, background, notifications, termsAccepted } = values

      // 1. Create the auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
            role: "user", // Default role
          },
        },
      })

      if (authError) {
        return { error: authError.message }
      }

      // 2. Update the profile record with additional fields using a server-side API call
      if (authData?.user) {
        try {
          // Wait a moment for Supabase to create the initial profile
          // This helps ensure the profile exists before we try to update it
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Update the profile with our additional fields
          const response = await fetch("/api/create-profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: authData.user.id,
              first_name,
              last_name,
              email,
              role: "user",
              interest,
              background,
            }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            console.error("Error updating profile via API:", errorData)
            // We don't return an error here because the auth user was created successfully
            // The profile can be updated later or fixed by an admin
          }
        } catch (apiError) {
          console.error("API error updating profile:", apiError)
          // We don't return an error here because the auth user was created successfully
        }
      }

      return { error: null }
    } catch (error: any) {
      console.error("Sign up error:", error)
      return { error: "An unexpected error occurred during sign up." }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        return { error: error.message }
      }
    
      return { error: null }
    } catch (error: any) {
      console.error("Sign in error:", error)
      return { error: "An unexpected error occurred during sign in." }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      toast({
        title: "Error signing out",
        description: "Supabase client not initialized",
        variant: "destructive",
      })
      return
    }

    try {
      await supabase.auth.signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  const resetPassword = async (email: string) => {
    if (!supabase) return { error: "Supabase client not initialized" }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        return { error: error.message }
      }

      return { error: null }
    } catch (error: any) {
      console.error("Reset password error:", error)
      return { error: "An unexpected error occurred during password reset." }
    }
  }

  const updateProfile = async (values: any) => {
    if (!supabase) return { error: "Supabase client not initialized", data: null }
    if (!user) return { error: "You must be logged in to update your profile", data: null }

    try {
      const { data, error } = await supabase.from("profiles").update(values).eq("id", user.id).select().single()

      if (error) {
        return { error: error.message, data: null }
      }

      setProfile(data)
      return { error: null, data }
    } catch (error: any) {
      console.error("Update profile error:", error)
      return { error: "An unexpected error occurred while updating your profile", data: null }
    }
  }

  // If Supabase failed to initialize, render a fallback UI
  if (!supabaseInitialized && isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading authentication...</p>
      </div>
    )
  }

  const value = {
    user,
    profile,
    isLoading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}