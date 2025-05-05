export const runtime = 'edge'

import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, first_name, last_name, email, role, interest, background } = body

    // Create a Supabase client with the service role key
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Supabase configuration is missing" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // First, check if the profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is the error code for "no rows returned" - that's expected if the profile doesn't exist
      console.error("Error checking for existing profile:", fetchError)
      return NextResponse.json({ error: fetchError.message }, { status: 400 })
    }

    let result

    if (existingProfile) {
      // Profile exists, update it
      result = await supabase
        .from("profiles")
        .update({
          first_name,
          last_name,
          email,
          role,
          updated_at: new Date().toISOString(),
          interest,
          background,
        })
        .eq("id", id)
    } else {
      // Profile doesn't exist, insert it
      result = await supabase.from("profiles").insert({
        id,
        first_name,
        last_name,
        email,
        role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        interest,
        background,
      })
    }

    if (result.error) {
      console.error("Error updating/creating profile:", result.error)
      return NextResponse.json({ error: result.error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
