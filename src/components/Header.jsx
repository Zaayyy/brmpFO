import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Clock, Calendar, Settings, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Header({ soundEnabled, setSoundEnabled, onOpenConfig, onOpenAdmin }) {
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    soundManager.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Fullscreen error: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleSoundToggle = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);
    soundManager.toggle(nextState);
    if (nextState) {
      soundManager.playSuccess();
    }
  };

  // Indonesian date formatter
  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(time);

  // Time digits
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <header className="kiosk-header">
      <div className="header-glass-sheen"></div>
      
      {/* Left: Branding & Official Logo */}
      <div className="header-left">
        <div className="logo-badge-container">
          <div className="logo-emblem-wrap">
            <img
              src="/images/brmp_emblem.png"
              alt="Logo Resmi BRMP DIY"
              className="brmp-official-logo-img"
            />
            <div className="emblem-pulse-ring"></div>
          </div>

          <div className="title-info">
            <div className="region-pill">
              <span className="gold-star">★</span> PEMERINTAH DAERAH D.I. YOGYAKARTA
            </div>
            <h1 className="main-agency-title">
              BRMP <span>D.I. YOGYAKARTA</span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Clock & Controls */}
      <div className="header-right">
        {/* Indonesian Live Clock */}
        <div className="live-clock-card">
          <div className="date-row">
            <Calendar className="icon-tiny text-emerald" />
            <span className="date-string">{formattedDate}</span>
          </div>
          <div className="time-row">
            <Clock className="icon-tiny text-gold" />
            <div className="time-digits-wrap">
              <span className="digit-block">{hours}</span>
              <span className="colon-blink">:</span>
              <span className="digit-block">{minutes}</span>
              <span className="colon-blink">:</span>
              <span className="digit-block">{seconds}</span>
            </div>
            <span className="wib-tag">WIB</span>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="header-action-btns">
          <button
            onClick={handleSoundToggle}
            className={`btn-icon-kiosk ${soundEnabled ? 'active' : 'muted'}`}
            title={soundEnabled ? 'Matikan Suara Efek' : 'Aktifkan Suara Efek'}
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="btn-icon-kiosk"
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Kiosk)'}
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>

          <button
            onClick={onOpenConfig}
            className="btn-icon-kiosk"
            title="Pengaturan Kiosk"
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>

          <button
            onClick={onOpenAdmin}
            className="btn-icon-kiosk btn-admin-header-trigger"
            title="Dashboard Admin Buku Tamu"
            aria-label="Dashboard Admin"
          >
            <ShieldCheck size={20} className="text-emerald" />
          </button>
        </div>
      </div>
    </header>
  );
}
