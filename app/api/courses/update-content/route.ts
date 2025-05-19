import { NextResponse } from "next/server";
import { updateCourseWithModulesAndLessons } from "../actions";

export async function POST(request: Request) {
  try {
    const { courseId, modules } = await request.json();
    if (!courseId || !Array.isArray(modules)) {
      return NextResponse.json({ error: "Missing courseId or modules array" }, { status: 400 });
    }
    const { data, error } = await updateCourseWithModulesAndLessons(courseId, modules);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
