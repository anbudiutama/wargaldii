-- ═══════════════════════════════════════════════════════════
-- WargaLDII.com — Supabase RPC Functions
-- Run this AFTER supabase-schema.sql
-- ═══════════════════════════════════════════════════════════

-- Update product stock when order is placed
CREATE OR REPLACE FUNCTION public.update_product_stock(p_id BIGINT, qty INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products 
  SET stock = stock - qty, sold = sold + qty, updated_at = NOW()
  WHERE id = p_id AND stock >= qty;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment job applicant count
CREATE OR REPLACE FUNCTION public.increment_applicants(j_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.jobs SET applicant_count = applicant_count + 1 WHERE id = j_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update course rating when review is added
CREATE OR REPLACE FUNCTION public.update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products 
  SET rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM public.reviews WHERE product_id = NEW.product_id)
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_added
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating();

-- Update course student count on progress
CREATE OR REPLACE FUNCTION public.update_course_student_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.courses
  SET student_count = (
    SELECT COUNT(DISTINCT user_id) FROM public.course_progress WHERE course_id = NEW.course_id
  )
  WHERE id = NEW.course_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_progress_added
  AFTER INSERT ON public.course_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_course_student_count();

-- ═══ SEED DATA (Optional — untuk testing) ═══

-- Buat akun admin (ganti email sesuai email Anda)
-- Setelah register via UI, jalankan SQL ini untuk jadikan admin:
-- UPDATE public.profiles SET role = 'admin' WHERE email = 'admin@wargaldii.com';
