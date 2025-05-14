"use server"

import { createServerClientInstance } from "@/server"
import { revalidatePath } from "next/cache"
import { MinimalEvent } from "@/lib/services/event-service"

// Get upcoming events
export async function getUpcomingEvents(limit: number = 6) {
  const supabase = await createServerClientInstance()
  try {
    const { data, error } = await supabase
      .from("event_with_speakers")
      .select(`
        *
      `)
      .gte("date_time", new Date().toISOString())
      .order("date_time", { ascending: true })
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching upcoming events:", error)
      return { data: [], error: { message: error.message } }
    }

    return { data: (data as MinimalEvent[]) || [], error: null }
  } catch (error) {
    console.error("Unexpected error fetching upcoming events:", error)
    return {
      data: [], 
      error: { message: "An unexpected error occurred while fetching upcoming events." },
    }
  }
}

// Get past events
export async function getPastEvents(limit: number = 6) {
  const supabase = await createServerClientInstance()
  try {
    const { data, error } = await supabase
      .from("event_with_speakers")
      .select(`
        *
      `)
      .lt("date_time", new Date().toISOString())
      .order("date_time", { ascending: false }) 
      .limit(limit)

    if (error) {
      console.error("Supabase error fetching past events:", error)
      return { data: [], error: { message: error.message } }
    }

    return { data: (data as MinimalEvent[]) || [], error: null }
  } catch (error) {
    console.error("Unexpected error fetching past events:", error)
    return {
      data: [], 
      error: { message: "An unexpected error occurred while fetching past events." },
    }
  }
}

// Get a single event
export async function getEvent(EventId: string) {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `)
    .eq("id", EventId)
    .single()

  if (error) {
    console.error(`Error fetching resource ${EventId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function getPaginatedEvents(page: number, limit: number) {
  const supabase = await createServerClientInstance()

  // Calculate the range for pagination
  const from = (page - 1) * limit
  const to = from + limit - 1

  // Fetch paginated events
  const { data, error, count } = await supabase
    .from("events")
    .select("*", { count: "exact" }) // Fetch events and total count
    .order("date_time", { ascending: true }) // Order by start date
    .range(from, to) // Apply pagination range

  if (error) {
    console.error("Error fetching paginated events:", error)
    return { error: error.message, data: null, meta: null }
  }

  // Calculate total pages
  const totalPages = Math.ceil((count || 0) / limit)

  return {
    data,
    meta: {
      totalPages,
      totalCount: count || 0,
      currentPage: page,
      limit,
    },
    error: null,
  }
}

// Register for an event
export async function registerForEvent(eventId: string) {
  const supabase = await createServerClientInstance()

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
    .select("id", { count: "exact" })
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
  const supabase = await createServerClientInstance()

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
  const date_time = formData.get("date_time") as string
  const location = formData.get("location") as string
  const is_virtual = formData.get("is_virtual") === "true"
  const platform_link = formData.get("platform_link") as string
  const max_participants = formData.get("max_participants")
    ? parseInt(formData.get("max_participants") as string, 10)
    : null
  const platform = formData.get("platform") as string
  const duration = formData.get("duration") as string
  const recording = formData.get("recording") === "true"
  const type = formData.get("type") as string
  // Create event
  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      date_time,
      location: is_virtual ? null : location,
      is_virtual,
      platform_link: is_virtual ? platform_link : null,
      max_participants,
      platform,
      type,
      duration,
      recording,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    return { error: error.message, data: null }
  }

  // Revalidate paths
  revalidatePath("/admin/events")
  revalidatePath("/community/events")
  return { data, error: null }
}

// Admin: Update an event
export async function updateEvent(eventId: string, formData: FormData) {
  const supabase = await createServerClientInstance();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized", data: null };
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile.role !== "admin") {
    return { error: "Unauthorized", data: null };
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date_time = formData.get("date_time") as string
  const location = formData?.get("location") as string
  const is_virtual = formData?.get("is_virtual") === "true"
  const platform_link = formData?.get("platform_link") as string
  const type = formData.get("type") as string
  const max_participants = formData?.get("max_participants")
    ? parseInt(formData.get("max_participants") as string, 10)
    : null
  const platform = formData?.get("platform") as string
  const duration = formData?.get("duration") as string
  const recording = formData?.get("recording") === "true"
  

  // Create event
  const { data, error } = await supabase
    .from("events")
    .update({
      title,
      description,
      date_time,
      location: is_virtual ? null : location,
      is_virtual,
      platform_link: is_virtual ? platform_link : null,
      max_participants,
      type,
      platform,
      duration,
      recording,
      created_by: user.id,
    })
    .eq("id", eventId)
    .select()
    .single()
  if (error) {
    console.error("Error updating event:", error);
    return { error: error.message, data: null };
  }

  // Revalidate paths
  revalidatePath("/admin/events");
  revalidatePath("/community/events");
  revalidatePath(`/community/events/${eventId}`);
  return { data, error: null };
}

// Admin: Delete an event
export async function deleteEvent(eventId: string) {
  const supabase = await createServerClientInstance()

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
