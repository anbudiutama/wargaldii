import { createClient } from '@supabase/supabase-js';

let _supabase = null;

// Lazy init — hanya buat client saat dipanggil, TIDAK crash jika env var kosong
export function getSupabase() {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.warn('Supabase env vars not set — running without database');
      return null;
    }
    _supabase = createClient(url, key);
  }
  return _supabase;
}
