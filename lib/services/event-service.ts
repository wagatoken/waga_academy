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
    title: string
    description: string
    location: string
    is_virtual: boolean
    created_at: string 
    platform_link: string
    image_url: string
    max_participants: number
    registered_count: number
    long_description: string
    platform: string
    date_time: string
    type: string
    duration: string
}

export type MinimalEvent = {
    id: number
    title: string
    description: string
    date_time: string
    location: string
    duration: string
    is_virtual: boolean
}



export async function getUpcomingEvents(limit: number = 2): Promise<EventResult<MinimalEvent[]>> {
    const supabase = await createServerClientInstance()
    try {
        const { data, error } = await supabase
            .from("events")
            .select(`
                id,
                title,
                description,
                date_time,
                location,
                duration,
                is_virtual
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

