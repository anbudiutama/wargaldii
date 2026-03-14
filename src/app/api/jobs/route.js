import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// GET /api/jobs — List jobs with filters
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const id = searchParams.get('id');

    if (id) {
      const { data } = await supabase.from('jobs')
        .select('*, company:profiles!company_id(full_name, city, phone)')
        .eq('id', id).single();
      return NextResponse.json({ job: data });
    }

    let query = supabase.from('jobs')
      .select('*, company:profiles!company_id(full_name, city)', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (type && type !== 'Semua') query = query.eq('type', type);
    if (city && city !== 'Semua') query = query.eq('city', city);
    if (search) query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ jobs: data, total: count });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/jobs — Create job (company) or apply (pencari kerja)
export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.action === 'create') {
      const { data, error } = await supabase.from('jobs')
        .insert({ company_id: user.id, title: body.title, description: body.description, requirements: body.requirements, city: body.city, type: body.type, salary: body.salary })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ job: data, message: 'Lowongan berhasil dibuat!' });
    }

    if (body.action === 'apply') {
      const { data, error } = await supabase.from('job_applications')
        .insert({ job_id: body.job_id, applicant_id: user.id, cover_letter: body.cover_letter, cv_url: body.cv_url })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      // Update applicant count
      await supabase.rpc('increment_applicants', { j_id: body.job_id });

      // Notify company
      const { data: job } = await supabase.from('jobs').select('company_id, title').eq('id', body.job_id).single();
      await supabase.from('notifications').insert({
        user_id: job.company_id, title: 'Lamaran Baru!',
        message: `Ada pelamar baru untuk posisi "${job.title}"`, type: 'job'
      });

      return NextResponse.json({ application: data, message: 'Lamaran berhasil dikirim!' });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
