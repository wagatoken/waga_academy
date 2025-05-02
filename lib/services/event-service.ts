"use server"

import { createServerClientInstance } from "@/lib/supabase/server"

import { revalidatePath } from "next/cache"

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

export async function getEventBySlug(slug: string): Promise<EventResult<Event>> {
    const supabase = await createServerClientInstance()
    try {
        const { data, error } = await supabase
            .from("event_with_speakers")
            .select(`
                *
            `)
            .eq("slug", slug)
            .single()

        if (error) {
            console.error("Supabase error fetching event by slug:", error)
            return { data: [], error: { message: error.message } }
        }

        return { data: (data as Event) || null, error: null }
    } catch (error) {
        console.error("Unexpected error fetching event by slug:", error)
        return {
            data: [],
            error: { message: "An unexpected error occurred while fetching the event." },
        }
    }
}


