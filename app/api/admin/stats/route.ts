import { NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";
export const runtime = "edge"

export async function GET() {
  const supabase = await createServerClientInstance();
    const { data, error } = await supabase.from("admin_stats").select("*").single();

    if (error) {
    console.error("Error fetching featured courses:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }


  return NextResponse.json({ data });
}