import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET /api/orders — Ambil pesanan user
export async function GET(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, product:products(name, image_url))')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ orders: data });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/orders — Buat pesanan baru (checkout)
export async function POST(request) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items, shipping_name, shipping_phone, shipping_address } = await request.json();
    if (!items?.length) return NextResponse.json({ error: 'Keranjang kosong' }, { status: 400 });

    // Calculate total & validate stock
    let total = 0;
    for (const item of items) {
      const { data: product } = await supabase.from('products').select('*').eq('id', item.product_id).single();
      if (!product) return NextResponse.json({ error: `Produk ${item.product_id} tidak ditemukan` }, { status: 404 });
      if (product.stock < item.quantity) return NextResponse.json({ error: `Stok ${product.name} tidak cukup` }, { status: 400 });
      item.price = product.price;
      item.subtotal = product.price * item.quantity;
      item.seller_id = product.seller_id;
      total += item.subtotal;
    }

    // Create order
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .insert({ buyer_id: user.id, total_amount: total, shipping_name, shipping_phone, shipping_address })
      .select()
      .single();
    if (orderErr) return NextResponse.json({ error: orderErr.message }, { status: 500 });

    // Create order items & reduce stock
    for (const item of items) {
      await supabase.from('order_items').insert({
        order_id: order.id, product_id: item.product_id, seller_id: item.seller_id,
        quantity: item.quantity, price: item.price, subtotal: item.subtotal
      });
      // Reduce stock & increase sold count
      await supabase.rpc('update_product_stock', { p_id: item.product_id, qty: item.quantity });
    }

    // Create notification for buyer
    await supabase.from('notifications').insert({
      user_id: user.id,
      title: 'Pesanan Berhasil!',
      message: `Pesanan #${order.id} senilai Rp ${total.toLocaleString('id-ID')} berhasil dibuat.`,
      type: 'order',
      link: `/orders/${order.id}`
    });

    return NextResponse.json({ order, message: 'Pesanan berhasil dibuat!' });
  } catch (err) {
    return NextResponse.json({ error: 'Server error: ' + err.message }, { status: 500 });
  }
}
