"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get all forum categories
export async function getForumCategories() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("forum_categories")
    .select(`
      *,
      topic_count:forum_topics(count)
    `)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching forum categories:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get topics for a category
export async function getForumTopics(categoryId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("forum_topics")
    .select(`
      *,
      category:forum_categories(*),
      user:profiles(id, first_name, last_name, avatar_url),
      reply_count:forum_replies(count)
    `)
    .eq("category_id", categoryId)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching forum topics for category ${categoryId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get a single topic with replies
export async function getForumTopic(topicId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("forum_topics")
    .select(`
      *,
      category:forum_categories(*),
      user:profiles(id, first_name, last_name, avatar_url),
      replies:forum_replies(
        *,
        user:profiles(id, first_name, last_name, avatar_url)
      )
    `)
    .eq("id", topicId)
    .single()

  if (error) {
    console.error(`Error fetching forum topic ${topicId}:`, error)
    return { error: error.message, data: null }
  }

  // Update view count
  await supabase
    .from("forum_topics")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", topicId)

  return { data, error: null }
}

// Create a new topic
export async function createForumTopic(formData: FormData) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to create a topic", data: null }
  }

  // Extract form data
  const categoryId = formData.get("category_id") as string
  const title = formData.get("title") as string
  const content = formData.get("content") as string

  if (!categoryId || !title || !content) {
    return { error: "Missing required fields", data: null }
  }

  // Create topic
  const { data, error } = await supabase
    .from("forum_topics")
    .insert({
      category_id: categoryId,
      title,
      content,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating forum topic:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/community/forums")
  return { data, error: null }
}

// Create a reply to a topic
export async function createForumReply(formData: FormData) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to reply", data: null }
  }

  // Extract form data
  const topicId = formData.get("topic_id") as string
  const content = formData.get("content") as string

  if (!topicId || !content) {
    return { error: "Missing required fields", data: null }
  }

  // Create reply
  const { data, error } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: topicId,
      content,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating forum reply:", error)
    return { error: error.message, data: null }
  }

  revalidatePath(`/community/forums/topics/${topicId}`)
  return { data, error: null }
}

// Admin: Create a new category
export async function createForumCategory(formData: FormData) {
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
  const name = formData.get("name") as string
  const description = formData.get("description") as string

  // Generate slug from name
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  // Get the highest order_index
  const { data: categories, error: categoriesError } = await supabase
    .from("forum_categories")
    .select("order_index")
    .order("order_index", { ascending: false })
    .limit(1)

  const nextOrderIndex = categories && categories.length > 0 ? categories[0].order_index + 1 : 0

  // Create category
  const { data, error } = await supabase
    .from("forum_categories")
    .insert({
      name,
      description,
      slug,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating forum category:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/forums")
  revalidatePath("/community/forums")
  return { data, error: null }
}

// Admin: Pin/unpin a topic
export async function togglePinTopic(topicId: string, isPinned: boolean) {
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

  // Update topic
  const { data, error } = await supabase
    .from("forum_topics")
    .update({ is_pinned: isPinned })
    .eq("id", topicId)
    .select()
    .single()

  if (error) {
    console.error("Error updating topic pin status:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/community/forums")
  return { data, error: null }
}

// Admin: Lock/unlock a topic
export async function toggleLockTopic(topicId: string, isLocked: boolean) {
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

  // Update topic
  const { data, error } = await supabase
    .from("forum_topics")
    .update({ is_locked: isLocked })
    .eq("id", topicId)
    .select()
    .single()

  if (error) {
    console.error("Error updating topic lock status:", error)
    return { error: error.message, data: null }
  }

  revalidatePath(`/community/forums/topics/${topicId}`)
  return { data, error: null }
}
