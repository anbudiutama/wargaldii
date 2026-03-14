import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// POST /api/quiz — Submit quiz answers & generate certificate if passed
export async function POST(request) {
  try { const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { course_id, answers } = await request.json(); // answers: { questionIndex: selectedOption }

    // Get quizzes
    const { data: quizzes } = await supabase.from('course_quizzes')
      .select('*').eq('course_id', course_id).order('sort_order');
    if (!quizzes?.length) return NextResponse.json({ error: 'Quiz tidak ditemukan' }, { status: 404 });

    // Calculate score
    let correct = 0;
    quizzes.forEach((q, i) => { if (answers[i] === q.correct_answer) correct++; });
    const passed = correct >= Math.ceil(quizzes.length * 0.7);

    // Save result
    const { data: result } = await supabase.from('quiz_results')
      .insert({ user_id: user.id, course_id, score: correct, total: quizzes.length, passed })
      .select().single();

    let certificate = null;
    if (passed) {
      // Generate certificate
      const certId = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const { data: cert } = await supabase.from('certificates')
        .insert({ user_id: user.id, course_id, certificate_id: certId })
        .select().single();
      certificate = cert;

      // Notification
      const { data: course } = await supabase.from('courses').select('title').eq('id', course_id).single();
      await supabase.from('notifications').insert({
        user_id: user.id, title: 'Sertifikat Baru!',
        message: `Selamat! Anda mendapat sertifikat untuk kursus "${course.title}"`,
        type: 'certificate'
      });
    }

    return NextResponse.json({ score: correct, total: quizzes.length, passed, certificate });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
