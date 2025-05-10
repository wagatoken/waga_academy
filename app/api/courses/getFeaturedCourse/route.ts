import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClientInstance();

  const { data, error } = await supabase
    .from("courses")
    .select(`
      *,
      creator:profiles(id, first_name, last_name, avatar_url)
    `)
    .eq("status", "published")
    .eq("is_featured", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching featured courses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}