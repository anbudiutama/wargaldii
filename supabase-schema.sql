-- ═══════════════════════════════════════════════════════════
-- WargaLDII.com — Complete Database Schema
-- Platform Ekonomi Jamaah LDII
-- Run this SQL in Supabase SQL Editor (supabase.com > project > SQL Editor)
-- ═══════════════════════════════════════════════════════════

-- ═══ 1. USERS & AUTH ═══
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'pembelajar' CHECK (role IN ('pembelajar','pengajar','pencari_kerja','produsen','seller','pembeli','usaha_bersama','investor','bmt','admin')),
  city TEXT,
  cabang_ldii TEXT,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role, city, cabang_ldii)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'pembelajar'),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'cabang_ldii', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══ 2. MARKETPLACE ═══
CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price BIGINT NOT NULL, -- in Rupiah
  stock INT NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  sold INT DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','pending')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.orders (
  id BIGSERIAL PRIMARY KEY,
  buyer_id UUID REFERENCES public.profiles(id) NOT NULL,
  total_amount BIGINT NOT NULL,
  shipping_name TEXT NOT NULL,
  shipping_phone TEXT NOT NULL,
  shipping_address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id BIGINT REFERENCES public.products(id) NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) NOT NULL,
  quantity INT NOT NULL,
  price BIGINT NOT NULL,
  subtotal BIGINT NOT NULL
);

