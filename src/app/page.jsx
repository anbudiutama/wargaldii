'use client';
import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { createClient } from '@supabase/supabase-js';

// Client-side only Supabase — tidak crash jika env var belum ada
function getSupabase() {
  if (typeof window === 'undefined') return null;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null; // Jangan crash, return null
  if (!window._supabase) {
    window._supabase = createClient(url, key);
  }
  return window._supabase;
}

const C = { crimson:"#C41E3A", gold:"#D4A017", dark:"#0F0F1A", emerald:"#1B6B3A", royal:"#2E5090", plum:"#6B3A7D", copper:"#C75B39", cream:"#FAF8F3", warmGray:"#F3F0EB" };

// ═══ STATIC CONFIG (tetap di kode, bukan dari DB) ═══
const MODULES = [
  { id:"marketplace", title:"Marketplace", icon:"🛒", color:C.gold },
  { id:"elearning", title:"E-Learning", icon:"📚", color:C.crimson },
  { id:"hibah", title:"Hibah Barkas", icon:"🎁", color:C.copper },
  { id:"investasi", title:"Investasi", icon:"📈", color:C.royal },
  { id:"loker", title:"Lowongan Kerja", icon:"💼", color:C.emerald },
  { id:"bmt", title:"BMT Syariah", icon:"🏦", color:C.plum },
];
const CATEGORIES = ["Semua","Makanan","Elektronik","Fashion","Kesehatan","Pertanian","Jasa","Furniture"];
const STAKEHOLDERS = [
  { name:"Pembelajar",icon:"🎓",benefit:"Mendapat materi & sertifikat digital" },
  { name:"Pengajar",icon:"👨‍🏫",benefit:"Mendapat nilai kualitas dari pembelajar" },
  { name:"Pencari Kerja",icon:"🔍",benefit:"Info lowongan & peluang kerja" },
  { name:"Produsen",icon:"🏭",benefit:"Karyawan, investor & mitra seller" },
  { name:"Seller",icon:"🏪",benefit:"Omzet dari transaksi" },
  { name:"Pembeli",icon:"🛍️",benefit:"Barang/jasa dari jamaah" },
  { name:"Usaha Bersama",icon:"🏢",benefit:"Omzet, karyawan & investor" },
  { name:"Investor",icon:"💰",benefit:"Deviden & bagi hasil" },
  { name:"BMT",icon:"🏦",benefit:"Nasabah & pembiayaan syariah" },
  { name:"Pemberi Hibah",icon:"🤲",benefit:"Barang bermanfaat untuk jamaah" },
  { name:"Penerima Hibah",icon:"🎁",benefit:"Barang gratis" },
];
const CITIES = [
  { name:"Medan",top:15,left:9,members:900,usaha:45,color:C.plum },
  { name:"Jakarta",top:72,left:26,members:3200,usaha:180,color:C.crimson },
  { name:"Bandung",top:74,left:28,members:1500,usaha:85,color:C.emerald },
  { name:"Semarang",top:73,left:34,members:1200,usaha:72,color:C.royal },
  { name:"Surabaya",top:74,left:40,members:2800,usaha:150,color:C.gold },
  { name:"Malang",top:78,left:39.5,members:950,usaha:52,color:C.emerald },
  { name:"Makassar",top:64,left:54,members:800,usaha:38,color:C.copper },
  { name:"Manado",top:26,left:64,members:280,usaha:14,color:C.copper },
];
const MONTHLY = [{b:"Jan",w:4200,t:320,i:45},{b:"Feb",w:4800,t:410,i:52},{b:"Mar",w:5500,t:520,i:68},{b:"Apr",w:6200,t:680,i:85},{b:"Mei",w:7100,t:790,i:102},{b:"Jun",w:7800,t:920,i:118},{b:"Jul",w:8600,t:1050,i:135},{b:"Ags",w:9400,t:1180,i:155},{b:"Sep",w:10200,t:1350,i:178},{b:"Okt",w:11100,t:1520,i:198},{b:"Nov",w:12000,t:1700,i:220},{b:"Des",w:13000,t:1900,i:245}];
const MOD_DIST = [{name:"Marketplace",value:32,color:C.gold},{name:"E-Learning",value:28,color:C.crimson},{name:"Loker",value:18,color:C.emerald},{name:"Investasi",value:12,color:C.royal},{name:"BMT",value:7,color:C.plum},{name:"Hibah",value:3,color:C.copper}];
const RADAR_D = [{subject:"Pembelajaran",A:92},{subject:"Perdagangan",A:85},{subject:"Investasi",A:70},{subject:"Ketenagakerjaan",A:78},{subject:"Pembiayaan",A:65},{subject:"Sosial",A:88}];
const fmt = (n) => "Rp "+n.toLocaleString("id-ID");

