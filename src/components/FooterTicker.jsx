import React from 'react';
import { Megaphone, Settings, Info, ShieldCheck, HeartHandshake } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function FooterTicker({ onOpenConfig }) {
  const handleConfigClick = () => {
    soundManager.playClick();
    onOpenConfig();
  };

  return (
    <footer className="kiosk-footer-bar">
      <div className="ticker-badge-lead">
        <span className="live-pulsing-circle"></span>
        <Megaphone size={16} className="text-gold" />
        <span className="ticker-badge-text">WARTA AGROMODERN DIY</span>
      </div>

      <div className="ticker-marquee-viewport">
        <div className="ticker-marquee-track">
          <span className="ticker-text-item">
            🌱 <strong>BRMP D.I. Yogyakarta:</strong> Satu Pintu Pengelolaan, Pengawasan Mutu Benih & Agromodern DIY
          </span>
          <span className="ticker-divider">✦</span>
          <span className="ticker-text-item">
            🔍 <strong>Layanan Online:</strong> Akses Tracking Uji Lab & Sertifikasi Benih Padi/Jagung melalui <strong>brmpdiy.my.id</strong>
          </span>
          <span className="ticker-divider">✦</span>
          <span className="ticker-text-item">
            ⏰ <strong>Jam Layanan Tatap Muka:</strong> Senin - Kamis 08.00 - 15.30 WIB | Jumat 08.00 - 15.00 WIB
          </span>
          <span className="ticker-divider">✦</span>
          <span className="ticker-text-item">
            🤝 <strong>Maklumat Pelayanan:</strong> Melayani dengan Ramah, Cepat, Akuntabel, dan Bebas Pungutan Liar
          </span>
          <span className="ticker-divider">✦</span>
          <span className="ticker-text-item">
            🌾 <strong>Wilayah Kerja:</strong> Sleman, Bantul, Kulon Progo, Gunungkidul, dan Kota Yogyakarta
          </span>
        </div>
      </div>

      <div className="ticker-right-tools">
        <button
          onClick={handleConfigClick}
          className="btn-settings-footer"
          title="Buka Pengaturan Kiosk"
          aria-label="Pengaturan"
        >
          <Settings size={18} />
          <span className="footer-btn-label">Opsi</span>
        </button>
      </div>
    </footer>
  );
}
