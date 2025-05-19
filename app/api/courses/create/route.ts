import { NextResponse } from "next/server";
import { createCourse } from "../actions";
export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const { data, error } = await createCourse(formData);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
