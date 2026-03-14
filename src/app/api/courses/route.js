import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET /api/courses — Ambil semua kursus
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // Single course with modules & quizzes
      const { data: course } = await supabase.from('courses')
        .select('*, instructor:profiles!instructor_id(full_name), course_modules(*), course_quizzes(*)')
        .eq('id', id).single();
      if (!course) return NextResponse.json({ error: 'Kursus tidak ditemukan' }, { status: 404 });

      // Get user progress if logged in
      const { data: { user } } = await supabase.auth.getUser();
      let progress = [];
      if (user) {
        const { data } = await supabase.from('course_progress')
          .select('*').eq('user_id', user.id).eq('course_id', id);
        progress = data || [];
      }
      return NextResponse.json({ course, progress });
    }

    // List all courses
    const { data, error } = await supabase.from('courses')
      .select('*, instructor:profiles!instructor_id(full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ courses: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/courses — Buat kursus baru (pengajar only)
export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.from('courses')
      .insert({ instructor_id: user.id, title: body.title, description: body.description, level: body.level, duration: body.duration, image_url: body.image_url })
      .select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Insert modules
    if (body.modules?.length) {
      await supabase.from('course_modules').insert(
        body.modules.map((m, i) => ({ course_id: data.id, title: m.title, content: m.content, type: m.type, duration: m.duration, video_url: m.video_url, sort_order: i }))
      );
    }
    // Insert quizzes
    if (body.quizzes?.length) {
      await supabase.from('course_quizzes').insert(
        body.quizzes.map((q, i) => ({ course_id: data.id, question: q.question, options: q.options, correct_answer: q.correct_answer, sort_order: i }))
      );
    }

    return NextResponse.json({ course: data, message: 'Kursus berhasil dibuat!' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
