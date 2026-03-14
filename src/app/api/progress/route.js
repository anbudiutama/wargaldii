import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// POST /api/progress — Tandai modul selesai
export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { course_id, module_id } = await request.json();
    const { data, error } = await supabase.from('course_progress')
      .upsert({ user_id: user.id, course_id, module_id, completed: true, completed_at: new Date().toISOString() }, { onConflict: 'user_id,course_id,module_id' })
      .select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ progress: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
