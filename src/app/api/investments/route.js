import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// GET /api/investments — List companies or user portfolio
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const portfolio = searchParams.get('portfolio');
    const company_id = searchParams.get('id');
    const { data: { user } } = await supabase.auth.getUser();

    if (portfolio === 'true' && user) {
      const { data } = await supabase.from('investments')
        .select('*, company:investment_companies(name, sector, city, rating)')
        .eq('investor_id', user.id)
        .order('created_at', { ascending: false });

      const totalInvested = data?.reduce((a, i) => a + i.amount, 0) || 0;
      const totalEarned = data?.reduce((a, i) => a + i.earned, 0) || 0;
      return NextResponse.json({ investments: data, totalInvested, totalEarned });
    }

    if (company_id) {
      const { data } = await supabase.from('investment_companies')
        .select('*, owner:profiles!owner_id(full_name)')
        .eq('id', company_id).single();
      return NextResponse.json({ company: data });
    }

    const { data, error } = await supabase.from('investment_companies')
      .select('*, owner:profiles!owner_id(full_name)')
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ companies: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/investments — Ajukan investasi
export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { company_id, amount } = await request.json();

    // Get company
    const { data: company } = await supabase.from('investment_companies').select('*').eq('id', company_id).single();
    if (!company) return NextResponse.json({ error: 'Perusahaan tidak ditemukan' }, { status: 404 });
    if (!company.open_for_investment) return NextResponse.json({ error: 'Pendanaan sudah ditutup' }, { status: 400 });

    const { data, error } = await supabase.from('investments')
      .insert({ investor_id: user.id, company_id, amount, status: 'pending' })
      .select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    // Update raised fund
    await supabase.from('investment_companies')
      .update({ raised_fund: company.raised_fund + amount })
      .eq('id', company_id);

    // Notify company owner
    await supabase.from('notifications').insert({
      user_id: company.owner_id, title: 'Investasi Baru!',
      message: `Investasi Rp ${amount} Jt masuk untuk ${company.name}`, type: 'investment'
    });

    return NextResponse.json({ investment: data, message: 'Investasi berhasil diajukan!' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
