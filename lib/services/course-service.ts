"use server"

import { createServerClientInstance } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export type CourseError = {
  message: string
}

export type CourseResult<T> = {
  data: T | null
  error: CourseError | null
}

// Get all published courses
export async function getPublishedCourses(): Promise<CourseResult<any[]>> {
  const supabase = createServerClientInstance()

  try {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching courses:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching courses." },
    }
  }
}

// Get a course by slug
export async function getCourseBySlug(slug: string): Promise<CourseResult<any>> {
  const supabase = createServerClientInstance()

  try {
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
      .eq("is_published", true)
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching course:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching the course." },
    }
  }
}

// Create a new course (admin only)
export async function createCourse(courseData: any): Promise<CourseResult<any>> {
  const supabase = createServerClientInstance()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return { data: null, error: { message: "Unauthorized" } }
    }

    // Create the course
    const { data, error } = await supabase
      .from("courses")
      .insert({
        ...courseData,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    revalidatePath("/courses")
    revalidatePath("/admin/courses")

    return { data, error: null }
  } catch (error) {
    console.error("Error creating course:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while creating the course." },
    }
  }
}

// Update a course (admin only)
export async function updateCourse(courseId: string, courseData: any): Promise<CourseResult<any>> {
  const supabase = createServerClientInstance()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Check if the user is an admin
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profileError || !profile || profile.role !== "admin") {
      return { data: null, error: { message: "Unauthorized" } }
    }

    // Update the course
    const { data, error } = await supabase.from("courses").update(courseData).eq("id", courseId).select().single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    revalidatePath("/courses")
    revalidatePath(`/courses/${data.slug}`)
    revalidatePath("/admin/courses")
    revalidatePath(`/admin/courses/${courseId}`)

    return { data, error: null }
  } catch (error) {
    console.error("Error updating course:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while updating the course." },
    }
  }
}

// Enroll a user in a course
export async function enrollInCourse(courseId: string): Promise<CourseResult<any>> {
  const supabase = createServerClientInstance()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Check if the user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from("enrollments")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle()

    if (checkError) {
      return { data: null, error: { message: checkError.message } }
    }

    if (existingEnrollment) {
      return { data: existingEnrollment, error: null }
    }

    // Create the enrollment
    const { data, error } = await supabase
      .from("enrollments")
      .insert({
        user_id: user.id,
        course_id: courseId,
      })
      .select()
      .single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    revalidatePath("/community/dashboard")

    return { data, error: null }
  } catch (error) {
    console.error("Error enrolling in course:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while enrolling in the course." },
    }
  }
}

// Get user's enrolled courses
export async function getUserEnrolledCourses(): Promise<CourseResult<any[]>> {
  const supabase = createServerClientInstance()

  try {
    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { data: null, error: { message: "Not authenticated" } }
    }

    // Get the user's enrollments with course details
    const { data, error } = await supabase
      .from("enrollments")
      .select(`
        *,
        course:courses(*)
      `)
      .eq("user_id", user.id)
      .order("enrolled_at", { ascending: false })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching enrolled courses:", error)
    return {
      data: null,
      error: { message: "An unexpected error occurred while fetching enrolled courses." },
    }
  }
}
