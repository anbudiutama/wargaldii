import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST /api/progress — Tandai modul selesai
export async function POST(request) {
  try { const supabase = getSupabase(); if(!supabase) return NextResponse.json({error:'Database not configured'},{status:503});
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
