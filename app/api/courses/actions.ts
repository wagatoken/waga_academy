"use server"


import { createServerClientInstance } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server";


// Admin: Create a new course
export async function createCourse(formData: FormData) {
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

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const duration = formData.get("duration") as string 
  const category = formData.get("category") as string
  const difficulty_level = formData.get("difficulty_level") as string
  const language = formData.get("language") as string
  const instructor = formData.get("instructor") as string
  const tags = formData.get("tags") as string
  const image_url = formData.get("image_url") as string

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
      duration,
      difficulty_level,
      category,
      tags,
      language,
      image_url,
      instructor,
      created_by: user.id,
      is_published: false,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating course:", error)
    return { error: error.message, data: null }
  }

  revalidatePath("/admin/courses")
  return { data: { id: data.id }, error: null }
}

type Lesson = {
  order_index: number
  id: string
  title: string
  content: string
  video_url: string
  duration: string
}

type Module = {
  order_index: number
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

// Fix: Use unique variable names in updateCourseWithModulesAndLessons to avoid redeclaration errors
export async function updateCourseWithModulesAndLessons(courseId: string, modules: any[]) {
  const supabase = await createServerClientInstance();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) {
    return { error: "Unauthorized", data: null };
  }
  const { data: profileData, error: profileErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();
  if (profileErr || profileData.role !== "admin") {
    return { error: "Unauthorized", data: null };
  }

  // 1. Fetch all current modules and lessons for the course
  const { data: dbModules, error: dbModulesError } = await supabase
    .from("modules")
    .select("id")
    .eq("course_id", courseId);
  if (dbModulesError) {
    return { error: dbModulesError.message, data: null };
  }
  const dbModuleIds = dbModules.map((m: any) => m.id);

  const { data: dbLessons, error: dbLessonsError } = await supabase
    .from("lessons")
    .select("id, module_id")
    .in("module_id", dbModuleIds.length ? dbModuleIds : ["00000000-0000-0000-0000-000000000000"]);
  if (dbLessonsError) {
    return { error: dbLessonsError.message, data: null };
  }
  const dbLessonIds = dbLessons.map((l: any) => l.id);

  // 2. Prepare sets for comparison
  const incomingModuleIds = modules.filter(m => m.id && m.id.length === 36).map(m => m.id);
  const incomingLessonIds = modules.flatMap(m => (m.lessons || []).filter(l => l.id && l.id.length === 36).map(l => l.id));

  // 3. Delete removed lessons
  const lessonsToDelete = dbLessons.filter(l => !incomingLessonIds.includes(l.id));
  for (const lesson of lessonsToDelete) {
    await supabase.from("lessons").delete().eq("id", lesson.id);
  }

  // 4. Delete removed modules (and cascade lessons)
  const modulesToDelete = dbModules.filter(m => !incomingModuleIds.includes(m.id));
  for (const mod of modulesToDelete) {
    await supabase.from("modules").delete().eq("id", mod.id);
  }

  // 5. Upsert modules and lessons
  for (const mod of modules) {
    let moduleId = mod.id;
    if (mod.id && mod.id.length === 36 && dbModuleIds.includes(mod.id)) {
      // Update existing module
      await supabase.from("modules").update({
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index,
        updated_at: new Date().toISOString(),
      }).eq("id", mod.id);
    } else {
      // Insert new module
      const { data: newMod, error: newModError } = await supabase.from("modules").insert({
        course_id: courseId,
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index,
      }).select("id").single();
      if (newMod && newMod.id) {
        moduleId = newMod.id;
      }
    }
    // Upsert lessons for this module
    for (const lesson of mod.lessons || []) {
      if (lesson.id && lesson.id.length === 36 && dbLessonIds.includes(lesson.id)) {
        // Update existing lesson
        await supabase.from("lessons").update({
          title: lesson.title,
          content: lesson.content,
          video_url: lesson.video_url,
          duration: lesson.duration,
          order_index: lesson.order_index,
          updated_at: new Date().toISOString(),
        }).eq("id", lesson.id);
      } else {
        // Insert new lesson
        await supabase.from("lessons").insert({
          module_id: moduleId,
          title: lesson.title,
          content: lesson.content,
          video_url: lesson.video_url,
          duration: lesson.duration,
          order_index: lesson.order_index,
        });
      }
    }
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data: true, error: null };
}


// Admin: Update a course
export async function updateCourse(courseId: string, formData: FormData) {
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

  // Extract form data
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const difficulty_level = formData.get("difficulty_level") as string
  const duration = formData.get("duration") as string || 0
  const is_published = formData.get("is_published") === "true"

  // Update course
  const { data, error } = await supabase
    .from("courses")
    .update({
      title,
      description,
      difficulty_level,
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

// Admin: Create modules for a course
export async function createModules(courseId: string, modules: { title: string; description: string }[]) {
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

  // Insert modules
  const formattedModules = modules.map((module, index) => ({
    course_id: courseId,
    title: module.title,
    description: module.description,
    order_index: index,
  }));

  const { data, error } = await supabase.from("modules").insert(formattedModules).select();

  if (error) {
    console.error("Error creating modules:", error);
    return { error: error.message, data: null };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

// Admin: Update course requirements
export async function updateRequirements(courseId: string, requirements: { prerequisites: string; target_audience: string; learning_objectives: string }) {
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

  // Update requirements
  const { data, error } = await supabase
    .from("courses")
    .update({
      prerequisites: requirements.prerequisites,
      target_audience: requirements.target_audience,
      learning_objectives: requirements.learning_objectives,
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating requirements:", error);
    return { error: error.message, data: null };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

// Admin: Update course settings
export async function updateSettings(courseId: string, settings: { status: string; visibility: string; certificate: boolean }) {
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

  // Update settings
  const { data, error } = await supabase
    .from("courses")
    .update({
      status: settings.status,
      visibility: settings.visibility,
      certificate: settings.certificate,
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating settings:", error);
    return { error: error.message, data: null };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

// Admin: Update course settings with additional resources
export async function updateCourseSettings(
  courseId: string,
  settings: { status: string; visibility: string; certificate: boolean; additional_resources: string }
) {
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

  // Update settings
  const { data, error } = await supabase
    .from("courses")
    .update({
      status: settings.status,
      visibility: settings.visibility,
      certificate: settings.certificate,
      additional_resources: settings.additional_resources,
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating settings:", error);
    return { error: error.message, data: null };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}

// Student: Enroll in a course
export async function enrollInCourse(courseId: string) {
  const supabase = await createServerClientInstance()

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
  const supabase = await createServerClientInstance()

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
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `)
    .eq("status", "Published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    return { error: error.message, data: null };
  }

  return { data, error: null };
}

// Get course by slug (public)
export async function getCourseBySlug(slug: string) {
  const supabase = await createServerClientInstance()

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

// Admin: Get all courses (including unpublished) with pagination, search, filter, and sort
export async function getAdminCourses({ page = 1, search = "", status = "", level = "" }) {
  const supabase = await createServerClientInstance();

  // Pagination settings
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  // Build query with filters
  let query = supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  if (level && level !== "all") {
    query = query.eq("difficulty_level", level);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching admin courses:", error);
    return { error: error.message, data: null };
  }

  const totalPages = Math.ceil((count || 0) / pageSize);

  return { data: { courses: data, totalPages }, error: null };
}

// Admin: Update course requirements
export async function updateCourseRequirements(courseId: string, requirements: { prerequisites: string; target_audience: string; learning_objectives: string }) {
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

  // Update requirements
  const { data, error } = await supabase
    .from("courses")
    .update({
      prerequisites: requirements.prerequisites,
      target_audience: requirements.target_audience,
      learning_objectives: requirements.learning_objectives,
    })
    .eq("id", courseId)
    .select()
    .single();

  if (error) {
    console.error("Error updating requirements:", error);
    return { error: error.message, data: null };
  }

  revalidatePath(`/admin/courses/${courseId}`);
  return { data, error: null };
}



