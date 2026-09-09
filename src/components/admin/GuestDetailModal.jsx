import React from 'react';
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
  Trash2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';

export default function GuestDetailModal({ isOpen, onClose, entry, onDelete }) {
  if (!isOpen || !entry) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
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

  return (
    <div className="modal-backdrop-overlay" onClick={handleClose}>
      <div
        className="kiosk-modal-card guest-detail-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Top bar */}
        <div className="modal-top-bar emerald-gradient-bar">
          <div className="modal-title-group">
            <div className="modal-logo-emblem-wrap">
              <img src="/images/brmp_emblem.png" alt="BRMP DIY" className="modal-emblem-img" />
            </div>
            <div>
              <h3 className="modal-title">Detail Kunjungan Tamu</h3>
              <p className="modal-desc">{entry.id} • {entry.timestamp}</p>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={handleClose} aria-label="Tutup">
            <X size={22} />
          </button>
        </div>

        <div className="detail-modal-content">
          {/* Guest Identity Card */}
          <div className="detail-guest-badge-header">
            <div className="avatar-letter-box">
              {entry.nama?.charAt(0)?.toUpperCase() || 'T'}
            </div>
            <div className="guest-info-block">
              <h4 className="guest-full-name">{entry.nama}</h4>
              <div className="guest-meta-tags">
                <span className="guest-tag-pill tag-asal">{entry.asal}</span>
                <span className="guest-tag-pill tag-edu">Pendidikan: {entry.pendidikan}</span>
                <span className="guest-tag-pill tag-age">Usia: {entry.usia} Tahun</span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="detail-info-grid">
            <div className="detail-grid-cell">
              <div className="cell-label">
                <Building size={16} className="text-emerald" />
                <span>Instansi / Lembaga</span>
              </div>
              <p className="cell-value">
                {entry.asal === 'Perorangan' ? 'Perorangan / Pribadi' : entry.nama_instansi}
              </p>
            </div>

            <div className="detail-grid-cell">
              <div className="cell-label">
                <Briefcase size={16} className="text-emerald" />
                <span>Pekerjaan / Jabatan</span>
              </div>
              <p className="cell-value">{entry.pekerjaan || '-'}</p>
            </div>

            <div className="detail-grid-cell">
              <div className="cell-label">
                <Phone size={16} className="text-emerald" />
                <span>No. Telepon / WhatsApp</span>
              </div>
              <div className="cell-value flex-row-align">
                <span>{entry.telepon || '-'}</span>
                {entry.telepon && (
                  <a
                    href={getWaLink(entry.telepon)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-link-wa"
                    title="Kirim pesan WhatsApp"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

            <div className="detail-grid-cell">
              <div className="cell-label">
                <Mail size={16} className="text-emerald" />
                <span>Alamat Email</span>
              </div>
              <div className="cell-value flex-row-align">
                <span>{entry.email || '-'}</span>
                {entry.email && (
                  <a
                    href={`mailto:${entry.email}`}
                    className="btn-link-email"
                    title="Kirim Email"
                  >
                    <ExternalLink size={14} />
                    <span>Email</span>
                  </a>
                )}
              </div>
            </div>

            <div className="detail-grid-cell col-span-2">
              <div className="cell-label">
                <FileText size={16} className="text-emerald" />
                <span>Maksud & Keperluan Kunjungan</span>
              </div>
              <div className="keperluan-box-highlight">
                <p>{entry.keperluan}</p>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="detail-modal-footer">
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(entry)}
                className="btn-detail-action danger"
                title="Hapus Catatan Kunjungan Ini"
              >
                <Trash2 size={16} />
                <span>Hapus Data</span>
              </button>
            )}
            <button type="button" onClick={handlePrint} className="btn-detail-action outline">
              <Printer size={16} />
              <span>Cetak Tiket Tamu</span>
            </button>
            <button type="button" onClick={handleClose} className="btn-detail-action primary">
              <span>Tutup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
