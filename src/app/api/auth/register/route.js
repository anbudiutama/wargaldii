import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// POST /api/auth/register — Daftar akun baru
export async function POST(request) {
  try {
    const { email, password, full_name, phone, role, city, cabang_ldii } = await request.json();

    // Validate
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'Email, password, dan nama lengkap wajib diisi' }, { status: 400 });
    }

    // Register with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name, phone, role: role || 'pembelajar', city, cabang_ldii }
      }
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({
      message: 'Registrasi berhasil! Cek email untuk verifikasi.',
      user: data.user
    });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
