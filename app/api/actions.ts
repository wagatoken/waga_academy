"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Courses
export async function getCourses() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function getCourseBySlug(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      modules:modules(
        *,
        lessons:lessons(*)
      )
    `)
    .eq("slug", slug)
    .single()

  if (error) {
    console.error(`Error fetching course with slug ${slug}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Forum
export async function getForumCategories() {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("forum_categories").select("*").order("order_index", { ascending: true })

  if (error) {
    console.error("Error fetching forum categories:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

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

export async function createForumTopic(categoryId: string, title: string, content: string, userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("forum_topics")
    .insert({
      category_id: categoryId,
      title,
      content,
      user_id: userId,
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

export async function createForumReply(topicId: string, content: string, userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("forum_replies")
    .insert({
      topic_id: topicId,
      content,
      user_id: userId,
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

// Events
export async function getEvents() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      creator:profiles(id, first_name, last_name),
      registrations:event_registrations(count)
    `)
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

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

export async function registerForEvent(eventId: string, userId: string) {
  const supabase = createServerClient()

  // Check if already registered
  const { data: existingReg, error: checkError } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", userId)
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
      user_id: userId,
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

// Resources
export async function getResources() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("resources")
    .select(`
      *,
      creator:profiles(id, first_name, last_name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

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

// User Profile
export async function getUserProfile(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error(`Error fetching user profile ${userId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function updateUserProfile(userId: string, profileData: any) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("profiles").update(profileData).eq("id", userId).select().single()

  if (error) {
    console.error("Error updating user profile:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/community/profile")
  return { data, error: null }
}

// Enrollments
export async function enrollInCourse(courseId: string, userId: string) {
  const supabase = createServerClient()

  // Check if already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", userId)
    .maybeSingle()

  if (checkError) {
    console.error("Error checking enrollment:", checkError)
    return { error: checkError.message, data: null }
  }

  if (existingEnrollment) {
    return { error: "You are already enrolled in this course", data: null }
  }

  // Create enrollment
  const { data, error } = await supabase
    .from("enrollments")
    .insert({
      course_id: courseId,
      user_id: userId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error enrolling in course:", error)
    return { error: error.message, data: null }
  }

  revalidatePath(`/courses/${courseId}`)
  return { data, error: null }
}

export async function getUserEnrollments(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("enrollments")
    .select(`
      *,
      course:courses(*)
    `)
    .eq("user_id", userId)
    .order("enrolled_at", { ascending: false })

  if (error) {
    console.error(`Error fetching enrollments for user ${userId}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

export async function updateEnrollmentProgress(enrollmentId: string, progress: number) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("enrollments")
    .update({ progress })
    .eq("id", enrollmentId)
    .select()
    .single()

  if (error) {
    console.error("Error updating enrollment progress:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}
