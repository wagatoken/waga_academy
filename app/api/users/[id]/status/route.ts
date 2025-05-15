import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";
export const runtime = "edge"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClientInstance();
    const body = await request.json();
    const { status } = body;
    const { id } = await params;


    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User status updated successfully." });
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}