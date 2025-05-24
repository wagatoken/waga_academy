import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = await createServerClientInstance();
  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      return NextResponse.json({ data: null, error: { message: "Failed to retrieve session." } }, { status: 401 });
    }
    if (!sessionData?.session) {
      return NextResponse.json({ data: null, error: { message: "Not authenticated" } }, { status: 401 });
    }
    const userId = sessionData.session.user.id;
    const { data: topic, error: topicError } = await supabase
      .from("forum_topics")
      .insert({
        title: body.title,
        content: body.content,
        profile_id: userId,
        category_id: body.category,
      })
      .select()
      .single();
    if (topicError) {
      return NextResponse.json({ data: null, error: { message: topicError.message || "Failed to create the topic." } }, { status: 500 });
    }
    const { error: categoryError } = await supabase.rpc('increment', { row_id: body.category });
    if (categoryError) {
      return NextResponse.json({ data: null, error: { message: categoryError.message || "Failed to update topic count." } }, { status: 500 });
    }
    revalidatePath("/community/dashboard");
    return NextResponse.json({ data: topic, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: { message: "An unexpected error occurred while creating the topic." } }, { status: 500 });
  }
}
