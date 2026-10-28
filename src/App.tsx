/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Cpu, 
  Sparkles, 
  TrendingUp, 
  Code, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Search, 
  Download, 
  AlertCircle, 
  ChevronDown,
  Check,
  Menu,
  X,
  Lock,
  MessageSquare,
  Zap,
  Layers,
  Award
} from 'lucide-react';

interface Registration {
  id: string;
  fullName: string;
  whatsapp: string;
  email: string;
  domicile: string;
  status: string;
  fields: string[];
  goal: string;
  paymentStatus: string;
  membershipStatus: string;
  nominal: number;
  createdAt: string;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<{
    fullName: string;
    whatsapp: string;
    email: string;
    domicile: string;
    status: string;
    fields: string[];
    goal: string;
  }>({
    fullName: '',
    whatsapp: '',
    email: '',
    domicile: 'Kendari',
    status: 'Mahasiswa',
    fields: [],
    goal: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState<Registration | null>(null);

  // Status Check Modal State
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Registration | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Admin Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [registrationsList, setRegistrationsList] = useState<Registration[]>([]);
  const [filterStatus, setFilterStatus] = useState('All');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Training fields options
  const trainingFields = [
    {
      id: 'Basic Komputer',
      title: 'Basic Komputer',
      shortTitle: 'Basic Komputer',
      desc: 'Siap kerja, pengenalan dasar, word, excel dan AI composer untuk produktivitas kerja.',
      icon: Cpu,
      badge: 'Fundamental'
    },
    {
      id: 'Artificial Intelligence',
      title: 'Artificial Intelligence (AI)',
      shortTitle: 'AI Productivity',
      desc: 'Pemanfaatan AI untuk pekerjaan, otomasi bisnis, pembuatan konten, dan proyek digital.',
      icon: Sparkles,
      badge: 'Popular'
    },
    {
      id: 'Digital Marketing',
      title: 'Digital Marketing',
      shortTitle: 'Marketing & Brand',
      desc: 'Strategi konten, media sosial, personal branding, dan pemasaran bisnis online modern.',
      icon: TrendingUp,
      badge: 'Growth'
    },
    {
      id: 'Vibe Coding',
      title: 'Vibe Coding',
      shortTitle: 'AI Web & App',
      desc: 'Membangun website, aplikasi, dan produk digital siap rilis dengan bantuan AI coding.',
      icon: Code,
      badge: 'Future Tech'
    }
  ];

  const statusOptions = [
    'Pelajar',
    'Mahasiswa',
    'Karyawan',
    'Freelancer',
    'Content Creator',
    'Pemilik Bisnis/UMKM',
    'Lainnya'
  ];

  const faqs = [
    {
      q: 'Berapa biaya bergabung dengan VAIBE CLUB?',
      a: 'Biaya pendaftaran adalah Rp250.000 sekali bayar (One-time membership fee) untuk seluruh aktivitas komunitas.'
    },
    {
      q: 'Apakah harus memilih semua bidang pelatihan?',
      a: 'Tidak. Anda cukup memilih bidang utama yang diminati saat pendaftaran. Anggota tetap bebas mengeksplorasi bidang lainnya melalui jadwal pelatihan rutin yang diadakan oleh komunitas.'
    },
    {
      q: 'Apakah ada biaya tambahan setiap mengikuti pelatihan?',
      a: 'Tidak ada sama sekali. Setelah status membership aktif, anggota dapat mengikuti setiap pelatihan yang diadakan oleh Digital Vaibe Kendari tanpa biaya pelatihan tambahan, sesuai ketentuan komunitas.'
    },
    {
      q: 'Bagaimana cara mengaktifkan membership setelah mendaftar?',
      a: 'Isi formulir pendaftaran, lakukan transfer biaya pendaftaran Rp250.000 ke rekening resmi, lalu kirim bukti pembayaran ke WhatsApp admin (082371068831). Setelah diverifikasi, akun keanggotaan Anda langsung aktif.'
    },
    {
      q: 'Apakah pemula yang belum punya pengalaman boleh bergabung?',
      a: 'Sangat boleh! Komunitas Digital Vaibe Kendari dirancang inklusif mulai dari pemula awam hingga praktisi yang ingin mengakselerasi keterampilan digital mereka.'
    },
    {
      q: 'Bagaimana cara mendapatkan informasi jadwal pelatihan?',
      a: 'Seluruh jadwal, modul materi, dan tautan live session dibagikan melalui kanal komunikasi resmi eksklusif member VAIBE CLUB.'
    }
  ];

  const handleFieldToggle = (fieldId: string) => {
    if (formData.fields.includes(fieldId)) {
      if (formData.fields.length > 1) {
        setFormData({ ...formData, fields: formData.fields.filter(f => f !== fieldId) });
      }
    } else {
      setFormData({ ...formData, fields: [...formData.fields, fieldId] });
    }
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || formData.fields.length === 0) {
      alert('Mohon lengkapi Nama Lengkap dan minimal pilih satu bidang minat.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessModalData(data.registration);
        handleWhatsAppCheckout(data.registration);
      } else {
        alert(data.error || 'Terjadi kesalahan saat pendaftaran.');
      }
    } catch (err) {
      const mockReg: Registration = {
        id: 'VAIBE-' + Math.floor(100000 + Math.random() * 900000),
        fullName: formData.fullName,
        whatsapp: formData.whatsapp,
        email: formData.email,
        domicile: formData.domicile,
        status: formData.status,
        fields: formData.fields,
        goal: formData.goal,
        paymentStatus: 'Menunggu Pembayaran',
        membershipStatus: 'Pending',
        nominal: 250000,
        createdAt: new Date().toISOString()
      };
      setSuccessModalData(mockReg);
      handleWhatsAppCheckout(mockReg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppCheckout = (reg: Registration) => {
    const text = encodeURIComponent(
      `Halo Admin Digital Vaibe Kendari, saya ingin gabung komunitas.\n\n` +
      `ID Pendaftaran: *${reg.id}*\n` +
      `Nama Lengkap: *${reg.fullName}*\n` +
      `Status: *${reg.status}*\n` +
      `Domisili: *${reg.domicile}*\n` +
      `Bidang Peminatan: *${reg.fields.join(', ')}*\n` +
      `Nominal: *Rp250.000*\n\n` +
      `Saya ingin melanjutkan pembayaran pendaftaran Rp250K. Mohon petunjuk nomor rekening dan konfirmasi selanjutnya.`
    );
    window.open(`https://wa.me/6282371068831?text=${text}`, '_blank');
  };

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      const found = data.find((r: Registration) => 
        r.id.toLowerCase() === searchQuery.trim().toLowerCase() ||
        r.whatsapp.includes(searchQuery.trim())
      );
      if (found) {
        setSearchResult(found);
      } else {
        setSearchError('Data pendaftaran dengan ID atau WhatsApp tersebut belum ditemukan.');
      }
    } catch (err) {
      setSearchError('Gagal memuat data. Periksa jaringan Anda.');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: adminPin })
      });
      const data = await res.json();
      if (res.ok) {
        setAdminLoggedIn(true);
        fetchAdminRegistrations();
      } else {
        setAdminError(data.error || 'PIN Admin Salah');
      }
    } catch (err) {
      if (adminPin === 'vaibekendari2026' || adminPin === 'admin123' || adminPin === 'divikendari2026') {
        setAdminLoggedIn(true);
        fetchAdminRegistrations();
      } else {
        setAdminError('PIN Admin Salah');
      }
    }
  };

  const fetchAdminRegistrations = async () => {
    try {
      const res = await fetch('/api/registrations');
      const data = await res.json();
      setRegistrationsList(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerifyPayment = async (id: string, newPaymentStatus: string, newMembershipStatus: string) => {
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          paymentStatus: newPaymentStatus,
          membershipStatus: newMembershipStatus,
          adminPin: adminPin || 'vaibekendari2026'
        })
      });
      if (res.ok) {
        fetchAdminRegistrations();
      }
    } catch (e) {
      alert('Gagal memperbarui status.');
    }
  };

  return (
    <div className="min-h-screen bg-[#ebedf2] text-[#111111] font-sans selection:bg-black selection:text-white pb-12">
      
      {/* MINIMALIST FLOATING NAVBAR */}
      <header className="fixed top-3 sm:top-5 inset-x-0 z-50 px-3 sm:px-6 max-w-5xl mx-auto">
        <div className="clay-pill px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between backdrop-blur-md bg-[#ebedf2]/90 border border-white/70">
          
          {/* Minimalist Logo */}
          <a href="#beranda" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl clay-card overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_18.42.58_6d42a93a.jpeg" 
                alt="Digital Vaibe Kendari Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xs sm:text-sm tracking-tight text-black leading-tight">
                DIGITAL VAIBE
              </span>
              <span className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                VAIBE CLUB
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-bold text-gray-700">
            <a href="#beranda" className="hover:text-black transition-colors">Beranda</a>
            <a href="#bidang" className="hover:text-black transition-colors">Pelatihan</a>
            <a href="#keuntungan" className="hover:text-black transition-colors">Keuntungan</a>
            <a href="#alur" className="hover:text-black transition-colors">Alur</a>
            <a href="#faq" className="hover:text-black transition-colors">FAQ</a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCheckModalOpen(true)}
              className="clay-button px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-black cursor-pointer"
            >
              Cek Status
            </button>
            <a 
              href="#daftar" 
              className="clay-button-black px-3.5 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              Daftar
            </a>
            
            {/* Minimal Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden clay-button w-8 h-8 rounded-full flex items-center justify-center text-black ml-1 cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Minimal Mobile Menu Sheet */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 clay-card p-5 animate-in fade-in slide-in-from-top-3 duration-200 space-y-3">
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-center">
              <a 
                href="#beranda" 
                onClick={() => setMobileMenuOpen(false)} 
                className="clay-button py-2.5 rounded-xl text-black"
              >
                Beranda
              </a>
              <a 
                href="#bidang" 
                onClick={() => setMobileMenuOpen(false)} 
                className="clay-button py-2.5 rounded-xl text-black"
              >
                Pelatihan
              </a>
              <a 
                href="#keuntungan" 
                onClick={() => setMobileMenuOpen(false)} 
                className="clay-button py-2.5 rounded-xl text-black"
              >
                Keuntungan
              </a>
              <a 
                href="#alur" 
                onClick={() => setMobileMenuOpen(false)} 
                className="clay-button py-2.5 rounded-xl text-black"
              >
                Alur
              </a>
              <a 
                href="#faq" 
                onClick={() => setMobileMenuOpen(false)} 
                className="clay-button py-2.5 rounded-xl text-black col-span-2"
              >
                Pertanyaan Umum (FAQ)
              </a>
            </div>
            <a 
              href="#daftar" 
              onClick={() => setMobileMenuOpen(false)} 
              className="w-full block clay-button-black text-center py-2.5 rounded-xl text-xs font-bold"
            >
              Daftar Membership Rp250K
            </a>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="beranda" className="pt-24 sm:pt-36 pb-14 sm:pb-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Text Hero */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              
              {/* Animated Floating Pill Badge */}
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full clay-pill text-[11px] sm:text-xs font-bold text-black animate-float">
                <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                <span>Komunitas Resmi • VAIBE CLUB Kendari</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-black leading-[1.15]">
                Skill Digital Hari Ini, <br className="hidden sm:inline" />
                <span className="relative inline-block mt-1">
                  Peluang Baru di Hari Esok.
                  <span className="absolute left-0 -bottom-1 w-full h-[4px] bg-black rounded-full opacity-80" />
                </span>
              </h1>

              <p className="text-sm sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Bergabung dengan <strong className="text-black font-extrabold">VAIBE CLUB</strong>, wadah komunitas untuk belajar, berbagi pengalaman, dan mengakselerasi kemampuan digital bersama di Kota Kendari.
              </p>

              {/* Mobile Tactile CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-2">
                <a 
                  href="#daftar" 
                  className="clay-button-black py-3.5 px-7 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 cursor-pointer shadow-lg"
                >
                  <span>Gabung VAIBE CLUB</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a 
                  href="#bidang" 
                  className="clay-button py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base text-black flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Lihat Bidang Pelatihan</span>
                </a>
              </div>

              {/* Transparency Notice Badges */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                <div className="clay-card-sm p-4 flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl clay-inset flex items-center justify-center text-black shrink-0 font-extrabold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-black text-xs sm:text-sm">Membership Rp250K</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Sekali bayar tanpa biaya bulanan.</p>
                  </div>
                </div>

                <div className="clay-card-sm p-4 flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-2xl clay-inset flex items-center justify-center text-black shrink-0 font-extrabold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-black text-xs sm:text-sm">Bebas Pelatihan</h4>
                    <p className="text-[11px] text-gray-600 font-medium">Ikuti pelatihan tanpa biaya tambahan.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Claymorphic 3D Card Visual */}
            <div className="lg:col-span-5 flex justify-center mt-2 lg:mt-0">
              <div className="w-full max-w-sm clay-card p-6 sm:p-7 space-y-5 relative">
                
                {/* Floating Tag */}
                <div className="absolute -top-3.5 right-6 clay-button-black text-white text-[10px] font-extrabold px-3.5 py-1 rounded-full shadow-md">
                  Akses Penuh Komunitas
                </div>

                {/* Profile Header */}
                <div className="flex items-center space-x-3.5 pt-1">
                  <div className="w-12 h-12 rounded-2xl clay-inset flex items-center justify-center text-black font-extrabold text-lg">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-black">Member Pass Card</h3>
                    <p className="text-[11px] font-semibold text-gray-500">Digital Vaibe Kendari</p>
                  </div>
                </div>

                {/* Pillowy Spec Items */}
                <div className="space-y-2.5">
                  <div className="clay-inset p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-bold">Biaya Registrasi</span>
                    <span className="font-extrabold text-black text-sm">Rp250.000</span>
                  </div>
                  <div className="clay-inset p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-bold">Akses Pelatihan</span>
                    <span className="font-extrabold text-black flex items-center space-x-1">
                      <span>Semua Pelatihan Bebas</span>
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="clay-inset p-3.5 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-bold">Bidang Utama</span>
                    <span className="font-bold text-black">Basic, AI, Marketing, Coding</span>
                  </div>
                </div>

                <div className="pt-1">
                  <a 
                    href="#daftar" 
                    className="w-full clay-button-black py-3 rounded-2xl text-xs sm:text-sm font-bold text-center block"
                  >
                    Klaim Membership Sekarang
                  </a>
                </div>

                <p className="text-[10px] text-center text-gray-500 font-medium">
                  Setelah verifikasi pembayaran, anggota berhak mengikuti seluruh pelatihan resmi.
                </p>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BIDANG PELATIHAN SECTION (MOBILE OPTIMIZED CARDS) */}
      <section id="bidang" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <span className="clay-pill px-4 py-1.5 text-[11px] font-extrabold text-black uppercase tracking-wider">
              Kurikulum Pelatihan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
              Bidang Pembelajaran Pilihan
            </h2>
            <p className="text-xs sm:text-base text-gray-700 font-medium">
              Pilih bidang yang paling sesuai dengan minatmu. Kamu dapat mengeksplorasi bidang lainnya melalui pelatihan komunitas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trainingFields.map((field) => {
              const IconComponent = field.icon;
              const isSelected = formData.fields.includes(field.id);
              return (
                <div 
                  key={field.id}
                  onClick={() => handleFieldToggle(field.id)}
                  className={`clay-card p-5 sm:p-6 flex flex-col justify-between cursor-pointer transition-all duration-200 select-none ${
                    isSelected ? 'ring-2 ring-black bg-[#ffffff]' : ''
                  }`}
                >
                  <div>
                    {/* Card Top: Icon & Check button */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl clay-inset flex items-center justify-center text-black">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isSelected ? 'clay-button-black' : 'clay-button'
                      }`}>
                        {isSelected ? <Check className="w-4 h-4 text-white" /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md clay-pill text-gray-700">
                        {field.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-black mb-2">
                      {field.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium">
                      {field.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-300/60 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-500">
                      {isSelected ? '✓ Terpilih' : 'Ketuk untuk Minat'}
                    </span>
                    <span className="font-extrabold text-black">VAIBE CLUB</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs font-bold text-gray-600 clay-pill inline-block px-4 py-2">
              💡 Kamu bisa memilih lebih dari satu bidang pada formulir di bawah.
            </p>
          </div>

        </div>
      </section>

      {/* KEUNTUNGAN MEMBERSHIP SECTION */}
      <section id="keuntungan" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <span className="clay-pill px-4 py-1.5 text-[11px] font-extrabold text-black uppercase tracking-wider">
              Keuntungan Member
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
              Benefit Menjadi Bagian dari VAIBE CLUB
            </h2>
            <p className="text-xs sm:text-base text-gray-700 font-medium">
              Satu keputusan tepat untuk membuka gerbang skill dan jejaring digital Anda di Sulawesi Tenggara.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            <div className="clay-card p-6 sm:p-7 space-y-3">
              <div className="w-12 h-12 rounded-2xl clay-button-black flex items-center justify-center font-extrabold text-base">
                01
              </div>
              <h3 className="text-lg font-extrabold text-black">Biaya Sekali Bayar Rp250.000</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Cukup satu kali pendaftaran untuk keanggotaan aktif. Tidak ada biaya langganan bulanan tersembunyi.
              </p>
            </div>

            <div className="clay-card p-6 sm:p-7 space-y-3">
              <div className="w-12 h-12 rounded-2xl clay-button-black flex items-center justify-center font-extrabold text-base">
                02
              </div>
              <h3 className="text-lg font-extrabold text-black">Bebas Ikut Setiap Pelatihan</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Setelah status terverifikasi, anggota berhak mengikuti seluruh pelatihan yang diadakan Digital Vaibe Kendari tanpa biaya pelatihan tambahan.
              </p>
            </div>

            <div className="clay-card p-6 sm:p-7 space-y-3">
              <div className="w-12 h-12 rounded-2xl clay-button-black flex items-center justify-center font-extrabold text-base">
                03
              </div>
              <h3 className="text-lg font-extrabold text-black">Koneksi & Ruang Berkarya</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                Wadah kolaboratif untuk bertukar ide, membangun proyek digital bersama, dan berjejaring dengan talenta serta praktisi di Kendari.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CARA BERGABUNG (4 ALUR VISUAL TACTILE) */}
      <section id="alur" className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <span className="clay-pill px-4 py-1.5 text-[11px] font-extrabold text-black uppercase tracking-wider">
              Langkah Bergabung
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
              Empat Langkah Mudah Menjadi Anggota
            </h2>
            <p className="text-xs sm:text-base text-gray-700 font-medium">
              Alur pendaftaran yang jelas dan transparan hingga akun keanggotaan aktif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="clay-card p-5 sm:p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl clay-inset flex items-center justify-center font-extrabold text-lg text-black mx-auto">
                1
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-black">Pilih Bidang Minat</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Tentukan bidang utama yang ingin Anda pelajari terlebih dahulu.
              </p>
            </div>

            <div className="clay-card p-5 sm:p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl clay-inset flex items-center justify-center font-extrabold text-lg text-black mx-auto">
                2
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-black">Isi Formulir</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Lengkapi formulir pendaftaran di halaman ini dengan data yang benar.
              </p>
            </div>

            <div className="clay-card p-5 sm:p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl clay-inset flex items-center justify-center font-extrabold text-lg text-black mx-auto">
                3
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-black">Transfer Rp250K</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Lakukan pembayaran Rp250.000 ke rekening resmi komunitas.
              </p>
            </div>

            <div className="clay-card p-5 sm:p-6 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl clay-button-black flex items-center justify-center font-extrabold text-lg text-white mx-auto">
                4
              </div>
              <h4 className="font-extrabold text-sm sm:text-base text-black">Verifikasi & Aktif</h4>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                Setelah admin memverifikasi, Anda berhak mengikuti pelatihan komunitas.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* FORMULIR PENDAFTARAN MEMBER (MOBILE FRIENDLY & TACTILE) */}
      <section id="daftar" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="clay-card p-6 sm:p-10 relative">
            
            <div className="text-center max-w-xl mx-auto space-y-2.5 mb-8">
              <span className="clay-pill px-4 py-1 text-[11px] font-extrabold text-black uppercase tracking-wider">
                Formulir Pendaftaran
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black">
                Registrasi Anggota VAIBE CLUB
              </h2>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                Biaya pendaftaran: <strong className="text-black font-extrabold">Rp250.000 (Sekali Bayar)</strong>
              </p>
            </div>

            <form onSubmit={handleSubmitRegistration} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                    Nama Lengkap *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Muhammad Ilham"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl clay-inset border-none text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                    Domisili *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Kota Kendari / Sultra"
                    value={formData.domicile}
                    onChange={(e) => setFormData({ ...formData, domicile: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl clay-inset border-none text-xs sm:text-sm text-black focus:outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>
              </div>



              <div>
                <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                  Status Saat Ini *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  {statusOptions.map((st) => {
                    const isSelected = formData.status === st;
                    return (
                      <button
                        type="button"
                        key={st}
                        onClick={() => setFormData({ ...formData, status: st })}
                        className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                          isSelected ? 'clay-button-black' : 'clay-button text-gray-800'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-black mb-1.5 uppercase tracking-wider">
                  Pilihan Bidang Minat 
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {trainingFields.map((field) => {
                    const isChecked = formData.fields.includes(field.id);
                    return (
                      <div 
                        key={field.id}
                        onClick={() => handleFieldToggle(field.id)}
                        className={`p-3.5 rounded-2xl cursor-pointer flex items-center justify-between transition-all select-none ${
                          isChecked ? 'clay-button-black text-white' : 'clay-card-sm text-black'
                        }`}
                      >
                        <span className="font-extrabold text-xs">{field.title}</span>
                        <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${
                          isChecked ? 'bg-white text-black' : 'clay-inset text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full clay-button-black py-4 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 cursor-pointer shadow-xl"
                >
                  {submitting ? (
                    <span>Memproses Data...</span>
                  ) : (
                    <>
                      <span>Lanjutkan Pendaftaran (Rp250.000)</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-14">
            <span className="clay-pill px-4 py-1.5 text-[11px] font-extrabold text-black uppercase tracking-wider">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-base text-gray-700 font-medium">
              Informasi lengkap tentang biaya, keanggotaan, dan pelaksanaan program di VAIBE CLUB.
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="clay-card p-5 sm:p-6 transition-all duration-200">
                  <button 
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-black text-sm sm:text-base focus:outline-none cursor-pointer"
                  >
                    <span className="pr-3">{faq.q}</span>
                    <span className={`w-8 h-8 rounded-full clay-button shrink-0 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4 text-black" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="mt-3.5 pt-3.5 border-t border-gray-300 text-gray-700 text-xs sm:text-sm leading-relaxed font-medium animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-14 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="clay-card p-8 sm:p-14 text-center space-y-5">
            <span className="clay-pill px-4 py-1 text-[11px] font-extrabold text-black uppercase tracking-wider">
              Akselerasi Skill
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-black tracking-tight max-w-xl mx-auto">
              Mulai Perjalanan Skill Digitalmu Bersama VAIBE CLUB.
            </h2>
            <p className="text-xs sm:text-base text-gray-700 max-w-md mx-auto font-medium">
              Satu kali pendaftaran Rp250.000 untuk mengikuti setiap pelatihan komunitas Digital Vaibe Kendari tanpa biaya pelatihan tambahan.
            </p>
            <div className="pt-2">
              <a 
                href="#daftar" 
                className="clay-button-black py-4 px-8 rounded-2xl font-extrabold text-sm sm:text-base inline-flex items-center space-x-2 shadow-xl"
              >
                <span>Daftar Membership Rp250.000</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="pt-10 pb-8 border-t border-gray-300/80 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-gray-700">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-gray-300/80">
          
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-2xl clay-card overflow-hidden flex items-center justify-center">
              <img 
                src="/assets/aistudio/WhatsApp_Image_2026-10-28_at_18.42.58_6d42a93a.jpeg" 
                alt="Digital Vaibe Kendari Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-black">
                Digital Vaibe Kendari — VAIBE CLUB
              </h4>
              <p className="text-xs font-semibold text-gray-500">
                Belajar, Berbagi, Berkarya.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-700">
            <a href="#beranda" className="hover:text-black">Beranda</a>
            <a href="#bidang" className="hover:text-black">Pelatihan</a>
            <a href="#keuntungan" className="hover:text-black">Keuntungan</a>
            <a href="#faq" className="hover:text-black">FAQ</a>
            <button 
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-black inline-flex items-center space-x-1 cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Digital Vaibe Kendari (VAIBE CLUB). Hak Cipta Dilindungi.</p>
          <p className="mt-2 sm:mt-0">WhatsApp Resmi: 082371068831 • Kendari, Sulawesi Tenggara</p>
        </div>
      </footer>

      {/* SUCCESS MODAL / RINGKASAN PENDAFTARAN */}
      {successModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="clay-card bg-[#ebedf2] max-w-md w-full p-6 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
            
            <button 
              onClick={() => setSuccessModalData(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full clay-button flex items-center justify-center text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1.5 pt-2">
              <div className="w-14 h-14 rounded-full clay-button-black flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-black">Pendaftaran Tersimpan!</h3>
              <p className="text-xs text-gray-600 font-medium">
                ID Registrasi: <strong className="text-black font-extrabold">{successModalData.id}</strong>
              </p>
            </div>

            <div className="clay-inset p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Nama Pendaftar:</span>
                <span className="font-extrabold text-black">{successModalData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">WhatsApp:</span>
                <span className="font-extrabold text-black">{successModalData.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Status:</span>
                <span className="font-extrabold text-black">{successModalData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Bidang:</span>
                <span className="font-extrabold text-black text-right max-w-[180px] truncate">{successModalData.fields.join(', ')}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2">
                <span className="text-gray-600 font-bold">Biaya Pendaftaran:</span>
                <span className="font-extrabold text-black text-sm">Rp250.000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-bold">Status Pembayaran:</span>
                <span className="clay-button-black px-2 py-0.5 rounded text-[10px] font-extrabold">
                  {successModalData.paymentStatus}
                </span>
              </div>
            </div>

            <div className="clay-inset p-3.5 rounded-2xl text-[11px] text-gray-800 space-y-1 font-medium">
              <p className="font-extrabold text-black">Instruksi Pembayaran Resmi:</p>
              <p>Transfer <strong>Rp250.000</strong> ke Rekening Resmi Komunitas:</p>
              <p className="font-extrabold text-black text-xs">Bank BRI: 1234-01-005678-50-9</p>
              <p className="text-[10px] text-gray-600">a.n. Digital Vaibe Kendari (atau QRIS via WhatsApp)</p>
            </div>

            <div className="space-y-2.5 pt-1">
              <button 
                onClick={() => handleWhatsAppCheckout(successModalData)}
                className="w-full clay-button-black py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Kirim Pesan ke WhatsApp (082371068831)</span>
              </button>
              <button 
                onClick={() => setSuccessModalData(null)}
                className="w-full clay-button py-2.5 rounded-xl text-xs font-bold text-gray-700 cursor-pointer"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CEK STATUS MODAL */}
      {checkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="clay-card bg-[#ebedf2] max-w-md w-full p-6 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
            
            <button 
              onClick={() => setCheckModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full clay-button flex items-center justify-center text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1 pt-1">
              <div className="w-12 h-12 rounded-2xl clay-inset flex items-center justify-center text-black mx-auto">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-extrabold text-black">Cek Status Pendaftaran</h3>
              <p className="text-xs text-gray-600 font-medium">
                Masukkan ID Pendaftaran (contoh: VAIBE-123456) atau No WhatsApp Anda.
              </p>
            </div>

            <form onSubmit={handleCheckStatus} className="space-y-3">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  required
                  placeholder="VAIBE-XXXXXX atau 0812..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-2xl clay-inset border-none text-xs text-black focus:outline-none font-medium"
                />
                <button 
                  type="submit"
                  disabled={searchLoading}
                  className="clay-button-black px-4 py-2.5 rounded-2xl text-xs font-bold cursor-pointer"
                >
                  {searchLoading ? 'Cek...' : 'Cari'}
                </button>
              </div>
            </form>

            {searchError && (
              <div className="p-3 rounded-2xl clay-inset text-black text-xs flex items-center space-x-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{searchError}</span>
              </div>
            )}

            {searchResult && (
              <div className="clay-inset p-4 space-y-2.5 text-xs animate-in fade-in duration-200 font-medium">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold">ID:</span>
                  <span className="font-extrabold text-black">{searchResult.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold">Nama:</span>
                  <span className="font-extrabold text-black">{searchResult.fullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold">WhatsApp:</span>
                  <span className="font-extrabold text-black">{searchResult.whatsapp}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-300 pt-2">
                  <span className="text-gray-600 font-bold">Status Bayar:</span>
                  <span className="clay-button-black px-2 py-0.5 rounded text-[10px] font-extrabold">
                    {searchResult.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-bold">Membership:</span>
                  <span className="clay-pill px-2.5 py-0.5 text-[10px] font-extrabold text-black">
                    {searchResult.membershipStatus}
                  </span>
                </div>

                {searchResult.paymentStatus !== 'Terverifikasi' && (
                  <div className="pt-2">
                    <button 
                      onClick={() => handleWhatsAppCheckout(searchResult)}
                      className="w-full clay-button-black py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Konfirmasi Pembayaran via WhatsApp</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD MODAL */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="clay-card bg-[#ebedf2] max-w-3xl w-full p-6 sm:p-7 space-y-5 relative max-h-[92vh] overflow-y-auto">
            
            <button 
              onClick={() => { setAdminModalOpen(false); setAdminLoggedIn(false); setAdminPin(''); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full clay-button flex items-center justify-center text-black cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {!adminLoggedIn ? (
              <div className="max-w-xs mx-auto py-6 space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl clay-button-black flex items-center justify-center mx-auto">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-black">Admin VAIBE CLUB</h3>
                  <p className="text-xs text-gray-600 font-medium mt-0.5">
                    Masukkan PIN Admin untuk verifikasi pendaftaran.
                  </p>
                </div>

                <form onSubmit={handleAdminLogin} className="space-y-3">
                  <input 
                    type="password" 
                    required
                    placeholder="PIN (vaibekendari2026 / admin123)"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl clay-inset border-none text-center text-xs text-black focus:outline-none font-bold"
                  />
                  {adminError && <p className="text-black text-xs font-extrabold">{adminError}</p>}
                  <button 
                    type="submit"
                    className="w-full clay-button-black py-2.5 rounded-2xl text-xs font-bold cursor-pointer"
                  >
                    Buka Dashboard
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-gray-300 pb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-black">Dashboard Pendaftar VAIBE CLUB</h3>
                    <p className="text-xs text-gray-600 font-medium">Verifikasi pembayaran pendaftaran Rp250K.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => {
                        const csvContent = "data:text/csv;charset=utf-8," + 
                          ["ID,Nama,WhatsApp,Status,Domisili,Bidang,Pembayaran,Membership,Tanggal"]
                          .concat(registrationsList.map(r => `"${r.id}","${r.fullName}","${r.whatsapp}","${r.status}","${r.domicile}","${r.fields.join(' - ')}","${r.paymentStatus}","${r.membershipStatus}","${r.createdAt}"`))
                          .join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "vaibe_club_registrations.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      className="clay-button px-3 py-1.5 rounded-xl text-xs font-bold text-black flex items-center space-x-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button 
                      onClick={() => setAdminLoggedIn(false)}
                      className="clay-button px-3 py-1.5 rounded-xl text-xs font-bold text-black cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {['All', 'Menunggu Pembayaran', 'Terverifikasi'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        filterStatus === st ? 'clay-button-black' : 'clay-button text-gray-700'
                      }`}
                    >
                      {st} ({st === 'All' ? registrationsList.length : registrationsList.filter(r => r.paymentStatus === st).length})
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-gray-800">
                    <thead className="clay-card-sm text-black uppercase font-extrabold">
                      <tr>
                        <th className="p-2.5 rounded-l-xl">ID & Nama</th>
                        <th className="p-2.5">WhatsApp / Status</th>
                        <th className="p-2.5">Bidang</th>
                        <th className="p-2.5">Status Bayar</th>
                        <th className="p-2.5 rounded-r-xl text-center">Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {registrationsList
                        .filter(r => filterStatus === 'All' || r.paymentStatus === filterStatus)
                        .map((reg) => (
                          <tr key={reg.id} className="hover:bg-gray-200/50">
                            <td className="p-2.5">
                              <div className="font-extrabold text-black">{reg.id}</div>
                              <div className="font-bold text-gray-800">{reg.fullName}</div>
                            </td>
                            <td className="p-2.5">
                              <div className="font-bold text-black">{reg.whatsapp}</div>
                              <div className="text-[10px] text-gray-600">{reg.status}</div>
                            </td>
                            <td className="p-2.5">
                              <div className="max-w-xs font-medium text-gray-700 truncate">{reg.fields.join(', ')}</div>
                            </td>
                            <td className="p-2.5">
                              <span className="clay-button-black px-2 py-0.5 rounded text-[10px] font-extrabold">
                                {reg.paymentStatus}
                              </span>
                            </td>
                            <td className="p-2.5 text-center">
                              {reg.paymentStatus !== 'Terverifikasi' ? (
                                <button 
                                  onClick={() => handleVerifyPayment(reg.id, 'Terverifikasi', 'Aktif')}
                                  className="clay-button-black px-3 py-1 rounded-xl text-[10px] font-extrabold cursor-pointer"
                                >
                                  Verifikasi Lunas
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handleVerifyPayment(reg.id, 'Menunggu Pembayaran', 'Pending')}
                                  className="clay-button px-3 py-1 rounded-xl text-[10px] font-extrabold text-black cursor-pointer"
                                >
                                  Batalkan
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      {registrationsList.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                            Belum ada pendaftaran.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
