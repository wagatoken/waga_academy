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
    // Get user session (if signed in)
    const { data: { session } } = await supabase.auth.getSession();
    const user_id = session?.user?.id ?? null;

    // Check for duplicate email or user_id for this course
    let duplicateQuery = supabase
      .from('course_waitlist')
      .select('id', { count: 'exact', head: true })
      .eq('course_id', course_id)
      .or(`email.eq.${email}${user_id ? `,user_id.eq.${user_id}` : ''}`);

    const { count } = await duplicateQuery;
    if (count && count > 0) {
      return NextResponse.json({ error: 'You have already joined the waitlist for this course.' }, { status: 400 });
    }

    // Insert new waitlist entry
    const { error } = await supabase.from('course_waitlist').insert([
      { name, email, course_id, message, user_id }
    ]);

    if (error) {
      // Handle unique constraint violation
      if (error.code === '23505' || error.message.includes('duplicate key')) {
        return NextResponse.json({ error: 'You have already joined the waitlist for this course.' }, { status: 400 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
