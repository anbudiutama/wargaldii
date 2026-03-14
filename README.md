# 🕌 WargaLDII.com — Full-Stack Platform

Platform Ekonomi Jamaah LDII. Backend menggunakan **Next.js 14 + Supabase**.

---

## 📁 Struktur Project

```
wargaldii-fullstack/
├── supabase-schema.sql          ← Jalankan pertama di Supabase SQL Editor
├── supabase-functions.sql       ← Jalankan kedua (RPC functions & triggers)
├── .env.local.example           ← Copy jadi .env.local, isi API keys
├── package.json
├── next.config.js
├── src/
│   ├── middleware.js             ← Auth middleware
│   ├── lib/
│   │   └── supabase.js          ← Supabase client & helpers
│   └── app/
│       ├── layout.jsx           ← Root layout
│       ├── page.jsx             ← Main page + AuthProvider + API helpers
│       └── api/
│           ├── auth/
│           │   ├── register/route.js   ← POST: Daftar akun
│           │   └── login/route.js      ← POST: Login
│           ├── products/route.js       ← GET: List produk, POST: Upload produk
│           ├── orders/route.js         ← GET: Riwayat order, POST: Checkout
│           ├── courses/route.js        ← GET: List kursus, POST: Buat kursus
│           ├── progress/route.js       ← POST: Tandai materi selesai
│           ├── quiz/route.js           ← POST: Submit quiz + sertifikat
│           ├── hibah/route.js          ← GET/POST: Hibah barkas
│           ├── investments/route.js    ← GET/POST: Investasi + portfolio
│           ├── jobs/route.js           ← GET/POST: Lowongan + lamaran
│           ├── bmt/route.js            ← GET/POST: BMT + riwayat cicilan
│           └── admin/
│               └── stats/route.js      ← GET/POST: Admin dashboard
```

---

## 🚀 Cara Setup (Step-by-Step)

### Langkah 1: Buat Akun Supabase (Gratis)

1. Buka **https://supabase.com** dan klik **Start your project**
2. Login dengan GitHub
3. Klik **New Project**
4. Isi:
   - **Name**: `wargaldii`
   - **Database Password**: buat password (SIMPAN BAIK-BAIK)
   - **Region**: Southeast Asia (Singapore)
5. Klik **Create new project** dan tunggu ~2 menit

### Langkah 2: Buat Database Tables

1. Di dashboard Supabase, klik **SQL Editor** di menu kiri
2. Klik **New query**
3. Buka file `supabase-schema.sql`, copy SEMUA isinya
4. Paste di SQL Editor dan klik **Run**
5. Pastikan muncul **Success** di bawah
6. Ulangi untuk file `supabase-functions.sql`

### Langkah 3: Ambil API Keys

1. Di Supabase, klik **Settings** (icon gear) > **API**
2. Catat dua nilai ini:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (string panjang)

### Langkah 4: Setup Project di Komputer

```bash
# 1. Ekstrak file zip
# 2. Buka folder di terminal / command prompt
cd wargaldii-fullstack

# 3. Copy env file
cp .env.local.example .env.local

# 4. Edit .env.local — isi dengan API keys dari Langkah 3
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# 5. Install dependencies
npm install

# 6. Jalankan development server
npm run dev
```

7. Buka **http://localhost:3000** di browser

### Langkah 5: Buat Akun Admin

1. Register akun baru via website (atau Supabase Auth dashboard)
2. Buka Supabase > **SQL Editor**, jalankan:
```sql
UPDATE public.profiles SET role = 'admin' WHERE email = 'emailanda@gmail.com';
```

### Langkah 6: Deploy ke Vercel

1. Upload project ke **GitHub** (buat repository baru)
2. Buka **https://vercel.com** > login dengan GitHub
3. Import project `wargaldii-fullstack`
4. Di **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = (isi URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (isi key)
5. Klik **Deploy**

### Langkah 7: Hubungkan Domain

Sama seperti panduan deploy sebelumnya:
- Vercel > Settings > Domains > tambahkan `wargaldii.com`
- Hostinger DNS > A record: `76.76.21.21`, CNAME www: `cname.vercel-dns.com`

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{email, password, full_name, phone, role, city, cabang_ldii}` | `{user, message}` |
| POST | `/api/auth/login` | `{email, password}` | `{user, profile, session}` |

### Marketplace
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/products` | `?category=&search=&limit=&page=` | `{products, total}` |
| POST | `/api/products` | `{name, description, price, stock, category, image_url}` | `{product}` |
| GET | `/api/orders` | — | `{orders}` |
| POST | `/api/orders` | `{items, shipping_name, shipping_phone, shipping_address}` | `{order}` |

### E-Learning
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/courses` | `?id=` (optional) | `{courses}` or `{course, progress}` |
| POST | `/api/courses` | `{title, description, level, modules[], quizzes[]}` | `{course}` |
| POST | `/api/progress` | `{course_id, module_id}` | `{progress}` |
| POST | `/api/quiz` | `{course_id, answers}` | `{score, total, passed, certificate}` |

### Hibah Barkas
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/hibah` | `?status=&my=donated/requested` | `{items}` |
| POST | `/api/hibah` | `{action: 'donate/request/approve', ...data}` | `{item/request}` |

### Investasi
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/investments` | `?portfolio=true&id=` | `{companies}` or `{investments}` |
| POST | `/api/investments` | `{company_id, amount}` | `{investment}` |

### Lowongan Kerja
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/jobs` | `?type=&city=&search=&id=` | `{jobs}` |
| POST | `/api/jobs` | `{action: 'create/apply', ...data}` | `{job/application}` |

### BMT Syariah
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/bmt` | — | `{applications, summary}` |
| POST | `/api/bmt` | `{action: 'apply/pay', ...data}` | `{application}` |

### Admin
| Method | Endpoint | Params/Body | Response |
|--------|----------|-------------|----------|
| GET | `/api/admin/stats` | `?section=overview/users/orders` | `{stats, recentUsers}` |
| POST | `/api/admin/stats` | `{action: 'update_status/approve_bmt/delete', ...}` | `{message}` |

---

## 💰 Biaya

| Item | Biaya |
|------|-------|
| Supabase (Free tier) | **Gratis** — 500MB database, 1GB storage, 50K auth users |
| Vercel (Free tier) | **Gratis** — 100GB bandwidth/bulan |
| Domain wargaldii.com | Rp 100-150rb/tahun |
| **TOTAL** | **Rp 100-150rb/tahun** |

---

## 📊 Database: 17 Tabel

1. `profiles` — Data pengguna (11 role)
2. `products` — Produk marketplace
3. `orders` — Pesanan
4. `order_items` — Item dalam pesanan
5. `reviews` — Rating & review produk
6. `courses` — Kursus e-learning
7. `course_modules` — Materi per kursus
8. `course_quizzes` — Soal quiz
9. `course_progress` — Progress belajar per user
10. `quiz_results` — Hasil quiz
11. `certificates` — Sertifikat digital
12. `hibah_items` — Barang hibah
13. `hibah_requests` — Pengajuan hibah
14. `investment_companies` — Perusahaan investasi
15. `investments` — Data investasi per investor
16. `jobs` — Lowongan kerja
17. `job_applications` — Lamaran kerja
18. `bmt_applications` — Pengajuan pembiayaan BMT
19. `bmt_payments` — Riwayat cicilan BMT
20. `notifications` — Notifikasi pengguna
