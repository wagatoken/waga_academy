export const runtime = 'edge';
import { NextResponse } from "next/server";
import { updateCourseSettings } from "../actions";

export async function POST(request: Request) {
  try {
    const { courseId, status, visibility, certificate, additional_resources } = await request.json();
    if (!courseId) {
      return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
    }
    const { data, error } = await updateCourseSettings(courseId, {
      status,
      visibility,
      certificate,
      additional_resources,
    });
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
