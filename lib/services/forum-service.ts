"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type ForumError = {
  message: string
}

export type ForumResult<T> = {
  data: T | null
  error: ForumError | null
}

// Get all forum categories
export async function getForumCategories(): Promise<ForumResult<any[]>> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*")
      .order("order_index", { ascending: true })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching forum categories:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching forum categories." },
    }
  }
}

// Get topics for a category
export async function getTopicsByCategory(categoryId: string): Promise<ForumResult<any[]>> {
  const supabase = createServerClient()

  try {
    const { data, error } = await supabase
      .from("forum_topics")
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url),
        replies:forum_replies(count)
      `)
      .eq("category_id", categoryId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching topics:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching topics." },
    }
  }
}

// Get a topic with its replies
export async function getTopicWithReplies(topicId: string): Promise<ForumResult<any>> {
  const supabase = createServerClient()

  try {
    // Increment view count
    await supabase.rpc("increment_topic_views", { topic_id: topicId })

    // Get the topic
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url),
        category:forum_categories(id, name, slug)
      `)
      .eq("id", topicId)
      .single()

    if (topicError) {
      return { data: null, error: { message: topicError.message } }
    }

    // Get the replies
    const { data: replies, error: repliesError } = await supabase
      .from("forum_replies")
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url)
      `)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true })

    if (repliesError) {
      return { data: null, error: { message: repliesError.message } }
    }

    return {
      data: {
        ...topic,
        replies,
      },
      error: null,
    }
  } catch (error) {
    console.error("Error fetching topic with replies:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching the topic." },
    }
  }
}

// Create a new topic
export async function createTopic(topicData: any): Promise<ForumResult<any>> {
  const supabase = createServerClient()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Create the topic
    const { data, error } = await supabase
      .from("forum_topics")
      .insert({
        ...topicData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    revalidatePath("/community/forums")
    revalidatePath(`/community/forums/topics/${data.id}`)

    return { data, error: null }
  } catch (error) {
    console.error("Error creating topic:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while creating the topic." },
    }
  }
}

// Create a reply to a topic
export async function createReply(replyData: any): Promise<ForumResult<any>> {
  const supabase = createServerClient()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Create the reply
    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        ...replyData,
        user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    revalidatePath(`/community/forums/topics/${replyData.topic_id}`)

    return { data, error: null }
  } catch (error) {
    console.error("Error creating reply:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while creating the reply." },
    }
  }
}
