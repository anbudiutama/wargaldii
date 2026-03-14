import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/bmt — Get user's BMT history
export async function GET(request) {
  try { const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: applications } = await supabase.from('bmt_applications')
      .select('*, payments:bmt_payments(*)')
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false });

    const summary = {
      total: applications?.length || 0,
      active: applications?.filter(a => a.status === 'active').length || 0,
      completed: applications?.filter(a => a.status === 'completed').length || 0,
      totalAmount: applications?.reduce((s, a) => s + a.amount, 0) || 0,
    };

    return NextResponse.json({ applications, summary });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/bmt — Submit new financing application
export async function POST(request) {
  try { const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.action === 'apply') {
      const margin = body.type === 'produktif' ? 0.012 : 0.015;
      const total = body.amount * (1 + margin * body.tenor);
      const monthly = total / body.tenor;

      const { data, error } = await supabase.from('bmt_applications')
        .insert({
          applicant_id: user.id,
          amount: body.amount,
          tenor: body.tenor,
          type: body.type,
          purpose: body.purpose,
          ktp_url: body.ktp_url,
          monthly_payment: monthly,
          total_payment: total,
          margin_rate: margin,
        })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      await supabase.from('notifications').insert({
        user_id: user.id, title: 'Pengajuan BMT Terkirim',
        message: `Pengajuan pembiayaan ${body.type} Rp ${body.amount} Jt sedang direview.`,
        type: 'bmt'
      });

      return NextResponse.json({ application: data, message: 'Pengajuan pembiayaan berhasil!' });
    }

    if (body.action === 'pay') {
      // Record a payment
      const { data: app } = await supabase.from('bmt_applications').select('*').eq('id', body.application_id).single();
      if (!app) return NextResponse.json({ error: 'Pengajuan tidak ditemukan' }, { status: 404 });

      const newMonthsPaid = app.months_paid + 1;
      await supabase.from('bmt_payments').insert({
        application_id: body.application_id, amount: app.monthly_payment, month_number: newMonthsPaid
      });
      
      const updates = { months_paid: newMonthsPaid };
      if (newMonthsPaid >= app.tenor) updates.status = 'completed';
      await supabase.from('bmt_applications').update(updates).eq('id', body.application_id);

      return NextResponse.json({ message: `Cicilan bulan ke-${newMonthsPaid} berhasil!` });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
