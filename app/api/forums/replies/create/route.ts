import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

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
    const { data, error } = await supabase
      .from("forum_replies")
      .insert({
        ...body,
        user_id: userId,
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
    }
    return NextResponse.json({ data, error: null });
  } catch (error) {
    return NextResponse.json({ data: null, error: { message: "An unexpected error occurred while creating the reply." } }, { status: 500 });
  }
}
