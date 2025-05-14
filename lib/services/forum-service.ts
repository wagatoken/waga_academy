"use server"

import { createServerClientInstance } from "@/server"

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
  const supabase = await createServerClientInstance()

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

// Get recent topics
export async function getRecentTopics(): Promise<ForumResult<any[]>> {
  const supabase = await createServerClientInstance()
  try {
    const { data, error } = await supabase
      .from("forum_topics_view")
      .select("*")
      .order("last_active", { ascending: true })
      .limit(5)

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching recent topics:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching recent topics." },
    }
  }
}

// Get popular topics
export async function getPopularTopics(): Promise<ForumResult<any[]>> {
  const supabase = await createServerClientInstance()

  try {
    const { data, error } = await supabase
      .from("forum_topics_view")
      .select("*")
      .order("replies_count", { ascending: false })
      .limit(5)

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching popular topics:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching popular topics." },
    }
  }
}
// Get topics for a category
export async function getTopicsByCategory(categoryId: string): Promise<ForumResult<any[]>> {
  const supabase = await createServerClientInstance()

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
  const supabase = await createServerClientInstance()

  try {
    // Increment view count
    await supabase.rpc("increment_topic_views", { topic_id: topicId })

    // Get the topic
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .select(`
        *,
        user:profiles(id, first_name, last_name, avatar_url),
        category:forum_categories(id, name, style_class)
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
  const supabase = await createServerClientInstance();

  try {
    // Get the current session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("Error fetching session:", sessionError);
      return { data: null, error: { message: "Failed to retrieve session." } };
    }

    if (!sessionData?.session) {
      console.log("No active session found.");
      return { data: null, error: { message: "Not authenticated" } };
    }

    const userId = sessionData.session.user.id;

    // Create the topic
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .insert({
        title: topicData.title,
        content: topicData.content,
        profile_id: userId, // Use the authenticated user's ID
        category_id: topicData.category,
      })
      .select()
      .single();

    if (topicError) {
      console.error("Error inserting topic:", topicError);
      return { data: null, error: { message: topicError.message || "Failed to create the topic." } };
    }

    // Increment the topic count for the category
    const { error: categoryError } = await supabase
      .rpc('increment', { row_id: topicData.category })


    if (categoryError) {
      console.error("Error updating topic count for category:", categoryError);
      return { data: null, error: { message: categoryError.message || "Failed to update topic count." } };
    }

    // Revalidate the forums page
    revalidatePath("/community/dashboard");

    return { data: topic, error: null };
  } catch (error) {
    console.error("Unexpected error creating topic:", error);
    return {
      data: null,
      error: { message: "An unexpected error occurred while creating the topic." },
    };
  }
}

// Create a reply to a topic
export async function createReply(replyData: any): Promise<ForumResult<any>> {
  const supabase = await createServerClientInstance()

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

    // revalidatePath(`/community/forums/topics/${replyData.topic_id}`)

    return { data, error: null }
  } catch (error) {
    console.error("Error creating reply:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while creating the reply." },
    }
  }
}
