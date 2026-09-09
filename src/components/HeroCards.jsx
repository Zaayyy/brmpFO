import React, { useRef, useEffect } from 'react';
import { Globe, ArrowRight, Sparkles, ExternalLink, Star } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function HeroCards({ onOpenGuestbook, onOpenWebsite, onOpenQuestionnaire }) {
  const cardGuestbookRef = useRef(null);
  const cardWebsiteRef = useRef(null);
  const cardQuestionnaireRef = useRef(null);

  // 3D Parallax Tilt Effect for desktop & smooth touch feedback
  const applyTiltEffect = (cardRef) => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9;
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;

      // Update specular sheen position
      const sheen = card.querySelector('.card-specular-sheen');
      if (sheen) {
        sheen.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 65%)`;
      }
    };

    const handleMouseLeave = () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
      const sheen = card.querySelector('.card-specular-sheen');
      if (sheen) {
        sheen.style.background = `none`;
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  };

  useEffect(() => {
    const clean1 = applyTiltEffect(cardGuestbookRef);
    const clean2 = applyTiltEffect(cardWebsiteRef);
    const clean3 = applyTiltEffect(cardQuestionnaireRef);
    return () => {
      if (clean1) clean1();
      if (clean2) clean2();
      if (clean3) clean3();
    };
  }, []);

  const handleCardClick = (type) => {
    soundManager.playClick();
    if (type === 'guestbook') {
      onOpenGuestbook();
    } else if (type === 'website') {
      onOpenWebsite();
    } else if (type === 'questionnaire') {
      onOpenQuestionnaire();
    }
  };

  return (
    <section className="hero-cards-section">
      <div className="cards-wrapper-grid">

        {/* ==================================================== */}
        {/* CARD 1: BUKU TAMU DIGITAL */}
        {/* ==================================================== */}
        <div
          ref={cardGuestbookRef}
          className="hero-action-card card-emerald-theme"
          onClick={() => handleCardClick('guestbook')}
          onMouseEnter={() => soundManager.playHover()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('guestbook')}
        >
          {/* Eye-catching Attract Mode Radar Rings */}
          <div className="radar-emitter">
            <div className="radar-wave wave-1"></div>
            <div className="radar-wave wave-2"></div>
            <div className="radar-wave wave-3"></div>
          </div>

          {/* Glowing Animated Border Frame */}
          <div className="animated-border-sheen"></div>

          {/* Interactive Specular Light Sheen */}
          <div className="card-specular-sheen"></div>

          <div className="card-content-stack">

            {/* Top Category Badge */}
            <div className="top-badge-row">
              <span className="badge-pill emerald-pill">
                <Sparkles size={14} className="sparkle-icon" />
                <span>LAYANAN RESEPSIONIS & KUNJUNGAN</span>
              </span>
              <span className="queue-status-tag">
                <span className="status-indicator-green"></span> Siap Melayani
              </span>
            </div>

            {/* Central 3D Vector Visual */}
            <div className="visual-hero-box">
              <div className="ambient-glow-circle emerald-glow-bg"></div>

              <div className="icon-3d-scene">
                <svg viewBox="0 0 160 160" className="vector-3d-svg">
                  <defs>
                    <linearGradient id="bookCoverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="40%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#064E3B" />
                    </linearGradient>
                    <linearGradient id="pagesGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <linearGradient id="goldPenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="50%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#B45309" />
                    </linearGradient>
                    <filter id="shadow3D" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#059669" floodOpacity="0.4" />
                    </filter>
                  </defs>

                  {/* 3D Isometric Book Base */}
                  <g filter="url(#shadow3D)">
                    <rect x="25" y="32" width="105" height="98" rx="14" fill="url(#bookCoverGrad)" />
                    <rect x="33" y="26" width="97" height="94" rx="10" fill="url(#pagesGrad)" />

                    <line x1="50" y1="46" x2="108" y2="46" stroke="#059669" strokeWidth="4.5" strokeLinecap="round" />
                    <line x1="50" y1="62" x2="100" y2="62" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="50" y1="78" x2="106" y2="78" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1="50" y1="94" x2="82" y2="94" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round" />

                    <path d="M96 26 L96 60 L86 50 L76 60 L76 26" fill="#DC2626" opacity="0.9" />
                  </g>

                  {/* Animated 3D Floating Pen */}
                  <g className="floating-pen-anim">
                    <path
                      d="M112 22 L134 44 L86 92 L64 94 L66 72 Z"
                      fill="url(#goldPenGrad)"
                      filter="drop-shadow(0 8px 10px rgba(0,0,0,0.35))"
                    />
                    <polygon points="64,94 58,102 66,100" fill="#1E293B" />
                    <rect x="115" y="26" width="6" height="24" rx="3" fill="#FFF" opacity="0.75" />
                  </g>

                  {/* Floating sparkles */}
                  <circle cx="28" cy="24" r="3.5" fill="#FDE047" className="star-float-1" />
                  <circle cx="138" cy="116" r="4.5" fill="#34D399" className="star-float-2" />
                </svg>
              </div>
            </div>

            {/* Typography & Description */}
            <div className="card-text-block">
              <h2 className="card-main-heading">BUKU TAMU DIGITAL</h2>
              <p className="card-description-text">
                Registrasi kehadiran tamu, konsultasi mutu benih, pengujian lab, koordinasi kedinasan, dan permohonan layanan agromodern BRMP DIY.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="card-bottom-cta">
              <div className="prominent-button emerald-cta-btn">
                <span className="btn-label-text">Isi Buku Tamu Sekarang</span>
                <span className="btn-arrow-wrap">
                  <ArrowRight size={22} className="btn-arrow-icon" />
                </span>
              </div>
              <div className="tap-invite-hint">
                <span className="tap-hand">👆</span> Sentuh layar untuk mulai
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* CARD 2: WEBSITE RESMI BRMP DIY (brmpdiy.my.id) */}
        {/* ==================================================== */}
        <div
          ref={cardWebsiteRef}
          className="hero-action-card card-sapphire-theme"
          onClick={() => handleCardClick('website')}
          onMouseEnter={() => soundManager.playHover()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('website')}
        >
          {/* Eye-catching Attract Mode Radar Rings */}
          <div className="radar-emitter">
            <div className="radar-wave wave-1"></div>
            <div className="radar-wave wave-2"></div>
            <div className="radar-wave wave-3"></div>
          </div>

          {/* Glowing Animated Border Frame */}
          <div className="animated-border-sheen"></div>

          {/* Interactive Specular Light Sheen */}
          <div className="card-specular-sheen"></div>

          <div className="card-content-stack">

            {/* Top Category Badge */}
            <div className="top-badge-row">
              <span className="badge-pill sapphire-pill">
                <Globe size={14} className="sparkle-icon" />
                <span>PORTAL AGROMODERN BRMPDIY.MY.ID</span>
              </span>
              <span className="online-status-tag">
                <span className="status-indicator-blue"></span> Portal Online
              </span>
            </div>

            {/* Central 3D Vector Visual */}
            <div className="visual-hero-box">
              <div className="ambient-glow-circle sapphire-glow-bg"></div>

              <div className="icon-3d-scene">
                <svg viewBox="0 0 160 160" className="vector-3d-svg">
                  <defs>
                    <linearGradient id="globeSphereGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="45%" stopColor="#2563EB" />
                      <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <linearGradient id="orbitGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="60%" stopColor="#F59E0B" />
                      <stop offset="100%" stopColor="#D97706" />
                    </linearGradient>
                    <filter id="shadowGlobe" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2563EB" floodOpacity="0.45" />
                    </filter>
                  </defs>

                  {/* 3D Globe with Glowing Grid Lines */}
                  <g filter="url(#shadowGlobe)">
                    <circle cx="80" cy="80" r="50" fill="url(#globeSphereGrad)" />
                    <ellipse cx="80" cy="80" rx="50" ry="24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
                    <ellipse cx="80" cy="80" rx="26" ry="50" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" />
                    <line x1="30" y1="80" x2="130" y2="80" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
                    <line x1="80" y1="30" x2="80" y2="130" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" />
                  </g>

                  {/* Glowing Orbit Rings */}
                  <g className="floating-orbit-anim">
                    <ellipse
                      cx="80"
                      cy="80"
                      rx="64"
                      ry="22"
                      fill="none"
                      stroke="url(#orbitGoldGrad)"
                      strokeWidth="4"
                      transform="rotate(-28 80 80)"
                      strokeDasharray="10 8"
                    />
                    <circle cx="132" cy="54" r="7" fill="#FDE047" filter="drop-shadow(0 0 8px #FDE047)" />
                    <circle cx="28" cy="106" r="5" fill="#38BDF8" filter="drop-shadow(0 0 8px #38BDF8)" />
                  </g>

                  {/* Floating 3D Browser Window Preview */}
                  <g className="floating-browser-anim" transform="translate(68, 62)">
                    <rect
                      x="0"
                      y="0"
                      width="54"
                      height="40"
                      rx="6"
                      fill="#0B1329"
                      stroke="#38BDF8"
                      strokeWidth="2.5"
                      filter="drop-shadow(0 8px 14px rgba(0,0,0,0.6))"
                    />
                    <circle cx="8" cy="8" r="2" fill="#EF4444" />
                    <circle cx="15" cy="8" r="2" fill="#F59E0B" />
                    <circle cx="22" cy="8" r="2" fill="#10B981" />
                    <rect x="8" y="16" width="38" height="4" rx="2" fill="#38BDF8" opacity="0.85" />
                    <rect x="8" y="24" width="26" height="4" rx="2" fill="#94A3B8" opacity="0.65" />
                    <rect x="8" y="31" width="16" height="3" rx="1.5" fill="#FDE047" opacity="0.8" />
                  </g>
                </svg>
              </div>
            </div>

            {/* Typography & Description */}
            <div className="card-text-block">
              <h2 className="card-main-heading">PORTAL LAYANAN BRMP DIY</h2>
              <p className="card-description-text">
                Akses portal resmi <strong>brmpdiy.my.id</strong> untuk tracking uji lab, pengawasan mutu benih padi & jagung, dan informasi agromodern Jogja.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="card-bottom-cta">
              <div className="prominent-button sapphire-cta-btn">
                <span className="btn-label-text">Kunjungi brmpdiy.my.id</span>
                <span className="btn-arrow-wrap">
                  <ExternalLink size={20} className="btn-arrow-icon" />
                </span>
              </div>
              <div className="tap-invite-hint">
                <span className="tap-hand">👆</span> Sentuh layar untuk membuka
              </div>
            </div>

          </div>
        </div>

        {/* ==================================================== */}
        {/* CARD 3: KUESIONER KEPUASAN MASYARAKAT (SKM) */}
        {/* ==================================================== */}
        <div
          ref={cardQuestionnaireRef}
          className="hero-action-card card-amber-theme"
          onClick={() => handleCardClick('questionnaire')}
          onMouseEnter={() => soundManager.playHover()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick('questionnaire')}
        >
          {/* Eye-catching Attract Mode Radar Rings */}
          <div className="radar-emitter">
            <div className="radar-wave wave-1"></div>
            <div className="radar-wave wave-2"></div>
            <div className="radar-wave wave-3"></div>
          </div>

          {/* Glowing Animated Border Frame */}
          <div className="animated-border-sheen"></div>

          {/* Interactive Specular Light Sheen */}
          <div className="card-specular-sheen"></div>

          <div className="card-content-stack">

            {/* Top Category Badge */}
            <div className="top-badge-row">
              <span className="badge-pill amber-pill">
                <Star size={14} className="sparkle-icon" />
                <span>SURVEI & EVALUASI LAYANAN</span>
              </span>
              <span className="online-status-tag">
                <span className="status-indicator-gold"></span> Terbuka Umum
              </span>
            </div>

            {/* Central 3D Vector Visual */}
            <div className="visual-hero-box">
              <div className="ambient-glow-circle amber-glow-bg"></div>

              <div className="icon-3d-scene">
                <svg viewBox="0 0 160 160" className="vector-3d-svg">
                  <defs>
                    <linearGradient id="boardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="40%" stopColor="#D97706" />
                      <stop offset="100%" stopColor="#92400E" />
                    </linearGradient>
                    <linearGradient id="sheetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="100%" stopColor="#FFFBEB" />
                    </linearGradient>
                    <linearGradient id="amberStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FDE047" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                    <linearGradient id="clipMetallicGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#E2E8F0" />
                      <stop offset="50%" stopColor="#94A3B8" />
                      <stop offset="100%" stopColor="#CBD5E1" />
                    </linearGradient>
                    <filter id="shadowSurvey" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#D97706" floodOpacity="0.38" />
                    </filter>
                  </defs>

                  {/* 3D Isometric Clipboard Base */}
                  <g filter="url(#shadowSurvey)">
                    <rect x="25" y="28" width="106" height="104" rx="14" fill="url(#boardGrad)" />
                    <rect x="33" y="36" width="90" height="90" rx="8" fill="url(#sheetGrad)" />

                    {/* Top Clip */}
                    <rect x="58" y="22" width="40" height="14" rx="4" fill="url(#clipMetallicGrad)" />
                    <circle cx="78" cy="28" r="3" fill="#64748B" />

                    {/* Survey Checkmarks & Rating Stars */}
                    {/* Item 1 */}
                    <rect x="42" y="48" width="10" height="10" rx="3" fill="#10B981" />
                    <polyline points="44,53 47,56 50,50" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="58" y1="53" x2="110" y2="53" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Item 2 */}
                    <rect x="42" y="64" width="10" height="10" rx="3" fill="#10B981" />
                    <polyline points="44,69 47,72 50,66" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="58" y1="69" x2="104" y2="69" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                    {/* Item 3 */}
                    <rect x="42" y="80" width="10" height="10" rx="3" fill="#10B981" />
                    <polyline points="44,85 47,88 50,82" stroke="#FFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="58" y1="85" x2="98" y2="85" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />

                    {/* 5-Star Row */}
                    <g transform="translate(42, 98)">
                      {[0, 14, 28, 42, 56].map((offset, idx) => (
                        <path
                          key={idx}
                          d={`M${offset + 6} 0 L${offset + 7.8} 3.6 L${offset + 12} 4.2 L${offset + 9} 7.2 L${offset + 9.8} 11.2 L${offset + 6} 9.2 L${offset + 2.2} 11.2 L${offset + 3} 7.2 L${offset + 0} 4.2 L${offset + 4.2} 3.6 Z`}
                          fill="url(#amberStarGrad)"
                        />
                      ))}
                    </g>
                  </g>

                  {/* Animated 3D Floating Stylus/Pen */}
                  <g className="floating-pen-anim">
                    <path
                      d="M112 24 L132 44 L88 88 L70 90 L72 72 Z"
                      fill="url(#amberStarGrad)"
                      filter="drop-shadow(0 8px 10px rgba(0,0,0,0.35))"
                    />
                    <polygon points="70,90 64,98 72,96" fill="#1E293B" />
                    <rect x="114" y="28" width="6" height="22" rx="3" fill="#FFF" opacity="0.75" />
                  </g>

                  {/* Floating sparkles */}
                  <circle cx="26" cy="22" r="3.5" fill="#FDE047" className="star-float-1" />
                  <circle cx="138" cy="116" r="4.5" fill="#F59E0B" className="star-float-2" />
                </svg>
              </div>
            </div>

            {/* Typography & Description */}
            <div className="card-text-block">
              <h2 className="card-main-heading">KUESIONER KEPUASAN</h2>
              <p className="card-description-text">
                Kuesioner Kepuasan Masyarakat (SKM) BRMP D.I. Yogyakarta untuk evaluasi dan peningkatan kualitas mutu pelayanan publik kami.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="card-bottom-cta">
              <div className="prominent-button amber-cta-btn">
                <span className="btn-label-text">Isi Kuesioner Sekarang</span>
                <span className="btn-arrow-wrap">
                  <ExternalLink size={20} className="btn-arrow-icon" />
                </span>
              </div>
              <div className="tap-invite-hint">
                <span className="tap-hand">👆</span> Sentuh layar untuk mengisi
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
