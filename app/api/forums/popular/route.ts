export const runtime = 'edge';
import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createServerClientInstance();
  try {
    const { data, error } = await supabase
      .from("forum_topics_view")
      .select("*")
      .order("replies_count", { ascending: false })
      .limit(5);
    if (error) {
      return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
    }
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: { message: "An unexpected error occurred while fetching popular topics." } }, { status: 500 });
  }
}
