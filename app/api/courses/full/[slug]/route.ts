import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server"



export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const supabase = await createServerClientInstance();
  const { slug } = await params;
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

  return NextResponse.json({ data });
}
