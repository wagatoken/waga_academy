import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("categoryId");
  if (!categoryId) {
    return NextResponse.json({ data: null, error: { message: "categoryId is required" } }, { status: 400 });
  }
  const supabase = await createServerClientInstance();
  try {
    const { data, error } = await supabase
      .from("forum_topics")
      .select(`*, user:profiles(id, first_name, last_name, avatar_url), replies:forum_replies(count)`)
      .eq("category_id", categoryId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
    }
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: { message: "An unexpected error occurred while fetching topics." } }, { status: 500 });
  }
}
