import { NextResponse } from "next/server";
import { toggleLike, getResourceById } from "../../actions";

export async function POST(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params; // Await the params before destructuring

  if (!id) {
    return NextResponse.json({ error: "Resource ID is required" }, { status: 400 });
  }

  const { data: toggleData, error: toggleError } = await toggleLike(id);

  if (toggleError) {
    return NextResponse.json({ error: toggleError }, { status: 500 });
  }

  if (!toggleData) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }

  const { data: resourceData, error: resourceError } = await getResourceById(id);

  if (resourceError) {
    return NextResponse.json({ error: resourceError }, { status: 500 });
  }

  return NextResponse.json({
    isLiked: toggleData.isLiked,
    likeCount: resourceData.likes, // Return the updated like count from the resource table
  });
}
