import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/hibah — Ambil semua barang hibah
export async function GET(request) {
  try { const supabase = getSupabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'available';
    const my = searchParams.get('my'); // 'donated' or 'requested'

    const { data: { user } } = await supabase.auth.getUser();

    if (my === 'donated' && user) {
      const { data } = await supabase.from('hibah_items').select('*, requests:hibah_requests(*, requester:profiles!requester_id(full_name, city))').eq('donor_id', user.id).order('created_at', { ascending: false });
      return NextResponse.json({ items: data });
    }
    if (my === 'requested' && user) {
      const { data } = await supabase.from('hibah_requests').select('*, item:hibah_items(*)').eq('requester_id', user.id).order('created_at', { ascending: false });
      return NextResponse.json({ requests: data });
    }

    let query = supabase.from('hibah_items').select('*, donor:profiles!donor_id(full_name, city)', { count: 'exact' }).order('created_at', { ascending: false });
    if (status !== 'all') query = query.eq('status', status);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ items: data, total: count });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/hibah — Beri hibah (upload barang) ATAU ajukan (request barang)
export async function POST(request) {
  try { const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();

    if (body.action === 'donate') {
      // Donor uploads item
      const { data, error } = await supabase.from('hibah_items')
        .insert({ donor_id: user.id, name: body.name, description: body.description, condition: body.condition, category: body.category, city: body.city, image_url: body.image_url })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ item: data, message: 'Barang hibah berhasil diupload!' });

    } else if (body.action === 'request') {
      // Requester requests item
      const { data, error } = await supabase.from('hibah_requests')
        .insert({ item_id: body.item_id, requester_id: user.id, reason: body.reason, address: body.address })
        .select().single();
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });

      // Notify donor
      const { data: item } = await supabase.from('hibah_items').select('donor_id, name').eq('id', body.item_id).single();
      await supabase.from('notifications').insert({
        user_id: item.donor_id, title: 'Pengajuan Hibah Baru',
        message: `Ada yang mengajukan hibah untuk "${item.name}"`, type: 'hibah'
      });

      return NextResponse.json({ request: data, message: 'Pengajuan hibah berhasil!' });

    } else if (body.action === 'approve') {
      // Donor approves a request
      await supabase.from('hibah_requests').update({ status: 'approved' }).eq('id', body.request_id);
      await supabase.from('hibah_requests').update({ status: 'rejected' }).eq('item_id', body.item_id).neq('id', body.request_id);
      await supabase.from('hibah_items').update({ status: 'claimed', claimed_by: body.requester_id }).eq('id', body.item_id);

      await supabase.from('notifications').insert({
        user_id: body.requester_id, title: 'Hibah Disetujui!',
        message: 'Pengajuan hibah Anda telah disetujui! Hubungi pemberi hibah.', type: 'hibah'
      });

      return NextResponse.json({ message: 'Hibah disetujui!' });
    }

    return NextResponse.json({ error: 'Action tidak valid' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
