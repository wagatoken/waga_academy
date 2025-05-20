export const runtime = 'edge';
import { NextRequest, NextResponse } from "next/server";
import { getForumRepliesForTopic, createForumReply } from "@/app/api/forums/actions";

// GET /api/forums/[id] - Get all replies for a topic (flat, for nesting on frontend)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const topicId = await params.id;
  if (!topicId) {
    return NextResponse.json({ error: "Missing topic id" }, { status: 400 });
  }
  const { data, error } = await getForumRepliesForTopic(topicId);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ data });
}

// POST /api/forums/[id] - Create a reply (top-level or nested)
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const topicId = await params.id;
  const formData = await req.formData();
  // Ensure topic_id is set in formData
  if (!formData.get("topic_id")) {
    formData.set("topic_id", topicId);
  }
  const { data, error } = await createForumReply(formData);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  return NextResponse.json({ data });
}

// (Optional) DELETE, PATCH, etc. can be added for moderation or editing replies
