"use server"

import { createServerClientInstance } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Get all forum categories
export async function getForumCategories() {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from("forum_topic_reply_counts")
    .select(`
      *
    `)
    .order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching forum categories:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get topics for a category
export async function getForumTopic(categoryId: string) {
  const supabase = await createServerClientInstance()

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

// Get topics with pagination
export async function getForumTopics(page: number = 1, limit: number = 10) {
  const supabase = await createServerClientInstance();

  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("forum_topics")
    .select(
      `
      *,
      category:forum_categories(*),
      user:profiles(id, first_name, last_name, avatar_url),
      reply_count:forum_replies(count)
    `,
      { count: "exact" } // Get the total count of topics
    )
    .order("is_pinned", { ascending: false }) // Pinned topics first
    .order("created_at", { ascending: false }) // Newest topics first
    .range(offset, offset + limit - 1); // Apply pagination range

  if (error) {
    console.error("Error fetching forum topics:", error);
    return { error: error.message, data: null, meta: null };
  }

  const totalPages = Math.ceil((count || 0) / limit); // Calculate total pages

  return {
    data,
    error: null,
    meta: {
      currentPage: page,
      totalPages,
      totalItems: count || 0,
    },
  };
}

// Create a new topic
export async function createForumTopic(formData: FormData) {
  const supabase = await createServerClientInstance()

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
  const isPinned = formData.get("is_pinned") as string

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
      profile_id: user.id,
      is_pinned: isPinned,
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

// Get all replies for a topic, flat (for building nested tree on frontend)
export async function getForumRepliesForTopic(topicId: string) {
  const supabase = await createServerClientInstance();

  // Fetch topic details
  const { data: topicData, error: topicError } = await supabase
    .from("forum_topics")
    .select(`
      id,
      title,
      content,
      created_at,
      category:forum_categories(name),
      user:profiles(id, first_name, last_name, avatar_url)
    `)
    .eq("id", topicId)
    .single();

  if (topicError) {
    console.error(`Error fetching topic ${topicId}:`, topicError);
    return { error: topicError.message, data: null };
  }

 

  // Fetch replies
  const { data: replies, error } = await supabase
    .from("forum_replies")
    .select(`
      id,
      topic_id,
      author_id,
      content,
      parent_id,
      created_at,
      profiles:author_id(id, first_name, last_name, avatar_url)
    `)
    .eq("topic_id", topicId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(`Error fetching replies for topic ${topicId}:`, error);
    return { error: error.message, data: null };
  }

  // Build topic object for frontend
  const topic = {
    id: topicData.id,
    title: topicData.title,
    content: topicData.content,
    author: topicData.user?.first_name && topicData.user?.last_name
      ? `${topicData.user.first_name} ${topicData.user.last_name}`
      : "Unknown",
    avatar: topicData.user?.avatar_url || (topicData.user?.first_name ? topicData.user.first_name[0] : "U"),
    category: topicData.category?.name || "",
    date: topicData.created_at,
  };

  return { data: { topic, replies }, error: null };
}

// Create a reply (top-level or nested)
export async function createForumReply(formData: FormData) {
  const supabase = await createServerClientInstance();

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to reply", data: null }
  }

  // Extract form data
  const topicId = formData.get("topic_id") as string;
  const content = formData.get("content") as string;
  const parentId = formData.get("parent_id") as string | null;

  if (!topicId || !content) {
    return { error: "Missing required fields", data: null }
  }

  // Create reply (with parent_id for nested replies)
  const { data, error } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: topicId,
      content,
      author_id: user.id,
      parent_id: parentId || null,
    })
    .select(`
      *,
      profiles:author_id(id, first_name, last_name, avatar_url)
    `)
    .single();
  

  if (error) {
    console.error("Error creating forum reply:", error)
    return { error: error.message, data: null }
  }

  // Revalidate topic page
  revalidatePath(`/community/forums/topics/${topicId}`)
  return { data, error: null }
}

// Admin: Create a new category
export async function createForumCategory(formData: FormData) {
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
    .select(`
      *,
      profiles:author_id(id, first_name, last_name, avatar_url)
    `)
    .single();
    

  if (profileError || profile.role !== "admin") {
    return { error: "Unauthorized", data: null }
  }

  // Extract form data
  const name = formData?.get("name") as string
  const description = formData?.get("description") as string

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

export async function getTopicsByCategory(categorySlug: string): Promise<ForumResult<any[]>> {
  const supabase = await createServerClientInstance();

  // Step 1: Get the category id for the given slug
  const { data: category, error: categoryError } = await supabase
    .from("forum_categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (categoryError || !category) {
    return { data: null, error: { message: categoryError?.message || "Category not found" } };
  }

  // Step 2: Use the category id to select from the view
  const { data, error } = await supabase
    .from("forum_topics_with_user_and_reply_count")
    .select("*, category:forum_categories(name, description)")
    .eq("category_id", category.id)
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) {
    return { data: null, error: { message: error.message } };
  }

  return { data, error: null };
}

// Admin: Pin/unpin a topic
export async function togglePinTopic(topicId: string, isPinned: boolean) {
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

// Admin: Delete a topic
export async function deleteForumTopic(topicId: string) {
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

  // Delete the topic
  const { error } = await supabase
    .from("forum_topics")
    .delete()
    .eq("id", topicId);

  if (error) {
    console.error(`Error deleting forum topic ${topicId}:`, error);
    return { error: error.message, data: null };
  }

  // Revalidate paths to reflect changes
  revalidatePath("/admin/forums");
  revalidatePath("/community/forums");

  return { error: null, data: "Topic deleted successfully" };
}

export async function getForumCategoryBySlug(slug: string): Promise<{ data: any | null; error: string | null }> {
  const supabase = await createServerClientInstance();
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}


