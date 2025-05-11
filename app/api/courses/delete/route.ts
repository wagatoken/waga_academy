import { NextRequest, NextResponse } from "next/server";
import { createServerClientInstance } from "@/lib/supabase/server";

async function deleteCourseById(id: string) {
  const supabase = await createServerClientInstance();

  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) {
    console.error(`Error deleting course with ID ${id}:`, error);
    throw new Error(error.message);
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ message: "Invalid course ID" }, { status: 400 });
  }

  try {
    await deleteCourseById(id);
    return NextResponse.json({ message: "Course deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json({ message: "Failed to delete course" }, { status: 500 });
  }
}
