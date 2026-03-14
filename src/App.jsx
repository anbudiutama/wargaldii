import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";

const C = { crimson:"#C41E3A", gold:"#D4A017", dark:"#0F0F1A", emerald:"#1B6B3A", royal:"#2E5090", plum:"#6B3A7D", copper:"#C75B39", cream:"#FAF8F3", warmGray:"#F3F0EB" };

// ═══ MODULE META ═══
const MODULES = [
  { id:"marketplace", title:"Marketplace", icon:"🛒", color:C.gold },
  { id:"elearning", title:"E-Learning", icon:"📚", color:C.crimson },
  { id:"hibah", title:"Hibah Barkas", icon:"🎁", color:C.copper },
  { id:"investasi", title:"Investasi", icon:"📈", color:C.royal },
  { id:"loker", title:"Lowongan Kerja", icon:"💼", color:C.emerald },
  { id:"bmt", title:"BMT Syariah", icon:"🏦", color:C.plum },
];

// ═══ MARKETPLACE DATA ═══
const CATEGORIES = ["Semua","Makanan","Elektronik","Fashion","Kesehatan","Pertanian","Jasa","Furniture"];
const PRODUCTS = [
  { id:1, name:"Madu Hutan Asli 500ml", price:125000, cat:"Makanan", seller:"Toko Amanah Jaya", city:"Jakarta", rating:4.8, sold:342, stock:50, img:"🍯", desc:"Madu hutan asli tanpa campuran, dipanen langsung dari hutan Kalimantan. Kaya antioksidan dan nutrisi alami.", reviews:[{user:"Siti A.",r:5,text:"Madu asli, kental dan manis alami"},{user:"Budi K.",r:4,text:"Pengiriman cepat, kualitas baik"},{user:"Rina M.",r:5,text:"Langganan beli di sini, recommended!"}] },
  { id:2, name:"Laptop Refurbished ThinkPad X250", price:3500000, cat:"Elektronik", seller:"PT Hidayah Tech", city:"Jakarta", rating:4.5, sold:28, stock:5, img:"💻", desc:"Laptop refurbished berkualitas, Core i5 Gen5, RAM 8GB, SSD 256GB. Garansi 6 bulan dari toko.", reviews:[{user:"Ahmad F.",r:5,text:"Kondisi 90%, sangat worth it"},{user:"Doni P.",r:4,text:"Baterai masih awet, mantap"}] },
  { id:3, name:"Gamis Syar'i Premium Wolfis", price:285000, cat:"Fashion", seller:"Toko Hikmah Online", city:"Bandung", rating:4.9, sold:1205, stock:200, img:"👗", desc:"Gamis syar'i bahan wolfis premium, adem dan tidak menerawang. Tersedia berbagai warna.", reviews:[{user:"Fatimah Z.",r:5,text:"Bahannya adem banget, jahitan rapi"},{user:"Nur H.",r:5,text:"Warnanya sesuai foto, suka!"}] },
  { id:4, name:"Herbal Habatussauda 120 Kapsul", price:95000, cat:"Kesehatan", seller:"Apotek Sehat Jamaah", city:"Medan", rating:4.7, sold:890, stock:150, img:"💊", desc:"Habbatussauda premium dalam bentuk kapsul. Membantu menjaga daya tahan tubuh dan kesehatan.", reviews:[{user:"Hasan B.",r:5,text:"Rutin konsumsi, badan lebih fit"},{user:"Sari L.",r:4,text:"Kapsulnya mudah ditelan"}] },
  { id:5, name:"Beras Organik Premium 5kg", price:89000, cat:"Pertanian", seller:"UB Mitra Umat", city:"Malang", rating:4.6, sold:567, stock:80, img:"🌾", desc:"Beras organik dari petani jamaah, ditanam tanpa pestisida kimia. Pulen dan beraroma wangi.", reviews:[{user:"Kartini D.",r:5,text:"Nasinya pulen, anak-anak suka"},{user:"Umar A.",r:4,text:"Harga terjangkau untuk organik"}] },
  { id:6, name:"Jasa Desain Logo Profesional", price:500000, cat:"Jasa", seller:"CV Berkah Mandiri", city:"Surabaya", rating:4.8, sold:156, stock:99, img:"🎨", desc:"Desain logo profesional untuk usaha Anda. Termasuk 3x revisi dan file master AI/PNG/SVG.", reviews:[{user:"Riko M.",r:5,text:"Hasilnya keren, cepat prosesnya"},{user:"Dewi S.",r:5,text:"Sangat profesional dan komunikatif"}] },
  { id:7, name:"Meja Kerja Minimalis Jati", price:1850000, cat:"Furniture", seller:"CV Ridho Abadi", city:"Surabaya", rating:4.4, sold:43, stock:8, img:"🪵", desc:"Meja kerja dari kayu jati asli dengan finishing natural. Kokoh dan tahan lama.", reviews:[{user:"Anton W.",r:4,text:"Kayunya bagus, finishing rapi"}] },
  { id:8, name:"Kurma Ajwa Madinah 1kg", price:350000, cat:"Makanan", seller:"Toko Amanah Jaya", city:"Jakarta", rating:4.9, sold:723, stock:35, img:"🌴", desc:"Kurma Ajwa premium asli Madinah. Manis alami dan lembut. Cocok untuk berbuka puasa.", reviews:[{user:"Aisyah R.",r:5,text:"Asli Madinah, manisnya pas"},{user:"Yusuf T.",r:5,text:"Packaging rapi, kurma fresh"}] },
  { id:9, name:"Sajadah Turki Premium", price:175000, cat:"Fashion", seller:"Toko Hikmah Online", city:"Bandung", rating:4.7, sold:445, stock:60, img:"🧎", desc:"Sajadah impor Turki, bahan tebal dan empuk. Motif elegan dengan warna yang indah.", reviews:[{user:"Mahmud K.",r:5,text:"Tebal dan nyaman untuk sholat"}] },
  { id:10, name:"Smartphone Reconditioned Samsung A52", price:2200000, cat:"Elektronik", seller:"PT Hidayah Tech", city:"Jakarta", rating:4.3, sold:67, stock:12, img:"📱", desc:"Samsung A52 rekondisi seperti baru. Layar AMOLED, RAM 6GB, Storage 128GB. Garansi 3 bulan.", reviews:[{user:"Ridwan H.",r:4,text:"Layar masih mulus, performa oke"}] },
  { id:11, name:"Pupuk Organik Cair 5 Liter", price:65000, cat:"Pertanian", seller:"UB Mitra Umat", city:"Malang", rating:4.5, sold:234, stock:100, img:"🧪", desc:"Pupuk organik cair fermentasi alami. Cocok untuk tanaman sayur, buah, dan hias.", reviews:[{user:"Bambang S.",r:4,text:"Tanaman jadi lebih subur"}] },
  { id:12, name:"Jasa Service AC & Elektronik", price:150000, cat:"Jasa", seller:"UB Karya Bersama", city:"Jakarta", rating:4.6, sold:312, stock:99, img:"🔧", desc:"Jasa service AC, kulkas, mesin cuci dan elektronik rumah tangga. Teknisi berpengalaman.", reviews:[{user:"Fitriani N.",r:5,text:"Teknisinya ramah dan cepat"}] },
];

// ═══ E-LEARNING DATA ═══
const COURSES = [
  { id:1, title:"Digital Marketing untuk UMKM Jamaah", instructor:"Ust. Ahmad Fauzi", level:"Pemula", duration:"8 jam", rating:4.8, students:342, img:"📱", modules:[
    { title:"Pengenalan Digital Marketing", type:"video", duration:"45 menit", content:"Digital marketing adalah strategi pemasaran menggunakan platform digital. Dalam modul ini kita akan membahas dasar-dasar digital marketing yang bisa langsung diterapkan untuk usaha jamaah." },
    { title:"Membangun Branding Online", type:"article", duration:"30 menit", content:"Branding online dimulai dari identitas visual yang konsisten. Pastikan logo, warna, dan tone komunikasi Anda sama di semua platform. Tips: gunakan Canva untuk membuat desain sederhana yang profesional." },
    { title:"Social Media Marketing", type:"video", duration:"60 menit", content:"Platform media sosial seperti Instagram, Facebook, dan TikTok adalah alat pemasaran yang sangat efektif untuk UMKM. Pelajari cara membuat konten yang menarik dan strategi posting yang optimal." },
    { title:"Google My Business & SEO Dasar", type:"article", duration:"45 menit", content:"Daftarkan usaha Anda di Google My Business agar mudah ditemukan. Optimalkan dengan foto, jam operasional, dan review pelanggan. SEO dasar membantu website Anda muncul di halaman pertama Google." },
  ], quiz:[
    { q:"Apa tujuan utama digital marketing?", options:["Mengurangi biaya operasional","Menjangkau pelanggan secara online","Mengganti toko fisik","Menghilangkan kompetitor"], answer:1 },
    { q:"Platform mana yang paling efektif untuk visual marketing?", options:["LinkedIn","Twitter","Instagram","Email"], answer:2 },
    { q:"Apa itu SEO?", options:["Social Email Optimization","Search Engine Optimization","Sales Enhancement Online","System Error Output"], answer:1 },
    { q:"Langkah pertama branding online adalah?", options:["Pasang iklan","Buat identitas visual konsisten","Beli domain mahal","Hire influencer"], answer:1 },
    { q:"Google My Business berguna untuk?", options:["Membuat website","Agar usaha ditemukan di Google Maps","Mengirim email marketing","Analisis kompetitor"], answer:1 },
  ]},
  { id:2, title:"Manajemen Keuangan Syariah", instructor:"Ust. Hasan Basri", level:"Menengah", duration:"10 jam", rating:4.9, students:215, img:"💰", modules:[
    { title:"Prinsip Dasar Keuangan Syariah", type:"article", duration:"40 menit", content:"Keuangan syariah berlandaskan prinsip larangan riba, gharar (ketidakpastian), dan maisir (spekulasi). Transaksi harus jelas, adil, dan saling menguntungkan kedua belah pihak." },
    { title:"Akad-Akad dalam Keuangan Syariah", type:"video", duration:"60 menit", content:"Berbagai jenis akad: Murabahah (jual beli), Musyarakah (kerjasama), Mudharabah (bagi hasil), Ijarah (sewa), dan Wakalah (perwakilan). Setiap akad memiliki ketentuan dan syarat yang berbeda." },
    { title:"Pencatatan Keuangan Usaha", type:"article", duration:"50 menit", content:"Pencatatan keuangan yang baik adalah kunci keberhasilan usaha. Pelajari cara membuat laporan laba rugi, neraca, dan arus kas sederhana yang sesuai prinsip syariah." },
    { title:"Perencanaan Keuangan Keluarga Islami", type:"video", duration:"45 menit", content:"Kelola keuangan keluarga dengan prinsip Islam: sisihkan untuk zakat, infaq, sedekah, tabungan, dan kebutuhan pokok. Hindari utang konsumtif dan investasikan di instrumen yang halal." },
  ], quiz:[
    { q:"Apa yang dilarang dalam keuangan syariah?", options:["Perdagangan","Riba","Investasi","Tabungan"], answer:1 },
    { q:"Akad Murabahah adalah?", options:["Sewa","Bagi hasil","Jual beli","Pinjaman"], answer:2 },
    { q:"Musyarakah berarti?", options:["Jual beli","Kerjasama/partnership","Sewa menyewa","Titipan"], answer:1 },
    { q:"Berapa minimal zakat mal?", options:["1%","2.5%","5%","10%"], answer:1 },
  ]},
  { id:3, title:"Leadership & Public Speaking", instructor:"Ustdzh. Siti Aminah", level:"Semua Level", duration:"6 jam", rating:4.7, students:189, img:"🎤", modules:[
    { title:"Dasar-dasar Kepemimpinan Islami", type:"video", duration:"50 menit", content:"Kepemimpinan dalam Islam berlandaskan amanah, shiddiq, tabligh, dan fathanah. Pemimpin sejati melayani umat dan bertanggung jawab atas kepercayaan yang diberikan." },
    { title:"Teknik Public Speaking", type:"article", duration:"40 menit", content:"Kunci public speaking: persiapan matang, kenali audiens, buka dengan hook yang kuat, gunakan storytelling, dan tutup dengan call to action yang jelas." },
    { title:"Mengelola Tim dengan Efektif", type:"video", duration:"55 menit", content:"Tim yang efektif dimulai dari visi yang jelas, pembagian tugas yang tepat, komunikasi terbuka, dan apresiasi terhadap kontribusi setiap anggota." },
  ], quiz:[
    { q:"Sifat pemimpin dalam Islam yang berarti dapat dipercaya?", options:["Shiddiq","Amanah","Tabligh","Fathanah"], answer:1 },
    { q:"Apa teknik paling efektif dalam public speaking?", options:["Membaca teks","Storytelling","Berbicara cepat","Menggunakan jargon"], answer:1 },
    { q:"Kunci utama tim yang efektif?", options:["Gaji tinggi","Komunikasi terbuka","Kerja overtime","Kompetisi internal"], answer:1 },
  ]},
  { id:4, title:"E-Commerce & Marketplace untuk Pemula", instructor:"Ust. Ridwan Hakim", level:"Pemula", duration:"7 jam", rating:4.6, students:278, img:"🛒", modules:[
    { title:"Memulai Jualan Online", type:"video", duration:"40 menit", content:"Langkah awal jualan online: tentukan produk, riset pasar, pilih platform (marketplace/sosmed/website), siapkan foto produk yang menarik, dan tulis deskripsi yang persuasif." },
    { title:"Foto Produk dengan Smartphone", type:"article", duration:"35 menit", content:"Tips foto produk: gunakan cahaya alami, background polos, angle 45 derajat, dan edit ringan. Smartphone modern sudah cukup untuk menghasilkan foto produk berkualitas." },
    { title:"Manajemen Stok & Pengiriman", type:"video", duration:"50 menit", content:"Kelola stok dengan sistem FIFO, catat setiap masuk-keluar barang, dan pilih jasa ekspedisi yang tepat sesuai jenis produk dan kecepatan yang dibutuhkan." },
  ], quiz:[
    { q:"Langkah pertama jualan online?", options:["Langsung posting","Tentukan produk & riset pasar","Buat website mahal","Hire karyawan"], answer:1 },
    { q:"FIFO dalam manajemen stok artinya?", options:["First In First Out","Fast In Fast Out","Free Input Free Output","Final Inventory Format"], answer:0 },
  ]},
];

