import { NextResponse } from "next/server";
import { getResources } from "./actions"; // Assuming getResources is defined in actions.ts
export const runtime = "edge"

export async function GET() {
  try {
    const resources = await getResources(); // Fetch resources using the custom function
     // Log the fetched resources
    return NextResponse.json(resources);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
  }
}
