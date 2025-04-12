"use server"

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export type AuthError = {
  message: string
}

export type AuthResult<T> = {
  data: T | null
  error: AuthError | null
}

// Create a server-side Supabase client with cookies
const getSupabaseServerClient = () => {
  const cookieStore = cookies()
  const supabase = createServerClient()
  return supabase
}

// Register a new user
export async function registerUser(formData: {
  email: string
  password: string
  name: string
  interest: string
  background: string
  notifications: boolean
  termsAccepted: boolean
}): Promise<AuthResult<{ user: any }>> {
  const supabase = getSupabaseServerClient()

  try {
    // Split the name into first and last name
    const nameParts = formData.name.split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

    // Register the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          interest: formData.interest,
          background: formData.background,
          notifications_enabled: formData.notifications,
        },
      },
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred during registration." },
    }
  }
}

// Login a user
export async function loginUser(formData: {
  email: string
  password: string
}): Promise<AuthResult<{ user: any }>> {
  const supabase = getSupabaseServerClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Login error:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred during login." },
    }
  }
}

// Logout a user
export async function logoutUser(): Promise<AuthResult<{}>> {
  const supabase = getSupabaseServerClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data: {}, error: null }
  } catch (error) {
    console.error("Logout error:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred during logout." },
    }
  }
}

// Get the current user
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: null }
    }

    // Get the user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
    }

    return {
      data: {
        ...user,
        profile: profile || null,
      },
      error: null,
    }
  } catch (error) {
    console.error("Get current user error:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching the current user." },
    }
  }
}

// Check if user is authenticated and redirect if not
export async function requireAuth(redirectTo = "/login") {
  const { data: user, error } = await getCurrentUser()

  if (!user || error) {
    redirect(redirectTo)
  }

  return user
}

// Check if user has admin role
export async function requireAdmin(redirectTo = "/login") {
  const { data: user, error } = await getCurrentUser()

  if (!user || error) {
    redirect(redirectTo)
  }

  // Get the user profile to check role
  const supabase = getSupabaseServerClient()
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || !profile || profile.role !== "admin") {
    redirect("/unauthorized")
  }

  return user
}

// Update user profile
export async function updateUserProfile(profileData: any): Promise<AuthResult<any>> {
  const supabase = getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: { message: "Not authenticated" } }
  }

  try {
    const { data, error } = await supabase.from("profiles").update(profileData).eq("id", user.id).select().single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Update profile error:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while updating the profile." },
    }
  }
}
