import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server"

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const supabase = await createServerClientInstance();
  const { id } = context.params;
  if (!id) {
    return NextResponse.json({ error: "Missing course ID" }, { status: 400 });
  }

  // Query the view for the full course structure
  const { data, error } = await supabase
    .from("course_with_modules_and_lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

