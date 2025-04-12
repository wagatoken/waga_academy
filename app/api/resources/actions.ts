"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get all resources
export async function getResources() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("resources")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get a single resource
export async function getResource(resourceId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("resources")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `)
    .eq("id", resourceId)
    .single()

  if (error) {
    console.error(`Error fetching resource ${resourceId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Admin: Create a new resource
export async function createResource(formData: FormData) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized", data: null }
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile.role !== "admin") {
    return { error: "Unauthorized", data: null }
  }

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const resource_type = formData.get("resource_type") as string
  const file_url = formData.get("file_url") as string
  const thumbnail_url = formData.get("thumbnail_url") as string

  // Create resource
  const { data, error } = await supabase
    .from("resources")
    .insert({
      title,
      description,
      resource_type,
      file_url,
      thumbnail_url,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating resource:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/resources")
  revalidatePath("/community/resources")
  return { data, error: null }
}

// Admin: Update a resource
export async function updateResource(resourceId: string, formData: FormData) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized", data: null }
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile.role !== "admin") {
    return { error: "Unauthorized", data: null }
  }

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const resource_type = formData.get("resource_type") as string
  const file_url = formData.get("file_url") as string
  const thumbnail_url = formData.get("thumbnail_url") as string

  // Update resource
  const { data, error } = await supabase
    .from("resources")
    .update({
      title,
      description,
      resource_type,
      file_url,
      thumbnail_url,
      updated_at: new Date().toISOString(),
    })
    .eq("id", resourceId)
    .select()
    .single()

  if (error) {
    console.error("Error updating resource:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/resources")
  revalidatePath("/community/resources")
  revalidatePath(`/community/resources/${resourceId}`)
  return { data, error: null }
}

// Admin: Delete a resource
export async function deleteResource(resourceId: string) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized", data: null }
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profileError || profile.role !== "admin") {
    return { error: "Unauthorized", data: null }
  }

  // Delete resource
  const { error } = await supabase.from("resources").delete().eq("id", resourceId)

  if (error) {
    console.error("Error deleting resource:", error)
    return { error: error.message, success: false }
  }

  revalidatePath("/admin/resources")
  revalidatePath("/community/resources")
  return { error: null, success: true }
}