// ═══ HIBAH DATA ═══
const HIBAH_ITEMS = [
  { id:1, name:"Laptop ASUS X441U", condition:"Baik (90%)", donor:"Umar Abdullah", city:"Jakarta", img:"💻", desc:"Laptop bekas pakai 2 tahun, masih normal semua. RAM 4GB, HDD 500GB. Cocok untuk pelajar.", status:"available", requests:3 },
  { id:2, name:"Kulkas Sharp 1 Pintu", condition:"Baik (85%)", donor:"Hasan Basri", city:"Surabaya", img:"🧊", desc:"Kulkas 1 pintu masih dingin normal, body sedikit lecet di samping. Cocok untuk keluarga kecil.", status:"available", requests:5 },
  { id:3, name:"Sepeda Gunung United", condition:"Cukup Baik (75%)", donor:"Ahmad Ridwan", city:"Bandung", img:"🚲", desc:"Sepeda gunung 26 inch, ban baru diganti. Frame kokoh, rem masih pakem.", status:"available", requests:2 },
  { id:4, name:"Mesin Cuci Samsung 7kg", condition:"Baik (80%)", donor:"Fatimah Zahra", city:"Semarang", img:"🫧", desc:"Mesin cuci top loading 7kg, semua program berfungsi normal. Timer sedikit kurang akurat.", status:"claimed", requests:7, claimedBy:"Siti Khadijah" },
  { id:5, name:"Set Buku Pelajaran SMA", condition:"Baik (95%)", donor:"Kartini Dewi", city:"Yogyakarta", img:"📚", desc:"Buku pelajaran SMA kelas 10-12 lengkap. Kondisi bersih, tidak ada coretan.", status:"available", requests:4 },
  { id:6, name:"Rak Buku Kayu 5 Tingkat", condition:"Cukup Baik (70%)", donor:"Bambang Suharto", city:"Malang", img:"📖", desc:"Rak buku kayu solid 5 tingkat. Ada goresan minor, masih kokoh untuk digunakan.", status:"available", requests:1 },
  { id:7, name:"Kompor Gas 2 Tungku Rinnai", condition:"Baik (85%)", donor:"Nur Halimah", city:"Jakarta", img:"🔥", desc:"Kompor gas 2 tungku, api normal, body bersih. Ganti karena upgrade ke kompor tanam.", status:"claimed", requests:8, claimedBy:"Dewi Rahmawati" },
  { id:8, name:"TV LED 32 inch LG", condition:"Baik (80%)", donor:"Ridwan Hakim", city:"Surabaya", img:"📺", desc:"TV LED 32 inch, gambar jernih, remote lengkap. Ada dead pixel kecil di pojok kiri bawah.", status:"available", requests:6 },
];

// ═══ INVESTASI DATA ═══
const INVEST_COMPANIES = [
  { id:1, name:"CV Berkah Mandiri", sector:"Makanan & Minuman", city:"Surabaya", rating:4.8, img:"🏭", targetFund:500, raisedFund:385, investors:24, returnRate:"15-18%", period:"12 bulan", akad:"Musyarakah", desc:"Produsen makanan ringan halal dengan distribusi ke 15 kota. Butuh modal untuk ekspansi produksi dan gudang baru.", financials:{ revenue:"Rp 2.4M/thn", profit:"Rp 480Jt/thn", growth:"+32%" }, openForInvestment:true },
  { id:2, name:"UB Sejahtera Bersama", sector:"Konveksi & Tekstil", city:"Bandung", rating:4.9, img:"🏢", targetFund:300, raisedFund:300, investors:18, returnRate:"12-15%", period:"12 bulan", akad:"Mudharabah", desc:"Usaha bersama konveksi yang memproduksi gamis dan busana muslim. Sudah punya 50+ mitra reseller.", financials:{ revenue:"Rp 1.8M/thn", profit:"Rp 360Jt/thn", growth:"+25%" }, openForInvestment:false },
  { id:3, name:"PT Hidayah Tech", sector:"Teknologi & IT", city:"Jakarta", rating:4.5, img:"🏭", targetFund:750, raisedFund:420, investors:31, returnRate:"18-22%", period:"18 bulan", akad:"Musyarakah", desc:"Perusahaan IT yang mengembangkan aplikasi dan solusi digital untuk komunitas muslim. Fokus pada marketplace dan fintech syariah.", financials:{ revenue:"Rp 3.2M/thn", profit:"Rp 800Jt/thn", growth:"+45%" }, openForInvestment:true },
  { id:4, name:"UB Mitra Umat", sector:"Pertanian & Peternakan", city:"Malang", rating:4.6, img:"🏢", targetFund:200, raisedFund:145, investors:12, returnRate:"10-14%", period:"12 bulan", akad:"Mudharabah", desc:"Usaha bersama di bidang pertanian organik dan peternakan ayam kampung. Produk dijual langsung ke jamaah.", financials:{ revenue:"Rp 900Jt/thn", profit:"Rp 180Jt/thn", growth:"+20%" }, openForInvestment:true },
  { id:5, name:"CV Ridho Abadi", sector:"Furniture & Interior", city:"Surabaya", rating:4.4, img:"🏭", targetFund:350, raisedFund:210, investors:15, returnRate:"13-16%", period:"12 bulan", akad:"Musyarakah", desc:"Produsen furniture jati berkualitas ekspor. Butuh modal untuk workshop baru dan mesin CNC.", financials:{ revenue:"Rp 1.5M/thn", profit:"Rp 300Jt/thn", growth:"+18%" }, openForInvestment:true },
];

// ═══ LOWONGAN KERJA DATA ═══
const JOBS = [
  { id:1, title:"Staff Marketing Digital", company:"PT Hidayah Tech", city:"Jakarta", type:"Full-time", salary:"Rp 5-7 Jt/bln", img:"💼", posted:"2 hari lalu", applicants:12, desc:"Bertanggung jawab mengelola social media, campaign digital, dan content marketing perusahaan.", requirements:["Pengalaman min. 1 tahun di digital marketing","Menguasai Meta Ads & Google Ads","Kreatif dan komunikatif","Muslim/Muslimah, diutamakan jamaah LDII"] },
  { id:2, title:"Operator Produksi", company:"CV Berkah Mandiri", city:"Surabaya", type:"Full-time", salary:"Rp 3.5-4.5 Jt/bln", img:"🏭", posted:"1 hari lalu", applicants:8, desc:"Mengoperasikan mesin produksi makanan ringan, quality control, dan packaging.", requirements:["Lulusan SMA/SMK sederajat","Sehat jasmani dan rohani","Bersedia kerja shift","Teliti dan disiplin"] },
  { id:3, title:"Desainer Grafis", company:"CV Berkah Mandiri", city:"Surabaya", type:"Freelance", salary:"Rp 3-5 Jt/proyek", img:"🎨", posted:"3 hari lalu", applicants:15, desc:"Membuat desain kemasan produk, banner promosi, dan konten social media.", requirements:["Menguasai Adobe Illustrator & Photoshop","Portfolio desain yang menarik","Bisa bekerja dengan deadline","Memahami trend desain terkini"] },
  { id:4, title:"Guru Privat Matematika", company:"Lembaga Bimbel Amanah", city:"Bandung", type:"Part-time", salary:"Rp 75-100rb/sesi", img:"📐", posted:"5 hari lalu", applicants:6, desc:"Mengajar matematika untuk siswa SD-SMP, datang ke rumah siswa atau online via Zoom.", requirements:["Mahasiswa/lulusan jurusan MIPA atau Pendidikan","Sabar dan komunikatif","Memiliki kendaraan sendiri","Berpengalaman mengajar (diutamakan)"] },
  { id:5, title:"Admin & Kasir Toko", company:"Toko Amanah Jaya", city:"Jakarta", type:"Full-time", salary:"Rp 3.5-4 Jt/bln", img:"🧾", posted:"1 hari lalu", applicants:20, desc:"Mengelola kasir, pencatatan stok, dan pelayanan pelanggan di toko.", requirements:["Lulusan SMA/SMK","Jujur dan amanah","Menguasai komputer dasar","Ramah dan rapi"] },
  { id:6, title:"Teknisi Maintenance", company:"UB Karya Bersama", city:"Jakarta", type:"Full-time", salary:"Rp 4.5-6 Jt/bln", img:"🔧", posted:"4 hari lalu", applicants:9, desc:"Merawat dan memperbaiki instalasi listrik, AC, plumbing di gedung kantor dan workshop.", requirements:["SMK Teknik Listrik/Mesin","Pengalaman min. 2 tahun","Memiliki sertifikat K3","Bisa bekerja mandiri dan tim"] },
];

// ═══ ACTIVITY & STATS ═══
const ACTIVITY_FEED = [
  { time:"2 mnt", user:"Ahmad Fauzi", action:"membeli Madu Hutan Asli", icon:"🛒", color:C.gold },
  { time:"5 mnt", user:"Siti Aminah", action:"menyelesaikan kursus Digital Marketing", icon:"🎓", color:C.emerald },
  { time:"12 mnt", user:"CV Berkah Mandiri", action:"membuka 3 lowongan kerja baru", icon:"💼", color:C.royal },
  { time:"18 mnt", user:"Hasan Basri", action:"berinvestasi di PT Hidayah Tech", icon:"📈", color:C.gold },
  { time:"25 mnt", user:"Umar Abdullah", action:"menghibahkan laptop bekas", icon:"🎁", color:C.copper },
  { time:"32 mnt", user:"Fatimah Zahra", action:"mengajukan pembiayaan ke BMT", icon:"🏦", color:C.plum },
  { time:"45 mnt", user:"Toko Amanah", action:"mengupload 8 produk baru", icon:"🛒", color:C.gold },
  { time:"1 jam", user:"BMT Al-Ikhlas", action:"menyetujui 5 pembiayaan", icon:"✅", color:C.emerald },
];
const MONTHLY = [{b:"Jan",w:4200,t:320,i:45},{b:"Feb",w:4800,t:410,i:52},{b:"Mar",w:5500,t:520,i:68},{b:"Apr",w:6200,t:680,i:85},{b:"Mei",w:7100,t:790,i:102},{b:"Jun",w:7800,t:920,i:118},{b:"Jul",w:8600,t:1050,i:135},{b:"Ags",w:9400,t:1180,i:155},{b:"Sep",w:10200,t:1350,i:178},{b:"Okt",w:11100,t:1520,i:198},{b:"Nov",w:12000,t:1700,i:220},{b:"Des",w:13000,t:1900,i:245}];
const MOD_DIST = [{name:"Marketplace",value:32,color:C.gold},{name:"E-Learning",value:28,color:C.crimson},{name:"Loker",value:18,color:C.emerald},{name:"Investasi",value:12,color:C.royal},{name:"BMT",value:7,color:C.plum},{name:"Hibah",value:3,color:C.copper}];
const RADAR_D = [{subject:"Pembelajaran",A:92},{subject:"Perdagangan",A:85},{subject:"Investasi",A:70},{subject:"Ketenagakerjaan",A:78},{subject:"Pembiayaan",A:65},{subject:"Sosial",A:88}];

const CITIES = [
  { name:"Medan",top:15,left:9,members:900,usaha:45,color:C.plum },
  { name:"Jakarta",top:72,left:26,members:3200,usaha:180,color:C.crimson },
  { name:"Bandung",top:74,left:28,members:1500,usaha:85,color:C.emerald },
  { name:"Semarang",top:73,left:34,members:1200,usaha:72,color:C.royal },
  { name:"Yogyakarta",top:77,left:33,members:1100,usaha:65,color:C.crimson },
  { name:"Surabaya",top:74,left:40,members:2800,usaha:150,color:C.gold },
  { name:"Malang",top:78,left:39.5,members:950,usaha:52,color:C.emerald },
  { name:"Denpasar",top:76,left:44.5,members:400,usaha:22,color:C.gold },
  { name:"Pontianak",top:35,left:31,members:350,usaha:18,color:C.royal },
  { name:"Banjarmasin",top:55,left:43,members:450,usaha:25,color:C.plum },
  { name:"Makassar",top:64,left:54,members:800,usaha:38,color:C.copper },
  { name:"Manado",top:26,left:64,members:280,usaha:14,color:C.copper },
];

const STAKEHOLDERS = [
  { name:"Pembelajar",icon:"🎓",benefit:"Mendapat materi & sertifikat digital",contribute:"Menilai kualitas materi" },
  { name:"Pengajar",icon:"👨‍🏫",benefit:"Mendapat nilai kualitas dari pembelajar",contribute:"Memberi materi pembelajaran" },
  { name:"Pencari Kerja",icon:"🔍",benefit:"Info lowongan & peluang kerja",contribute:"Tenaga kerja ekonomi jamaah" },
  { name:"Produsen",icon:"🏭",benefit:"Karyawan, investor & mitra seller",contribute:"Lapangan kerja & barang/jasa" },
  { name:"Seller",icon:"🏪",benefit:"Omzet dari transaksi",contribute:"Menjualkan produk jamaah" },
  { name:"Pembeli",icon:"🛍️",benefit:"Barang/jasa dari jamaah",contribute:"Perputaran uang jamaah" },
  { name:"Usaha Bersama",icon:"🏢",benefit:"Omzet, karyawan & investor",contribute:"Lapangan kerja jamaah" },
  { name:"Investor",icon:"💰",benefit:"Deviden & bagi hasil",contribute:"Modal usaha jamaah" },
  { name:"BMT",icon:"🏦",benefit:"Nasabah & pembiayaan syariah",contribute:"Jamaah bebas riba" },
  { name:"Pemberi Hibah",icon:"🤲",benefit:"Barang bermanfaat untuk jamaah",contribute:"Barang layak pakai" },
  { name:"Penerima Hibah",icon:"🎁",benefit:"Barang gratis",contribute:"Doa & syukur" },
];

