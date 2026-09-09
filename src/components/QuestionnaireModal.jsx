import React, { useState } from 'react';
import {
  X,
  QrCode,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Clock,
  ShieldCheck,
  FileCheck2,
  Maximize2,
  ChevronRight
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function QuestionnaireModal({
  isOpen,
  onClose,
  formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeY3UsQnLzl6jUj6RFppdyID_oV8Ja4aygP_yAPHbwhZDxc8w/viewform'
}) {
  const [activeTab, setActiveTab] = useState('barcode'); // 'barcode' | 'form'
  const [useHdQr, setUseHdQr] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const shortLink = 'https://s.id/SKM-BRMPDIY';

  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shortLink);
    setCopiedLink(true);
    soundManager.playSuccess();
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleOpenGform = () => {
    soundManager.playClick();
    window.open(formUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop-overlay" onClick={handleClose}>
      <div
        className="kiosk-modal-card questionnaire-choice-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="qmodal-top-bar">
          <div className="qmodal-title-group">
            <div className="qmodal-emblem-badge">
              <img src="/images/brmp_emblem.png" alt="BRMP DIY" className="modal-emblem-img" />
            </div>
            <div>
              <div className="qmodal-badge-row">
                <span className="qmodal-tag-chip">
                  <Sparkles size={12} className="sparkle-gold" />
                  Survei Pelayanan Publik
                </span>
                <span className="qmodal-subtag">SKM Kemenpan-RB</span>
              </div>
              <h3 className="qmodal-heading">Survei Kepuasan Masyarakat (SKM)</h3>
            </div>
          </div>
          <button className="qmodal-close-btn" onClick={handleClose} aria-label="Tutup Modal">
            <X size={20} />
          </button>
        </div>

        <div className="qmodal-body">
          {/* Subtitle intro banner */}
          <div className="qmodal-intro-banner">
            <p>
              Pilih metode pengisian yang paling nyaman bagi Anda untuk membantu kami meningkatkan kualitas pelayanan:
            </p>
          </div>

          {/* Interactive Option Tabs */}
          <div className="qmodal-tabs-selector">
            <button
              type="button"
              className={`qmodal-tab-btn ${activeTab === 'barcode' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setActiveTab('barcode');
              }}
            >
              <div className="tab-icon-wrap bg-tab-qr">
                <QrCode size={20} />
              </div>
              <div className="tab-text-wrap">
                <span className="tab-title">1. Tampilkan Barcode / QR Code</span>
                <span className="tab-desc">Pindai dengan kamera smartphone pribadi</span>
              </div>
            </button>

            <button
              type="button"
              className={`qmodal-tab-btn ${activeTab === 'form' ? 'active' : ''}`}
              onClick={() => {
                soundManager.playClick();
                setActiveTab('form');
              }}
            >
              <div className="tab-icon-wrap bg-tab-form">
                <ExternalLink size={20} />
              </div>
              <div className="tab-text-wrap">
                <span className="tab-title">2. Buka Langsung ke Google Form</span>
                <span className="tab-desc">Buka formulir langsung di browser ini</span>
              </div>
            </button>
          </div>

          {/* Tab 1: Barcode / QR Code Presentation */}
          {activeTab === 'barcode' && (
            <div className="qmodal-content-panel animate-fade-in">
              <div className="barcode-panel-layout">
                {/* Left: Physical stand photo / QR Viewer */}
                <div className="barcode-visual-card">
                  <div className="barcode-header-tag">
                    <span className="live-dot-amber"></span>
                    <span>{useHdQr ? 'QR Code Digital HD' : 'Stand Resmi Front Office'}</span>
                  </div>

                  <div className="barcode-image-frame">
                    <img
                      src={useHdQr ? '/images/qr_skm_clean.png' : '/images/barcode_kuisioner_brmp.png'}
                      alt="Barcode Survei Kepuasan Masyarakat BRMP DIY"
                      className={`barcode-main-img ${useHdQr ? 'is-clean-qr' : 'is-photo-stand'}`}
                    />
                  </div>

                  <div className="barcode-toggle-view">
                    <button
                      type="button"
                      onClick={() => {
                        soundManager.playClick();
                        setUseHdQr(!useHdQr);
                      }}
                      className="btn-switch-qr"
                    >
                      <span>{useHdQr ? 'Lihat Foto Stand Meja FO' : 'Tampilkan QR Digital Tajam'}</span>
                    </button>
                  </div>
                </div>

                {/* Right: How to Scan + Direct Link */}
                <div className="barcode-guide-card">
                  <h4 className="guide-title">
                    <Smartphone size={18} className="text-amber-600" />
                    <span>Panduan Scan Smartphone</span>
                  </h4>

                  <ol className="guide-steps-list">
                    <li>
                      <span className="step-num">1</span>
                      <div>
                        <strong>Buka Kamera HP</strong>
                        <p>Aktifkan aplikasi kamera bawaan ponsel atau Google Lens.</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-num">2</span>
                      <div>
                        <strong>Arahkan ke Barcode</strong>
                        <p>Arahkan lensa ke Barcode di samping hingga muncul tautan.</p>
                      </div>
                    </li>
                    <li>
                      <span className="step-num">3</span>
                      <div>
                        <strong>Isi Kuisioner</strong>
                        <p>Ketuk notifikasi untuk membuka form dan berikan penilaian Anda.</p>
                      </div>
                    </li>
                  </ol>

                  {/* Shortlink Box */}
                  <div className="shortlink-box">
                    <div className="shortlink-info">
                      <span className="shortlink-label">Tautan Singkat Form:</span>
                      <a
                        href={shortLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shortlink-url"
                        title="Buka tautan ini"
                      >
                        {shortLink}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="btn-copy-shortlink"
                      title="Salin tautan ke clipboard"
                    >
                      {copiedLink ? (
                        <>
                          <Check size={14} />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Quick Shortcut to Gform */}
                  <button
                    type="button"
                    onClick={handleOpenGform}
                    className="btn-barcode-open-gform"
                  >
                    <span>Buka Langsung ke Google Form</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Direct Google Form Presentation */}
          {activeTab === 'form' && (
            <div className="qmodal-content-panel animate-fade-in">
              <div className="direct-form-card">
                <div className="form-hero-badge">
                  <FileCheck2 size={36} className="text-emerald-600" />
                </div>
                <h4 className="form-hero-title">Kuesioner Kepuasan Masyarakat BRMP D.I. Yogyakarta</h4>
                <p className="form-hero-desc">
                  Survei ini bertujuan untuk mengukur tingkat kepuasan masyarakat terhadap mutu pelayanan administrasi, 
                  rekomendasi teknis, dan sertifikasi pada Balai Penerapan Modernisasi Pertanian D.I. Yogyakarta.
                </p>

                <div className="form-feature-badges">
                  <div className="feature-item">
                    <Clock size={16} className="text-amber-500" />
                    <span>Waktu Pengisian: ~2-3 Menit</span>
                  </div>
                  <div className="feature-item">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Respon Aman & Terpercaya</span>
                  </div>
                  <div className="feature-item">
                    <Sparkles size={16} className="text-blue-500" />
                    <span>BerAKHLAK & Bangga Melayani</span>
                  </div>
                </div>

                <div className="form-action-container">
                  <button
                    type="button"
                    onClick={handleOpenGform}
                    className="btn-launch-gform"
                  >
                    <span>Buka Google Form Sekarang</span>
                    <ExternalLink size={18} />
                  </button>
                  <p className="form-open-notice">
                    Formulir akan otomatis dibuka pada jendela / tab peramban baru.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="qmodal-footer-note">
            <p>🌱 Masukan Anda sangat berarti bagi kami untuk terus memberikan pelayanan yang lebih baik.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
