import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

async function checkAdmin() {
  const supabase = getSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  return profile?.role === 'admin' ? user : null;
}

// GET /api/admin/stats — Dashboard statistics
export async function GET(request) {
  try { const supabase = getSupabase(); if(!supabase) return NextResponse.json({error:'Database not configured'},{status:503});
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section') || 'overview';

    if (section === 'overview') {
      const [users, products, orders, courses, hibah, jobs, bmt, investments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('hibah_items').select('*', { count: 'exact', head: true }),
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('bmt_applications').select('*', { count: 'exact', head: true }),
        supabase.from('investments').select('*', { count: 'exact', head: true }),
      ]);

      // Revenue
      const { data: orderTotals } = await supabase.from('orders').select('total_amount').eq('status', 'delivered');
      const totalRevenue = orderTotals?.reduce((s, o) => s + o.total_amount, 0) || 0;

      // Recent users
      const { data: recentUsers } = await supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(10);

      // Pending BMT
      const { data: pendingBmt } = await supabase.from('bmt_applications').select('*').eq('status', 'pending');

      return NextResponse.json({
        stats: {
          totalUsers: users.count,
          totalProducts: products.count,
          totalOrders: orders.count,
          totalCourses: courses.count,
          totalHibah: hibah.count,
          totalJobs: jobs.count,
          totalBmt: bmt.count,
          totalInvestments: investments.count,
          totalRevenue,
        },
        recentUsers,
        pendingBmt,
      });
    }

    if (section === 'users') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = 20;
      const offset = (page - 1) * limit;
      const { data, count } = await supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(offset, offset + limit - 1);
      return NextResponse.json({ users: data, total: count, page });
    }

    if (section === 'orders') {
      const { data } = await supabase.from('orders').select('*, buyer:profiles!buyer_id(full_name), order_items(*, product:products(name))').order('created_at', { ascending: false }).limit(50);
      return NextResponse.json({ orders: data });
    }

    return NextResponse.json({ error: 'Section tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/admin/stats — Admin actions (approve, reject, update status)
export async function POST(request) {
  try { const supabase = getSupabase(); if(!supabase) return NextResponse.json({error:'Database not configured'},{status:503});
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: 'Admin access required' }, { status: 403 });

    const { action, table, id, updates } = await request.json();

    if (action === 'update_status') {
      const { error } = await supabase.from(table).update(updates).eq('id', id);
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ message: 'Status berhasil diupdate!' });
    }

    if (action === 'approve_bmt') {
      await supabase.from('bmt_applications').update({ status: 'active', approved_at: new Date().toISOString() }).eq('id', id);
      const { data: app } = await supabase.from('bmt_applications').select('applicant_id, amount, type').eq('id', id).single();
      await supabase.from('notifications').insert({
        user_id: app.applicant_id, title: 'Pembiayaan Disetujui!',
        message: `Pembiayaan ${app.type} Rp ${app.amount} Jt Anda telah disetujui BMT.`, type: 'bmt'
      });
      return NextResponse.json({ message: 'Pembiayaan disetujui!' });
    }

    if (action === 'delete') {
      await supabase.from(table).delete().eq('id', id);
      return NextResponse.json({ message: 'Data berhasil dihapus!' });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