// ═══ HELPER ═══
const fmt = (n) => "Rp "+n.toLocaleString("id-ID");

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [sub, setSub] = useState(null); // sub-page / detail id
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notif, setNotif] = useState(false);
  const [loginM, setLoginM] = useState(false);
  const [regM, setRegM] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [mapCity, setMapCity] = useState(null);
  // Marketplace
  const [mCat, setMCat] = useState("Semua");
  const [mSearch, setMSearch] = useState("");
  // E-Learning
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  // Hibah
  const [hibahReq, setHibahReq] = useState(null); // item id for request modal
  const [hibahReason, setHibahReason] = useState("");
  const [hibahSent, setHibahSent] = useState([]);
  // Investasi
  const [investAmount, setInvestAmount] = useState(10);
  const [investTab, setInvestTab] = useState("explore");
  const [myInvestments] = useState([
    { company:"CV Berkah Mandiri", amount:25, date:"15 Mar 2026", returnRate:"16.2%", earned:"Rp 1.35 Jt", status:"Aktif", nextDiv:"15 Jun 2026", sector:"Makanan" },
    { company:"PT Hidayah Tech", amount:50, date:"20 Jan 2026", returnRate:"19.5%", earned:"Rp 3.25 Jt", status:"Aktif", nextDiv:"20 Apr 2026", sector:"IT" },
    { company:"UB Mitra Umat", amount:15, date:"10 Des 2025", returnRate:"12.8%", earned:"Rp 0.96 Jt", status:"Selesai", nextDiv:"-", sector:"Pertanian" },
  ]);
  // Loker
  const [lokerType, setLokerType] = useState("Semua");
  const [lokerSearch, setLokerSearch] = useState("");
  const [lokerCity, setLokerCity] = useState("Semua");
  // BMT
  const [bmtAmt, setBmtAmt] = useState(50);
  const [bmtTenor, setBmtTenor] = useState(12);
  const [bmtType, setBmtType] = useState("produktif");
  const [bmtSubmitted, setBmtSubmitted] = useState(false);
  const [bmtTab, setBmtTab] = useState("kalkulator");
  const [bmtHistory, setBmtHistory] = useState([
    { id:1, date:"12 Feb 2026", amount:75, tenor:12, type:"produktif", status:"Berjalan", paid:3, monthly:6.57 },
    { id:2, date:"5 Jan 2026", amount:25, tenor:6, type:"konsumtif", status:"Lunas", paid:6, monthly:4.35 },
  ]);
  // Profile
  const [profileTab, setProfileTab] = useState("overview");
  // Map & Directory
  const [dirSearch, setDirSearch] = useState("");
  const [dirType, setDirType] = useState("Semua");
  // Mobile menu
  const [mobileMenu, setMobileMenu] = useState(false);
  // Hibah give form
  const [hibahGive, setHibahGive] = useState(false);
  // E-Learning progress
  const [completedLessons, setCompletedLessons] = useState({});

  useEffect(() => { setTimeout(() => setHeroReady(true), 150); }, []);
  useEffect(() => { if(page==="home"){const t=setInterval(()=>setFlowStep(p=>(p+1)%7),2500);return()=>clearInterval(t);} },[page]);

  const nav = (p, s=null) => { setPage(p); setSub(s); setNotif(false); setCartOpen(false); setMobileMenu(false); setQuizStarted(false); setQuizDone(false); setQuizAnswers({}); setActiveLesson(0); window.scrollTo({top:0,behavior:"smooth"}); };
  const addCart = (p) => { setCart(prev => { const ex=prev.find(x=>x.id===p.id); if(ex) return prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x); return [...prev,{...p,qty:1}]; }); };
  const rmCart = (id) => setCart(prev=>prev.filter(x=>x.id!==id));
  const updQty = (id,d) => setCart(prev=>prev.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x));
  const cartTotal = cart.reduce((a,x)=>a+x.price*x.qty,0);
  const cartCount = cart.reduce((a,x)=>a+x.qty,0);

  const bmtMargin = bmtType==="produktif"?0.012:0.015;
  const bmtTotal = bmtAmt*(1+bmtMargin*bmtTenor);
  const bmtMonthly = bmtTotal/bmtTenor;

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.dark, background:C.cream, minHeight:"100vh", overflowX:"hidden" }}>
<style>{`
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.crimson};border-radius:9px}
@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
@keyframes glow{0%,100%{box-shadow:0 0 8px rgba(196,30,58,.3)}50%{box-shadow:0 0 18px rgba(196,30,58,.6)}}
@keyframes ripple{0%{transform:scale(1);opacity:1}100%{transform:scale(3);opacity:0}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.glass{background:rgba(250,248,243,.88);backdrop-filter:blur(16px)}
.nav-link{position:relative;color:#555;text-decoration:none;font-weight:600;font-size:13px;padding:6px 0;cursor:pointer;transition:all .3s}
.nav-link:hover{color:${C.crimson}}.nav-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:2px;background:${C.crimson};transition:width .3s;border-radius:2px}.nav-link:hover::after{width:100%}
.card{background:white;border-radius:16px;border:1px solid rgba(0,0,0,.04);transition:all .35s cubic-bezier(.175,.885,.32,1.275);overflow:hidden}
.card:hover{transform:translateY(-4px);box-shadow:0 14px 36px rgba(0,0,0,.06)}
.btn{border:none;border-radius:50px;font-weight:700;cursor:pointer;transition:all .3s;font-family:'DM Sans';display:inline-flex;align-items:center;justify-content:center;gap:6px}
.bp{background:linear-gradient(135deg,${C.crimson},#991528);color:white;padding:12px 28px;font-size:14px}
.bp:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(196,30,58,.3)}
.bo{background:transparent;color:${C.crimson};border:2px solid ${C.crimson};padding:10px 24px;font-size:14px}
.bo:hover{background:${C.crimson};color:white}
.bs{padding:8px 16px;font-size:12.5px}
.bg{background:rgba(255,255,255,.12);color:white;border:1px solid rgba(255,255,255,.2);padding:11px 26px;font-size:14px}
.bg:hover{background:rgba(255,255,255,.22)}
.inp{width:100%;padding:12px 16px;border:2px solid #eee;border-radius:11px;font-size:13.5px;font-family:'DM Sans';outline:none;background:${C.cream};transition:border .3s;margin-bottom:10px}
.inp:focus{border-color:${C.crimson}}
.sel{width:100%;padding:12px 16px;border:2px solid #eee;border-radius:11px;font-size:13.5px;font-family:'DM Sans';outline:none;background:${C.cream};margin-bottom:10px;appearance:none;cursor:pointer}
.modal-bg{position:fixed;inset:0;background:rgba(15,15,26,.55);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fadeIn .2s}
.modal{background:white;border-radius:20px;padding:32px;max-width:440px;width:92%;animation:fadeUp .3s;position:relative;max-height:90vh;overflow-y:auto}
.tag{display:inline-block;padding:4px 12px;border-radius:50px;font-size:11.5px;font-weight:600}
.hxl{font-family:'DM Serif Display',serif;font-size:clamp(30px,5vw,50px);line-height:1.12}
.hlg{font-family:'DM Serif Display',serif;font-size:30px;line-height:1.2}
.hmd{font-family:'Outfit';font-weight:800;font-size:18px}
.lab{font-family:'Outfit';font-weight:700;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.crimson}}
.back{background:none;border:none;color:${C.crimson};font-weight:700;font-size:13.5px;cursor:pointer;font-family:'DM Sans';display:flex;align-items:center;gap:6px;padding:0;margin-bottom:22px;transition:gap .3s}
.back:hover{gap:10px}
.tab{padding:9px 18px;border-radius:50px;font-weight:600;font-size:12.5px;cursor:pointer;transition:all .3s;border:none;font-family:'DM Sans';background:transparent;color:#999}
.tab:hover{background:#f5f3ef;color:#555}
.tab-a{background:${C.crimson}!important;color:white!important}
.sld{-webkit-appearance:none;width:100%;height:6px;border-radius:3px;background:#e8e4de;outline:none}
.sld::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:${C.crimson};cursor:pointer;box-shadow:0 2px 8px rgba(196,30,58,.3)}
.prog{height:8px;border-radius:4px;background:#eee;overflow:hidden}.prog-fill{height:100%;border-radius:4px;transition:width .5s}
.flow-node{padding:12px 18px;border-radius:12px;font-weight:700;font-size:12px;display:flex;align-items:center;gap:8px;transition:all .5s;white-space:nowrap}
.flow-active{transform:scale(1.06);box-shadow:0 6px 22px rgba(0,0,0,.1)}
.map-dot{position:absolute;cursor:pointer;transition:all .3s;z-index:2}.map-dot:hover{transform:scale(1.5);z-index:10}
.stars{color:${C.gold};font-size:12px;letter-spacing:1px}
.hamburger-btn{display:none!important}
@media(max-width:768px){.hide-m{display:none!important}.m-col{flex-direction:column!important}.m-grid1{grid-template-columns:1fr!important}.hamburger-btn{display:flex!important}}
.mob-overlay{position:fixed;inset:0;background:rgba(15,15,26,.5);z-index:998;animation:fadeIn .2s}
.mob-menu{position:fixed;top:0;right:0;width:280px;max-width:80vw;height:100%;background:white;z-index:999;padding:24px;animation:slideR .3s;overflow-y:auto;box-shadow:-8px 0 30px rgba(0,0,0,.1)}
`}</style>

      {/* ═══ NAVBAR ═══ */}
      <nav className="glass" style={{ position:"sticky",top:0,zIndex:100,borderBottom:"1px solid rgba(0,0,0,.05)",padding:"0 20px" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",height:58 }}>
          <div style={{ display:"flex",alignItems:"center",gap:9,cursor:"pointer" }} onClick={()=>nav("home")}>
            <div style={{ width:34,height:34,background:`linear-gradient(135deg,${C.crimson},#991528)`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontFamily:"'DM Serif Display'",fontSize:16 }}>W</div>
            <div><div style={{ fontFamily:"'Outfit'",fontWeight:900,fontSize:15,color:C.dark,lineHeight:1 }}>WargaLDII</div><div style={{ fontSize:8.5,color:"#ccc",fontWeight:600,letterSpacing:1.8,textTransform:"uppercase" }}>wargaldii.com</div></div>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:16 }}>
            {MODULES.map(m=><span key={m.id} className="nav-link hide-m" onClick={()=>nav(m.id)}>{m.icon} {m.title}</span>)}
            <span className="nav-link hide-m" onClick={()=>nav("dashboard")}>📊</span>
            {/* Cart */}
            <div style={{ position:"relative",cursor:"pointer" }} onClick={()=>{setCartOpen(!cartOpen);setNotif(false)}}>
              <span style={{ fontSize:17 }}>🛒</span>
              {cartCount>0&&<span style={{ position:"absolute",top:-5,right:-6,minWidth:16,height:16,background:C.gold,borderRadius:50,fontSize:9,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,border:"2px solid white",padding:"0 3px" }}>{cartCount}</span>}
            </div>
            {/* Notif */}
            <div style={{ position:"relative",cursor:"pointer" }} onClick={()=>{setNotif(!notif);setCartOpen(false)}}>
              <span style={{ fontSize:17 }}>🔔</span>
              <span style={{ position:"absolute",top:-4,right:-4,width:14,height:14,background:C.crimson,borderRadius:50,fontSize:8,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,border:"2px solid white" }}>5</span>
            </div>
            <button className="btn bp bs" onClick={()=>setRegM(true)}>Daftar</button>
            {/* Hamburger - shown on mobile only */}
            <button className="btn hamburger-btn" onClick={()=>setMobileMenu(!mobileMenu)} style={{ fontSize:20,padding:4,background:"none",color:C.dark }}>☰</button>
          </div>
        </div>
        {/* Mobile Menu */}
        {mobileMenu&&<><div className="mob-overlay" onClick={()=>setMobileMenu(false)}/><div className="mob-menu">
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
            <div style={{ fontFamily:"'Outfit'",fontWeight:900,fontSize:16 }}>Menu</div>
            <button style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#999" }} onClick={()=>setMobileMenu(false)}>✕</button>
          </div>
          {MODULES.map(m=><div key={m.id} style={{ padding:"12px 0",borderBottom:"1px solid #f5f3ef",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10 }} onClick={()=>nav(m.id)}>
            <span style={{ fontSize:20 }}>{m.icon}</span>{m.title}
          </div>)}
          <div style={{ padding:"12px 0",borderBottom:"1px solid #f5f3ef",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10 }} onClick={()=>nav("dashboard")}>📊 Dashboard</div>
          <div style={{ padding:"12px 0",borderBottom:"1px solid #f5f3ef",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10 }} onClick={()=>nav("profile")}>👤 Profil</div>
          <div style={{ marginTop:20,display:"flex",gap:8 }}>
            <button className="btn bo bs" style={{ flex:1 }} onClick={()=>{setMobileMenu(false);setLoginM(true)}}>Masuk</button>
            <button className="btn bp bs" style={{ flex:1 }} onClick={()=>{setMobileMenu(false);setRegM(true)}}>Daftar</button>
          </div>
        </div></>}
        {/* Cart dropdown */}
        {cartOpen&&(<div style={{ position:"absolute",right:20,top:56,width:380,maxWidth:"92vw",background:"white",borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,.12)",border:"1px solid #f0ece6",zIndex:200,animation:"fadeUp .2s" }}>
          <div style={{ padding:"14px 18px",borderBottom:"1px solid #f5f3ef",fontWeight:800,fontSize:14 }}>Keranjang ({cartCount})</div>
          <div style={{ maxHeight:300,overflowY:"auto" }}>
            {cart.length===0?<div style={{ padding:30,textAlign:"center",color:"#ccc" }}>Keranjang kosong</div>:
            cart.map(x=><div key={x.id} style={{ padding:"12px 18px",borderBottom:"1px solid #faf8f5",display:"flex",gap:10,alignItems:"center" }}>
              <span style={{ fontSize:28 }}>{x.img}</span>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5,fontWeight:700 }}>{x.name}</div>
                <div style={{ fontSize:12,color:C.crimson,fontWeight:700 }}>{fmt(x.price)}</div>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginTop:4 }}>
                  <button className="btn" style={{ width:24,height:24,borderRadius:6,background:"#f5f3ef",fontSize:14,padding:0,color:"#666" }} onClick={()=>updQty(x.id,-1)}>-</button>
                  <span style={{ fontSize:13,fontWeight:700 }}>{x.qty}</span>
                  <button className="btn" style={{ width:24,height:24,borderRadius:6,background:"#f5f3ef",fontSize:14,padding:0,color:"#666" }} onClick={()=>updQty(x.id,1)}>+</button>
                  <button style={{ marginLeft:"auto",background:"none",border:"none",color:"#ccc",cursor:"pointer",fontSize:14 }} onClick={()=>rmCart(x.id)}>✕</button>
                </div>
              </div>
            </div>)}
          </div>
          {cart.length>0&&<div style={{ padding:"14px 18px",borderTop:"1px solid #f5f3ef" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}><span style={{ fontWeight:700,fontSize:13 }}>Total</span><span style={{ fontWeight:800,fontSize:15,color:C.crimson }}>{fmt(cartTotal)}</span></div>
            <button className="btn bp" style={{ width:"100%" }} onClick={()=>{nav("checkout");setCartOpen(false)}}>Checkout →</button>
          </div>}
        </div>)}
        {/* Notif dropdown */}
        {notif&&(<div style={{ position:"absolute",right:60,top:56,width:340,maxWidth:"90vw",background:"white",borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,.12)",border:"1px solid #f0ece6",zIndex:200,animation:"fadeUp .2s" }}>
          <div style={{ padding:"12px 16px",borderBottom:"1px solid #f5f3ef",fontWeight:800,fontSize:13 }}>Notifikasi</div>
          <div style={{ maxHeight:300,overflowY:"auto" }}>{ACTIVITY_FEED.slice(0,5).map((a,i)=><div key={i} style={{ padding:"10px 16px",borderBottom:"1px solid #faf8f5",display:"flex",gap:8 }}><span style={{ fontSize:18 }}>{a.icon}</span><div><span style={{ fontSize:12 }}><b>{a.user}</b> {a.action}</span><div style={{ fontSize:10,color:"#ccc",marginTop:1 }}>{a.time}</div></div></div>)}</div>
        </div>)}
      </nav>

      {/* ═══ MODALS ═══ */}
      {loginM&&<div className="modal-bg" onClick={()=>setLoginM(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setLoginM(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:20 }}><div style={{ fontSize:36,marginBottom:4 }}>🕌</div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>Masuk</h2></div>
        <input className="inp" placeholder="Email" type="email"/><input className="inp" placeholder="Kata Sandi" type="password"/>
        <button className="btn bp" style={{ width:"100%",marginTop:4 }}>Masuk</button>
        <p style={{ textAlign:"center",marginTop:12,fontSize:12,color:"#aaa" }}>Belum punya akun? <span style={{ color:C.crimson,fontWeight:700,cursor:"pointer" }} onClick={()=>{setLoginM(false);setRegM(true)}}>Daftar</span></p>
      </div></div>}
      {regM&&<div className="modal-bg" onClick={()=>setRegM(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setRegM(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:16 }}><div style={{ fontSize:36,marginBottom:4 }}>🤝</div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>Daftar</h2></div>
        <input className="inp" placeholder="Nama Lengkap"/><input className="inp" placeholder="Email" type="email"/><input className="inp" placeholder="No. WhatsApp" type="tel"/>
        <select className="sel"><option value="">Pilih Peran</option>{STAKEHOLDERS.map(s=><option key={s.name}>{s.icon} {s.name}</option>)}</select>
        <input className="inp" placeholder="Cabang / PC LDII"/><input className="inp" placeholder="Kata Sandi" type="password"/>
        <button className="btn bp" style={{ width:"100%" }}>Daftar Sekarang</button>
      </div></div>}
      {/* Hibah request modal */}
      {hibahReq!==null&&<div className="modal-bg" onClick={()=>setHibahReq(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setHibahReq(null)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:4 }}>Ajukan Hibah</h3>
        <p style={{ fontSize:12.5,color:"#999",marginBottom:16 }}>Tulis alasan mengapa Anda membutuhkan barang ini</p>
        <div style={{ background:`${C.copper}08`,borderRadius:12,padding:14,marginBottom:14,display:"flex",gap:10,alignItems:"center" }}>
          <span style={{ fontSize:28 }}>{HIBAH_ITEMS.find(x=>x.id===hibahReq)?.img}</span>
          <div><div style={{ fontWeight:700,fontSize:14 }}>{HIBAH_ITEMS.find(x=>x.id===hibahReq)?.name}</div><div style={{ fontSize:12,color:"#999" }}>{HIBAH_ITEMS.find(x=>x.id===hibahReq)?.condition}</div></div>
        </div>
        <input className="inp" placeholder="Nama Lengkap"/>
        <input className="inp" placeholder="Alamat Lengkap"/>
        <textarea className="inp" placeholder="Alasan membutuhkan barang ini..." style={{ minHeight:80,resize:"vertical" }} value={hibahReason} onChange={e=>setHibahReason(e.target.value)}/>
        <button className="btn bp" style={{ width:"100%" }} onClick={()=>{setHibahSent(p=>[...p,hibahReq]);setHibahReq(null);setHibahReason("")}}>Kirim Pengajuan</button>
      </div></div>}
      {/* Hibah GIVE modal */}
      {hibahGive&&<div className="modal-bg" onClick={()=>setHibahGive(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setHibahGive(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:16 }}><div style={{ fontSize:38,marginBottom:4 }}>🤲</div><h3 className="hmd">Beri Hibah Barkas</h3><p style={{ fontSize:12,color:"#999",marginTop:4 }}>Bagikan barang layak pakai Anda untuk sesama jamaah</p></div>
        <input className="inp" placeholder="Nama Barang (mis: Laptop ASUS X441)"/>
        <select className="sel"><option value="">Kategori Barang</option><option>Elektronik</option><option>Furniture</option><option>Buku & Alat Tulis</option><option>Pakaian</option><option>Peralatan Rumah</option><option>Kendaraan</option><option>Lainnya</option></select>
        <select className="sel"><option value="">Kondisi Barang</option><option>Sangat Baik (90-100%)</option><option>Baik (75-90%)</option><option>Cukup Baik (60-75%)</option><option>Layak Pakai (50-60%)</option></select>
        <textarea className="inp" placeholder="Deskripsi barang (spesifikasi, kelebihan/kekurangan, alasan dihibahkan)..." style={{ minHeight:80,resize:"vertical" }}/>
        <input className="inp" placeholder="Kota / Lokasi"/>
        <input className="inp" placeholder="No. WhatsApp untuk koordinasi"/>
        <div style={{ padding:"14px",borderRadius:10,border:"2px dashed #ddd",textAlign:"center",color:"#bbb",fontSize:12.5,marginBottom:10,cursor:"pointer" }}>📷 Upload Foto Barang (klik untuk pilih)</div>
        <button className="btn bp" style={{ width:"100%" }} onClick={()=>{setHibahGive(false);alert("Barang hibah berhasil diupload! Terima kasih atas kebaikan Anda.")}}>Upload Barang Hibah →</button>
      </div></div>}

      {/* ═══════════════════════════════════
           PAGE ROUTING
         ═══════════════════════════════════ */}

      {/* ═══ HOME ═══ */}
      {page==="home"&&<>
        {/* Hero */}
        <section style={{ position:"relative",overflow:"hidden",background:`linear-gradient(155deg,${C.dark} 0%,#1a1028 35%,${C.crimson} 100%)`,padding:"64px 24px 80px" }}>
          <div style={{ maxWidth:840,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2,opacity:heroReady?1:0,transform:heroReady?"none":"translateY(24px)",transition:"all .8s cubic-bezier(.16,1,.3,1)" }}>
            <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(255,255,255,.07)",borderRadius:50,padding:"6px 16px",marginBottom:22,border:"1px solid rgba(255,255,255,.1)" }}>
              <span style={{ fontSize:11 }}>🕌</span><span className="lab" style={{ color:"rgba(255,255,255,.8)",fontSize:10 }}>PLATFORM EKONOMI JAMAAH LDII</span>
            </div>
            <h1 className="hxl" style={{ color:"white",marginBottom:16 }}>Bangun <span style={{ background:`linear-gradient(135deg,${C.gold},#FFA500)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Ekosistem Ekonomi</span><br/>Jamaah yang Mandiri</h1>
            <p style={{ color:"rgba(255,255,255,.55)",fontSize:15.5,maxWidth:500,margin:"0 auto 28px",lineHeight:1.7 }}>Satu platform untuk belajar, bekerja, berdagang, berinvestasi, dan saling membantu sesama warga LDII</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
              <button className="btn bp" style={{ fontSize:15,padding:"14px 32px" }} onClick={()=>setRegM(true)}>Bergabung Sekarang</button>
              <button className="btn bg" onClick={()=>nav("marketplace")}>Jelajahi Marketplace →</button>
            </div>
            <div style={{ display:"flex",justifyContent:"center",gap:36,marginTop:44,flexWrap:"wrap" }}>
              {[{n:"13,000+",l:"Warga"},{n:"1,900+",l:"Transaksi/Bln"},{n:"300+",l:"Usaha"},{n:"245+",l:"Investasi"}].map((s,i)=><div key={i}><div style={{ fontSize:24,fontWeight:900,color:C.gold,fontFamily:"'DM Serif Display'" }}>{s.n}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,marginTop:2 }}>{s.l}</div></div>)}
            </div>
          </div>
        </section>
        {/* Marquee */}
        <div style={{ background:C.dark,padding:"8px 0",overflow:"hidden",borderBottom:`3px solid ${C.crimson}` }}>
          <div style={{ display:"flex",animation:"marquee 45s linear infinite",width:"max-content" }}>
            {[...ACTIVITY_FEED,...ACTIVITY_FEED].map((a,i)=><span key={i} style={{ color:"rgba(255,255,255,.55)",fontSize:11,fontWeight:500,whiteSpace:"nowrap",marginRight:32,display:"flex",alignItems:"center",gap:4 }}><span>{a.icon}</span><b style={{ color:"rgba(255,255,255,.8)" }}>{a.user}</b> {a.action} <span style={{ color:"rgba(255,255,255,.25)" }}>• {a.time}</span></span>)}
          </div>
        </div>
        {/* Module Cards */}
        <section style={{ maxWidth:1280,margin:"0 auto",padding:"64px 24px" }}>
          <div style={{ textAlign:"center",marginBottom:40 }}>
            <span className="lab">6 Modul Utama</span>
            <h2 className="hlg" style={{ marginTop:6 }}>Pilih Modul & Mulai Sekarang</h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:14 }}>
            {MODULES.map((m,i)=><div key={m.id} className="card" style={{ padding:"22px 18px",cursor:"pointer",textAlign:"center",animation:`fadeUp .4s ease ${i*.06}s both` }} onClick={()=>nav(m.id)}>
              <div style={{ fontSize:36,marginBottom:8 }}>{m.icon}</div>
              <h3 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15,color:m.color }}>{m.title}</h3>
              <div style={{ fontSize:12,color:"#bbb",marginTop:4,fontWeight:600 }}>Buka →</div>
            </div>)}
          </div>
        </section>

        {/* Animated Flow */}
        <section style={{ background:`linear-gradient(180deg,${C.warmGray},white)`,padding:"60px 24px",overflow:"hidden" }}>
          <div style={{ maxWidth:1100,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:36 }}><span className="lab">Alur Ekonomi</span><h2 className="hlg" style={{ marginTop:6 }}>Siklus Perputaran Ekonomi Jamaah</h2></div>
            <div style={{ display:"flex",alignItems:"center",justifyContent:"center",flexWrap:"wrap",gap:6,padding:"12px 0" }}>
              {[{l:"📚 Belajar",c:C.crimson,s:"Pembelajar & Pengajar"},{l:"🔍 Cari Kerja",c:C.emerald,s:"Pencari Kerja → Produsen/UB"},{l:"🏭 Produksi",c:"#555",s:"Produsen membuat barang"},{l:"🏪 Jual",c:C.gold,s:"Seller menjualkan produk"},{l:"🛍️ Beli",c:C.copper,s:"Pembeli bertransaksi"},{l:"💰 Investasi",c:C.royal,s:"Investor mendanai usaha"},{l:"🏦 BMT",c:C.plum,s:"Pembiayaan syariah"}].map((n,i)=>(
                <div key={i} style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div className={`flow-node ${flowStep===i?"flow-active":""}`} style={{ background:flowStep===i?n.c:`${n.c}10`,color:flowStep===i?"white":n.c,border:`2px solid ${flowStep===i?n.c:`${n.c}30`}` }}>
                    <span style={{ fontSize:15 }}>{n.l.split(" ")[0]}</span>
                    <div><div style={{ fontSize:11.5 }}>{n.l.split(" ").slice(1).join(" ")}</div>{flowStep===i&&<div style={{ fontSize:9,opacity:.8,fontWeight:500,marginTop:1 }}>{n.s}</div>}</div>
                  </div>
                  {i<6&&<div style={{ height:3,flex:1,minWidth:12,borderRadius:3,background:flowStep===i?n.c:"#e0dcd6",transition:"all .5s" }}/>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Peta Interaktif Indonesia */}
        <section style={{ maxWidth:1200,margin:"0 auto",padding:"60px 24px" }}>
          <div style={{ textAlign:"center",marginBottom:36 }}><span className="lab">Peta Sebaran</span><h2 className="hlg" style={{ marginTop:6 }}>Sebaran Warga & Usaha LDII</h2><p style={{ color:"#aaa",fontSize:13,marginTop:4 }}>Klik titik kota untuk melihat detail</p></div>
          <div style={{ display:"flex",gap:22,flexWrap:"wrap",alignItems:"flex-start" }}>
            <div style={{ flex:"1 1 560px",background:"white",borderRadius:18,padding:20,border:"1px solid #f0ece6",position:"relative",minHeight:300,overflow:"hidden" }}>
              <svg viewBox="0 0 1000 420" style={{ width:"100%",height:"auto" }}>
                <defs><linearGradient id="lG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7DB87D"/><stop offset="100%" stopColor="#5A9E5A"/></linearGradient><linearGradient id="sG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#DCEEFB"/><stop offset="100%" stopColor="#C5E1F5"/></linearGradient><filter id="ls" x="-2%" y="-2%" width="104%" height="104%"><feDropShadow dx="1" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.08"/></filter></defs>
                <rect width="1000" height="420" fill="url(#sG)" rx="10"/>
                {/* Sumatra */}<path d="M52,35 C65,28 82,30 92,42 C100,54 105,68 112,85 C120,105 130,128 142,152 C154,178 166,202 178,225 C190,248 200,268 208,284 C214,296 218,308 215,318 C210,328 200,332 188,328 C176,322 168,310 158,294 C148,276 138,256 128,234 C118,212 108,190 100,170 C92,150 84,130 78,112 C72,95 66,78 62,64 C58,50 54,40 52,35Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1" filter="url(#ls)"/>
                {/* Jawa */}<path d="M230,302 C242,292 262,288 284,286 C308,284 332,286 356,290 C376,294 394,300 408,308 C416,314 420,320 416,326 C410,332 398,334 382,332 C362,330 340,326 316,322 C292,318 270,316 252,314 C240,312 234,310 232,306 C230,304 230,303 230,302Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1" filter="url(#ls)"/>
                {/* Bali */}<path d="M436,318 C442,312 450,314 450,320 C448,326 442,328 438,324Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.8"/>
                {/* Nusa Tenggara */}<ellipse cx="465" cy="324" rx="8" ry="6" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                <path d="M484,318 C496,314 514,316 520,322 C524,328 518,332 506,332 C494,330 486,326 484,318Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                <path d="M538,312 C556,306 580,308 594,314 C600,318 596,324 584,326 C568,326 548,322 538,316Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                {/* Kalimantan */}<path d="M300,130 C316,112 340,100 366,94 C392,88 418,90 440,98 C458,106 470,120 476,140 C482,162 482,186 476,210 C470,232 458,250 442,262 C426,272 408,274 390,268 C374,262 362,268 346,262 C330,256 318,242 310,224 C302,206 298,186 296,166 C294,148 296,138 300,130Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1" filter="url(#ls)"/>
                {/* Sulawesi */}<path d="M535,115 C542,106 552,108 554,118 C556,130 550,144 544,158 C538,172 536,186 540,200 C544,214 554,224 560,238 C566,252 564,268 556,282 C548,294 538,302 530,296 C524,288 526,274 530,260 C534,246 532,232 526,218 C520,204 520,190 524,176 C528,162 534,148 536,134 C537,126 536,118 535,115Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1" filter="url(#ls)"/>
                <path d="M554,118 C564,110 578,104 594,100 C610,96 626,98 638,106 C644,112 640,118 632,118 C620,118 606,114 592,110 C578,108 566,112 554,118Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.8"/>
                <path d="M554,200 C566,196 578,200 588,210 C594,218 590,226 580,226 C570,224 560,216 554,200Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.8"/>
                {/* Maluku */}<path d="M680,135 C688,130 698,134 696,144 C694,152 686,156 680,150Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                <path d="M690,175 C698,170 708,174 706,184 C704,192 696,196 690,190Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                <path d="M670,220 C680,214 694,218 698,228 C700,236 692,242 682,240 C672,238 666,230 670,220Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="0.7"/>
                {/* Papua */}<path d="M762,128 C754,122 744,126 740,136 C736,148 738,162 744,172 C750,180 760,182 768,176 C774,168 776,156 776,144 C776,136 770,130 762,128Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1"/>
                <path d="M768,148 C778,138 792,130 810,126 C830,122 852,124 874,130 C896,138 914,150 928,166 C938,180 944,196 944,214 C942,234 934,250 920,262 C906,272 888,276 870,272 C852,268 838,270 824,264 C810,258 800,246 792,232 C784,218 778,202 774,186 C770,170 768,156 768,148Z" fill="url(#lG)" stroke="#4A8B4A" strokeWidth="1" filter="url(#ls)"/>
                <line x1="0" y1="148" x2="1000" y2="148" stroke="#E74C3C" strokeWidth="0.7" strokeDasharray="8,5" opacity="0.25"/>
                <text x="12" y="142" fill="#E74C3C" fontSize="8" opacity="0.3" fontWeight="700">Khatulistiwa</text>
                <text x="120" y="190" fill="#2D5F2D" fontSize="11" fontWeight="800" opacity="0.25">SUMATRA</text>
                <text x="310" y="308" fill="#2D5F2D" fontSize="9" fontWeight="800" opacity="0.25">JAWA</text>
                <text x="360" y="170" fill="#2D5F2D" fontSize="11" fontWeight="800" opacity="0.25">KALIMANTAN</text>
                <text x="540" y="255" fill="#2D5F2D" fontSize="9" fontWeight="800" opacity="0.25">SULAWESI</text>
                <text x="855" y="215" fill="#2D5F2D" fontSize="11" fontWeight="800" opacity="0.25">PAPUA</text>
              </svg>
              {CITIES.map((c,i)=><div key={i} className="map-dot" style={{ left:`${c.left}%`,top:`${c.top}%` }} onClick={()=>setMapCity(mapCity?.name===c.name?null:c)}>
                <div style={{ width:12,height:12,borderRadius:"50%",background:c.color,border:"2.5px solid white",boxShadow:`0 2px 10px ${c.color}50`,animation:mapCity?.name===c.name?"glow 1.5s infinite":"none" }}/>
                {mapCity?.name===c.name&&<div style={{ position:"absolute",inset:-6,borderRadius:"50%",border:`2px solid ${c.color}`,animation:"ripple 2s infinite" }}/>}
                <span style={{ position:"absolute",top:-20,left:"50%",transform:"translateX(-50%)",fontSize:9.5,fontWeight:700,color:"#333",whiteSpace:"nowrap",background:"rgba(255,255,255,.92)",padding:"1px 6px",borderRadius:4,boxShadow:"0 1px 4px rgba(0,0,0,.08)" }}>{c.name}</span>
              </div>)}
            </div>
            <div style={{ flex:"0 0 260px",minWidth:220 }}>
              {mapCity?<div style={{ background:"white",borderRadius:14,padding:20,border:`2px solid ${mapCity.color}20`,animation:"slideR .3s" }}>
                <h3 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:17,color:mapCity.color,marginBottom:14 }}>📍 {mapCity.name}</h3>
                <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12 }}>
                  <div style={{ background:`${mapCity.color}06`,borderRadius:10,padding:"12px 14px",textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:mapCity.color }}>{mapCity.members.toLocaleString()}</div><div style={{ fontSize:10,color:"#aaa" }}>Warga</div></div>
                  <div style={{ background:`${mapCity.color}06`,borderRadius:10,padding:"12px 14px",textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:mapCity.color }}>{mapCity.usaha}</div><div style={{ fontSize:10,color:"#aaa" }}>Usaha</div></div>
                </div>
                <button className="btn bp bs" style={{ width:"100%" }} onClick={()=>nav("marketplace")}>Lihat Produk →</button>
              </div>:<div style={{ background:"white",borderRadius:14,padding:22,border:"1px solid #f0ece6",textAlign:"center" }}>
                <div style={{ fontSize:32,marginBottom:8,opacity:.3 }}>🗺️</div>
                <p style={{ color:"#bbb",fontSize:12.5 }}>Klik titik kota pada peta</p>
                <div style={{ marginTop:14,fontSize:12,color:"#ccc" }}><b style={{ color:C.crimson }}>{CITIES.reduce((a,c)=>a+c.members,0).toLocaleString()}</b> total warga<br/><b style={{ color:C.emerald }}>{CITIES.reduce((a,c)=>a+c.usaha,0)}</b> total usaha</div>
              </div>}
            </div>
          </div>
        </section>

        {/* Direktori Usaha (mini) */}
        <section style={{ maxWidth:1280,margin:"0 auto",padding:"20px 24px 60px" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}><div><span className="lab">Direktori</span><h2 className="hlg" style={{ marginTop:4 }}>Usaha Jamaah</h2></div>
            <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>{["Semua","Produsen","Seller","UB","BMT"].map(t=><button key={t} className={`tab ${dirType===t?"tab-a":""}`} onClick={()=>setDirType(t)}>{t}</button>)}</div>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12 }}>
            {[
              {name:"CV Berkah Mandiri",type:"Produsen",city:"Surabaya",sector:"Makanan & Minuman",rating:4.8,img:"🏭",open:true},
              {name:"Toko Amanah Jaya",type:"Seller",city:"Jakarta",sector:"Elektronik",rating:4.6,img:"🏪",open:false},
              {name:"UB Sejahtera Bersama",type:"UB",city:"Bandung",sector:"Konveksi & Tekstil",rating:4.9,img:"🏢",open:true},
              {name:"BMT Al-Ikhlas",type:"BMT",city:"Semarang",sector:"Keuangan Syariah",rating:4.7,img:"🏦",open:false},
              {name:"PT Hidayah Tech",type:"Produsen",city:"Jakarta",sector:"Teknologi & IT",rating:4.5,img:"🏭",open:true},
              {name:"Toko Hikmah Online",type:"Seller",city:"Bandung",sector:"Fashion & Busana",rating:4.9,img:"🏪",open:false},
            ].filter(d=>dirType==="Semua"||d.type===dirType).map((d,i)=><div key={i} className="card" style={{ padding:18,animation:`fadeUp .3s ease ${i*.05}s both` }}>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:10 }}>
                <div style={{ width:42,height:42,background:`${C.crimson}06`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>{d.img}</div>
                <div style={{ flex:1 }}><h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:14 }}>{d.name}</h4><div style={{ fontSize:11,color:"#aaa" }}>{d.type} · 📍 {d.city}</div></div>
                <span style={{ fontSize:11,fontWeight:700,color:C.gold }}>★ {d.rating}</span>
              </div>
              <div style={{ fontSize:12,color:"#999",marginBottom:8 }}>📂 {d.sector}</div>
              <div style={{ display:"flex",gap:6 }}>
                {d.open&&<span className="tag" style={{ background:"#E8F5E9",color:"#2E7D32",fontSize:10 }}>Open Investment</span>}
                <button className="btn bp bs" style={{ marginLeft:"auto" }} onClick={()=>nav("marketplace")}>Lihat →</button>
              </div>
            </div>)}
          </div>
        </section>

        {/* Ecosystem */}
        <section style={{ background:`linear-gradient(180deg,${C.warmGray},white)`,padding:"64px 24px" }}>
          <div style={{ maxWidth:1280,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:36 }}><span className="lab">Ekosistem</span><h2 className="hlg" style={{ marginTop:6 }}>11 Peran, Satu Ekosistem</h2></div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12 }}>
              {STAKEHOLDERS.map((s,i)=><div key={i} className="card" style={{ padding:18,animation:`fadeUp .3s ease ${i*.03}s both` }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}><div style={{ width:34,height:34,background:`${C.crimson}06`,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>{s.icon}</div><h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:13.5 }}>{s.name}</h4></div>
                <div style={{ fontSize:11.5,color:"#888",lineHeight:1.5 }}><span style={{ color:C.emerald,fontWeight:700 }}>✓</span> {s.benefit}</div>
              </div>)}
            </div>
          </div>
        </section>
        {/* Stats */}
        <section style={{ background:`linear-gradient(135deg,${C.dark},#1a1028,${C.crimson})`,padding:"56px 24px",textAlign:"center" }}>
          <h2 className="hlg" style={{ color:"white",marginBottom:36 }}>Pertumbuhan Platform</h2>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:24,maxWidth:900,margin:"0 auto" }}>
            {[{n:"13,000+",l:"Warga Terdaftar"},{n:"1,900+",l:"Transaksi/Bulan"},{n:"12",l:"Kota Aktif"},{n:"50+",l:"Fitur Platform"}].map((s,i)=><div key={i}><div style={{ fontFamily:"'DM Serif Display'",fontSize:34,color:C.gold }}>{s.n}</div><div style={{ color:"rgba(255,255,255,.45)",fontSize:12,fontWeight:600,marginTop:4 }}>{s.l}</div></div>)}
          </div>
        </section>
        {/* CTA */}
        <section style={{ maxWidth:700,margin:"0 auto",padding:"64px 24px",textAlign:"center" }}>
          <div className="card" style={{ padding:"44px 32px" }}>
            <div style={{ fontSize:40,marginBottom:10 }}>🕌</div>
            <h2 className="hlg">Siap Bergabung?</h2>
            <p style={{ color:"#aaa",fontSize:14,maxWidth:380,margin:"8px auto 24px",lineHeight:1.7 }}>Jadilah bagian dari ekonomi jamaah LDII yang mandiri</p>
            <button className="btn bp" style={{ fontSize:15,padding:"14px 34px" }} onClick={()=>setRegM(true)}>Daftar Sekarang</button>
          </div>
        </section>
        {/* Footer */}
        <footer style={{ background:C.dark,padding:"40px 24px 24px",color:"rgba(255,255,255,.5)",textAlign:"center" }}>
          <div style={{ display:"flex",justifyContent:"center",gap:20,flexWrap:"wrap",marginBottom:16 }}>
            {MODULES.map(m=><span key={m.id} style={{ fontSize:12,cursor:"pointer" }} onClick={()=>nav(m.id)}>{m.icon} {m.title}</span>)}
          </div>
          <div style={{ fontSize:11,borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:16 }}>© 2026 WargaLDII.com — Platform Ekonomi Jamaah LDII</div>
        </footer>
      </>}

      {/* ═══════════════════════════════
           MARKETPLACE
         ═══════════════════════════════ */}
      {page==="marketplace"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>🛒 Marketplace</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:22 }}>Jual beli barang & jasa dalam komunitas jamaah</p>
        {/* Filters */}
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center" }}>
          <div style={{ flex:"1 1 220px",position:"relative" }}><span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13 }}>🔍</span><input className="inp" style={{ paddingLeft:34,marginBottom:0 }} placeholder="Cari produk..." value={mSearch} onChange={e=>setMSearch(e.target.value)}/></div>
          <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>{CATEGORIES.map(c=><button key={c} className={`tab ${mCat===c?"tab-a":""}`} onClick={()=>setMCat(c)}>{c}</button>)}</div>
        </div>
        {/* Products */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
          {PRODUCTS.filter(p=>(mCat==="Semua"||p.cat===mCat)&&(p.name.toLowerCase().includes(mSearch.toLowerCase())||p.seller.toLowerCase().includes(mSearch.toLowerCase()))).map((p,i)=><div key={p.id} className="card" style={{ cursor:"pointer",animation:`fadeUp .35s ease ${i*.04}s both` }} onClick={()=>nav("marketplace",p.id)}>
            <div style={{ background:`${C.gold}08`,padding:"28px 20px",textAlign:"center",fontSize:52 }}>{p.img}</div>
            <div style={{ padding:"14px 16px" }}>
              <div className="tag" style={{ background:`${C.gold}10`,color:C.gold,marginBottom:6 }}>{p.cat}</div>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:14,marginBottom:4,lineHeight:1.3 }}>{p.name}</h4>
              <div style={{ fontFamily:"'DM Serif Display'",fontSize:18,color:C.crimson,marginBottom:6 }}>{fmt(p.price)}</div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"#bbb" }}>
                <span className="stars">{"★".repeat(Math.floor(p.rating))} {p.rating}</span>
                <span>{p.sold} terjual</span>
              </div>
              <div style={{ fontSize:11,color:"#ccc",marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"center" }}><span>🏪 {p.seller}</span><span style={{ color:"#25D366",fontWeight:700,fontSize:10 }} onClick={e=>{e.stopPropagation();alert(`Chat WA ke ${p.seller}: wa.me/628xx?text=Halo, saya tertarik dengan ${p.name}`)}}>💬 Chat</span></div>
            </div>
          </div>)}
        </div>
      </div>}

      {/* Product Detail */}
      {page==="marketplace"&&sub&&sub!=="checkout"&&(()=>{const p=PRODUCTS.find(x=>x.id===sub);if(!p)return null;return<div style={{ maxWidth:960,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("marketplace")}>← Marketplace</button>
        <div style={{ display:"flex",gap:28,flexWrap:"wrap" }} className="m-col">
          <div style={{ flex:"1 1 300px",background:`${C.gold}06`,borderRadius:18,padding:"48px 32px",textAlign:"center",fontSize:100 }}>{p.img}</div>
          <div style={{ flex:"1 1 340px" }}>
            <div className="tag" style={{ background:`${C.gold}10`,color:C.gold,marginBottom:10 }}>{p.cat}</div>
            <h1 style={{ fontFamily:"'DM Serif Display'",fontSize:28,marginBottom:6 }}>{p.name}</h1>
            <div className="stars" style={{ marginBottom:8 }}>{"★".repeat(Math.floor(p.rating))} {p.rating} · {p.sold} terjual</div>
            <div style={{ fontFamily:"'DM Serif Display'",fontSize:32,color:C.crimson,marginBottom:14 }}>{fmt(p.price)}</div>
            <p style={{ fontSize:13.5,color:"#777",lineHeight:1.7,marginBottom:18 }}>{p.desc}</p>
            <div style={{ display:"flex",gap:12,alignItems:"center",marginBottom:18,padding:"12px 16px",background:"#faf8f5",borderRadius:12 }}>
              <span style={{ fontSize:24 }}>🏪</span>
              <div><div style={{ fontWeight:700,fontSize:13.5 }}>{p.seller}</div><div style={{ fontSize:11.5,color:"#aaa" }}>📍 {p.city} · Stok: {p.stock}</div></div>
            </div>
            <div style={{ display:"flex",gap:10 }}>
              <button className="btn bp" style={{ flex:1 }} onClick={()=>{addCart(p);setCartOpen(true)}}>🛒 Tambah ke Keranjang</button>
              <button className="btn bo" onClick={()=>{addCart(p);nav("checkout")}}>Beli Langsung</button>
            </div>
            <button className="btn" style={{ width:"100%",marginTop:10,background:"#25D366",color:"white",padding:"12px 24px",fontSize:14 }} onClick={()=>alert(`Chat WA ke ${p.seller} akan dibuka: wa.me/6281200000000?text=Halo, saya tertarik dengan ${p.name}`)}>💬 Chat WhatsApp Seller</button>
          </div>
        </div>
        {/* Reviews */}
        <div style={{ marginTop:32 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Ulasan ({p.reviews.length})</h3>
          {p.reviews.map((r,i)=><div key={i} className="card" style={{ padding:16,marginBottom:10 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
              <span style={{ fontWeight:700,fontSize:13 }}>👤 {r.user}</span>
              <span className="stars">{"★".repeat(r.r)}</span>
            </div>
            <p style={{ fontSize:13,color:"#777" }}>{r.text}</p>
          </div>)}
        </div>
      </div>})()}

      {/* Checkout */}
      {page==="checkout"&&<div style={{ maxWidth:640,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("marketplace")}>← Marketplace</button>
        <h1 className="hlg" style={{ marginBottom:20 }}>Checkout</h1>
        {cart.length===0?<div style={{ textAlign:"center",padding:48,color:"#ccc" }}><div style={{ fontSize:48 }}>🛒</div><p style={{ marginTop:10 }}>Keranjang kosong</p><button className="btn bp" style={{ marginTop:16 }} onClick={()=>nav("marketplace")}>Belanja Sekarang</button></div>:<>
          {cart.map(x=><div key={x.id} className="card" style={{ padding:16,marginBottom:10,display:"flex",gap:14,alignItems:"center" }}>
            <span style={{ fontSize:36 }}>{x.img}</span>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:14 }}>{x.name}</div><div style={{ fontSize:12,color:"#999" }}>Qty: {x.qty} × {fmt(x.price)}</div></div>
            <div style={{ fontWeight:800,fontSize:15,color:C.crimson }}>{fmt(x.price*x.qty)}</div>
          </div>)}
          <div className="card" style={{ padding:20,marginTop:16 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Alamat Pengiriman</h3>
            <input className="inp" placeholder="Nama Penerima"/>
            <input className="inp" placeholder="No. WhatsApp"/>
            <textarea className="inp" placeholder="Alamat lengkap..." style={{ minHeight:60,resize:"vertical" }}/>
            <div style={{ display:"flex",justifyContent:"space-between",marginTop:10,marginBottom:8 }}><span style={{ fontWeight:700 }}>Subtotal</span><span style={{ fontWeight:800,color:C.crimson }}>{fmt(cartTotal)}</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:14 }}><span style={{ fontWeight:700 }}>Ongkir</span><span style={{ color:C.emerald,fontWeight:700 }}>Gratis</span></div>
            <div style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`2px solid ${C.crimson}20` }}><span style={{ fontWeight:800,fontSize:16 }}>Total</span><span style={{ fontWeight:900,fontSize:20,fontFamily:"'DM Serif Display'",color:C.crimson }}>{fmt(cartTotal)}</span></div>
            <button className="btn bp" style={{ width:"100%",marginTop:8 }} onClick={()=>{const sellers=[...new Set(cart.map(x=>x.seller))];setCart([]);alert(`Pesanan berhasil!\n\nNotifikasi WhatsApp akan dikirim ke:\n${sellers.map(s=>`• ${s}`).join("\n")}\n\nSilakan cek WhatsApp untuk konfirmasi.`)}}>Bayar & Pesan via WhatsApp →</button>
            <p style={{ textAlign:"center",fontSize:11,color:"#aaa",marginTop:8 }}>💬 Seller akan dihubungi otomatis via WhatsApp untuk konfirmasi pesanan</p>
          </div>
        </>}
      </div>}

      {/* ═══════════════════════════════
           E-LEARNING
         ═══════════════════════════════ */}
      {page==="elearning"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>📚 E-Learning</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:22 }}>Kursus softskill, hardskill & how-to dengan sertifikat digital</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
          {COURSES.map((c,i)=><div key={c.id} className="card" style={{ cursor:"pointer",animation:`fadeUp .35s ease ${i*.06}s both` }} onClick={()=>nav("elearning",c.id)}>
            <div style={{ background:`${C.crimson}06`,padding:"28px 20px",textAlign:"center",fontSize:52 }}>{c.img}</div>
            <div style={{ padding:"16px 18px" }}>
              <div className="tag" style={{ background:`${C.crimson}10`,color:C.crimson,marginBottom:8 }}>{c.level}</div>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:15,marginBottom:6,lineHeight:1.3 }}>{c.title}</h4>
              <div style={{ fontSize:12,color:"#999",marginBottom:8 }}>👨‍🏫 {c.instructor} · ⏱ {c.duration}</div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11.5 }}>
                <span className="stars">{"★".repeat(Math.floor(c.rating))} {c.rating}</span>
                <span style={{ color:"#bbb" }}>{c.students} siswa</span>
              </div>
              <div style={{ marginTop:10,fontWeight:700,fontSize:13,color:C.crimson }}>Mulai Belajar →</div>
              {(()=>{const done=(completedLessons[c.id]||[]).length;const total=c.modules.length+1;const pct=Math.round(done/total*100);return done>0?<div style={{ marginTop:8 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,marginBottom:3 }}><span style={{ color:"#999" }}>Progress</span><span style={{ fontWeight:700,color:pct===100?C.emerald:C.crimson }}>{pct}%</span></div>
                <div className="prog" style={{ height:5 }}><div className="prog-fill" style={{ width:`${pct}%`,background:pct===100?C.emerald:C.crimson }}/></div>
              </div>:null})()}
            </div>
          </div>)}
        </div>
      </div>}

      {/* Course Detail */}
      {page==="elearning"&&sub&&(()=>{const c=COURSES.find(x=>x.id===sub);if(!c)return null;
        const quizScore = c.quiz ? Object.keys(quizAnswers).filter(k=>quizAnswers[k]===c.quiz[k].answer).length : 0;
        return<div style={{ maxWidth:960,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("elearning")}>← Kursus</button>
        <div style={{ display:"flex",gap:24,flexWrap:"wrap" }} className="m-col">
          {/* Sidebar */}
          <div style={{ flex:"0 0 260px",minWidth:240 }}>
            <div className="card" style={{ padding:18,marginBottom:14 }}>
              <div style={{ textAlign:"center",fontSize:48,marginBottom:8 }}>{c.img}</div>
              <h3 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:16,marginBottom:6 }}>{c.title}</h3>
              <div style={{ fontSize:12,color:"#999",marginBottom:10 }}>👨‍🏫 {c.instructor}<br/>⏱ {c.duration} · 📊 {c.level}</div>
              {/* Progress bar */}
              {(()=>{const done=(completedLessons[c.id]||[]).length;const total=c.modules.length+1;const pct=Math.round(done/total*100);return<div style={{ marginBottom:12 }}>
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4 }}><span style={{ fontWeight:700,color:"#666" }}>Progress</span><span style={{ fontWeight:800,color:pct===100?C.emerald:C.crimson }}>{pct}%</span></div>
                <div className="prog"><div className="prog-fill" style={{ width:`${pct}%`,background:pct===100?C.emerald:C.crimson }}/></div>
                <div style={{ fontSize:10.5,color:"#bbb",marginTop:3 }}>{done}/{total} selesai</div>
              </div>})()}
              <div style={{ borderTop:"1px solid #f0ece6",paddingTop:12 }}>
                <div style={{ fontSize:11.5,fontWeight:700,color:"#777",marginBottom:8 }}>Materi ({c.modules.length})</div>
                {c.modules.map((m,i)=>{const isDone=(completedLessons[c.id]||[]).includes(`m${i}`);return<div key={i} onClick={()=>{setActiveLesson(i);setQuizStarted(false);setQuizDone(false)}} style={{ padding:"8px 10px",borderRadius:8,marginBottom:4,cursor:"pointer",fontSize:12.5,fontWeight:activeLesson===i&&!quizStarted?700:500,background:activeLesson===i&&!quizStarted?`${C.crimson}10`:"transparent",color:activeLesson===i&&!quizStarted?C.crimson:isDone?C.emerald:"#777",display:"flex",gap:6,alignItems:"center" }}>
                  <span>{isDone?"✅":m.type==="video"?"🎬":"📄"}</span>{m.title}
                </div>})}
                <div onClick={()=>{setQuizStarted(true);setQuizDone(false);setQuizAnswers({})}} style={{ padding:"8px 10px",borderRadius:8,marginTop:4,cursor:"pointer",fontSize:12.5,fontWeight:quizStarted?700:500,background:quizStarted?`${C.emerald}10`:"transparent",color:quizStarted?C.emerald:(completedLessons[c.id]||[]).includes("quiz")?C.emerald:"#777",display:"flex",gap:6,alignItems:"center" }}>{(completedLessons[c.id]||[]).includes("quiz")?"✅":"📝"} Quiz ({c.quiz.length} soal)</div>
              </div>
            </div>
          </div>
          {/* Content */}
          <div style={{ flex:1,minWidth:0 }}>
            {!quizStarted?<div className="card" style={{ padding:24 }}>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
                <span style={{ fontSize:24 }}>{c.modules[activeLesson].type==="video"?"🎬":"📄"}</span>
                <div><h3 className="hmd">{c.modules[activeLesson].title}</h3><div style={{ fontSize:12,color:"#aaa" }}>{c.modules[activeLesson].type==="video"?"Video":"Artikel"} · {c.modules[activeLesson].duration}</div></div>
              </div>
              {c.modules[activeLesson].type==="video"&&<div style={{ background:"#1a1a2e",borderRadius:14,padding:"48px 20px",textAlign:"center",marginBottom:16 }}>
                <div style={{ width:64,height:64,borderRadius:50,background:"rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,cursor:"pointer" }}>▶</div>
                <div style={{ color:"rgba(255,255,255,.5)",fontSize:12,marginTop:10 }}>Klik untuk memutar video</div>
              </div>}
              <div style={{ fontSize:14,lineHeight:1.8,color:"#555" }}>{c.modules[activeLesson].content}</div>
              {/* Mark complete + navigation */}
              {!(completedLessons[c.id]||[]).includes(`m${activeLesson}`)&&<button className="btn" style={{ width:"100%",marginTop:16,background:C.emerald,color:"white",padding:"12px 20px",fontSize:13 }} onClick={()=>setCompletedLessons(p=>({...p,[c.id]:[...(p[c.id]||[]),`m${activeLesson}`]}))}>✅ Tandai Selesai</button>}
              {(completedLessons[c.id]||[]).includes(`m${activeLesson}`)&&<div style={{ marginTop:16,padding:"10px 14px",borderRadius:10,background:"#E8F5E9",color:"#2E7D32",fontSize:13,fontWeight:700,textAlign:"center" }}>✅ Materi ini sudah diselesaikan</div>}
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:16 }}>
                <button className="btn bo bs" disabled={activeLesson===0} onClick={()=>setActiveLesson(p=>p-1)} style={{ opacity:activeLesson===0?.4:1 }}>← Sebelumnya</button>
                {activeLesson<c.modules.length-1?<button className="btn bp bs" onClick={()=>setActiveLesson(p=>p+1)}>Selanjutnya →</button>
                :<button className="btn bp bs" style={{ background:C.emerald }} onClick={()=>{setQuizStarted(true);setQuizDone(false);setQuizAnswers({})}}>Mulai Quiz →</button>}
              </div>
            </div>
            :<div className="card" style={{ padding:24 }}>
              {!quizDone?<>
                <h3 className="hmd" style={{ marginBottom:4 }}>📝 Quiz: {c.title}</h3>
                <p style={{ fontSize:12.5,color:"#999",marginBottom:18 }}>{c.quiz.length} soal pilihan ganda</p>
                {c.quiz.map((q,qi)=><div key={qi} style={{ marginBottom:18,padding:16,background:"#faf8f5",borderRadius:12 }}>
                  <div style={{ fontWeight:700,fontSize:13.5,marginBottom:10 }}>{qi+1}. {q.q}</div>
                  {q.options.map((o,oi)=><div key={oi} onClick={()=>setQuizAnswers(p=>({...p,[qi]:oi}))} style={{ padding:"10px 14px",borderRadius:8,marginBottom:5,cursor:"pointer",border:`2px solid ${quizAnswers[qi]===oi?C.crimson:"#eee"}`,background:quizAnswers[qi]===oi?`${C.crimson}08`:"white",fontSize:13,fontWeight:quizAnswers[qi]===oi?700:500,color:quizAnswers[qi]===oi?C.crimson:"#666",transition:"all .2s" }}>
                    {String.fromCharCode(65+oi)}. {o}
                  </div>)}
                </div>)}
                <button className="btn bp" style={{ width:"100%", opacity:Object.keys(quizAnswers).length<c.quiz.length?.5:1 }} onClick={()=>{setQuizDone(true);const score=Object.keys(quizAnswers).filter(k=>quizAnswers[k]===c.quiz[k].answer).length;if(score>=c.quiz.length*0.7)setCompletedLessons(p=>({...p,[c.id]:[...(p[c.id]||[]).filter(x=>x!=="quiz"),"quiz"]}))}} disabled={Object.keys(quizAnswers).length<c.quiz.length}>Selesai & Lihat Hasil</button>
              </>:<div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ fontSize:56,marginBottom:10 }}>{quizScore>=c.quiz.length*0.7?"🏆":"📋"}</div>
                <h3 className="hlg">Skor Anda: {quizScore}/{c.quiz.length}</h3>
                <div style={{ fontSize:14,color:quizScore>=c.quiz.length*0.7?C.emerald:C.copper,fontWeight:700,marginTop:6,marginBottom:16 }}>{quizScore>=c.quiz.length*0.7?"Selamat! Anda lulus!":"Belum lulus, coba lagi."}</div>
                {quizScore>=c.quiz.length*0.7&&<div className="card" style={{ padding:24,background:`linear-gradient(135deg,${C.dark},${C.crimson})`,color:"white",marginBottom:16 }}>
                  <div style={{ fontSize:28,marginBottom:6 }}>🏅</div>
                  <div style={{ fontFamily:"'DM Serif Display'",fontSize:18 }}>Sertifikat Digital</div>
                  <div style={{ fontSize:13,opacity:.8,marginTop:4 }}>{c.title}</div>
                  <div style={{ fontSize:12,opacity:.6,marginTop:2 }}>Pengajar: {c.instructor} · {new Date().toLocaleDateString("id-ID")}</div>
                  <div style={{ fontSize:11,opacity:.4,marginTop:6 }}>ID: CERT-{Date.now().toString(36).toUpperCase()}</div>
                </div>}
                <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
                  <button className="btn bo bs" onClick={()=>{setQuizStarted(false);setQuizDone(false);setQuizAnswers({})}}>Ulangi Quiz</button>
                  <button className="btn bp bs" onClick={()=>nav("elearning")}>Kursus Lainnya</button>
                </div>
              </div>}
            </div>}
          </div>
        </div>
      </div>})()}

      {/* ═══════════════════════════════
           HIBAH BARKAS
         ═══════════════════════════════ */}
      {page==="hibah"&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>🎁 Hibah Barkas</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:22 }}>Berbagi barang layak pakai untuk sesama jamaah</p>
        <div style={{ display:"flex",gap:10,marginBottom:20 }}>
          <button className="btn bp bs" onClick={()=>setHibahGive(true)}>🎁 Beri Hibah</button>
          <button className="btn bo bs">📋 Pengajuan Saya</button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
          {HIBAH_ITEMS.map((h,i)=><div key={h.id} className="card" style={{ padding:0,animation:`fadeUp .35s ease ${i*.05}s both` }}>
            <div style={{ background:`${C.copper}06`,padding:"28px 20px",textAlign:"center",fontSize:52,position:"relative" }}>
              {h.img}
              <span className="tag" style={{ position:"absolute",top:12,right:12,background:h.status==="available"?"#E8F5E9":"#FFF3E0",color:h.status==="available"?"#2E7D32":"#E65100" }}>{h.status==="available"?"Tersedia":"Sudah Diklaim"}</span>
            </div>
            <div style={{ padding:"14px 18px" }}>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:14,marginBottom:4 }}>{h.name}</h4>
              <div style={{ fontSize:12,color:"#999",marginBottom:6 }}>📦 Kondisi: {h.condition}</div>
              <p style={{ fontSize:12.5,color:"#777",lineHeight:1.5,marginBottom:10 }}>{h.desc}</p>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:12,color:"#bbb",marginBottom:10 }}>
                <span>🤲 {h.donor} · 📍 {h.city}</span>
                <span>{h.requests} pengaju</span>
              </div>
              {h.status==="available"?
                (hibahSent.includes(h.id)?<div style={{ padding:"10px 14px",borderRadius:10,background:"#E8F5E9",color:"#2E7D32",fontSize:12.5,fontWeight:700,textAlign:"center" }}>✅ Pengajuan terkirim!</div>
                :<button className="btn bp bs" style={{ width:"100%" }} onClick={()=>setHibahReq(h.id)}>Ajukan Hibah Ini</button>)
                :<div style={{ padding:"10px 14px",borderRadius:10,background:"#FFF3E0",color:"#E65100",fontSize:12.5,fontWeight:700,textAlign:"center" }}>Diklaim oleh {h.claimedBy}</div>}
            </div>
          </div>)}
        </div>
      </div>}

      {/* ═══════════════════════════════
           INVESTASI
         ═══════════════════════════════ */}
      {page==="investasi"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>📈 Investasi Syariah</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:16 }}>Investasi ke usaha jamaah, bagi hasil, tanpa riba</p>
        {/* Tabs */}
        <div style={{ display:"flex",gap:4,marginBottom:20 }}>
          <button className={`tab ${investTab==="explore"?"tab-a":""}`} onClick={()=>setInvestTab("explore")}>🔍 Jelajahi Investasi</button>
          <button className={`tab ${investTab==="portfolio"?"tab-a":""}`} onClick={()=>setInvestTab("portfolio")}>💼 Portfolio Saya</button>
        </div>
        {investTab==="explore"&&<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16 }}>
          {INVEST_COMPANIES.map((c,i)=><div key={c.id} className="card" style={{ padding:22,animation:`fadeUp .35s ease ${i*.06}s both` }}>
            <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:14 }}>
              <div style={{ width:48,height:48,background:`${C.royal}08`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24 }}>{c.img}</div>
              <div><h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{c.name}</h4><div style={{ fontSize:11.5,color:"#aaa" }}>{c.sector} · 📍 {c.city}</div></div>
              <div style={{ marginLeft:"auto" }}><span className="stars">★ {c.rating}</span></div>
            </div>
            <p style={{ fontSize:12.5,color:"#777",lineHeight:1.5,marginBottom:12 }}>{c.desc}</p>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12 }}>
              <div style={{ background:`${C.royal}06`,borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
                <div style={{ fontWeight:800,fontSize:15,color:C.royal }}>{c.returnRate}</div><div style={{ fontSize:10,color:"#aaa" }}>Return/tahun</div>
              </div>
              <div style={{ background:`${C.emerald}06`,borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
                <div style={{ fontWeight:800,fontSize:15,color:C.emerald }}>{c.akad}</div><div style={{ fontSize:10,color:"#aaa" }}>Akad</div>
              </div>
            </div>
            {/* Funding progress */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11.5,marginBottom:4 }}>
                <span style={{ fontWeight:700 }}>Rp {c.raisedFund} Jt / Rp {c.targetFund} Jt</span>
                <span style={{ color:C.royal,fontWeight:700 }}>{Math.round(c.raisedFund/c.targetFund*100)}%</span>
              </div>
              <div className="prog"><div className="prog-fill" style={{ width:`${c.raisedFund/c.targetFund*100}%`,background:C.royal }}/></div>
              <div style={{ fontSize:10.5,color:"#bbb",marginTop:3 }}>{c.investors} investor · {c.period}</div>
            </div>
            {c.openForInvestment?<button className="btn bp bs" style={{ width:"100%" }} onClick={()=>nav("investasi",c.id)}>Lihat Detail & Investasi →</button>
            :<div style={{ padding:"10px 14px",borderRadius:10,background:"#f5f3ef",color:"#999",fontSize:12.5,fontWeight:700,textAlign:"center" }}>Pendanaan Tercapai ✅</div>}
          </div>)}
        </div>}
        {/* Portfolio Tab */}
        {investTab==="portfolio"&&<div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12,marginBottom:20 }}>
            <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.royal }}>Rp 90 Jt</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Total Investasi</div></div>
            <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.emerald }}>Rp 5.56 Jt</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Total Dividen</div></div>
            <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.gold }}>3</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Investasi</div></div>
            <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.crimson }}>16.2%</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Avg Return</div></div>
          </div>
          {myInvestments.map((inv,i)=><div key={i} className="card" style={{ padding:20,marginBottom:12,animation:`fadeUp .3s ease ${i*.06}s both` }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12 }}>
              <div><h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{inv.company}</h4><div style={{ fontSize:12,color:"#aaa",marginTop:2 }}>{inv.sector} · Investasi sejak {inv.date}</div></div>
              <span className="tag" style={{ background:inv.status==="Aktif"?"#E8F5E9":"#f5f3ef",color:inv.status==="Aktif"?"#2E7D32":"#999" }}>{inv.status}</span>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:12 }}>
              <div style={{ background:`${C.royal}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Jumlah</div><div style={{ fontWeight:800,color:C.royal }}>Rp {inv.amount} Jt</div></div>
              <div style={{ background:`${C.emerald}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Return</div><div style={{ fontWeight:800,color:C.emerald }}>{inv.returnRate}</div></div>
              <div style={{ background:`${C.gold}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Dividen</div><div style={{ fontWeight:800,color:C.gold }}>{inv.earned}</div></div>
              <div style={{ background:"#f5f3ef",borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Dividen Berikut</div><div style={{ fontWeight:700,fontSize:12 }}>{inv.nextDiv}</div></div>
            </div>
            {inv.status==="Aktif"&&<div style={{ display:"flex",gap:8 }}>
              <button className="btn bo bs" style={{ flex:1 }}>📊 Laporan</button>
              <button className="btn bp bs" style={{ flex:1 }}>⭐ Rating Kinerja</button>
            </div>}
          </div>)}
        </div>}
      </div>}

      {/* Investasi Detail */}
      {page==="investasi"&&sub&&(()=>{const c=INVEST_COMPANIES.find(x=>x.id===sub);if(!c)return null;return<div style={{ maxWidth:720,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("investasi")}>← Investasi</button>
        <div className="card" style={{ padding:24,marginBottom:18 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:16 }}>
            <div style={{ width:56,height:56,background:`${C.royal}08`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>{c.img}</div>
            <div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:24 }}>{c.name}</h2><div style={{ fontSize:12.5,color:"#aaa" }}>{c.sector} · {c.city} · ★ {c.rating}</div></div>
          </div>
          <p style={{ fontSize:13.5,color:"#666",lineHeight:1.7,marginBottom:18 }}>{c.desc}</p>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18 }}>
            {Object.entries(c.financials).map(([k,v])=><div key={k} style={{ background:`${C.royal}06`,borderRadius:10,padding:"12px 14px",textAlign:"center" }}>
              <div style={{ fontWeight:800,fontSize:15,color:C.royal }}>{v}</div><div style={{ fontSize:10,color:"#aaa",textTransform:"capitalize" }}>{k}</div>
            </div>)}
          </div>
          {/* Funding bar */}
          <div style={{ marginBottom:18 }}>
            <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4 }}><span style={{ fontWeight:700 }}>Rp {c.raisedFund} Jt / Rp {c.targetFund} Jt</span><span style={{ color:C.royal,fontWeight:700 }}>{Math.round(c.raisedFund/c.targetFund*100)}%</span></div>
            <div className="prog" style={{ height:10 }}><div className="prog-fill" style={{ width:`${c.raisedFund/c.targetFund*100}%`,background:C.royal }}/></div>
          </div>
        </div>
        {c.openForInvestment&&<div className="card" style={{ padding:24 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Investasikan Dana Anda</h3>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><label style={{ fontSize:13,fontWeight:700,color:"#666" }}>Jumlah Investasi</label><span style={{ fontFamily:"'DM Serif Display'",fontSize:18,color:C.royal }}>Rp {investAmount} Juta</span></div>
          <input type="range" className="sld" min="5" max="100" value={investAmount} onChange={e=>setInvestAmount(+e.target.value)}/>
          <div style={{ display:"flex",justifyContent:"space-between",fontSize:10,color:"#ddd",marginTop:3 }}><span>Rp 5 Jt</span><span>Rp 100 Jt</span></div>
          <div style={{ background:`${C.royal}06`,borderRadius:12,padding:16,marginTop:14,marginBottom:14 }}>
            <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10 }}>
              <div><div style={{ fontSize:10.5,color:"#999" }}>Estimasi Return</div><div style={{ fontWeight:800,color:C.royal }}>Rp {(investAmount*0.16).toFixed(1)} Jt/thn</div></div>
              <div><div style={{ fontSize:10.5,color:"#999" }}>Akad</div><div style={{ fontWeight:800,color:C.emerald }}>{c.akad}</div></div>
              <div><div style={{ fontSize:10.5,color:"#999" }}>Periode</div><div style={{ fontWeight:700 }}>{c.period}</div></div>
              <div><div style={{ fontSize:10.5,color:"#999" }}>Bagi Hasil</div><div style={{ fontWeight:700 }}>{c.returnRate}</div></div>
            </div>
          </div>
          <button className="btn bp" style={{ width:"100%" }} onClick={()=>alert(`Pengajuan investasi Rp ${investAmount} Jt ke ${c.name} berhasil dikirim!`)}>Ajukan Investasi →</button>
        </div>}
      </div>})()}

      {/* ═══════════════════════════════
           LOWONGAN KERJA
         ═══════════════════════════════ */}
      {page==="loker"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>💼 Lowongan Kerja</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:16 }}>Temukan peluang kerja di lingkungan jamaah</p>
        {/* Search + filters */}
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16,alignItems:"center" }}>
          <div style={{ flex:"1 1 200px",position:"relative" }}><span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13 }}>🔍</span><input className="inp" style={{ paddingLeft:34,marginBottom:0 }} placeholder="Cari posisi atau perusahaan..." value={lokerSearch} onChange={e=>setLokerSearch(e.target.value)}/></div>
          <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>
            {["Semua","Full-time","Part-time","Freelance"].map(t=><button key={t} className={`tab ${lokerType===t?"tab-a":""}`} onClick={()=>setLokerType(t)}>{t}</button>)}
          </div>
          <select className="sel" style={{ width:"auto",minWidth:120,marginBottom:0,padding:"9px 14px",fontSize:12.5 }} value={lokerCity} onChange={e=>setLokerCity(e.target.value)}>
            <option value="Semua">📍 Semua Kota</option>
            {[...new Set(JOBS.map(j=>j.city))].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ fontSize:12,color:"#bbb",marginBottom:12,fontWeight:600 }}>{JOBS.filter(j=>(lokerType==="Semua"||j.type===lokerType)&&(lokerCity==="Semua"||j.city===lokerCity)&&(j.title.toLowerCase().includes(lokerSearch.toLowerCase())||j.company.toLowerCase().includes(lokerSearch.toLowerCase()))).length} lowongan ditemukan</div>
        <div style={{ display:"grid",gap:12 }}>
          {JOBS.filter(j=>(lokerType==="Semua"||j.type===lokerType)&&(lokerCity==="Semua"||j.city===lokerCity)&&(j.title.toLowerCase().includes(lokerSearch.toLowerCase())||j.company.toLowerCase().includes(lokerSearch.toLowerCase()))).map((j,i)=><div key={j.id} className="card" style={{ padding:20,display:"flex",gap:16,alignItems:"flex-start",cursor:"pointer",animation:`fadeUp .35s ease ${i*.05}s both` }} onClick={()=>nav("loker",j.id)}>
            <div style={{ width:50,height:50,background:`${C.emerald}08`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>{j.img}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6 }}>
                <h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{j.title}</h4>
                <span className="tag" style={{ background:`${C.emerald}10`,color:C.emerald }}>{j.type}</span>
              </div>
              <div style={{ fontSize:12.5,color:"#999",marginTop:3 }}>🏢 {j.company} · 📍 {j.city}</div>
              <div style={{ fontSize:13.5,fontWeight:800,color:C.emerald,marginTop:6 }}>{j.salary}</div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:11.5,color:"#ccc",marginTop:6 }}><span>{j.applicants} pelamar</span><span>{j.posted}</span></div>
            </div>
          </div>)}
        </div>
      </div>}

      {/* Job Detail */}
      {page==="loker"&&sub&&(()=>{const j=JOBS.find(x=>x.id===sub);if(!j)return null;return<div style={{ maxWidth:720,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("loker")}>← Lowongan</button>
        <div className="card" style={{ padding:24,marginBottom:18 }}>
          <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
            <div style={{ width:56,height:56,background:`${C.emerald}08`,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28 }}>{j.img}</div>
            <div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>{j.title}</h2><div style={{ fontSize:12.5,color:"#aaa" }}>{j.company} · {j.city} · {j.type}</div></div>
          </div>
          <div style={{ fontFamily:"'DM Serif Display'",fontSize:24,color:C.emerald,marginBottom:14 }}>{j.salary}</div>
          <p style={{ fontSize:14,color:"#666",lineHeight:1.7,marginBottom:18 }}>{j.desc}</p>
          <h3 style={{ fontWeight:700,fontSize:14,marginBottom:10 }}>Persyaratan:</h3>
          {j.requirements.map((r,i)=><div key={i} style={{ fontSize:13,color:"#777",padding:"6px 0",display:"flex",gap:8 }}><span style={{ color:C.emerald }}>✓</span>{r}</div>)}
          <div style={{ fontSize:12,color:"#bbb",marginTop:14 }}>{j.applicants} pelamar · Diposting {j.posted}</div>
        </div>
        <div className="card" style={{ padding:24 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Lamar Posisi Ini</h3>
          <input className="inp" placeholder="Nama Lengkap"/>
          <input className="inp" placeholder="Email"/>
          <input className="inp" placeholder="No. WhatsApp"/>
          <div style={{ padding:"16px 18px",borderRadius:10,border:"2px dashed #ddd",textAlign:"center",color:"#bbb",fontSize:13,marginBottom:10,cursor:"pointer" }}>📄 Upload CV (PDF/DOC) — klik untuk pilih file</div>
          <textarea className="inp" placeholder="Ceritakan pengalaman dan motivasi Anda..." style={{ minHeight:70,resize:"vertical" }}/>
          <button className="btn bp" style={{ width:"100%" }} onClick={()=>alert(`Lamaran untuk posisi ${j.title} di ${j.company} berhasil dikirim!`)}>Kirim Lamaran →</button>
        </div>
      </div>})()}

      {/* ═══════════════════════════════
           BMT SYARIAH
         ═══════════════════════════════ */}
      {page==="bmt"&&<div style={{ maxWidth:940,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <span className="lab">Pembiayaan Syariah</span>
          <h1 className="hlg" style={{ marginTop:6 }}>🏦 BMT Syariah</h1>
          <p style={{ color:"#aaa",fontSize:13,marginTop:4 }}>Simulasi & ajukan pembiayaan tanpa riba</p>
        </div>
        {/* Tabs */}
        <div style={{ display:"flex",gap:4,justifyContent:"center",marginBottom:24 }}>
          <button className={`tab ${bmtTab==="kalkulator"?"tab-a":""}`} onClick={()=>setBmtTab("kalkulator")}>🧮 Kalkulator & Pengajuan</button>
          <button className={`tab ${bmtTab==="riwayat"?"tab-a":""}`} onClick={()=>setBmtTab("riwayat")}>📋 Riwayat Pembiayaan ({bmtHistory.length})</button>
        </div>
        {bmtTab==="kalkulator"&&<div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="m-grid1">
          <div className="card" style={{ padding:24 }}>
            <h3 className="hmd" style={{ marginBottom:16 }}>Kalkulator Pembiayaan</h3>
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              {[{v:"produktif",l:"🏭 Produktif",d:"1.2%/bln"},{v:"konsumtif",l:"🛍️ Konsumtif",d:"1.5%/bln"}].map(t=><div key={t.v} onClick={()=>setBmtType(t.v)} style={{ flex:1,padding:"12px",borderRadius:12,border:`2px solid ${bmtType===t.v?C.plum:"#eee"}`,background:bmtType===t.v?`${C.plum}06`:"white",cursor:"pointer",textAlign:"center" }}>
                <div style={{ fontWeight:700,fontSize:13,color:bmtType===t.v?C.plum:"#666" }}>{t.l}</div>
                <div style={{ fontSize:10.5,color:"#bbb" }}>{t.d}</div>
              </div>)}
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><label style={{ fontSize:12.5,fontWeight:700,color:"#666" }}>Jumlah</label><span style={{ fontFamily:"'DM Serif Display'",fontSize:17,color:C.plum }}>Rp {bmtAmt} Jt</span></div>
              <input type="range" className="sld" min="5" max="500" value={bmtAmt} onChange={e=>setBmtAmt(+e.target.value)}/>
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><label style={{ fontSize:12.5,fontWeight:700,color:"#666" }}>Tenor</label><span style={{ fontFamily:"'DM Serif Display'",fontSize:17,color:C.plum }}>{bmtTenor} Bulan</span></div>
              <input type="range" className="sld" min="3" max="60" value={bmtTenor} onChange={e=>setBmtTenor(+e.target.value)}/>
            </div>
            <div style={{ background:`${C.plum}06`,borderRadius:12,padding:14,border:`1px solid ${C.plum}12` }}>
              <div style={{ fontSize:11.5,color:"#999" }}>Akad: {bmtType==="produktif"?"Murabahah/Musyarakah":"Murabahah"}</div>
            </div>
          </div>
          <div>
            <div className="card" style={{ padding:24,marginBottom:14,background:`linear-gradient(135deg,${C.plum},${C.plum}DD)`,color:"white" }}>
              <h3 style={{ fontSize:13,fontWeight:700,opacity:.75,marginBottom:12 }}>Ringkasan</h3>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div><div style={{ fontSize:10,opacity:.6 }}>Pokok</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {bmtAmt} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Margin Total</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {(bmtTotal-bmtAmt).toFixed(1)} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Total Bayar</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {bmtTotal.toFixed(1)} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Cicilan/Bln</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20,color:C.gold }}>Rp {bmtMonthly.toFixed(1)} Jt</div></div>
              </div>
            </div>
            <div className="card" style={{ padding:20 }}>
              <h3 style={{ fontSize:13,fontWeight:700,color:"#666",marginBottom:10 }}>Sisa Pembiayaan</h3>
              <ResponsiveContainer width="100%" height={140}>
                <AreaChart data={Array.from({length:bmtTenor},(_,i)=>({b:`${i+1}`,s:Math.max(0,+(bmtTotal-bmtMonthly*(i+1)).toFixed(1))}))}>
                  <defs><linearGradient id="gB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.plum} stopOpacity={0.2}/><stop offset="95%" stopColor={C.plum} stopOpacity={0}/></linearGradient></defs>
                  <XAxis dataKey="b" axisLine={false} tickLine={false} style={{ fontSize:8 }} interval={Math.max(0,Math.floor(bmtTenor/6)-1)}/>
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize:9 }}/>
                  <Tooltip contentStyle={{ borderRadius:8,border:"none",fontSize:11 }}/>
                  <Area type="monotone" dataKey="s" stroke={C.plum} strokeWidth={2} fill="url(#gB)" name="Sisa (Jt)"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            {!bmtSubmitted?<button className="btn bp" style={{ width:"100%",marginTop:14 }} onClick={()=>setBmtSubmitted(true)}>Ajukan Pembiayaan →</button>
            :<div style={{ marginTop:14 }}>
              <div className="card" style={{ padding:20 }}>
                <h3 className="hmd" style={{ marginBottom:12 }}>Form Pengajuan</h3>
                <input className="inp" placeholder="Nama Lengkap"/>
                <input className="inp" placeholder="No. KTP"/>
                <input className="inp" placeholder="Alamat"/>
                <input className="inp" placeholder="No. WhatsApp"/>
                <textarea className="inp" placeholder="Tujuan pembiayaan..." style={{ minHeight:60,resize:"vertical" }}/>
                <div style={{ padding:"14px",borderRadius:10,border:"2px dashed #ddd",textAlign:"center",color:"#bbb",fontSize:12.5,marginBottom:10,cursor:"pointer" }}>📄 Upload KTP & dokumen pendukung</div>
                <button className="btn bp" style={{ width:"100%" }} onClick={()=>{
                  setBmtHistory(p=>[{id:Date.now(),date:new Date().toLocaleDateString("id-ID"),amount:bmtAmt,tenor:bmtTenor,type:bmtType,status:"Menunggu",paid:0,monthly:+(bmtMonthly.toFixed(2))},...p]);
                  setBmtSubmitted(false);setBmtTab("riwayat");alert("Pengajuan pembiayaan berhasil dikirim ke BMT!")
                }}>Kirim Pengajuan</button>
              </div>
            </div>}
          </div>
        </div>}
        {/* Riwayat Tab */}
        {bmtTab==="riwayat"&&<div>
          {bmtHistory.length===0?<div style={{ textAlign:"center",padding:48,color:"#ccc" }}><div style={{ fontSize:48 }}>📋</div><p style={{ marginTop:10 }}>Belum ada riwayat pembiayaan</p><button className="btn bp" style={{ marginTop:16 }} onClick={()=>setBmtTab("kalkulator")}>Ajukan Pembiayaan</button></div>
          :<>
            {/* Summary */}
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:12,marginBottom:20 }}>
              <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.plum }}>{bmtHistory.length}</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Total Pengajuan</div></div>
              <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.emerald }}>{bmtHistory.filter(h=>h.status==="Berjalan"||h.status==="Disetujui").length}</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Aktif</div></div>
              <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.gold }}>{bmtHistory.filter(h=>h.status==="Lunas").length}</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Lunas</div></div>
              <div className="card" style={{ padding:16,textAlign:"center" }}><div style={{ fontFamily:"'DM Serif Display'",fontSize:22,color:C.crimson }}>Rp {bmtHistory.reduce((a,h)=>a+h.amount,0)} Jt</div><div style={{ fontSize:10.5,color:"#aaa",marginTop:2 }}>Total Pembiayaan</div></div>
            </div>
            {/* History list */}
            {bmtHistory.map((h,i)=>{
              const totalH=h.amount*(1+(h.type==="produktif"?0.012:0.015)*h.tenor);
              const paidPct=Math.round(h.paid/h.tenor*100);
              return <div key={h.id} className="card" style={{ padding:20,marginBottom:12,animation:`fadeUp .3s ease ${i*.06}s both` }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:14 }}>
                  <div>
                    <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                      <span style={{ fontSize:20 }}>{h.type==="produktif"?"🏭":"🛍️"}</span>
                      <h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>Pembiayaan {h.type==="produktif"?"Produktif":"Konsumtif"}</h4>
                    </div>
                    <div style={{ fontSize:12,color:"#aaa",marginTop:3 }}>📅 Diajukan: {h.date} · Akad: {h.type==="produktif"?"Murabahah":"Murabahah"}</div>
                  </div>
                  <span className="tag" style={{ background:h.status==="Berjalan"?`${C.royal}10`:h.status==="Lunas"?"#E8F5E9":h.status==="Menunggu"?"#FFF8E1":"#FFF3E0", color:h.status==="Berjalan"?C.royal:h.status==="Lunas"?"#2E7D32":h.status==="Menunggu"?"#F9A825":"#E65100" }}>{h.status==="Berjalan"?"🔄 Berjalan":h.status==="Lunas"?"✅ Lunas":h.status==="Menunggu"?"⏳ Menunggu Review":"❌ Ditolak"}</span>
                </div>
                <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:8,marginBottom:14 }}>
                  <div style={{ background:`${C.plum}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Pokok</div><div style={{ fontWeight:800,color:C.plum }}>Rp {h.amount} Jt</div></div>
                  <div style={{ background:"#f5f3ef",borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Tenor</div><div style={{ fontWeight:700 }}>{h.tenor} bulan</div></div>
                  <div style={{ background:`${C.gold}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Cicilan/bln</div><div style={{ fontWeight:800,color:C.gold }}>Rp {h.monthly} Jt</div></div>
                  <div style={{ background:`${C.crimson}06`,borderRadius:10,padding:"10px 12px" }}><div style={{ fontSize:10,color:"#999" }}>Total Bayar</div><div style={{ fontWeight:800,color:C.crimson }}>Rp {totalH.toFixed(1)} Jt</div></div>
                </div>
                {(h.status==="Berjalan")&&<div>
                  <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4 }}><span style={{ fontWeight:700,color:"#666" }}>Cicilan: {h.paid}/{h.tenor} bulan</span><span style={{ fontWeight:700,color:C.royal }}>{paidPct}%</span></div>
                  <div className="prog"><div className="prog-fill" style={{ width:`${paidPct}%`,background:C.royal }}/></div>
                </div>}
              </div>})}
          </>}
        </div>}
      </div>}

      {/* ═══════════════════════════════
           DASHBOARD
         ═══════════════════════════════ */}
      {page==="dashboard"&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>📊 Dashboard</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:22 }}>Statistik ekosistem ekonomi jamaah</p>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20 }}>
          {[{l:"Warga",v:"13,000",ch:"+8.2%",ic:"👥",cl:C.crimson},{l:"Transaksi",v:"1,900",ch:"+11.8%",ic:"🛒",cl:C.gold},{l:"Investasi",v:"245",ch:"+13.6%",ic:"📈",cl:C.royal},{l:"BMT",v:"Rp 2.4M",ch:"+9.1%",ic:"🏦",cl:C.plum}].map((k,i)=><div key={i} className="card" style={{ padding:"18px 20px",animation:`fadeUp .35s ease ${i*.06}s both` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <div style={{ width:38,height:38,background:`${k.cl}10`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17 }}>{k.ic}</div>
              <span className="tag" style={{ background:"#E8F5E9",color:"#2E7D32",fontSize:10 }}>{k.ch}</span>
            </div>
            <div style={{ fontFamily:"'DM Serif Display'",fontSize:24,color:C.dark }}>{k.v}</div>
            <div style={{ fontSize:11.5,color:"#bbb",fontWeight:600 }}>{k.l}</div>
          </div>)}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr",gap:16,marginBottom:16 }} className="m-grid1">
          <div className="card" style={{ padding:22 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Pertumbuhan</h3>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={MONTHLY}>
                <defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.crimson} stopOpacity={.15}/><stop offset="95%" stopColor={C.crimson} stopOpacity={0}/></linearGradient><linearGradient id="gT" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.15}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
                <XAxis dataKey="b" axisLine={false} tickLine={false} style={{ fontSize:10 }}/><YAxis axisLine={false} tickLine={false} style={{ fontSize:10 }}/>
                <Tooltip contentStyle={{ borderRadius:8,border:"none",fontSize:11 }}/>
                <Area type="monotone" dataKey="w" stroke={C.crimson} strokeWidth={2} fill="url(#gW)" name="Warga"/>
                <Area type="monotone" dataKey="t" stroke={C.gold} strokeWidth={2} fill="url(#gT)" name="Transaksi"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:22 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Distribusi Modul</h3>
            <ResponsiveContainer width="100%" height={170}>
              <PieChart><Pie data={MOD_DIST} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">{MOD_DIST.map((d,i)=><Cell key={i} fill={d.color}/>)}</Pie><Tooltip contentStyle={{ borderRadius:8,border:"none",fontSize:11 }}/></PieChart>
            </ResponsiveContainer>
            <div style={{ display:"flex",flexWrap:"wrap",gap:6,justifyContent:"center",marginTop:6 }}>{MOD_DIST.map((d,i)=><span key={i} style={{ fontSize:10,fontWeight:600,color:d.color,display:"flex",alignItems:"center",gap:3 }}><span style={{ width:7,height:7,borderRadius:2,background:d.color,display:"inline-block" }}/>{d.name}</span>)}</div>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }} className="m-grid1">
          <div className="card" style={{ padding:22 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Investasi Bulanan</h3>
            <ResponsiveContainer width="100%" height={200}><BarChart data={MONTHLY}><XAxis dataKey="b" axisLine={false} tickLine={false} style={{ fontSize:10 }}/><YAxis axisLine={false} tickLine={false} style={{ fontSize:10 }}/><Tooltip contentStyle={{ borderRadius:8,border:"none",fontSize:11 }}/><Bar dataKey="i" fill={C.royal} radius={[4,4,0,0]} name="Investasi"/></BarChart></ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:22 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Kematangan Ekosistem</h3>
            <ResponsiveContainer width="100%" height={200}><RadarChart data={RADAR_D}><PolarGrid stroke="#eee"/><PolarAngleAxis dataKey="subject" style={{ fontSize:10 }}/><Radar dataKey="A" stroke={C.crimson} fill={C.crimson} fillOpacity={.1} strokeWidth={2}/></RadarChart></ResponsiveContainer>
          </div>
        </div>
        <div className="card" style={{ padding:22,marginTop:16 }}>
          <h3 className="hmd" style={{ marginBottom:12 }}>Aktivitas Terbaru</h3>
          {ACTIVITY_FEED.map((a,i)=><div key={i} style={{ display:"flex",gap:12,padding:"10px 0",borderBottom:i<ACTIVITY_FEED.length-1?"1px solid #f5f3ef":"none",animation:`fadeUp .3s ease ${i*.04}s both` }}>
            <div style={{ width:34,height:34,borderRadius:8,background:`${a.color}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0 }}>{a.icon}</div>
            <div><span style={{ fontSize:12.5 }}><b>{a.user}</b> {a.action}</span><div style={{ fontSize:10.5,color:"#ccc" }}>{a.time}</div></div>
          </div>)}
        </div>
      </div>}

    </div>
  );
}
