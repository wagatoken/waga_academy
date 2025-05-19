import { NextRequest, NextResponse } from "next/server"
import { createServerClientInstance } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const courseId = formData.get("courseId") as string
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 })
    }

    // Prepare update fields
    const updateFields: Record<string, any> = {}
    formData.forEach((value, key) => {
      if (key !== "courseId") {
        updateFields[key] = value
      }
    })

    const supabase = await createServerClientInstance()
    const { data, error } = await supabase
      .from("courses")
      .update(updateFields)
      .eq("id", courseId)
      .select()
      .single()

    console.log(error);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 })
  }
}
