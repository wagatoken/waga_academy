"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Admin: Create a new course
export async function createCourse(formData: FormData) {
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
  const level = formData.get("level") as string
  const duration = Number.parseInt(formData.get("duration") as string) || 0

  // Generate slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")

  // Insert course
  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description,
      level,
      duration,
      created_by: user.id,
      is_published: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating course:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/courses")
  return { data, error: null }
}

// Admin: Update a course
export async function updateCourse(courseId: string, formData: FormData) {
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
  const level = formData.get("level") as string
  const duration = Number.parseInt(formData.get("duration") as string) || 0
  const is_published = formData.get("is_published") === "true"

  // Update course
  const { data, error } = await supabase
    .from("courses")
    .update({
      title,
      description,
      level,
      duration,
      is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", courseId)
    .select()
    .single()

  if (error) {
    console.error("Error updating course:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/courses")
  revalidatePath(`/courses/${data.slug}`)
  return { data, error: null }
}

// Admin: Delete a course
export async function deleteCourse(courseId: string) {
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

  // Delete course
  const { error } = await supabase.from("courses").delete().eq("id", courseId)

  if (error) {
    console.error("Error deleting course:", error)
    return { error: error.message, success: false }
  }

  revalidatePath("/admin/courses")
  return { error: null, success: true }
}

// Admin: Add a module to a course
export async function addModuleToCourse(courseId: string, formData: FormData) {
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

  // Get the highest order_index for this course
  const { data: modules, error: modulesError } = await supabase
    .from("modules")
    .select("order_index")
    .eq("course_id", courseId)
    .order("order_index", { ascending: false })
    .limit(1)

  const nextOrderIndex = modules && modules.length > 0 ? modules[0].order_index + 1 : 0

  // Insert module
  const { data, error } = await supabase
    .from("modules")
    .insert({
      course_id: courseId,
      title,
      description,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding module:", error)
    return { error: error.message, data: null }
  }

  revalidatePath(`/admin/courses/${courseId}`)
  return { data, error: null }
}

// Admin: Add a lesson to a module
export async function addLessonToModule(moduleId: string, formData: FormData) {
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
  const content = formData.get("content") as string
  const video_url = formData.get("video_url") as string
  const duration = Number.parseInt(formData.get("duration") as string) || 0

  // Get the highest order_index for this module
  const { data: lessons, error: lessonsError } = await supabase
    .from("lessons")
    .select("order_index")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: false })
    .limit(1)

  const nextOrderIndex = lessons && lessons.length > 0 ? lessons[0].order_index + 1 : 0

  // Insert lesson
  const { data, error } = await supabase
    .from("lessons")
    .insert({
      module_id: moduleId,
      title,
      content,
      video_url,
      duration,
      order_index: nextOrderIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Error adding lesson:", error)
    return { error: error.message, data: null }
  }

  // Get the course_id for the module to revalidate the path
  const { data: module, error: moduleError } = await supabase
    .from("modules")
    .select("course_id")
    .eq("id", moduleId)
    .single()

  if (!moduleError && module) {
    revalidatePath(`/admin/courses/${module.course_id}`)
  }

  return { data, error: null }
}

// Student: Enroll in a course
export async function enrollInCourse(courseId: string) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "You must be logged in to enroll in a course", data: null }
  }

  // Check if already enrolled
  const { data: existingEnrollment, error: checkError } = await supabase
    .from("enrollments")
    .select("id")
    .eq("course_id", courseId)
    .eq("user_id", user.id)
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
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error("Error enrolling in course:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/courses")
  revalidatePath("/dashboard")
  return { data, error: null }
}

// Student: Update course progress
export async function updateCourseProgress(enrollmentId: string, progress: number) {
  const supabase = createServerClient()

  // Get the current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized", data: null }
  }

  // Update enrollment progress
  const { data, error } = await supabase
    .from("enrollments")
    .update({
      progress,
      completed_at: progress === 100 ? new Date().toISOString() : null,
    })
    .eq("id", enrollmentId)
    .eq("user_id", user.id) // Ensure the user owns this enrollment
    .select()
    .single()

  if (error) {
    console.error("Error updating progress:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/dashboard")
  return { data, error: null }
}

// Get all courses (public)
export async function getAllCourses() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
      enrollment_count:enrollments(count)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching courses:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Get course by slug (public)
export async function getCourseBySlug(slug: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
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

// Admin: Get all courses (including unpublished)
export async function getAdminCourses() {
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

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url),
      enrollment_count:enrollments(count),
      module_count:modules(count)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching admin courses:", error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}
