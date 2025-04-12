"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get upcoming events
export async function getUpcomingEvents() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
      registration_count:event_registrations(count)
    `)
    .gte("start_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching upcoming events:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get past events
export async function getPastEvents() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
      registration_count:event_registrations(count)
    `)
    .lt("end_date", new Date().toISOString())
    .order("start_date", { ascending: false })

  if (error) {
    console.error("Error fetching past events:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get a single event
export async function getEvent(eventId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
      registrations:event_registrations(
        *,
        user:profiles(id, first_name, last_name, avatar_url)
      )
    `)
    .eq("id", eventId)
    .single()

  if (error) {
    console.error(`Error fetching event ${eventId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Register for an event
export async function registerForEvent(eventId: string) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to register for an event", data: null }
  }

  // Check if already registered
  const { data: existingReg, error: checkError } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking event registration:", checkError)
    return { error: checkError.message, data: null }
  }

  if (existingReg) {
    return { error: "You are already registered for this event", data: null }
  }

  // Check if event is full
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("max_participants")
    .eq("id", eventId)
    .single()

  if (eventError) {
    console.error("Error fetching event:", eventError)
    return { error: eventError.message, data: null }
  }

  const { count, error: countError } = await supabase
    .from("event_registrations")
    .select("id", { count: true })
    .eq("event_id", eventId)

  if (countError) {
    console.error("Error counting registrations:", countError)
    return { error: countError.message, data: null }
  }

  if (event.max_participants && count >= event.max_participants) {
    return { error: "This event is full", data: null }
  }

  // Register for the event
  const { data, error } = await supabase
    .from("event_registrations")
    .insert({
      event_id: eventId,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error registering for event:", error)
    return { error: error.message, data: null }
  }

  revalidatePath(`/community/events/${eventId}`)
  return { data, error: null }
}

// Admin: Create a new event
export async function createEvent(formData: FormData) {
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
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const location = formData.get("location") as string
  const is_virtual = formData.get("is_virtual") === "true"
  const meeting_url = formData.get("meeting_url") as string
  const max_participants = Number.parseInt(formData.get("max_participants") as string) || null

  // Create event
  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      start_date,
      end_date,
      location,
      is_virtual,
      meeting_url: is_virtual ? meeting_url : null,
      max_participants,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/events")
  revalidatePath("/community/events")
  return { data, error: null }
}

// Admin: Update an event
export async function updateEvent(eventId: string, formData: FormData) {
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
  const start_date = formData.get("start_date") as string
  const end_date = formData.get("end_date") as string
  const location = formData.get("location") as string
  const is_virtual = formData.get("is_virtual") === "true"
  const meeting_url = formData.get("meeting_url") as string
  const max_participants = Number.parseInt(formData.get("max_participants") as string) || null

  // Update event
  const { data, error } = await supabase
    .from("events")
    .update({
      title,
      description,
      start_date,
      end_date,
      location,
      is_virtual,
      meeting_url: is_virtual ? meeting_url : null,
      max_participants,
      updated_at: new Date().toISOString(),
    })
    .eq("id", eventId)
    .select()
    .single()

  if (error) {
    console.error("Error updating event:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/events")
  revalidatePath("/community/events")
  revalidatePath(`/community/events/${eventId}`)
  return { data, error: null }
}

// Admin: Delete an event
export async function deleteEvent(eventId: string) {
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

  // Delete event
  const { error } = await supabase.from("events").delete().eq("id", eventId)

  if (error) {
    console.error("Error deleting event:", error)
    return { error: error.message, success: false }
  }

  revalidatePath("/admin/events")
  revalidatePath("/community/events")
  return { error: null, success: true }
}
