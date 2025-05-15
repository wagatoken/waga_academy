import { NextResponse } from "next/server";
import { getResourceById, toggleLike } from "../actions";
export const runtime = "edge"

export async function GET(request: Request, context: { params: { id: string } }) {
  const params = await context.params; // Await the resolution of `params`
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
  }

  const { data, error } = await getResourceById(id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}