CREATE TABLE public.reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products viewable by all" ON public.products FOR SELECT USING (true);
CREATE POLICY "Sellers manage own products" ON public.products FOR ALL USING (auth.uid() = seller_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id);
CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Create order items" ON public.order_items FOR INSERT WITH CHECK (true);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews viewable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══ 3. E-LEARNING ═══
CREATE TABLE public.courses (
  id BIGSERIAL PRIMARY KEY,
  instructor_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level TEXT DEFAULT 'pemula' CHECK (level IN ('pemula','menengah','lanjut','semua')),
  duration TEXT,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  student_count INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.course_modules (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT DEFAULT 'article' CHECK (type IN ('article','video','audio')),
  duration TEXT,
  video_url TEXT,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.course_quizzes (
  id BIGSERIAL PRIMARY KEY,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- ["Option A", "Option B", "Option C", "Option D"]
  correct_answer INT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE public.course_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  module_id BIGINT REFERENCES public.course_modules(id),
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, course_id, module_id)
);

CREATE TABLE public.quiz_results (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id BIGINT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  passed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.certificates (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_id BIGINT REFERENCES public.courses(id) NOT NULL,
  certificate_id TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Courses viewable" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Instructors manage courses" ON public.courses FOR ALL USING (auth.uid() = instructor_id);

ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Modules viewable" ON public.course_modules FOR SELECT USING (true);

ALTER TABLE public.course_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Quizzes viewable" ON public.course_quizzes FOR SELECT USING (true);

ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.course_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own results" ON public.quiz_results FOR ALL USING (auth.uid() = user_id);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Certificates viewable" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Users get own certificates" ON public.certificates FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ═══ 4. HIBAH BARKAS ═══
CREATE TABLE public.hibah_items (
  id BIGSERIAL PRIMARY KEY,
  donor_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  condition TEXT NOT NULL,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available','claimed','closed')),
  claimed_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.hibah_requests (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT REFERENCES public.hibah_items(id) ON DELETE CASCADE NOT NULL,
  requester_id UUID REFERENCES public.profiles(id) NOT NULL,
  reason TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(item_id, requester_id)
);

ALTER TABLE public.hibah_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hibah viewable" ON public.hibah_items FOR SELECT USING (true);
CREATE POLICY "Donors manage hibah" ON public.hibah_items FOR ALL USING (auth.uid() = donor_id);

ALTER TABLE public.hibah_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "View own requests" ON public.hibah_requests FOR SELECT USING (auth.uid() = requester_id);
CREATE POLICY "Create requests" ON public.hibah_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Donors view item requests" ON public.hibah_requests FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.hibah_items WHERE id = item_id AND donor_id = auth.uid())
);

-- ═══ 5. INVESTASI ═══
CREATE TABLE public.investment_companies (
  id BIGSERIAL PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) NOT NULL,
  name TEXT NOT NULL,
  sector TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_fund BIGINT NOT NULL, -- in Juta Rupiah
  raised_fund BIGINT DEFAULT 0,
  return_rate TEXT,
  period TEXT,
  akad TEXT NOT NULL,
  revenue TEXT,
  profit TEXT,
  growth TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  open_for_investment BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.investments (
  id BIGSERIAL PRIMARY KEY,
  investor_id UUID REFERENCES public.profiles(id) NOT NULL,
  company_id BIGINT REFERENCES public.investment_companies(id) NOT NULL,
  amount BIGINT NOT NULL, -- in Juta Rupiah
  return_rate DECIMAL(4,2),
  earned BIGINT DEFAULT 0,
  next_dividend_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('pending','active','completed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.investment_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Companies viewable" ON public.investment_companies FOR SELECT USING (true);
CREATE POLICY "Owners manage companies" ON public.investment_companies FOR ALL USING (auth.uid() = owner_id);

ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Investors view own" ON public.investments FOR SELECT USING (auth.uid() = investor_id);
CREATE POLICY "Investors create" ON public.investments FOR INSERT WITH CHECK (auth.uid() = investor_id);
CREATE POLICY "Company owners view" ON public.investments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.investment_companies WHERE id = company_id AND owner_id = auth.uid())
);

-- ═══ 6. LOWONGAN KERJA ═══
CREATE TABLE public.jobs (
  id BIGSERIAL PRIMARY KEY,
  company_id UUID REFERENCES public.profiles(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT[],
  city TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('Full-time','Part-time','Freelance','Internship')),
  salary TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','closed','draft')),
  applicant_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.job_applications (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  applicant_id UUID REFERENCES public.profiles(id) NOT NULL,
  cover_letter TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','reviewed','interview','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id)
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Jobs viewable" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Companies manage jobs" ON public.jobs FOR ALL USING (auth.uid() = company_id);

ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Applicants view own" ON public.job_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Applicants create" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);
CREATE POLICY "Companies view applications" ON public.job_applications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.jobs WHERE id = job_id AND company_id = auth.uid())
);

-- ═══ 7. BMT SYARIAH ═══
CREATE TABLE public.bmt_applications (
  id BIGSERIAL PRIMARY KEY,
  applicant_id UUID REFERENCES public.profiles(id) NOT NULL,
  amount BIGINT NOT NULL, -- in Juta Rupiah
  tenor INT NOT NULL, -- months
  type TEXT NOT NULL CHECK (type IN ('produktif','konsumtif')),
  purpose TEXT,
  ktp_url TEXT,
  monthly_payment DECIMAL(10,2),
  total_payment DECIMAL(10,2),
  margin_rate DECIMAL(4,3),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','active','completed')),
  months_paid INT DEFAULT 0,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bmt_payments (
  id BIGSERIAL PRIMARY KEY,
  application_id BIGINT REFERENCES public.bmt_applications(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  month_number INT NOT NULL,
  paid_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bmt_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own BMT" ON public.bmt_applications FOR SELECT USING (auth.uid() = applicant_id);
CREATE POLICY "Users create BMT" ON public.bmt_applications FOR INSERT WITH CHECK (auth.uid() = applicant_id);

ALTER TABLE public.bmt_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own payments" ON public.bmt_payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.bmt_applications WHERE id = application_id AND applicant_id = auth.uid())
);

-- ═══ 8. NOTIFICATIONS ═══
CREATE TABLE public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own notifs" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- ═══ 9. ADMIN POLICIES ═══
-- Allow admin to view & manage everything
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Admin can view all data
CREATE POLICY "Admin view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin manage all products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all jobs" ON public.jobs FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all bmt" ON public.bmt_applications FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all hibah" ON public.hibah_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all investments" ON public.investment_companies FOR ALL USING (public.is_admin());
CREATE POLICY "Admin manage all notifications" ON public.notifications FOR ALL USING (public.is_admin());

-- ═══ 10. INDEXES for Performance ═══
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_seller ON public.products(seller_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_courses_instructor ON public.courses(instructor_id);
CREATE INDEX idx_progress_user ON public.course_progress(user_id);
CREATE INDEX idx_hibah_status ON public.hibah_items(status);
CREATE INDEX idx_jobs_city ON public.jobs(city);
CREATE INDEX idx_jobs_type ON public.jobs(type);
CREATE INDEX idx_bmt_applicant ON public.bmt_applications(applicant_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id, read);

-- ═══ DONE! ═══
-- Total: 17 tables, covering all 6 modules + auth + notifications + admin
