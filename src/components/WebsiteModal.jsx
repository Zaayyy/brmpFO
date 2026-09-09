import React from 'react';
import { X, Globe, ExternalLink } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function WebsiteModal({ isOpen, onClose, websiteUrl }) {
  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const handleOpenExternal = () => {
    soundManager.playClick();
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="modal-backdrop-overlay" onClick={handleClose}>
      <div
        className="kiosk-modal-card website-modal-box kiosk-frame-mode"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header */}
        <div className="modal-top-bar sapphire-gradient-bar">
          <div className="modal-title-group">
            <div className="modal-logo-emblem-wrap">
              <img src="/images/brmp_emblem.png" alt="Logo BRMP DIY" className="modal-emblem-img" />
            </div>
            <div>
              <h3 className="modal-title">Portal Layanan BRMP DIY</h3>
              <p className="modal-desc">{websiteUrl}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              className="modal-close-icon-btn"
              onClick={handleOpenExternal}
              title="Buka di Tab Baru"
              aria-label="Buka di Tab Baru"
            >
              <ExternalLink size={18} />
            </button>
            <button className="modal-close-icon-btn" onClick={handleClose} aria-label="Tutup">
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Embedded Iframe Browser View */}
        <div className="iframe-container-wrap">
          <iframe
            src={websiteUrl}
            title="Website Resmi BRMP DIY"
            className="kiosk-embedded-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  );
}
