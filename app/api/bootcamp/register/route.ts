export const runtime = 'edge';

import { NextResponse } from "next/server";
import { submitCampRegistration } from "@/app/bootcamp/register/actions";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await submitCampRegistration(data);
    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request or server error." },
      { status: 500 }
    );
  }
}
