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
      .or(
        user_id
          ? `email.eq.${email},user_id.eq.${user_id}`
          : `email.eq.${email}`
      );

    const { count, error: dupError } = await duplicateQuery;
    if (dupError) {
      return NextResponse.json({ error: true, message: dupError.message }, { status: 500 });
    }
    if (count && count > 0) {
      return NextResponse.json({ error: true, message: 'You have already joined the waitlist for this course.' }, { status: 200 });
    }

    // Insert new waitlist entry
    const { error } = await supabase.from('course_waitlist').insert([
      { name, email, course_id, message, user_id }
    ]);

    if (error) {
      // Handle unique constraint violation (for both email and user_id)
      if (error.code === '23505' || error.message.toLowerCase().includes('duplicate')) {
        return NextResponse.json({ error: true, message: 'You have already joined the waitlist for this course.' }, { status: 200 });
      }
      return NextResponse.json({ error: true, message: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: false, message: 'Successfully joined the waitlist!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
