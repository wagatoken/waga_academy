import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/server";

export async function GET() {
  try {
    const supabase = await createServerClientInstance();
    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, email, role, status");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
  }
}


