export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server"



export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = await createServerClientInstance();
  const { slug } = params;
  if (!slug) {
    return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
  }

  // Query the view for the full course structure
  const { data, error } = await supabase
    .from("course_with_modules_and_lessons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Fetch related courses (by category, excluding current course)
  let relatedCourses = [];
  if (data?.category) {
    const { data: related, error: relatedError } = await supabase
      .from("courses")
      .select("id, title, slug, description")
      .eq("category", data.category)
      .neq("id", data.id)
      .limit(3);
    if (!relatedError && related) {
      relatedCourses = related;
    }
  }

  // Get user session (if signed in)
  const { data: sessionData } = await supabase.auth.getSession();
  const user_id = sessionData?.session?.user?.id ?? null;
  let in_waitlist = false;

  if (user_id && data?.id) {
    const { count } = await supabase
      .from('course_waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', data.id)
      .eq('user_id', user_id);
    in_waitlist = !!(count && count > 0);
  }

  return NextResponse.json({ data: { ...data, in_waitlist, relatedCourses } });
}
