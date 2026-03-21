-- ═══════════════════════════════════════════════════════════
-- WargaLDII.com — Chat & Storage Setup
-- Jalankan di Supabase SQL Editor SETELAH schema utama
-- ═══════════════════════════════════════════════════════════

-- ═══ CHAT MESSAGES ═══
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id BIGSERIAL PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chat_sender ON public.chat_messages(sender_id);
CREATE INDEX idx_chat_receiver ON public.chat_messages(receiver_id);
CREATE INDEX idx_chat_pair ON public.chat_messages(sender_id, receiver_id);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own chats" ON public.chat_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users send messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users mark read" ON public.chat_messages FOR UPDATE USING (auth.uid() = receiver_id);

-- ═══ STORAGE BUCKET ═══
-- Buat bucket untuk upload gambar produk, CV, KTP, dll
-- Jalankan ini di SQL Editor:
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: siapa saja bisa melihat file
CREATE POLICY "Public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
-- Policy: user yang login bisa upload
CREATE POLICY "Auth users upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
-- Policy: user hanya bisa hapus file sendiri (berdasarkan path yang dimulai dengan user id)
CREATE POLICY "Users delete own" ON storage.objects FOR DELETE USING (bucket_id = 'uploads' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enable realtime for chat
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ═══ BMT INSTITUTIONS ═══
CREATE TABLE IF NOT EXISTS public.bmt_institutions (
  id BIGSERIAL PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  description TEXT,
  margin_produktif NUMERIC DEFAULT 0.012,
  margin_konsumtif NUMERIC DEFAULT 0.015,
  max_amount NUMERIC DEFAULT 500,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.bmt_institutions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active BMT" ON public.bmt_institutions FOR SELECT USING (status = 'active');
CREATE POLICY "Owner manage BMT" ON public.bmt_institutions FOR ALL USING (auth.uid() = owner_id);

-- Add bmt_id to bmt_applications if not exists
ALTER TABLE public.bmt_applications ADD COLUMN IF NOT EXISTS bmt_id BIGINT REFERENCES public.bmt_institutions(id);

-- ═══ LOWONGAN KERJA: Tambah kolom company_name ═══
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS company_name TEXT;

-- ═══════════════════════════════════════════════════════════
-- MODUL ACARA: Kalender + Pendaftaran + Berita
-- ═══════════════════════════════════════════════════════════

-- Tabel Acara / Events
CREATE TABLE IF NOT EXISTS public.events (
  id BIGSERIAL PRIMARY KEY,
  organizer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'umum' CHECK (category IN ('pengajian','pelatihan','sosial','ekonomi','rapat','umum')),
  city TEXT,
  location TEXT,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  max_participants INT,
  is_free BOOLEAN DEFAULT true,
  fee NUMERIC DEFAULT 0,
  image_url TEXT,
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Organizer manage events" ON public.events FOR ALL USING (auth.uid() = organizer_id);

-- Tabel Pendaftaran Acara
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered','attended','cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id OR auth.uid() IN (SELECT organizer_id FROM public.events WHERE id = event_id));
CREATE POLICY "Users register" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Organizer manage" ON public.event_registrations FOR UPDATE USING (auth.uid() IN (SELECT organizer_id FROM public.events WHERE id = event_id));

-- Tabel Berita Pasca Acara
CREATE TABLE IF NOT EXISTS public.event_news (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  image_urls TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.event_news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view news" ON public.event_news FOR SELECT USING (true);
CREATE POLICY "Author manage news" ON public.event_news FOR ALL USING (auth.uid() = author_id);
