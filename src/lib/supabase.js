import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Client-side Supabase (untuk dipakai di component React)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper: get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile ? { ...user, profile } : user;
}

// Helper: check if admin
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.profile?.role === 'admin';
}

// Helper: send WhatsApp via Fonnte (optional)
export async function sendWhatsApp(phone, message) {
  const apiKey = process.env.FONNTE_API_KEY;
  if (!apiKey) return console.log('WA would send to', phone, ':', message);
  
  try {
    const res = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: { 'Authorization': apiKey },
      body: new URLSearchParams({ target: phone, message, countryCode: '62' }),
    });
    return await res.json();
  } catch (err) {
    console.error('WhatsApp send failed:', err);
  }
}
