import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST /api/auth/login
export async function POST(request) {
  try { const supabase = getSupabase();
    const { email, password } = await request.json();

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return NextResponse.json({
      message: 'Login berhasil!',
      user: data.user,
      profile,
      session: data.session
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
