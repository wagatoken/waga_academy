export const runtime = 'edge';
import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const topicId = searchParams.get("topicId");
  if (!topicId) {
    return NextResponse.json({ data: null, error: { message: "topicId is required" } }, { status: 400 });
  }
  const supabase = await createServerClientInstance();
  try {
    await supabase.rpc("increment_topic_views", { topic_id: topicId });
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .select(`*, user:profiles(id, first_name, last_name, avatar_url), category:forum_categories(id, name, style_class)`)
      .eq("id", topicId)
      .single();
    if (topicError) {
      return NextResponse.json({ data: null, error: { message: topicError.message } }, { status: 500 });
    }
    const { data: replies, error: repliesError } = await supabase
      .from("forum_replies")
      .select(`*, user:profiles(id, first_name, last_name, avatar_url)`)
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });
    if (repliesError) {
      return NextResponse.json({ data: null, error: { message: repliesError.message } }, { status: 500 });
    }
    return NextResponse.json({ data: { ...topic, replies }, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: { message: "An unexpected error occurred while fetching the topic." } }, { status: 500 });
  }
}
