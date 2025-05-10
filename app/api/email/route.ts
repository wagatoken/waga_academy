import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/services/emailservice";

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    // Call the sendEmail function
    const response = await sendEmail({ to, subject, html });

    return NextResponse.json({ success: true, response });
  } catch (error) {
    console.error("Error in email API:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}