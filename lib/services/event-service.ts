"use server"

import { createServerClientInstance } from "@/lib/supabase/server"


export type EventError = {
  message: string
}

export type EventResult<T> = {
  data: T | []
  error: EventError | null
}

export type Event = {
    id: number
    slug: string
    title: string
    description: string | null
    location: string 
    is_virtual: boolean 
    created_at: string 
    platform_link: string | null
    image_url: string | null
    max_participants: number 
    registered_count: number | null
    long_description: string | null
    platform: string 
    date_time: string 
    type: string
    duration: string 
    recording: boolean
    speakers: {
        id: number
        name: string
        bio: string | null
        avatar: string | null
        role: string | null
    }[] | null
}

export type MinimalEvent = {
    id: number
    slug: string
    title: string
    description: string | null
    date_time: string  | null
    location: string | null
    duration: string | null
    type: string | null
    is_virtual: boolean | null
    recording: boolean
    speakers: {
        id: number
        name: string
        bio: string | null
        avatar: string | null
        role: string | null
    }[] | null
}

export async function getUpcomingEvents(limit: number = 2): Promise<EventResult<MinimalEvent[]>> {
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

export async function getPastEvents(limit: number = 2): Promise<EventResult<MinimalEvent[]>> {
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

export async function getEventBySlug(slug: string): Promise<EventResult<Event & { is_registered: boolean }>> {
    const supabase = await createServerClientInstance()
    try {
        const { data, error } = await supabase
            .from("event_with_speakers")
            .select(`*`)
            .eq("slug", slug)
            .single()

        if (error) {
            console.error("Supabase error fetching event by slug:", error)
            return { data: [], error: { message: error.message } }
        }

        // Get current user
        const { data: userData } = await supabase.auth.getUser();
        const user = userData?.user;
        let is_registered = false;

        if (user && data?.id) {
            // Check if user is registered for this event
            const { count, error: regError } = await supabase
                .from("event_registrations")
                .select("id", { count: "exact", head: true })
                .eq("event_id", data.id)
                .eq("user_id", user.id);
            if (!regError && count && count > 0) {
                is_registered = true;
            }
        }

        return { data: { ...(data as Event), is_registered }, error: null }
    } catch (error) {
        console.error("Unexpected error fetching event by slug:", error)
        return {
            data: [],
            error: { message: "An unexpected error occurred while fetching the event." },
        }
    }
}

export async function registerForEvent(eventId: string) {
  const supabase = await createServerClientInstance()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to register for an event", data: null }
  }

 
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

  // revalidatePath(`/community/events/${eventId}`)
  return { data, error: null }
}