// ═══════════════════════════════════════
// MAIN APP — CONNECTED TO SUPABASE
// ═══════════════════════════════════════
export default function App() {
  // ═══ AUTH STATE (dari Supabase) ═══
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");

  // ═══ NAVIGATION ═══
  const [page, setPage] = useState("home");
  const [sub, setSub] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [notif, setNotif] = useState(false);
  const [loginM, setLoginM] = useState(false);
  const [regM, setRegM] = useState(false);
  const [heroReady, setHeroReady] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const [mapCity, setMapCity] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);

  // ═══ DATA FROM DATABASE (sebelumnya hardcoded) ═══
  const [products, setProducts] = useState([]);
  const [courses, setCourses] = useState([]);
  const [hibahItems, setHibahItems] = useState([]);
  const [investCompanies, setInvestCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  // ═══ MODULE STATE ═══
  const [mCat, setMCat] = useState("Semua");
  const [mSearch, setMSearch] = useState("");
  const [activeLesson, setActiveLesson] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizDone, setQuizDone] = useState(false);
  const [hibahReq, setHibahReq] = useState(null);
  const [hibahReason, setHibahReason] = useState("");
  const [hibahSent, setHibahSent] = useState([]);
  const [hibahGive, setHibahGive] = useState(false);
  const [completedLessons, setCompletedLessons] = useState({});
  const [investAmount, setInvestAmount] = useState(10);
  const [investTab, setInvestTab] = useState("explore");
  const [myInvestments, setMyInvestments] = useState([]);
  const [lokerType, setLokerType] = useState("Semua");
  const [lokerSearch, setLokerSearch] = useState("");
  const [lokerCity, setLokerCity] = useState("Semua");
  const [bmtAmt, setBmtAmt] = useState(50);
  const [bmtTenor, setBmtTenor] = useState(12);
  const [bmtType, setBmtType] = useState("produktif");
  const [bmtSubmitted, setBmtSubmitted] = useState(false);
  const [bmtTab, setBmtTab] = useState("kalkulator");
  const [bmtHistory, setBmtHistory] = useState([]);
  const [profileTab, setProfileTab] = useState("overview");
  const [dirSearch, setDirSearch] = useState("");
  const [dirType, setDirType] = useState("Semua");

  // ═══ FORM STATE (untuk register/login) ═══
  const [regForm, setRegForm] = useState({ full_name:"", email:"", phone:"", role:"pembelajar", city:"", cabang_ldii:"", password:"" });
  const [loginForm, setLoginForm] = useState({ email:"", password:"" });

  // ═══ FORM MODALS (untuk input data baru) ═══
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showJobForm, setShowJobForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);

  // ═══ FORM DATA (semua di top-level agar tidak melanggar rules of hooks) ═══
  const [productForm, setProductForm] = useState({name:"",description:"",price:"",stock:"",category:"Makanan",image_url:""});
  const [hibahForm, setHibahForm] = useState({name:"",description:"",condition:"Baik (80%)",category:"Elektronik",city:""});
  const [courseForm, setCourseForm] = useState({title:"",description:"",level:"pemula",duration:""});
  const [courseMods, setCourseMods] = useState([{title:"",content:"",type:"article",duration:""}]);
  const [courseQuizzes, setCourseQuizzes] = useState([{question:"",options:["","","",""],correct_answer:0}]);
  const [courseStep, setCourseStep] = useState(1);
  const [jobForm, setJobForm] = useState({title:"",description:"",requirements:"",city:"",type:"Full-time",salary:""});
  const [companyForm, setCompanyForm] = useState({name:"",sector:"Makanan & Minuman",city:"",description:"",target_fund:"",return_rate:"",period:"12 bulan",akad:"Musyarakah",revenue:"",profit:"",growth:""});
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutAddr, setCheckoutAddr] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [bmtPurpose, setBmtPurpose] = useState("");

  // ═══════════════════════════════════════
  // 🔌 SUPABASE AUTH — Login & Register Sungguhan
  // ═══════════════════════════════════════
  useEffect(() => {
    getSupabase()?.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id); }
      setAuthLoading(false);
    });
    const { data: { subscription } } = getSupabase()?.auth.onAuthStateChange((event, session) => {
      if (session?.user) { setUser(session.user); fetchProfile(session.user.id); }
      else { setUser(null); setProfile(null); }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function fetchProfile(uid) {
    const { data } = await getSupabase()?.from('profiles').select('*').eq('id', uid).single();
    setProfile(data);
  }

  async function handleRegister() {
    setAuthError(""); setAuthSuccess("");
    try {
      const { data, error } = await getSupabase()?.auth.signUp({
        email: regForm.email, password: regForm.password,
        options: { data: { full_name: regForm.full_name, phone: regForm.phone, role: regForm.role, city: regForm.city, cabang_ldii: regForm.cabang_ldii } }
      });
      if (error) throw error;
      setAuthSuccess("Registrasi berhasil! Cek email untuk verifikasi.");
      setRegM(false); setRegForm({ full_name:"", email:"", phone:"", role:"pembelajar", city:"", cabang_ldii:"", password:"" });
    } catch (e) { setAuthError(e.message); }
  }

  async function handleLogin() {
    setAuthError("");
    try {
      const { data, error } = await getSupabase()?.auth.signInWithPassword({ email: loginForm.email, password: loginForm.password });
      if (error) throw error;
      setLoginM(false); setLoginForm({ email:"", password:"" });
    } catch (e) { setAuthError(e.message); }
  }

  async function handleLogout() {
    await getSupabase()?.auth.signOut();
    setUser(null); setProfile(null); nav("home");
  }

  // ═══════════════════════════════════════
  // 🔌 DATA FETCHING — Ambil data dari Supabase
  // ═══════════════════════════════════════
  useEffect(() => { fetchProducts(); fetchCourses(); fetchHibah(); fetchInvestments(); fetchJobs(); }, []);
  useEffect(() => { if (user) { fetchMyInvestments(); fetchBmtHistory(); fetchNotifications(); } }, [user]);

  async function fetchProducts() {
    const { data } = await getSupabase()?.from('products').select('*, seller:profiles!seller_id(full_name, city, phone)').eq('status', 'active').order('created_at', { ascending: false });
    if (data?.length) setProducts(data.map(p => ({ ...p, img: getCatEmoji(p.category), reviews: [] })));
  }
  async function fetchCourses() {
    const { data } = await getSupabase()?.from('courses').select('*, instructor:profiles!instructor_id(full_name), course_modules(*), course_quizzes(*)').eq('status', 'active');
    if (data?.length) setCourses(data);
  }
  async function fetchHibah() {
    const { data } = await getSupabase()?.from('hibah_items').select('*, donor:profiles!donor_id(full_name, city)').order('created_at', { ascending: false });
    if (data?.length) setHibahItems(data);
  }
  async function fetchInvestments() {
    const { data } = await getSupabase()?.from('investment_companies').select('*, owner:profiles!owner_id(full_name)').eq('status', 'active');
    if (data?.length) setInvestCompanies(data);
  }
  async function fetchJobs() {
    const { data } = await getSupabase()?.from('jobs').select('*, company:profiles!company_id(full_name, city)').eq('status', 'active').order('created_at', { ascending: false });
    if (data?.length) setJobs(data);
  }
  async function fetchMyInvestments() {
    const { data } = await getSupabase()?.from('investments').select('*, company:investment_companies(name, sector, city)').eq('investor_id', user.id);
    if (data) setMyInvestments(data);
  }
  async function fetchBmtHistory() {
    const { data } = await getSupabase()?.from('bmt_applications').select('*').eq('applicant_id', user.id).order('created_at', { ascending: false });
    if (data) setBmtHistory(data);
  }
  async function fetchNotifications() {
    const { data } = await getSupabase()?.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    if (data) setNotifications(data);
  }
  async function fetchCourseProgress(courseId) {
    if (!user) return [];
    const { data } = await getSupabase()?.from('course_progress').select('*').eq('user_id', user.id).eq('course_id', courseId);
    return data || [];
  }

  function getCatEmoji(cat) {
    const map = { "Makanan":"🍯","Elektronik":"💻","Fashion":"👗","Kesehatan":"💊","Pertanian":"🌾","Jasa":"🎨","Furniture":"🪵" };
    return map[cat] || "📦";
  }

  // ═══════════════════════════════════════
  // 🔌 ACTIONS — Panggilan API sungguhan
  // ═══════════════════════════════════════

  // 🛒 MARKETPLACE: Checkout
  async function handleCheckout(shippingName, shippingPhone, shippingAddress) {
    if (!user) { setLoginM(true); return; }
    const items = cart.map(x => ({ product_id: x.id, quantity: x.qty }));
    const { data, error } = await getSupabase()?.from('orders').insert({
      buyer_id: user.id, total_amount: cartTotal, shipping_name: shippingName, shipping_phone: shippingPhone, shipping_address: shippingAddress
    }).select().single();
    if (error) { alert("Error: " + error.message); return; }
    // Insert order items
    for (const item of cart) {
      await getSupabase()?.from('order_items').insert({ order_id: data.id, product_id: item.id, seller_id: item.seller_id, quantity: item.qty, price: item.price, subtotal: item.price * item.qty });
      // Reduce stock
      await getSupabase()?.from('products').update({ stock: item.stock - item.qty, sold: (item.sold||0) + item.qty }).eq('id', item.id);
    }
    setCart([]);
    alert(`✅ Pesanan #${data.id} berhasil! Total: ${fmt(cartTotal)}\nSeller akan dihubungi via WhatsApp.`);
    fetchProducts();
    nav("home");
  }

  // 📚 E-LEARNING: Tandai selesai
  async function handleMarkComplete(courseId, moduleId) {
    if (!user) { setLoginM(true); return; }
    await getSupabase()?.from('course_progress').upsert({ user_id: user.id, course_id: courseId, module_id: moduleId, completed: true, completed_at: new Date().toISOString() }, { onConflict: 'user_id,course_id,module_id' });
    setCompletedLessons(p => ({ ...p, [courseId]: [...(p[courseId]||[]), `m${moduleId}`] }));
  }

  // 📚 E-LEARNING: Submit quiz
  async function handleSubmitQuiz(courseId, quizzes) {
    if (!user) { setLoginM(true); return; }
    let correct = 0;
    quizzes.forEach((q, i) => { if (quizAnswers[i] === q.correct_answer) correct++; });
    const passed = correct >= Math.ceil(quizzes.length * 0.7);
    await getSupabase()?.from('quiz_results').insert({ user_id: user.id, course_id: courseId, score: correct, total: quizzes.length, passed });
    if (passed) {
      const certId = `CERT-${Date.now().toString(36).toUpperCase()}`;
      await getSupabase()?.from('certificates').insert({ user_id: user.id, course_id: courseId, certificate_id: certId });
      setCompletedLessons(p => ({ ...p, [courseId]: [...(p[courseId]||[]), "quiz"] }));
    }
    setQuizDone(true);
  }

  // 🎁 HIBAH: Ajukan
  async function handleHibahRequest(itemId) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('hibah_requests').insert({ item_id: itemId, requester_id: user.id, reason: hibahReason, address: "Alamat akan dikonfirmasi" });
    if (error) { alert("Error: " + error.message); return; }
    setHibahSent(p => [...p, itemId]); setHibahReq(null); setHibahReason("");
    // Notify donor
    const item = hibahItems.find(h => h.id === itemId);
    if (item) await getSupabase()?.from('notifications').insert({ user_id: item.donor_id, title: "Pengajuan Hibah Baru", message: `Ada yang mengajukan "${item.name}"`, type: "hibah" });
  }

  // 🎁 HIBAH: Beri hibah
  async function handleHibahGive(formData) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('hibah_items').insert({ donor_id: user.id, ...formData });
    if (error) { alert("Error: " + error.message); return; }
    alert("✅ Barang hibah berhasil diupload!"); setHibahGive(false); fetchHibah();
  }

  // 📈 INVESTASI: Ajukan investasi
  async function handleInvest(companyId) {
    if (!user) { setLoginM(true); return; }
    const company = investCompanies.find(c => c.id === companyId);
    const { error } = await getSupabase()?.from('investments').insert({ investor_id: user.id, company_id: companyId, amount: investAmount, status: "pending" });
    if (error) { alert("Error: " + error.message); return; }
    // Update raised fund
    if (company) await getSupabase()?.from('investment_companies').update({ raised_fund: (company.raised_fund||0) + investAmount }).eq('id', companyId);
    alert(`✅ Investasi Rp ${investAmount} Jt ke ${company?.name} berhasil diajukan!`);
    fetchInvestments(); fetchMyInvestments();
  }

  // 💼 LOKER: Lamar
  async function handleApplyJob(jobId, coverLetter) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('job_applications').insert({ job_id: jobId, applicant_id: user.id, cover_letter: coverLetter });
    if (error) { alert("Error: " + error.message); return; }
    const job = jobs.find(j => j.id === jobId);
    alert(`✅ Lamaran untuk "${job?.title}" berhasil dikirim!`);
    // Notify company
    if (job) await getSupabase()?.from('notifications').insert({ user_id: job.company_id, title: "Lamaran Baru!", message: `Pelamar baru untuk "${job.title}"`, type: "job" });
  }

  // 🏦 BMT: Ajukan pembiayaan
  async function handleBmtApply(purpose) {
    if (!user) { setLoginM(true); return; }
    const margin = bmtType === "produktif" ? 0.012 : 0.015;
    const total = bmtAmt * (1 + margin * bmtTenor);
    const monthly = total / bmtTenor;
    const { error } = await getSupabase()?.from('bmt_applications').insert({
      applicant_id: user.id, amount: bmtAmt, tenor: bmtTenor, type: bmtType, purpose,
      monthly_payment: monthly, total_payment: total, margin_rate: margin
    });
    if (error) { alert("Error: " + error.message); return; }
    alert("✅ Pengajuan pembiayaan berhasil dikirim ke BMT!"); setBmtSubmitted(false); setBmtTab("riwayat"); fetchBmtHistory();
  }

  // 🛒 MARKETPLACE: Upload produk baru
  async function handleAddProduct(formData) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('products').insert({
      seller_id: user.id, name: formData.name, description: formData.description,
      price: parseInt(formData.price), stock: parseInt(formData.stock),
      category: formData.category, image_url: formData.image_url || null, status: 'active'
    });
    if (error) { alert("Error: " + error.message); return; }
    alert("✅ Produk berhasil ditambahkan!"); setShowProductForm(false); fetchProducts();
  }

  // 📚 E-LEARNING: Buat kursus baru + modul + quiz
  async function handleAddCourse(formData) {
    if (!user) { setLoginM(true); return; }
    const { data: course, error } = await getSupabase()?.from('courses').insert({
      instructor_id: user.id, title: formData.title, description: formData.description,
      level: formData.level, duration: formData.duration, status: 'active'
    }).select().single();
    if (error) { alert("Error: " + error.message); return; }
    // Insert modules
    if (formData.modules?.length) {
      await getSupabase()?.from('course_modules').insert(
        formData.modules.map((m, i) => ({ course_id: course.id, title: m.title, content: m.content, type: m.type, duration: m.duration, sort_order: i }))
      );
    }
    // Insert quizzes
    if (formData.quizzes?.length) {
      await getSupabase()?.from('course_quizzes').insert(
        formData.quizzes.map((q, i) => ({ course_id: course.id, question: q.question, options: q.options, correct_answer: q.correct_answer, sort_order: i }))
      );
    }
    alert("✅ Kursus berhasil dibuat!"); setShowCourseForm(false); fetchCourses();
  }

  // 💼 LOKER: Buat lowongan baru
  async function handleAddJob(formData) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('jobs').insert({
      company_id: user.id, title: formData.title, description: formData.description,
      requirements: formData.requirements.split('\n').filter(r => r.trim()),
      city: formData.city, type: formData.type, salary: formData.salary, status: 'active'
    });
    if (error) { alert("Error: " + error.message); return; }
    alert("✅ Lowongan berhasil dibuat!"); setShowJobForm(false); fetchJobs();
  }

  // 📈 INVESTASI: Daftarkan perusahaan
  async function handleAddCompany(formData) {
    if (!user) { setLoginM(true); return; }
    const { error } = await getSupabase()?.from('investment_companies').insert({
      owner_id: user.id, name: formData.name, sector: formData.sector, city: formData.city,
      description: formData.description, target_fund: parseInt(formData.target_fund),
      return_rate: formData.return_rate, period: formData.period, akad: formData.akad,
      revenue: formData.revenue, profit: formData.profit, growth: formData.growth,
      open_for_investment: true, status: 'active'
    });
    if (error) { alert("Error: " + error.message); return; }
    alert("✅ Perusahaan berhasil didaftarkan!"); setShowCompanyForm(false); fetchInvestments();
  }

  // ═══════════════════════════════════════
  // HELPERS
  // ═══════════════════════════════════════
  useEffect(() => { setTimeout(() => setHeroReady(true), 150); }, []);
  useEffect(() => { if(page==="home"){const t=setInterval(()=>setFlowStep(p=>(p+1)%7),2500);return()=>clearInterval(t);} },[page]);

  const nav = (p, s=null) => { setPage(p); setSub(s); setNotif(false); setCartOpen(false); setMobileMenu(false); setQuizStarted(false); setQuizDone(false); setQuizAnswers({}); setActiveLesson(0); setAuthError(""); setAuthSuccess(""); window.scrollTo({top:0,behavior:"smooth"}); };
  const addCart = (p) => { setCart(prev => { const ex=prev.find(x=>x.id===p.id); if(ex) return prev.map(x=>x.id===p.id?{...x,qty:x.qty+1}:x); return [...prev,{...p,qty:1}]; }); };
  const rmCart = (id) => setCart(prev=>prev.filter(x=>x.id!==id));
  const updQty = (id,d) => setCart(prev=>prev.map(x=>x.id===id?{...x,qty:Math.max(1,x.qty+d)}:x));
  const cartTotal = cart.reduce((a,x)=>a+x.price*x.qty,0);
  const cartCount = cart.reduce((a,x)=>a+x.qty,0);
  const bmtMargin = bmtType==="produktif"?0.012:0.015;
  const bmtTotal = bmtAmt*(1+bmtMargin*bmtTenor);
  const bmtMonthly = bmtTotal/bmtTenor;

  // ═══════════════════════════════════════
  // STATUS BAR — Menunjukkan koneksi DB
  // ═══════════════════════════════════════
  const isConnected = products.length > 0 || courses.length > 0;

  return (
    <div style={{ fontFamily:"'DM Sans','Segoe UI',sans-serif", color:C.dark, background:C.cream, minHeight:"100vh", overflowX:"hidden" }}>
{/* ═══ CONNECTION STATUS BAR ═══ */}
<div style={{ background: user ? C.emerald : isConnected ? C.royal : C.gold, color:"white", padding:"6px 20px", fontSize:12, fontWeight:600, textAlign:"center", display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
  <span>{isConnected ? "🟢 Database terhubung" : "🟡 Menghubungkan ke database..."}</span>
  <span>📦 {products.length} produk | 📚 {courses.length} kursus | 🎁 {hibahItems.length} hibah | 💼 {jobs.length} loker</span>
  {user ? <span>👤 {profile?.full_name || user.email} ({profile?.role}) — <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={handleLogout}>Logout</span></span> : <span>🔒 Belum login</span>}
</div>

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
.err{background:#FFEBEE;color:#C62828;padding:10px 14px;border-radius:10px;font-size:12.5px;margin-bottom:10px;font-weight:600}
.ok{background:#E8F5E9;color:#2E7D32;padding:10px 14px;border-radius:10px;font-size:12.5px;margin-bottom:10px;font-weight:600}
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
            <div style={{ position:"relative",cursor:"pointer" }} onClick={()=>{setCartOpen(!cartOpen);setNotif(false)}}>
              <span style={{ fontSize:17 }}>🛒</span>
              {cartCount>0&&<span style={{ position:"absolute",top:-5,right:-6,minWidth:16,height:16,background:C.gold,borderRadius:50,fontSize:9,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,border:"2px solid white",padding:"0 3px" }}>{cartCount}</span>}
            </div>
            <div style={{ position:"relative",cursor:"pointer" }} onClick={()=>{setNotif(!notif);setCartOpen(false)}}>
              <span style={{ fontSize:17 }}>🔔</span>
              {notifications.filter(n=>!n.read).length>0&&<span style={{ position:"absolute",top:-4,right:-4,width:14,height:14,background:C.crimson,borderRadius:50,fontSize:8,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,border:"2px solid white" }}>{notifications.filter(n=>!n.read).length}</span>}
            </div>
            {user ? <button className="btn bo bs" onClick={handleLogout}>Logout</button>
            : <button className="btn bp bs" onClick={()=>setRegM(true)}>Daftar</button>}
            <button className="btn hamburger-btn" onClick={()=>setMobileMenu(!mobileMenu)} style={{ fontSize:20,padding:4,background:"none",color:C.dark }}>☰</button>
          </div>
        </div>
        {/* Cart dropdown */}
        {cartOpen&&<div style={{ position:"absolute",right:20,top:56,width:380,maxWidth:"92vw",background:"white",borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,.12)",border:"1px solid #f0ece6",zIndex:200,animation:"fadeUp .2s" }}>
          <div style={{ padding:"14px 18px",borderBottom:"1px solid #f5f3ef",fontWeight:800,fontSize:14 }}>Keranjang ({cartCount})</div>
          <div style={{ maxHeight:300,overflowY:"auto" }}>
            {cart.length===0?<div style={{ padding:30,textAlign:"center",color:"#ccc" }}>Keranjang kosong</div>:
            cart.map(x=><div key={x.id} style={{ padding:"12px 18px",borderBottom:"1px solid #faf8f5",display:"flex",gap:10,alignItems:"center" }}>
              <span style={{ fontSize:28 }}>{x.img||"📦"}</span>
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
        </div>}
        {/* Notif dropdown (from database) */}
        {notif&&<div style={{ position:"absolute",right:60,top:56,width:340,maxWidth:"90vw",background:"white",borderRadius:16,boxShadow:"0 16px 48px rgba(0,0,0,.12)",border:"1px solid #f0ece6",zIndex:200,animation:"fadeUp .2s" }}>
          <div style={{ padding:"12px 16px",borderBottom:"1px solid #f5f3ef",fontWeight:800,fontSize:13 }}>Notifikasi</div>
          <div style={{ maxHeight:300,overflowY:"auto" }}>
            {notifications.length===0?<div style={{ padding:24,textAlign:"center",color:"#ccc",fontSize:13 }}>Belum ada notifikasi</div>
            :notifications.map((n,i)=><div key={n.id||i} style={{ padding:"10px 16px",borderBottom:"1px solid #faf8f5",display:"flex",gap:8,background:n.read?"transparent":"#faf8f5" }}>
              <span style={{ fontSize:18 }}>{n.type==="order"?"🛒":n.type==="certificate"?"🏅":n.type==="hibah"?"🎁":n.type==="investment"?"📈":n.type==="job"?"💼":n.type==="bmt"?"🏦":"🔔"}</span>
              <div><div style={{ fontSize:12.5,fontWeight:n.read?500:700 }}>{n.title}</div><div style={{ fontSize:11,color:"#aaa" }}>{n.message}</div></div>
            </div>)}
          </div>
        </div>}
        {/* Mobile menu */}
        {mobileMenu&&<><div className="mob-overlay" onClick={()=>setMobileMenu(false)}/><div className="mob-menu">
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24 }}>
            <div style={{ fontFamily:"'Outfit'",fontWeight:900,fontSize:16 }}>Menu</div>
            <button style={{ background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#999" }} onClick={()=>setMobileMenu(false)}>✕</button>
          </div>
          {user&&<div style={{ padding:"12px 14px",background:`${C.crimson}06`,borderRadius:12,marginBottom:16,fontSize:13 }}>👤 <b>{profile?.full_name}</b><br/><span style={{ color:"#999" }}>{profile?.role} · {profile?.city}</span></div>}
          {MODULES.map(m=><div key={m.id} style={{ padding:"12px 0",borderBottom:"1px solid #f5f3ef",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10 }} onClick={()=>nav(m.id)}><span style={{ fontSize:20 }}>{m.icon}</span>{m.title}</div>)}
          <div style={{ padding:"12px 0",cursor:"pointer",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:10 }} onClick={()=>nav("dashboard")}>📊 Dashboard</div>
          <div style={{ marginTop:20,display:"flex",gap:8 }}>
            {user?<button className="btn bp bs" style={{ flex:1 }} onClick={()=>{setMobileMenu(false);handleLogout()}}>Logout</button>
            :<><button className="btn bo bs" style={{ flex:1 }} onClick={()=>{setMobileMenu(false);setLoginM(true)}}>Masuk</button><button className="btn bp bs" style={{ flex:1 }} onClick={()=>{setMobileMenu(false);setRegM(true)}}>Daftar</button></>}
          </div>
        </div></>}
      </nav>

      {/* ═══ LOGIN MODAL (Real Supabase Auth) ═══ */}
      {loginM&&<div className="modal-bg" onClick={()=>setLoginM(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setLoginM(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:20 }}><div style={{ fontSize:36,marginBottom:4 }}>🕌</div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>Masuk</h2></div>
        {authError&&<div className="err">{authError}</div>}
        <input className="inp" placeholder="Email" type="email" value={loginForm.email} onChange={e=>setLoginForm(p=>({...p,email:e.target.value}))}/>
        <input className="inp" placeholder="Kata Sandi" type="password" value={loginForm.password} onChange={e=>setLoginForm(p=>({...p,password:e.target.value}))}/>
        <button className="btn bp" style={{ width:"100%",marginTop:4 }} onClick={handleLogin}>Masuk</button>
        <p style={{ textAlign:"center",marginTop:12,fontSize:12,color:"#aaa" }}>Belum punya akun? <span style={{ color:C.crimson,fontWeight:700,cursor:"pointer" }} onClick={()=>{setLoginM(false);setRegM(true);setAuthError("")}}>Daftar</span></p>
      </div></div>}

      {/* ═══ REGISTER MODAL (Real Supabase Auth) ═══ */}
      {regM&&<div className="modal-bg" onClick={()=>setRegM(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setRegM(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <div style={{ textAlign:"center",marginBottom:16 }}><div style={{ fontSize:36,marginBottom:4 }}>🤝</div><h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>Daftar</h2></div>
        {authError&&<div className="err">{authError}</div>}
        {authSuccess&&<div className="ok">{authSuccess}</div>}
        <input className="inp" placeholder="Nama Lengkap" value={regForm.full_name} onChange={e=>setRegForm(p=>({...p,full_name:e.target.value}))}/>
        <input className="inp" placeholder="Email" type="email" value={regForm.email} onChange={e=>setRegForm(p=>({...p,email:e.target.value}))}/>
        <input className="inp" placeholder="No. WhatsApp" type="tel" value={regForm.phone} onChange={e=>setRegForm(p=>({...p,phone:e.target.value}))}/>
        <select className="sel" value={regForm.role} onChange={e=>setRegForm(p=>({...p,role:e.target.value}))}>
          <option value="">Pilih Peran</option>
          {STAKEHOLDERS.map(s=><option key={s.name} value={s.name.toLowerCase().replace(/ /g,"_")}>{s.icon} {s.name}</option>)}
        </select>
        <input className="inp" placeholder="Kota" value={regForm.city} onChange={e=>setRegForm(p=>({...p,city:e.target.value}))}/>
        <input className="inp" placeholder="Cabang / PC LDII" value={regForm.cabang_ldii} onChange={e=>setRegForm(p=>({...p,cabang_ldii:e.target.value}))}/>
        <input className="inp" placeholder="Kata Sandi (min 6 karakter)" type="password" value={regForm.password} onChange={e=>setRegForm(p=>({...p,password:e.target.value}))}/>
        <button className="btn bp" style={{ width:"100%" }} onClick={handleRegister}>Daftar Sekarang</button>
        <p style={{ textAlign:"center",marginTop:12,fontSize:12,color:"#aaa" }}>Sudah punya akun? <span style={{ color:C.crimson,fontWeight:700,cursor:"pointer" }} onClick={()=>{setRegM(false);setLoginM(true);setAuthError("")}}>Masuk</span></p>
      </div></div>}

      {/* ═══════════════════════════════════════════════
           REST OF THE APP — SAME UI, CONNECTED TO DB
           Komponen UI sama seperti sebelumnya
           Hanya data & action yang terhubung ke Supabase
         ═══════════════════════════════════════════════ */}

      {/* HOME PAGE */}
      {page==="home"&&<>
        <section style={{ position:"relative",overflow:"hidden",background:`linear-gradient(155deg,${C.dark} 0%,#1a1028 35%,${C.crimson} 100%)`,padding:"64px 24px 80px" }}>
          <div style={{ maxWidth:840,margin:"0 auto",textAlign:"center",position:"relative",zIndex:2,opacity:heroReady?1:0,transform:heroReady?"none":"translateY(24px)",transition:"all .8s cubic-bezier(.16,1,.3,1)" }}>
            <h1 className="hxl" style={{ color:"white",marginBottom:16 }}>Bangun <span style={{ background:`linear-gradient(135deg,${C.gold},#FFA500)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>Ekosistem Ekonomi</span><br/>Jamaah yang Mandiri</h1>
            <p style={{ color:"rgba(255,255,255,.55)",fontSize:15.5,maxWidth:500,margin:"0 auto 28px",lineHeight:1.7 }}>Satu platform untuk belajar, bekerja, berdagang, berinvestasi, dan saling membantu sesama warga LDII</p>
            <div style={{ display:"flex",gap:10,justifyContent:"center",flexWrap:"wrap" }}>
              {user
                ? <button className="btn bp" style={{ fontSize:15,padding:"14px 32px" }} onClick={()=>nav("marketplace")}>Jelajahi Marketplace →</button>
                : <button className="btn bp" style={{ fontSize:15,padding:"14px 32px" }} onClick={()=>setRegM(true)}>Bergabung Sekarang</button>}
              <button className="btn bg" onClick={()=>nav("elearning")}>Mulai Belajar →</button>
            </div>
            {/* Real stats from database */}
            <div style={{ display:"flex",justifyContent:"center",gap:36,marginTop:44,flexWrap:"wrap" }}>
              {[{n:products.length||"0",l:"Produk"},{n:courses.length||"0",l:"Kursus"},{n:investCompanies.length||"0",l:"Investasi"},{n:jobs.length||"0",l:"Lowongan"}].map((s,i)=><div key={i}><div style={{ fontSize:24,fontWeight:900,color:C.gold,fontFamily:"'DM Serif Display'" }}>{s.n}</div><div style={{ fontSize:11,color:"rgba(255,255,255,.4)",fontWeight:600,marginTop:2 }}>{s.l}</div></div>)}
            </div>
          </div>
        </section>
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
        <section style={{ background:`linear-gradient(135deg,${C.dark},#1a1028,${C.crimson})`,padding:"56px 24px",textAlign:"center" }}>
          <h2 className="hlg" style={{ color:"white",marginBottom:36 }}>Bergabung Sekarang — Gratis!</h2>
          <button className="btn bp" style={{ fontSize:16,padding:"16px 36px" }} onClick={()=>user?nav("marketplace"):setRegM(true)}>{user?"Jelajahi Platform →":"Daftar Sekarang"}</button>
        </section>
        <footer style={{ background:C.dark,padding:"40px 24px 24px",color:"rgba(255,255,255,.5)",textAlign:"center" }}>
          <div style={{ fontSize:11,borderTop:"1px solid rgba(255,255,255,.07)",paddingTop:16 }}>© 2026 WargaLDII.com — Platform Ekonomi Jamaah LDII</div>
        </footer>
      </>}

      {/* MARKETPLACE — Data dari Supabase */}
      {page==="marketplace"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>🛒 Marketplace</h1>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8 }}>
          <p style={{ color:"#aaa",fontSize:13 }}>{products.length} produk tersedia</p>
          <button className="btn bp bs" onClick={()=>{if(!user){setLoginM(true);return}setShowProductForm(true)}}>➕ Upload Produk</button>
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:20,alignItems:"center" }}>
          <div style={{ flex:"1 1 220px",position:"relative" }}><span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13 }}>🔍</span><input className="inp" style={{ paddingLeft:34,marginBottom:0 }} placeholder="Cari produk..." value={mSearch} onChange={e=>setMSearch(e.target.value)}/></div>
          <div style={{ display:"flex",gap:4,flexWrap:"wrap" }}>{CATEGORIES.map(c=><button key={c} className={`tab ${mCat===c?"tab-a":""}`} onClick={()=>setMCat(c)}>{c}</button>)}</div>
        </div>
        {products.length===0?<div style={{ textAlign:"center",padding:60,color:"#ccc" }}><div style={{ fontSize:48 }}>📦</div><p style={{ marginTop:10 }}>Belum ada produk di database. Tambahkan produk melalui Supabase atau form seller.</p></div>
        :<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14 }}>
          {products.filter(p=>(mCat==="Semua"||p.category===mCat)&&(p.name.toLowerCase().includes(mSearch.toLowerCase()))).map((p,i)=><div key={p.id} className="card" style={{ cursor:"pointer",animation:`fadeUp .35s ease ${i*.04}s both` }} onClick={()=>nav("marketplace",p.id)}>
            <div style={{ background:`${C.gold}08`,padding:"28px 20px",textAlign:"center",fontSize:52 }}>{p.img||"📦"}</div>
            <div style={{ padding:"14px 16px" }}>
              <div className="tag" style={{ background:`${C.gold}10`,color:C.gold,marginBottom:6 }}>{p.category}</div>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:14,marginBottom:4 }}>{p.name}</h4>
              <div style={{ fontFamily:"'DM Serif Display'",fontSize:18,color:C.crimson }}>{fmt(p.price)}</div>
              <div style={{ fontSize:11,color:"#ccc",marginTop:4 }}>🏪 {p.seller?.full_name||"Seller"} · 📍 {p.seller?.city||""}</div>
            </div>
          </div>)}
        </div>}
      </div>}

      {/* PRODUCT DETAIL */}
      {page==="marketplace"&&sub&&(()=>{const p=products.find(x=>x.id===sub);if(!p)return<div style={{padding:60,textAlign:"center"}}>Produk tidak ditemukan</div>;return<div style={{ maxWidth:960,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("marketplace")}>← Marketplace</button>
        <div style={{ display:"flex",gap:28,flexWrap:"wrap" }} className="m-col">
          <div style={{ flex:"1 1 300px",background:`${C.gold}06`,borderRadius:18,padding:"48px 32px",textAlign:"center",fontSize:100 }}>{p.img||"📦"}</div>
          <div style={{ flex:"1 1 340px" }}>
            <h1 style={{ fontFamily:"'DM Serif Display'",fontSize:28,marginBottom:6 }}>{p.name}</h1>
            <div style={{ fontFamily:"'DM Serif Display'",fontSize:32,color:C.crimson,marginBottom:14 }}>{fmt(p.price)}</div>
            <p style={{ fontSize:13.5,color:"#777",lineHeight:1.7,marginBottom:18 }}>{p.description}</p>
            <div style={{ padding:"12px 16px",background:"#faf8f5",borderRadius:12,marginBottom:18 }}>
              <div style={{ fontWeight:700,fontSize:13.5 }}>🏪 {p.seller?.full_name}</div>
              <div style={{ fontSize:11.5,color:"#aaa" }}>📍 {p.seller?.city} · Stok: {p.stock}</div>
            </div>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              <button className="btn bp" style={{ flex:1 }} onClick={()=>{addCart(p);setCartOpen(true)}}>🛒 Tambah ke Keranjang</button>
              <button className="btn" style={{ flex:"0 0 auto",background:"#25D366",color:"white",padding:"12px 20px",borderRadius:50,fontSize:14 }} onClick={()=>window.open(`https://wa.me/${p.seller?.phone||"628xx"}?text=Halo, saya tertarik dengan ${p.name} di WargaLDII`)}>💬 Chat WA</button>
            </div>
          </div>
        </div>
      </div>})()}

      {/* CHECKOUT — Real order creation */}
      {page==="checkout"&&<div style={{ maxWidth:640,margin:"0 auto",padding:"28px 24px 64px" }}>
          <button className="back" onClick={()=>nav("marketplace")}>← Marketplace</button>
          <h1 className="hlg" style={{ marginBottom:20 }}>Checkout</h1>
          {!user&&<div className="err">Anda harus login untuk checkout. <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setLoginM(true)}>Login sekarang</span></div>}
          {cart.map(x=><div key={x.id} className="card" style={{ padding:16,marginBottom:10,display:"flex",gap:14,alignItems:"center" }}>
            <span style={{ fontSize:36 }}>{x.img||"📦"}</span>
            <div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:14 }}>{x.name}</div><div style={{ fontSize:12,color:"#999" }}>Qty: {x.qty} × {fmt(x.price)}</div></div>
            <div style={{ fontWeight:800,fontSize:15,color:C.crimson }}>{fmt(x.price*x.qty)}</div>
          </div>)}
          <div className="card" style={{ padding:20,marginTop:16 }}>
            <h3 className="hmd" style={{ marginBottom:14 }}>Alamat Pengiriman</h3>
            <input className="inp" placeholder="Nama Penerima" value={checkoutName} onChange={e=>setCheckoutName(e.target.value)}/>
            <input className="inp" placeholder="No. WhatsApp" value={checkoutPhone} onChange={e=>setCheckoutPhone(e.target.value)}/>
            <textarea className="inp" placeholder="Alamat lengkap..." style={{ minHeight:60,resize:"vertical" }} value={checkoutAddr} onChange={e=>setCheckoutAddr(e.target.value)}/>
            <div style={{ display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`2px solid ${C.crimson}20` }}><span style={{ fontWeight:800,fontSize:16 }}>Total</span><span style={{ fontWeight:900,fontSize:20,fontFamily:"'DM Serif Display'",color:C.crimson }}>{fmt(cartTotal)}</span></div>
            <button className="btn bp" style={{ width:"100%",marginTop:8,opacity:!user?.5:1 }} disabled={!user} onClick={()=>handleCheckout(checkoutName,checkoutPhone,checkoutAddr)}>Bayar & Pesan →</button>
          </div>
      </div>}

      {/* E-LEARNING — Data dari Supabase */}
      {page==="elearning"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>📚 E-Learning</h1>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:8 }}>
          <p style={{ color:"#aaa",fontSize:13 }}>{courses.length} kursus tersedia</p>
          <button className="btn bp bs" onClick={()=>{if(!user){setLoginM(true);return}setShowCourseForm(true)}}>➕ Buat Kursus Baru</button>
        </div>
        {courses.length===0?<div style={{ textAlign:"center",padding:60,color:"#ccc" }}><div style={{ fontSize:48 }}>📚</div><p style={{ marginTop:10 }}>Belum ada kursus. Tambahkan via Supabase Table Editor.</p></div>
        :<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:16 }}>
          {courses.map((c,i)=><div key={c.id} className="card" style={{ cursor:"pointer",animation:`fadeUp .35s ease ${i*.06}s both` }} onClick={()=>nav("elearning",c.id)}>
            <div style={{ background:`${C.crimson}06`,padding:"28px 20px",textAlign:"center",fontSize:52 }}>📚</div>
            <div style={{ padding:"16px 18px" }}>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:15,marginBottom:6 }}>{c.title}</h4>
              <div style={{ fontSize:12,color:"#999",marginBottom:8 }}>👨‍🏫 {c.instructor?.full_name} · ⏱ {c.duration}</div>
              <div style={{ fontSize:12,color:"#bbb" }}>{c.course_modules?.length||0} materi · {c.course_quizzes?.length||0} quiz</div>
              <div style={{ marginTop:10,fontWeight:700,fontSize:13,color:C.crimson }}>Mulai Belajar →</div>
            </div>
          </div>)}
        </div>}
      </div>}

      {/* COURSE DETAIL — Connected */}
      {page==="elearning"&&sub&&(()=>{const c=courses.find(x=>x.id===sub);if(!c)return null;
        const modules = c.course_modules||[];
        const quizzes = c.course_quizzes||[];
        const quizScore = quizzes.length ? Object.keys(quizAnswers).filter(k=>quizAnswers[k]===quizzes[k]?.correct_answer).length : 0;
        return<div style={{ maxWidth:960,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("elearning")}>← Kursus</button>
        <div style={{ display:"flex",gap:24,flexWrap:"wrap" }} className="m-col">
          <div style={{ flex:"0 0 260px",minWidth:240 }}>
            <div className="card" style={{ padding:18 }}>
              <h3 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:16,marginBottom:6 }}>{c.title}</h3>
              <div style={{ fontSize:12,color:"#999",marginBottom:10 }}>👨‍🏫 {c.instructor?.full_name}<br/>📊 {c.level} · {modules.length} materi</div>
              <div style={{ borderTop:"1px solid #f0ece6",paddingTop:12 }}>
                {modules.map((m,i)=><div key={m.id} onClick={()=>{setActiveLesson(i);setQuizStarted(false);setQuizDone(false)}} style={{ padding:"8px 10px",borderRadius:8,marginBottom:4,cursor:"pointer",fontSize:12.5,fontWeight:activeLesson===i&&!quizStarted?700:500,background:activeLesson===i&&!quizStarted?`${C.crimson}10`:"transparent",color:activeLesson===i&&!quizStarted?C.crimson:"#777",display:"flex",gap:6,alignItems:"center" }}>
                  <span>{m.type==="video"?"🎬":"📄"}</span>{m.title}
                </div>)}
                {quizzes.length>0&&<div onClick={()=>{setQuizStarted(true);setQuizDone(false);setQuizAnswers({})}} style={{ padding:"8px 10px",borderRadius:8,marginTop:4,cursor:"pointer",fontSize:12.5,fontWeight:quizStarted?700:500,background:quizStarted?`${C.emerald}10`:"transparent",color:quizStarted?C.emerald:"#777" }}>📝 Quiz ({quizzes.length} soal)</div>}
              </div>
            </div>
          </div>
          <div style={{ flex:1,minWidth:0 }}>
            {!quizStarted&&modules[activeLesson]?<div className="card" style={{ padding:24 }}>
              <h3 className="hmd" style={{ marginBottom:6 }}>{modules[activeLesson].title}</h3>
              <div style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>{modules[activeLesson].type==="video"?"Video":"Artikel"} · {modules[activeLesson].duration}</div>
              {modules[activeLesson].type==="video"&&<div style={{ background:"#1a1a2e",borderRadius:14,padding:"48px 20px",textAlign:"center",marginBottom:16 }}><div style={{ width:64,height:64,borderRadius:50,background:"rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:28,cursor:"pointer" }}>▶</div></div>}
              <div style={{ fontSize:14,lineHeight:1.8,color:"#555" }}>{modules[activeLesson].content}</div>
              <button className="btn" style={{ width:"100%",marginTop:16,background:C.emerald,color:"white",padding:"12px 20px",fontSize:13 }} onClick={()=>handleMarkComplete(c.id, modules[activeLesson].id)}>✅ Tandai Selesai</button>
              <div style={{ display:"flex",justifyContent:"space-between",marginTop:12 }}>
                <button className="btn bo bs" disabled={activeLesson===0} onClick={()=>setActiveLesson(p=>p-1)} style={{opacity:activeLesson===0?.4:1}}>← Sebelumnya</button>
                {activeLesson<modules.length-1?<button className="btn bp bs" onClick={()=>setActiveLesson(p=>p+1)}>Selanjutnya →</button>
                :quizzes.length>0&&<button className="btn bp bs" style={{background:C.emerald}} onClick={()=>{setQuizStarted(true);setQuizDone(false);setQuizAnswers({})}}>Mulai Quiz →</button>}
              </div>
            </div>
            :quizStarted&&<div className="card" style={{ padding:24 }}>
              {!quizDone?<>
                <h3 className="hmd" style={{ marginBottom:16 }}>📝 Quiz</h3>
                {quizzes.map((q,qi)=><div key={qi} style={{ marginBottom:18,padding:16,background:"#faf8f5",borderRadius:12 }}>
                  <div style={{ fontWeight:700,fontSize:13.5,marginBottom:10 }}>{qi+1}. {q.question}</div>
                  {(q.options||[]).map((o,oi)=><div key={oi} onClick={()=>setQuizAnswers(p=>({...p,[qi]:oi}))} style={{ padding:"10px 14px",borderRadius:8,marginBottom:5,cursor:"pointer",border:`2px solid ${quizAnswers[qi]===oi?C.crimson:"#eee"}`,background:quizAnswers[qi]===oi?`${C.crimson}08`:"white",fontSize:13 }}>
                    {String.fromCharCode(65+oi)}. {o}
                  </div>)}
                </div>)}
                <button className="btn bp" style={{ width:"100%",opacity:Object.keys(quizAnswers).length<quizzes.length?.5:1 }} disabled={Object.keys(quizAnswers).length<quizzes.length} onClick={()=>handleSubmitQuiz(c.id,quizzes)}>Selesai & Lihat Hasil</button>
              </>:<div style={{ textAlign:"center",padding:"20px 0" }}>
                <div style={{ fontSize:56,marginBottom:10 }}>{quizScore>=quizzes.length*0.7?"🏆":"📋"}</div>
                <h3 className="hlg">Skor: {quizScore}/{quizzes.length}</h3>
                <div style={{ fontSize:14,color:quizScore>=quizzes.length*0.7?C.emerald:C.copper,fontWeight:700,marginTop:6 }}>{quizScore>=quizzes.length*0.7?"Selamat lulus! Sertifikat tersimpan.":"Belum lulus, coba lagi."}</div>
                <button className="btn bp" style={{ marginTop:16 }} onClick={()=>nav("elearning")}>Kembali</button>
              </div>}
            </div>}
          </div>
        </div>
      </div>})()}

      {/* HIBAH — Connected */}
      {page==="hibah"&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>🎁 Hibah Barkas</h1>
        <p style={{ color:"#aaa",fontSize:13,marginBottom:22 }}>{hibahItems.length} barang hibah tersedia</p>
        <div style={{ display:"flex",gap:10,marginBottom:20 }}>
          <button className="btn bp bs" onClick={()=>{if(!user){setLoginM(true);return}setHibahGive(true)}}>🎁 Beri Hibah</button>
        </div>
        {hibahItems.length===0?<div style={{ textAlign:"center",padding:60,color:"#ccc" }}><div style={{ fontSize:48 }}>🎁</div><p style={{ marginTop:10 }}>Belum ada barang hibah.</p></div>
        :<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14 }}>
          {hibahItems.map((h,i)=><div key={h.id} className="card" style={{ padding:18,animation:`fadeUp .35s ease ${i*.05}s both` }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:700,fontSize:14 }}>{h.name}</h4>
              <span className="tag" style={{ background:h.status==="available"?"#E8F5E9":"#FFF3E0",color:h.status==="available"?"#2E7D32":"#E65100" }}>{h.status==="available"?"Tersedia":"Diklaim"}</span>
            </div>
            <div style={{ fontSize:12,color:"#999",marginBottom:6 }}>📦 {h.condition} · 📍 {h.donor?.city||h.city}</div>
            <p style={{ fontSize:12.5,color:"#777",lineHeight:1.5,marginBottom:10 }}>{h.description}</p>
            <div style={{ fontSize:12,color:"#bbb",marginBottom:10 }}>🤲 {h.donor?.full_name}</div>
            {h.status==="available"&&!hibahSent.includes(h.id)?<button className="btn bp bs" style={{ width:"100%" }} onClick={()=>{if(!user){setLoginM(true);return}setHibahReq(h.id)}}>Ajukan Hibah Ini</button>
            :hibahSent.includes(h.id)?<div className="ok" style={{textAlign:"center"}}>✅ Pengajuan terkirim!</div>:null}
          </div>)}
        </div>}
      </div>}
      {/* Hibah request modal */}
      {hibahReq!==null&&<div className="modal-bg" onClick={()=>setHibahReq(null)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setHibahReq(null)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:12 }}>Ajukan Hibah</h3>
        <textarea className="inp" placeholder="Alasan membutuhkan barang ini..." style={{ minHeight:80 }} value={hibahReason} onChange={e=>setHibahReason(e.target.value)}/>
        <button className="btn bp" style={{ width:"100%" }} onClick={()=>handleHibahRequest(hibahReq)}>Kirim Pengajuan</button>
      </div></div>}
      {/* Hibah give modal */}
      {hibahGive&&<div className="modal-bg" onClick={()=>setHibahGive(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setHibahGive(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:12 }}>🤲 Beri Hibah</h3>
        <input className="inp" placeholder="Nama Barang" value={hibahForm.name} onChange={e=>setHibahForm(p=>({...p,name:e.target.value}))}/>
        <select className="sel" value={hibahForm.category} onChange={e=>setHibahForm(p=>({...p,category:e.target.value}))}><option>Elektronik</option><option>Furniture</option><option>Buku</option><option>Pakaian</option><option>Peralatan Rumah</option><option>Lainnya</option></select>
        <select className="sel" value={hibahForm.condition} onChange={e=>setHibahForm(p=>({...p,condition:e.target.value}))}><option>Sangat Baik (90%+)</option><option>Baik (80%)</option><option>Cukup Baik (70%)</option><option>Layak Pakai (60%)</option></select>
        <textarea className="inp" placeholder="Deskripsi barang..." style={{ minHeight:60 }} value={hibahForm.description} onChange={e=>setHibahForm(p=>({...p,description:e.target.value}))}/>
        <input className="inp" placeholder="Kota" value={hibahForm.city} onChange={e=>setHibahForm(p=>({...p,city:e.target.value}))}/>
        <button className="btn bp" style={{ width:"100%" }} onClick={()=>handleHibahGive(hibahForm)}>Upload Barang →</button>
      </div></div>}

      {/* ═══ FORM: Upload Produk (Marketplace) ═══ */}
      {showProductForm&&<div className="modal-bg" onClick={()=>setShowProductForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setShowProductForm(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:4 }}>🛒 Upload Produk Baru</h3>
        <p style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>Isi detail produk yang ingin dijual</p>
        <input className="inp" placeholder="Nama Produk *" value={productForm.name} onChange={e=>setProductForm(p=>({...p,name:e.target.value}))}/>
        <textarea className="inp" placeholder="Deskripsi produk..." style={{minHeight:60,resize:"vertical"}} value={productForm.description} onChange={e=>setProductForm(p=>({...p,description:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Harga (Rp) *" type="number" style={{flex:1}} value={productForm.price} onChange={e=>setProductForm(p=>({...p,price:e.target.value}))}/>
          <input className="inp" placeholder="Stok *" type="number" style={{flex:"0 0 100px"}} value={productForm.stock} onChange={e=>setProductForm(p=>({...p,stock:e.target.value}))}/>
        </div>
        <select className="sel" value={productForm.category} onChange={e=>setProductForm(p=>({...p,category:e.target.value}))}>
          {CATEGORIES.filter(c=>c!=="Semua").map(c=><option key={c}>{c}</option>)}
        </select>
        <input className="inp" placeholder="URL Gambar (opsional)" value={productForm.image_url} onChange={e=>setProductForm(p=>({...p,image_url:e.target.value}))}/>
        <button className="btn bp" style={{width:"100%",opacity:productForm.name&&productForm.price&&productForm.stock?1:.5}} disabled={!productForm.name||!productForm.price||!productForm.stock} onClick={()=>handleAddProduct(productForm)}>Upload Produk →</button>
      </div></div>}

      {/* ═══ FORM: Buat Kursus (E-Learning) ═══ */}
      {showCourseForm&&<div className="modal-bg" onClick={()=>setShowCourseForm(false)}><div className="modal" style={{maxWidth:560}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setShowCourseForm(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:4 }}>📚 Buat Kursus Baru</h3>
        <p style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>Isi detail kursus, materi, dan quiz</p>
        {courseStep===1&&<>
          <div style={{fontSize:12,fontWeight:700,color:C.crimson,marginBottom:10}}>Langkah 1/3 — Info Kursus</div>
          <input className="inp" placeholder="Judul Kursus *" value={courseForm.title} onChange={e=>setCourseForm(p=>({...p,title:e.target.value}))}/>
          <textarea className="inp" placeholder="Deskripsi kursus..." style={{minHeight:50,resize:"vertical"}} value={courseForm.description} onChange={e=>setCourseForm(p=>({...p,description:e.target.value}))}/>
          <div style={{display:"flex",gap:8}}>
            <select className="sel" style={{flex:1}} value={courseForm.level} onChange={e=>setCourseForm(p=>({...p,level:e.target.value}))}>
              <option value="pemula">Pemula</option><option value="menengah">Menengah</option><option value="lanjut">Lanjut</option><option value="semua">Semua Level</option>
            </select>
            <input className="inp" placeholder="Durasi (mis: 8 jam)" style={{flex:1}} value={courseForm.duration} onChange={e=>setCourseForm(p=>({...p,duration:e.target.value}))}/>
          </div>
          <button className="btn bp" style={{width:"100%",opacity:courseForm.title?1:.5}} disabled={!courseForm.title} onClick={()=>setCourseStep(2)}>Lanjut: Tambah Materi →</button>
        </>}
        {courseStep===2&&<>
          <div style={{fontSize:12,fontWeight:700,color:C.crimson,marginBottom:10}}>Langkah 2/3 — Materi ({courseMods.length} modul)</div>
          {courseMods.map((m,i)=><div key={i} style={{background:"#faf8f5",borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:700,color:"#666"}}>Modul {i+1}</span>
              {courseMods.length>1&&<span style={{fontSize:11,color:"#ccc",cursor:"pointer"}} onClick={()=>setCourseMods(p=>p.filter((_,j)=>j!==i))}>Hapus</span>}
            </div>
            <input className="inp" placeholder="Judul Modul *" value={m.title} onChange={e=>{const n=[...courseMods];n[i]={...n[i],title:e.target.value};setCourseMods(n)}}/>
            <div style={{display:"flex",gap:8}}>
              <select className="sel" style={{flex:"0 0 120px"}} value={m.type} onChange={e=>{const n=[...courseMods];n[i]={...n[i],type:e.target.value};setCourseMods(n)}}>
                <option value="article">📄 Artikel</option><option value="video">🎬 Video</option>
              </select>
              <input className="inp" placeholder="Durasi" style={{flex:1}} value={m.duration} onChange={e=>{const n=[...courseMods];n[i]={...n[i],duration:e.target.value};setCourseMods(n)}}/>
            </div>
            <textarea className="inp" placeholder="Isi materi..." style={{minHeight:50,resize:"vertical"}} value={m.content} onChange={e=>{const n=[...courseMods];n[i]={...n[i],content:e.target.value};setCourseMods(n)}}/>
          </div>)}
          <button className="btn bo bs" style={{width:"100%",marginBottom:10}} onClick={()=>setCourseMods(p=>[...p,{title:"",content:"",type:"article",duration:""}])}>+ Tambah Modul</button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn bo bs" style={{flex:1}} onClick={()=>setCourseStep(1)}>← Kembali</button>
            <button className="btn bp bs" style={{flex:1}} onClick={()=>setCourseStep(3)}>Lanjut: Quiz →</button>
          </div>
        </>}
        {courseStep===3&&<>
          <div style={{fontSize:12,fontWeight:700,color:C.crimson,marginBottom:10}}>Langkah 3/3 — Quiz ({courseQuizzes.length} soal)</div>
          {courseQuizzes.map((q,i)=><div key={i} style={{background:"#faf8f5",borderRadius:12,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontSize:12,fontWeight:700,color:"#666"}}>Soal {i+1}</span>
              {courseQuizzes.length>1&&<span style={{fontSize:11,color:"#ccc",cursor:"pointer"}} onClick={()=>setCourseQuizzes(p=>p.filter((_,j)=>j!==i))}>Hapus</span>}
            </div>
            <input className="inp" placeholder="Pertanyaan *" value={q.question} onChange={e=>{const n=[...courseQuizzes];n[i]={...n[i],question:e.target.value};setCourseQuizzes(n)}}/>
            {q.options.map((o,oi)=><div key={oi} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
              <input type="radio" name={`q${i}`} checked={q.correct_answer===oi} onChange={()=>{const n=[...courseQuizzes];n[i]={...n[i],correct_answer:oi};setCourseQuizzes(n)}} style={{cursor:"pointer"}}/>
              <input className="inp" placeholder={`Opsi ${String.fromCharCode(65+oi)}`} style={{marginBottom:0,flex:1}} value={o} onChange={e=>{const n=[...courseQuizzes];n[i].options[oi]=e.target.value;setCourseQuizzes(n)}}/>
            </div>)}
            <div style={{fontSize:10,color:"#aaa",marginTop:4}}>● Pilih radio button di samping jawaban yang benar</div>
          </div>)}
          <button className="btn bo bs" style={{width:"100%",marginBottom:10}} onClick={()=>setCourseQuizzes(p=>[...p,{question:"",options:["","","",""],correct_answer:0}])}>+ Tambah Soal</button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn bo bs" style={{flex:1}} onClick={()=>setCourseStep(2)}>← Kembali</button>
            <button className="btn bp bs" style={{flex:1}} onClick={()=>handleAddCourse({...courseForm,modules:courseMods.filter(m=>m.title),quizzes:courseQuizzes.filter(q=>q.question)})}>Publish Kursus 🚀</button>
          </div>
        </>}
      </div></div>}

      {/* ═══ FORM: Buat Lowongan Kerja ═══ */}
      {showJobForm&&<div className="modal-bg" onClick={()=>setShowJobForm(false)}><div className="modal" onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setShowJobForm(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:4 }}>💼 Buat Lowongan Baru</h3>
        <p style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>Isi detail posisi yang Anda butuhkan</p>
        <input className="inp" placeholder="Judul Posisi *" value={jobForm.title} onChange={e=>setJobForm(p=>({...p,title:e.target.value}))}/>
        <textarea className="inp" placeholder="Deskripsi pekerjaan..." style={{minHeight:60,resize:"vertical"}} value={jobForm.description} onChange={e=>setJobForm(p=>({...p,description:e.target.value}))}/>
        <textarea className="inp" placeholder="Persyaratan (satu per baris)" style={{minHeight:80,resize:"vertical"}} value={jobForm.requirements} onChange={e=>setJobForm(p=>({...p,requirements:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Kota *" style={{flex:1}} value={jobForm.city} onChange={e=>setJobForm(p=>({...p,city:e.target.value}))}/>
          <select className="sel" style={{flex:1}} value={jobForm.type} onChange={e=>setJobForm(p=>({...p,type:e.target.value}))}>
            <option>Full-time</option><option>Part-time</option><option>Freelance</option><option>Internship</option>
          </select>
        </div>
        <input className="inp" placeholder="Gaji (mis: Rp 5-7 Jt/bln)" value={jobForm.salary} onChange={e=>setJobForm(p=>({...p,salary:e.target.value}))}/>
        <button className="btn bp" style={{width:"100%",opacity:jobForm.title&&jobForm.city?1:.5}} disabled={!jobForm.title||!jobForm.city} onClick={()=>handleAddJob(jobForm)}>Publish Lowongan →</button>
      </div></div>}

      {/* ═══ FORM: Daftarkan Perusahaan (Investasi) ═══ */}
      {showCompanyForm&&<div className="modal-bg" onClick={()=>setShowCompanyForm(false)}><div className="modal" style={{maxWidth:520}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setShowCompanyForm(false)} style={{ position:"absolute",top:12,right:16,background:"none",border:"none",fontSize:17,cursor:"pointer",color:"#ccc" }}>✕</button>
        <h3 className="hmd" style={{ marginBottom:4 }}>📈 Daftarkan Perusahaan</h3>
        <p style={{ fontSize:12,color:"#aaa",marginBottom:14 }}>Daftarkan usaha Anda untuk menerima investasi</p>
        <input className="inp" placeholder="Nama Perusahaan/UB *" value={companyForm.name} onChange={e=>setCompanyForm(p=>({...p,name:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}>
          <select className="sel" style={{flex:1}} value={companyForm.sector} onChange={e=>setCompanyForm(p=>({...p,sector:e.target.value}))}>
            <option>Makanan & Minuman</option><option>Konveksi & Tekstil</option><option>Teknologi & IT</option>
            <option>Pertanian & Peternakan</option><option>Furniture & Interior</option><option>Keuangan Syariah</option>
            <option>Konstruksi</option><option>Kesehatan</option><option>Pendidikan</option><option>Lainnya</option>
          </select>
          <input className="inp" placeholder="Kota *" style={{flex:1}} value={companyForm.city} onChange={e=>setCompanyForm(p=>({...p,city:e.target.value}))}/>
        </div>
        <textarea className="inp" placeholder="Deskripsi usaha & rencana penggunaan dana..." style={{minHeight:60,resize:"vertical"}} value={companyForm.description} onChange={e=>setCompanyForm(p=>({...p,description:e.target.value}))}/>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Target Dana (Jt) *" type="number" style={{flex:1}} value={companyForm.target_fund} onChange={e=>setCompanyForm(p=>({...p,target_fund:e.target.value}))}/>
          <input className="inp" placeholder="Return Rate (mis: 15-18%)" style={{flex:1}} value={companyForm.return_rate} onChange={e=>setCompanyForm(p=>({...p,return_rate:e.target.value}))}/>
        </div>
        <div style={{display:"flex",gap:8}}>
          <select className="sel" style={{flex:1}} value={companyForm.akad} onChange={e=>setCompanyForm(p=>({...p,akad:e.target.value}))}>
            <option>Musyarakah</option><option>Mudharabah</option><option>Murabahah</option>
          </select>
          <select className="sel" style={{flex:1}} value={companyForm.period} onChange={e=>setCompanyForm(p=>({...p,period:e.target.value}))}>
            <option>6 bulan</option><option>12 bulan</option><option>18 bulan</option><option>24 bulan</option><option>36 bulan</option>
          </select>
        </div>
        <div style={{fontSize:12,fontWeight:700,color:"#666",marginBottom:8,marginTop:4}}>Data Keuangan (opsional)</div>
        <div style={{display:"flex",gap:8}}>
          <input className="inp" placeholder="Revenue/thn" style={{flex:1}} value={companyForm.revenue} onChange={e=>setCompanyForm(p=>({...p,revenue:e.target.value}))}/>
          <input className="inp" placeholder="Profit/thn" style={{flex:1}} value={companyForm.profit} onChange={e=>setCompanyForm(p=>({...p,profit:e.target.value}))}/>
          <input className="inp" placeholder="Growth %" style={{flex:"0 0 80px"}} value={companyForm.growth} onChange={e=>setCompanyForm(p=>({...p,growth:e.target.value}))}/>
        </div>
        <button className="btn bp" style={{width:"100%",opacity:companyForm.name&&companyForm.city&&companyForm.target_fund?1:.5}} disabled={!companyForm.name||!companyForm.city||!companyForm.target_fund} onClick={()=>handleAddCompany(companyForm)}>Daftarkan Perusahaan →</button>
      </div></div>}

      {/* INVESTASI — Connected */}
      {page==="investasi"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>📈 Investasi Syariah</h1>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,marginTop:12,flexWrap:"wrap",gap:8 }}>
          <div style={{ display:"flex",gap:4 }}>
            <button className={`tab ${investTab==="explore"?"tab-a":""}`} onClick={()=>setInvestTab("explore")}>🔍 Jelajahi</button>
            <button className={`tab ${investTab==="portfolio"?"tab-a":""}`} onClick={()=>setInvestTab("portfolio")}>💼 Portfolio</button>
          </div>
          <button className="btn bp bs" onClick={()=>{if(!user){setLoginM(true);return}setShowCompanyForm(true)}}>➕ Daftarkan Perusahaan</button>
        </div>
        {investTab==="explore"&&<div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:16 }}>
          {investCompanies.map((c,i)=><div key={c.id} className="card" style={{ padding:22,animation:`fadeUp .35s ease ${i*.06}s both` }}>
            <h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{c.name}</h4>
            <div style={{ fontSize:11.5,color:"#aaa",marginBottom:8 }}>{c.sector} · 📍 {c.city}</div>
            <p style={{ fontSize:12.5,color:"#777",lineHeight:1.5,marginBottom:12 }}>{c.description}</p>
            <div className="prog" style={{marginBottom:8}}><div className="prog-fill" style={{ width:`${Math.min(100,(c.raised_fund||0)/(c.target_fund||1)*100)}%`,background:C.royal }}/></div>
            <div style={{ fontSize:11,color:"#bbb",marginBottom:12 }}>Rp {c.raised_fund||0} Jt / Rp {c.target_fund} Jt · {c.akad}</div>
            {c.open_for_investment?<button className="btn bp bs" style={{ width:"100%" }} onClick={()=>nav("investasi",c.id)}>Investasi →</button>
            :<div style={{ padding:8,borderRadius:8,background:"#f5f3ef",color:"#999",fontSize:12,textAlign:"center",fontWeight:700 }}>Pendanaan Tercapai ✅</div>}
          </div>)}
        </div>}
        {investTab==="portfolio"&&<div>
          {myInvestments.length===0?<div style={{ textAlign:"center",padding:48,color:"#ccc" }}><p>Belum ada investasi. {!user&&<span style={{color:C.crimson,cursor:"pointer"}} onClick={()=>setLoginM(true)}>Login dulu</span>}</p></div>
          :myInvestments.map((inv,i)=><div key={inv.id} className="card" style={{ padding:20,marginBottom:12 }}>
            <h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{inv.company?.name}</h4>
            <div style={{ fontSize:12,color:"#aaa" }}>{inv.company?.sector} · Rp {inv.amount} Jt · Status: {inv.status}</div>
          </div>)}
        </div>}
      </div>}
      {/* Investasi Detail */}
      {page==="investasi"&&sub&&(()=>{const c=investCompanies.find(x=>x.id===sub);if(!c)return null;return<div style={{ maxWidth:720,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("investasi")}>← Investasi</button>
        <div className="card" style={{ padding:24,marginBottom:18 }}>
          <h2 style={{ fontFamily:"'DM Serif Display'",fontSize:24,marginBottom:8 }}>{c.name}</h2>
          <div style={{ fontSize:12.5,color:"#aaa",marginBottom:14 }}>{c.sector} · {c.city} · {c.akad}</div>
          <p style={{ fontSize:13.5,color:"#666",lineHeight:1.7,marginBottom:16 }}>{c.description}</p>
          <div className="prog" style={{height:10,marginBottom:8}}><div className="prog-fill" style={{ width:`${(c.raised_fund||0)/(c.target_fund||1)*100}%`,background:C.royal }}/></div>
          <div style={{ fontSize:12,color:"#bbb" }}>Rp {c.raised_fund||0} Jt / Rp {c.target_fund} Jt terkumpul</div>
        </div>
        {c.open_for_investment&&<div className="card" style={{ padding:24 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Investasikan Dana</h3>
          <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ fontSize:13,fontWeight:700,color:"#666" }}>Jumlah</span><span style={{ fontFamily:"'DM Serif Display'",fontSize:18,color:C.royal }}>Rp {investAmount} Juta</span></div>
          <input type="range" className="sld" min="5" max="100" value={investAmount} onChange={e=>setInvestAmount(+e.target.value)}/>
          <button className="btn bp" style={{ width:"100%",marginTop:16 }} onClick={()=>handleInvest(c.id)}>Ajukan Investasi →</button>
        </div>}
      </div>})()}

      {/* LOWONGAN KERJA — Connected */}
      {page==="loker"&&!sub&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:4 }}>💼 Lowongan Kerja</h1>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12,flexWrap:"wrap",gap:8 }}>
          <p style={{ color:"#aaa",fontSize:13 }}>{jobs.length} lowongan tersedia</p>
          <button className="btn bp bs" onClick={()=>{if(!user){setLoginM(true);return}setShowJobForm(true)}}>➕ Buat Lowongan</button>
        </div>
        <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16 }}>
          <div style={{ flex:"1 1 200px",position:"relative" }}><span style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13 }}>🔍</span><input className="inp" style={{ paddingLeft:34,marginBottom:0 }} placeholder="Cari posisi..." value={lokerSearch} onChange={e=>setLokerSearch(e.target.value)}/></div>
          {["Semua","Full-time","Part-time","Freelance"].map(t=><button key={t} className={`tab ${lokerType===t?"tab-a":""}`} onClick={()=>setLokerType(t)}>{t}</button>)}
        </div>
        <div style={{ display:"grid",gap:12 }}>
          {jobs.filter(j=>(lokerType==="Semua"||j.type===lokerType)&&(j.title.toLowerCase().includes(lokerSearch.toLowerCase()))).map((j,i)=><div key={j.id} className="card" style={{ padding:20,display:"flex",gap:16,alignItems:"flex-start",cursor:"pointer" }} onClick={()=>nav("loker",j.id)}>
            <div style={{ width:50,height:50,background:`${C.emerald}08`,borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0 }}>💼</div>
            <div style={{ flex:1 }}>
              <div style={{ display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:6 }}>
                <h4 style={{ fontFamily:"'Outfit'",fontWeight:800,fontSize:15 }}>{j.title}</h4>
                <span className="tag" style={{ background:`${C.emerald}10`,color:C.emerald }}>{j.type}</span>
              </div>
              <div style={{ fontSize:12.5,color:"#999",marginTop:3 }}>🏢 {j.company?.full_name} · 📍 {j.city}</div>
              <div style={{ fontSize:13.5,fontWeight:800,color:C.emerald,marginTop:6 }}>{j.salary}</div>
            </div>
          </div>)}
        </div>
      </div>}
      {/* Job Detail */}
      {page==="loker"&&sub&&(()=>{const j=jobs.find(x=>x.id===sub);if(!j)return null;
        return<div style={{ maxWidth:720,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("loker")}>← Lowongan</button>
        <div className="card" style={{ padding:24,marginBottom:18 }}>
          <h2 style={{ fontFamily:"'DM Serif Display'",fontSize:22 }}>{j.title}</h2>
          <div style={{ fontSize:12.5,color:"#aaa",marginBottom:8 }}>{j.company?.full_name} · {j.city} · {j.type}</div>
          <div style={{ fontFamily:"'DM Serif Display'",fontSize:24,color:C.emerald,marginBottom:14 }}>{j.salary}</div>
          <p style={{ fontSize:14,color:"#666",lineHeight:1.7,marginBottom:14 }}>{j.description}</p>
          {(j.requirements||[]).map((r,i)=><div key={i} style={{ fontSize:13,color:"#777",padding:"4px 0" }}>✓ {r}</div>)}
        </div>
        <div className="card" style={{ padding:24 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Lamar Posisi Ini</h3>
          {!user&&<div className="err">Login dulu untuk melamar. <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>setLoginM(true)}>Login</span></div>}
          <textarea className="inp" placeholder="Ceritakan pengalaman dan motivasi Anda..." style={{ minHeight:80 }} value={coverLetter} onChange={e=>setCoverLetter(e.target.value)}/>
          <button className="btn bp" style={{ width:"100%",opacity:!user?.5:1 }} disabled={!user} onClick={()=>handleApplyJob(j.id,coverLetter)}>Kirim Lamaran →</button>
        </div>
      </div>})()}

      {/* BMT — Connected */}
      {page==="bmt"&&<div style={{ maxWidth:940,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:12 }}>🏦 BMT Syariah</h1>
        <div style={{ display:"flex",gap:4,justifyContent:"center",marginBottom:24 }}>
          <button className={`tab ${bmtTab==="kalkulator"?"tab-a":""}`} onClick={()=>setBmtTab("kalkulator")}>🧮 Kalkulator</button>
          <button className={`tab ${bmtTab==="riwayat"?"tab-a":""}`} onClick={()=>setBmtTab("riwayat")}>📋 Riwayat ({bmtHistory.length})</button>
        </div>
        {bmtTab==="kalkulator"&&<div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:20 }} className="m-grid1">
          <div className="card" style={{ padding:24 }}>
            <h3 className="hmd" style={{ marginBottom:16 }}>Parameter</h3>
            <div style={{ display:"flex",gap:8,marginBottom:16 }}>
              {[{v:"produktif",l:"🏭 Produktif"},{v:"konsumtif",l:"🛍️ Konsumtif"}].map(t=><div key={t.v} onClick={()=>setBmtType(t.v)} style={{ flex:1,padding:"12px",borderRadius:12,border:`2px solid ${bmtType===t.v?C.plum:"#eee"}`,background:bmtType===t.v?`${C.plum}06`:"white",cursor:"pointer",textAlign:"center" }}>
                <div style={{ fontWeight:700,fontSize:13,color:bmtType===t.v?C.plum:"#666" }}>{t.l}</div>
              </div>)}
            </div>
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ fontSize:12.5,fontWeight:700,color:"#666" }}>Jumlah</span><span style={{ fontFamily:"'DM Serif Display'",fontSize:17,color:C.plum }}>Rp {bmtAmt} Jt</span></div>
              <input type="range" className="sld" min="5" max="500" value={bmtAmt} onChange={e=>setBmtAmt(+e.target.value)}/>
            </div>
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}><span style={{ fontSize:12.5,fontWeight:700,color:"#666" }}>Tenor</span><span style={{ fontFamily:"'DM Serif Display'",fontSize:17,color:C.plum }}>{bmtTenor} Bulan</span></div>
              <input type="range" className="sld" min="3" max="60" value={bmtTenor} onChange={e=>setBmtTenor(+e.target.value)}/>
            </div>
          </div>
          <div>
            <div className="card" style={{ padding:24,marginBottom:14,background:`linear-gradient(135deg,${C.plum},${C.plum}DD)`,color:"white" }}>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                <div><div style={{ fontSize:10,opacity:.6 }}>Pokok</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {bmtAmt} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Cicilan/Bln</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20,color:C.gold }}>Rp {bmtMonthly.toFixed(1)} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Total Bayar</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {bmtTotal.toFixed(1)} Jt</div></div>
                <div><div style={{ fontSize:10,opacity:.6 }}>Margin</div><div style={{ fontFamily:"'DM Serif Display'",fontSize:20 }}>Rp {(bmtTotal-bmtAmt).toFixed(1)} Jt</div></div>
              </div>
            </div>
            {!bmtSubmitted?<button className="btn bp" style={{ width:"100%",marginTop:8 }} onClick={()=>{if(!user){setLoginM(true);return}setBmtSubmitted(true)}}>Ajukan Pembiayaan →</button>
            :<div className="card" style={{ padding:20,marginTop:8 }}>
              <h3 className="hmd" style={{ marginBottom:12 }}>Form Pengajuan</h3>
              <textarea className="inp" placeholder="Tujuan pembiayaan..." style={{ minHeight:60 }} value={bmtPurpose} onChange={e=>setBmtPurpose(e.target.value)}/>
              <button className="btn bp" style={{ width:"100%" }} onClick={()=>handleBmtApply(bmtPurpose)}>Kirim ke BMT →</button>
            </div>}
          </div>
        </div>}
        {bmtTab==="riwayat"&&<div>
          {bmtHistory.length===0?<div style={{ textAlign:"center",padding:48,color:"#ccc" }}><p>Belum ada riwayat. {!user&&<span style={{color:C.crimson,cursor:"pointer"}} onClick={()=>setLoginM(true)}>Login dulu</span>}</p></div>
          :bmtHistory.map((h,i)=><div key={h.id} className="card" style={{ padding:20,marginBottom:12 }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
              <h4 style={{ fontFamily:"'Outfit'",fontWeight:800 }}>Pembiayaan {h.type} — Rp {h.amount} Jt</h4>
              <span className="tag" style={{ background:h.status==="active"?`${C.royal}10`:h.status==="completed"?"#E8F5E9":"#FFF8E1",color:h.status==="active"?C.royal:h.status==="completed"?"#2E7D32":"#F9A825" }}>{h.status}</span>
            </div>
            <div style={{ fontSize:12,color:"#aaa" }}>Tenor: {h.tenor} bln · Cicilan: Rp {h.monthly_payment?.toFixed(1)} Jt/bln · Dibayar: {h.months_paid}/{h.tenor}</div>
            {h.status==="active"&&<div className="prog" style={{marginTop:8}}><div className="prog-fill" style={{ width:`${(h.months_paid||0)/h.tenor*100}%`,background:C.royal }}/></div>}
          </div>)}
        </div>}
      </div>}

      {/* DASHBOARD */}
      {page==="dashboard"&&<div style={{ maxWidth:1280,margin:"0 auto",padding:"28px 24px 64px" }}>
        <button className="back" onClick={()=>nav("home")}>← Beranda</button>
        <h1 className="hlg" style={{ marginBottom:22 }}>📊 Dashboard</h1>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginBottom:20 }}>
          {[{l:"Produk",v:products.length,ic:"📦",cl:C.gold},{l:"Kursus",v:courses.length,ic:"📚",cl:C.crimson},{l:"Hibah",v:hibahItems.length,ic:"🎁",cl:C.copper},{l:"Lowongan",v:jobs.length,ic:"💼",cl:C.emerald}].map((k,i)=><div key={i} className="card" style={{ padding:"18px 20px" }}>
            <div style={{ width:38,height:38,background:`${k.cl}10`,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,marginBottom:8 }}>{k.ic}</div>
            <div style={{ fontFamily:"'DM Serif Display'",fontSize:28,color:C.dark }}>{k.v}</div>
            <div style={{ fontSize:11.5,color:"#bbb",fontWeight:600 }}>{k.l} di Database</div>
          </div>)}
        </div>
        <div className="card" style={{ padding:22 }}>
          <h3 className="hmd" style={{ marginBottom:14 }}>Data Growth (Dummy — ganti dengan real stats)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={MONTHLY}>
              <defs><linearGradient id="gW" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.crimson} stopOpacity={.15}/><stop offset="95%" stopColor={C.crimson} stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="b" axisLine={false} tickLine={false} style={{ fontSize:10 }}/><YAxis axisLine={false} tickLine={false} style={{ fontSize:10 }}/>
              <Tooltip contentStyle={{ borderRadius:8,border:"none",fontSize:11 }}/>
              <Area type="monotone" dataKey="w" stroke={C.crimson} strokeWidth={2} fill="url(#gW)" name="Warga"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>}

    </div>
  );
}
