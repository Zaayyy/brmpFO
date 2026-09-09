import React, { useState, useEffect } from 'react';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import HeroCards from './components/HeroCards';
import GuestbookModal from './components/GuestbookModal';
import WebsiteModal from './components/WebsiteModal';
import ConfigModal from './components/ConfigModal';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { checkAdminAuth } from './utils/guestbookStore';
import { Leaf, ShieldCheck } from 'lucide-react';

export default function App() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isWebsiteOpen, setIsWebsiteOpen] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Page Routing: 'frontoffice' | 'admin'
  const [currentPage, setCurrentPage] = useState(() => {
    const hash = window.location.hash;
    const path = window.location.pathname;
    if (hash === '#admin' || path.startsWith('/admin')) {
      return 'admin';
    }
    return 'frontoffice';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => checkAdminAuth());

  const [websiteUrl, setWebsiteUrl] = useState(() => {
    const saved = localStorage.getItem('brmp_web_url');
    if (!saved || saved.includes('bsip') || saved.includes('jogja')) {
      localStorage.setItem('brmp_web_url', 'https://brmpdiy.my.id/');
      return 'https://brmpdiy.my.id/';
    }
    return saved;
  });
  const [guestbookType, setGuestbookType] = useState(() => {
    localStorage.setItem('brmp_guest_type', 'modal');
    return 'modal';
  });
  const [externalGuestUrl, setExternalGuestUrl] = useState(() => {
    return localStorage.getItem('brmp_guest_ext_url') || '';
  });
  const [questionnaireUrl, setQuestionnaireUrl] = useState(() => {
    return (
      localStorage.getItem('brmp_survey_url') ||
      'https://docs.google.com/forms/d/e/1FAIpQLSeY3UsQnLzl6jUj6RFppdyID_oV8Ja4aygP_yAPHbwhZDxc8w/viewform'
    );
  });
  const [officialWebUrl, setOfficialWebUrl] = useState(() => {
    return (
      localStorage.getItem('brmp_official_web_url') ||
      'https://diy.brmp.pertanian.go.id/'
    );
  });

  const [greeting, setGreeting] = useState('');

  // Sync URL hash for page navigation
  useEffect(() => {
    const handleHashOrPopState = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      if (hash === '#admin' || path.startsWith('/admin')) {
        setCurrentPage('admin');
      } else {
        setCurrentPage('frontoffice');
      }
    };
    window.addEventListener('hashchange', handleHashOrPopState);
    window.addEventListener('popstate', handleHashOrPopState);
    return () => {
      window.removeEventListener('hashchange', handleHashOrPopState);
      window.removeEventListener('popstate', handleHashOrPopState);
    };
  }, []);

  const navigateToAdmin = () => {
    window.location.hash = 'admin';
    setCurrentPage('admin');
    setIsAdminAuthenticated(checkAdminAuth());
  };

  const navigateToFO = () => {
    window.location.hash = '';
    setCurrentPage('frontoffice');
  };

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 4 && hour < 11) {
        setGreeting('Selamat Pagi & Selamat Datang');
      } else if (hour >= 11 && hour < 15) {
        setGreeting('Selamat Siang & Selamat Datang');
      } else if (hour >= 15 && hour < 18) {
        setGreeting('Selamat Sore & Selamat Datang');
      } else {
        setGreeting('Selamat Datang di Pelayanan Terpadu');
      }
    };
    updateGreeting();
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { localStorage.setItem('brmp_web_url', websiteUrl); }, [websiteUrl]);
  useEffect(() => { localStorage.setItem('brmp_guest_type', guestbookType); }, [guestbookType]);
  useEffect(() => { localStorage.setItem('brmp_guest_ext_url', externalGuestUrl); }, [externalGuestUrl]);
  useEffect(() => { localStorage.setItem('brmp_survey_url', questionnaireUrl); }, [questionnaireUrl]);
  useEffect(() => { localStorage.setItem('brmp_official_web_url', officialWebUrl); }, [officialWebUrl]);

  const handleOpenGuestbook = () => {
    setIsGuestbookOpen(true);
  };

  const handleOpenWebsite = () => {
    window.open('https://brmpdiy.my.id/', '_blank', 'noopener,noreferrer');
  };

  const handleOpenQuestionnaire = () => {
    window.open(
      questionnaireUrl ||
        'https://docs.google.com/forms/d/e/1FAIpQLSeY3UsQnLzl6jUj6RFppdyID_oV8Ja4aygP_yAPHbwhZDxc8w/viewform',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const handleOpenOfficialWeb = () => {
    window.open(
      officialWebUrl || 'https://diy.brmp.pertanian.go.id/',
      '_blank',
      'noopener,noreferrer'
    );
  };

  // Render Admin View if current page is admin
  if (currentPage === 'admin') {
    if (isAdminAuthenticated) {
      return (
        <AdminDashboard
          onLogout={() => {
            setIsAdminAuthenticated(false);
          }}
          onBackToFO={navigateToFO}
        />
      );
    }
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setIsAdminAuthenticated(true);
        }}
        onBackToFO={navigateToFO}
      />
    );
  }

  // Otherwise render Front Office Kiosk
  return (
    <div className="kiosk-app-root">
      {/* Soft radiant ambient blurs */}
      <div className="ambient-orb orb-emerald"></div>
      <div className="ambient-orb orb-sapphire"></div>
      <div className="ambient-orb orb-gold"></div>

      {/* Decorative agriculture leaf ornaments */}
      <div className="agri-deco deco-leaf-1">🌿</div>
      <div className="agri-deco deco-leaf-2">🍃</div>
      <div className="agri-deco deco-leaf-3">🌱</div>
      <div className="agri-deco deco-leaf-4">🌾</div>
      <div className="agri-deco deco-leaf-5">☘️</div>
      <div className="agri-deco deco-leaf-6">🌿</div>

      {/* Decorative vine/branch SVG overlays */}
      <svg className="vine-deco vine-top-left" viewBox="0 0 300 300" fill="none">
        <path d="M0 0 Q80 120, 60 260 Q55 280, 30 300" stroke="rgba(16,185,129,0.15)" strokeWidth="3" fill="none" />
        <path d="M0 30 Q60 100, 50 200 Q45 230, 20 260" stroke="rgba(52,211,153,0.12)" strokeWidth="2.5" fill="none" />
        <circle cx="60" cy="130" r="8" fill="rgba(16,185,129,0.12)" />
        <circle cx="45" cy="220" r="6" fill="rgba(52,211,153,0.1)" />
        <path d="M60 130 Q75 120, 90 128 M60 130 Q50 115, 62 105" stroke="rgba(16,185,129,0.18)" strokeWidth="2" fill="none" />
      </svg>
      <svg className="vine-deco vine-top-right" viewBox="0 0 300 300" fill="none">
        <path d="M300 0 Q220 120, 240 260 Q245 280, 270 300" stroke="rgba(16,185,129,0.15)" strokeWidth="3" fill="none" />
        <path d="M300 30 Q240 100, 250 200 Q255 230, 280 260" stroke="rgba(52,211,153,0.12)" strokeWidth="2.5" fill="none" />
        <circle cx="240" cy="130" r="8" fill="rgba(16,185,129,0.12)" />
        <circle cx="255" cy="220" r="6" fill="rgba(52,211,153,0.1)" />
        <path d="M240 130 Q225 120, 210 128 M240 130 Q250 115, 238 105" stroke="rgba(16,185,129,0.18)" strokeWidth="2" fill="none" />
      </svg>
      <svg className="vine-deco vine-bottom" viewBox="0 0 1400 120" fill="none">
        <path d="M0 100 Q200 30, 400 80 Q600 130, 800 60 Q1000 -10, 1200 70 Q1350 110, 1400 90" stroke="rgba(16,185,129,0.12)" strokeWidth="3" fill="none" />
        <path d="M0 110 Q200 50, 400 90 Q600 140, 800 75 Q1000 10, 1200 85 Q1350 120, 1400 100" stroke="rgba(52,211,153,0.08)" strokeWidth="2" fill="none" />
        {[100, 300, 500, 700, 900, 1100, 1300].map((cx, i) => (
          <g key={i}>
            <circle cx={cx} cy={70 + (i % 2 === 0 ? -15 : 15)} r="4" fill="rgba(16,185,129,0.15)" />
            <path d={`M${cx} ${70 + (i % 2 === 0 ? -15 : 15)} Q${cx + 12} ${70 + (i % 2 === 0 ? -28 : 2)}, ${cx + 20} ${70 + (i % 2 === 0 ? -18 : 12)}`} stroke="rgba(52,211,153,0.15)" strokeWidth="1.5" fill="none" />
          </g>
        ))}
      </svg>

      <ParticleBackground />

      <div className="kiosk-layout-wrapper">
        
        <Header
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onOpenConfig={() => setIsConfigOpen(true)}
          onOpenAdmin={navigateToAdmin}
        />

        {/* Welcome Section */}
        <section className="welcome-banner-section">
          <div className="greeting-pill-badge">
            <span className="live-sparkle-dot"></span>
            <Leaf size={16} className="text-emerald" />
            <span className="greeting-text-val">{greeting}</span>
          </div>
          
          <h2 className="hero-display-headline">
            Selamat Datang di{' '}
            <span className="gradient-text-animated">BRMP DIY</span>
          </h2>

          <div className="hero-tagline-row">
            <span className="tagline-dash"></span>
            <p className="hero-tagline-text">
              Balai Besar Penerapan Modernisasi Pertanian
            </p>
            <span className="tagline-dash"></span>
          </div>
          
          <p className="hero-display-sub">
            Satu pintu pelayanan terpadu untuk pengujian mutu, sertifikasi benih, dan modernisasi pertanian di <strong>Daerah Istimewa Yogyakarta</strong>.
          </p>
        </section>

        {/* 4 Main Hero Action Buttons */}
        <main className="main-cards-container">
          <HeroCards
            onOpenGuestbook={handleOpenGuestbook}
            onOpenWebsite={handleOpenWebsite}
            onOpenQuestionnaire={handleOpenQuestionnaire}
            onOpenOfficialWeb={handleOpenOfficialWeb}
          />
        </main>

        {/* Soft bottom attribution */}
        <div className="bottom-branding">
          <div className="bottom-branding-left">
            <Leaf size={14} className="text-emerald" />
            <span>© {new Date().getFullYear()} BRMP D.I. Yogyakarta • Pelayanan Terpadu Agromodern</span>
          </div>
          <button
            type="button"
            onClick={navigateToAdmin}
            className="bottom-admin-link"
            title="Masuk ke Dashboard Admin Buku Tamu"
          >
            <ShieldCheck size={14} />
            <span>Akses Dashboard Admin</span>
          </button>
        </div>

      </div>

      {/* Modals */}
      <GuestbookModal isOpen={isGuestbookOpen} onClose={() => setIsGuestbookOpen(false)} />
      <WebsiteModal isOpen={isWebsiteOpen} onClose={() => setIsWebsiteOpen(false)} websiteUrl={websiteUrl} />
      <ConfigModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        websiteUrl={websiteUrl}
        setWebsiteUrl={setWebsiteUrl}
        guestbookType={guestbookType}
        setGuestbookType={setGuestbookType}
        externalGuestUrl={externalGuestUrl}
        setExternalGuestUrl={setExternalGuestUrl}
        questionnaireUrl={questionnaireUrl}
        setQuestionnaireUrl={setQuestionnaireUrl}
        officialWebUrl={officialWebUrl}
        setOfficialWebUrl={setOfficialWebUrl}
      />
    </div>
  );
}
