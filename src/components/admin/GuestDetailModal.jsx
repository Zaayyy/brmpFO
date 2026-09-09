import React, { useState } from 'react';
import {
  X,
  User,
  Calendar,
  GraduationCap,
  Building,
  Briefcase,
  Phone,
  Mail,
  FileText,
  Clock,
  Printer,
  ExternalLink,
  MessageSquare,
  Trash2,
  Copy,
  Check,
  Building2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function GuestDetailModal({ isOpen, onClose, entry, onDelete }) {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen || !entry) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const handleCopyId = () => {
    if (!entry.id) return;
    navigator.clipboard.writeText(entry.id);
    setCopiedId(true);
    soundManager.playSuccess();
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getWaLink = (phone) => {
    if (!phone) return '#';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return `https://wa.me/${clean}?text=Halo%20${encodeURIComponent(entry.nama)},%20terima%20kasih%20telah%20berkunjung%20ke%20BRMP%20D.I.%20Yogyakarta.`;
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  const initial = entry.nama?.charAt(0)?.toUpperCase() || 'T';

  return (
    <div className="modal-backdrop-overlay" onClick={handleClose}>
      <div
        className="kiosk-modal-card guest-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <div className="guest-detail-top-bar">
          <div className="guest-detail-title-group">
            <div className="guest-detail-emblem-badge">
              <img src="/images/brmp_emblem.png" alt="BRMP DIY" className="modal-emblem-img" />
            </div>
            <div>
              <div className="guest-detail-badge-row">
                <span className="guest-detail-live-chip">
                  <span className="live-pulse-dot"></span>
                  Buku Tamu FO
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="guest-id-copy-chip"
                  title="Klik untuk salin ID Tamu"
                >
                  <span>{entry.id}</span>
                  {copiedId ? (
                    <span className="chip-copied-text">
                      <Check size={12} /> Tersalin
                    </span>
                  ) : (
                    <Copy size={12} className="chip-copy-icon" />
                  )}
                </button>
              </div>
              <h3 className="guest-detail-heading">Detail Kunjungan Tamu</h3>
            </div>
          </div>
          <button className="guest-detail-close-btn" onClick={handleClose} aria-label="Tutup Modal">
            <X size={20} />
          </button>
        </div>

        <div className="guest-detail-modal-body">
          {/* Guest Profile Hero Card */}
          <div className="guest-profile-hero-card">
            <div className="guest-profile-avatar-wrap">
              <div className="guest-profile-avatar">
                {initial}
              </div>
              <div className="guest-avatar-check-badge" title="Tamu Terdata">
                <ShieldCheck size={14} />
              </div>
            </div>

            <div className="guest-profile-main-info">
              <div className="guest-profile-name-row">
                <h4 className="guest-profile-name">{entry.nama}</h4>
                <span className="guest-time-chip">
                  <Clock size={13} />
                  <span>{entry.timestamp}</span>
                </span>
              </div>

              <div className="guest-profile-pills">
                <span className="profile-pill pill-category">
                  <User size={13} />
                  <span>{entry.asal || 'Perorangan'}</span>
                </span>
                <span className="profile-pill pill-education">
                  <GraduationCap size={13} />
                  <span>Pendidikan: {entry.pendidikan || '-'}</span>
                </span>
                <span className="profile-pill pill-age">
                  <Calendar size={13} />
                  <span>Usia: {entry.usia} Tahun</span>
                </span>
              </div>
            </div>
          </div>

          {/* Structured 2x2 Information Grid */}
          <div className="guest-info-cards-grid">
            {/* Instansi Card */}
            <div className="guest-info-card">
              <div className="info-card-header">
                <div className="info-card-icon-box bg-emerald">
                  <Building2 size={16} />
                </div>
                <span className="info-card-label">INSTANSI / LEMBAGA</span>
              </div>
              <p className="info-card-value">
                {entry.asal === 'Perorangan' ? 'Perorangan / Pribadi' : (entry.nama_instansi || '-')}
              </p>
            </div>

            {/* Pekerjaan Card */}
            <div className="guest-info-card">
              <div className="info-card-header">
                <div className="info-card-icon-box bg-amber">
                  <Briefcase size={16} />
                </div>
                <span className="info-card-label">PEKERJAAN / JABATAN</span>
              </div>
              <p className="info-card-value">
                {entry.pekerjaan || '-'}
              </p>
            </div>

            {/* Telepon Card */}
            <div className="guest-info-card">
              <div className="info-card-header">
                <div className="info-card-icon-box bg-teal">
                  <Phone size={16} />
                </div>
                <span className="info-card-label">NO. TELEPON / WHATSAPP</span>
              </div>
              <div className="info-card-action-row">
                <span className="info-card-value-phone">{entry.telepon || '-'}</span>
                {entry.telepon && (
                  <a
                    href={getWaLink(entry.telepon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-pill-wa"
                    title="Buka percakapan WhatsApp"
                  >
                    <MessageSquare size={13} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            {/* Email Card */}
            <div className="guest-info-card">
              <div className="info-card-header">
                <div className="info-card-icon-box bg-blue">
                  <Mail size={16} />
                </div>
                <span className="info-card-label">ALAMAT EMAIL</span>
              </div>
              <div className="info-card-action-row">
                <span className="info-card-value-email" title={entry.email || '-'}>
                  {entry.email || '-'}
                </span>
                {entry.email && (
                  <a
                    href={`mailto:${entry.email}`}
                    className="btn-pill-email"
                    title="Kirim pesan Email"
                  >
                    <ExternalLink size={13} />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            {/* Keperluan Full Card */}
            <div className="guest-info-card card-span-full">
              <div className="info-card-header">
                <div className="info-card-icon-box bg-purple">
                  <FileText size={16} />
                </div>
                <span className="info-card-label">MAKSUD & KEPERLUAN KUNJUNGAN</span>
              </div>
              <div className="keperluan-quote-box">
                <p className="keperluan-quote-text">
                  {entry.keperluan || 'Tidak ada keterangan khusus.'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="guest-detail-modal-footer">
            <div className="footer-left">
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(entry)}
                  className="btn-guest-delete"
                  title="Hapus data tamu ini secara permanen"
                >
                  <Trash2 size={16} />
                  <span>Hapus Data</span>
                </button>
              )}
            </div>

            <div className="footer-right">
              <button
                type="button"
                onClick={handlePrint}
                className="btn-guest-print"
                title="Cetak struk / tiket tamu"
              >
                <Printer size={16} />
                <span>Cetak Tiket Tamu</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="btn-guest-close"
              >
                <span>Tutup</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

