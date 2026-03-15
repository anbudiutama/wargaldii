import { getSupabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

// GET /api/products — Ambil semua produk (dengan filter)
export async function GET(request) {
  try { const supabase = getSupabase(); if(!supabase) return NextResponse.json({error:'Database not configured'},{status:503});
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const seller_id = searchParams.get('seller_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('products')
      .select('*, seller:profiles!seller_id(full_name, city, phone)', { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'Semua') query = query.eq('category', category);
    if (search) query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    if (seller_id) query = query.eq('seller_id', seller_id);

    const { data, count, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ products: data, total: count, page, limit });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/products — Tambah produk baru (seller only)
export async function POST(request) {
  try { const supabase = getSupabase(); if(!supabase) return NextResponse.json({error:'Database not configured'},{status:503});
    const body = await request.json();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('products')
      .insert({
        seller_id: user.id,
        name: body.name,
        description: body.description,
        price: body.price,
        stock: body.stock,
        category: body.category,
        image_url: body.image_url,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ product: data, message: 'Produk berhasil ditambahkan!' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
