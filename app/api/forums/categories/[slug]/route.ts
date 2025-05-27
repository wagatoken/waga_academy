import { NextResponse } from "next/server";
import { getTopicsByCategory } from "../../actions";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;
  const { data, error } = await getTopicsByCategory(slug);
  return NextResponse.json({ data, error });
}
