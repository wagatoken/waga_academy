export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { createServerClientInstance } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, course_id, message } = body;
    if (!name || !email || !course_id) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerClientInstance();
    const { error } = await supabase.from('course_waitlist').insert([
      { name, email, course_id, message }
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
