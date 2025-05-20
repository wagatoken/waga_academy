export const runtime = 'edge';
import { NextResponse } from "next/server";
import { updateCourseRequirements } from "../actions";

export async function POST(request: Request) {
  try {
    const { courseId, prerequisites, target_audience, learning_objectives } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }
    const { data, error } = await updateCourseRequirements(courseId, {
      prerequisites,
      target_audience,
      learning_objectives,
    });
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
