import React, { useState, useEffect } from 'react';
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
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/audio';
import { saveGuestbookEntry } from '../utils/guestbookStore';

export default function GuestbookModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    nama: '',
    usia: '',
    pendidikan: '',
    asal: '',
    nama_instansi: '',
    pekerjaan: '',
    telepon: '',
    email: '',
    keperluan: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEntry, setSubmittedEntry] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset state on close
      setIsSuccess(false);
      setIsSubmitting(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'asal' && value === 'Perorangan') {
        next.nama_instansi = '-';
      } else if (name === 'asal' && prev.asal === 'Perorangan') {
        next.nama_instansi = '';
      }
      return next;
    });
  };

  const getInstansiLabel = () => {
    if (formData.asal === 'Sekolah') return 'Nama Sekolah / Universitas';
    if (formData.asal === 'Perusahaan') return 'Nama Perusahaan';
    return 'Nama Instansi / Dinas';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();
    setIsSubmitting(true);

    setTimeout(() => {
      try {
        const saved = saveGuestbookEntry(formData);
        setSubmittedEntry(saved);
        setIsSubmitting(false);
        setIsSuccess(true);
        soundManager.playSuccess();

        // Trigger celebratory confetti
        confetti({
          particleCount: 110,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10B981', '#F59E0B', '#38BDF8', '#059669', '#FDE047']
        });
      } catch (err) {
        console.error('Failed to submit:', err);
        alert('Terjadi kendala saat menyimpan formulir. Silakan coba kembali.');
        setIsSubmitting(false);
      }
    }, 600);
  };

  const handleResetForm = () => {
    soundManager.playClick();
    setFormData({
      nama: '',
      usia: '',
      pendidikan: '',
      asal: '',
      nama_instansi: '',
      pekerjaan: '',
      telepon: '',
      email: '',
      keperluan: ''
    });
    setIsSuccess(false);
    setSubmittedEntry(null);
  };

  return (
    <div className="modal-backdrop-overlay" onClick={handleClose}>
      <div
        className="kiosk-modal-card guestbook-custom-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Decorative Watermark Logo */}
        <div className="modal-emblem-watermark">
          <img src="/images/brmp_emblem.png" alt="BRMP DIY Emblem Watermark" />
        </div>

        {/* Modal Top Bar */}
        <div className="modal-top-bar emerald-gradient-bar">
          <div className="modal-title-group">
            <div className="modal-logo-emblem-wrap">
              <img
                src="/images/brmp_emblem.png"
                alt="Logo Resmi BRMP DIY"
                className="modal-emblem-img"
              />
            </div>
            <div>
              <div className="modal-top-tag">
                <span>PELAYANAN TERPADU AGROMODERN</span>
              </div>
              <h3 className="modal-title">Buku Tamu Digital BRMP DIY</h3>
              <p className="modal-desc">
                Pemerintah Daerah Daerah Istimewa Yogyakarta • Registrasi Kunjungan Resmi
              </p>
            </div>
          </div>
          <button
            className="modal-close-icon-btn"
            onClick={handleClose}
            aria-label="Tutup Formulir"
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="guestbook-modal-scrollable">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="guestbook-modern-form">
              <div className="form-intro-strip">
                <div className="strip-icon-box">
                  <Sparkles size={18} className="text-emerald" />
                </div>
                <div>
                  <h4 className="strip-title">Selamat Datang di BRMP D.I. Yogyakarta</h4>
                  <p className="strip-sub">
                    Silakan lengkapi formulir kehadiran di bawah ini untuk pencatatan buku tamu & pelayanan kami.
                  </p>
                </div>
              </div>

              <div className="form-grid-2col">
                {/* 1. Nama Lengkap */}
                <div className="modern-field-group col-span-full-sm md-span-3">
                  <label htmlFor="nama" className="modern-field-label">
                    Nama Lengkap <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper">
                    <User size={18} className="input-leading-icon" />
                    <input
                      type="text"
                      id="nama"
                      name="nama"
                      required
                      value={formData.nama}
                      onChange={handleInputChange}
                      placeholder="Masukkan nama lengkap beserta gelar jika ada"
                      className="modern-text-input"
                    />
                  </div>
                </div>

                {/* 2. Usia */}
                <div className="modern-field-group col-span-full-sm md-span-1">
                  <label htmlFor="usia" className="modern-field-label">
                    Usia <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper">
                    <Calendar size={18} className="input-leading-icon" />
                    <input
                      type="number"
                      id="usia"
                      name="usia"
                      required
                      min="1"
                      max="120"
                      value={formData.usia}
                      onChange={handleInputChange}
                      placeholder="Contoh: 25"
                      className="modern-text-input"
                    />
                  </div>
                </div>

                {/* 3. Pendidikan Terakhir */}
                <div className="modern-field-group col-span-2">
                  <label htmlFor="pendidikan" className="modern-field-label">
                    Pendidikan Terakhir <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper">
                    <GraduationCap size={18} className="input-leading-icon" />
                    <select
                      id="pendidikan"
                      name="pendidikan"
                      required
                      value={formData.pendidikan}
                      onChange={handleInputChange}
                      className="modern-text-input modern-select"
                    >
                      <option value="" disabled>Pilih Jenjang Pendidikan</option>
                      <option value="SD">SD / Sederajat</option>
                      <option value="SMP">SMP / Sederajat</option>
                      <option value="SMA">SMA / SMK / Sederajat</option>
                      <option value="D3">Diploma (D1 - D4)</option>
                      <option value="S1">Sarjana (S1)</option>
                      <option value="S2">Magister (S2)</option>
                      <option value="S3">Doktor (S3)</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* 4. Asal Tamu & 5. Nama Instansi */}
                <div className="instansi-card-box col-span-2">
                  <div className="instansi-grid-inner">
                    <div className="modern-field-group">
                      <label htmlFor="asal" className="modern-field-label">
                        Asal Tamu <span className="req-star">*</span>
                      </label>
                      <div className="modern-input-wrapper">
                        <Building size={18} className="input-leading-icon" />
                        <select
                          id="asal"
                          name="asal"
                          required
                          value={formData.asal}
                          onChange={handleInputChange}
                          className="modern-text-input modern-select bg-card-select"
                        >
                          <option value="" disabled>Pilih Kategori Asal</option>
                          <option value="Instansi">Instansi Pemerintahan</option>
                          <option value="Perusahaan">Perusahaan Swasta</option>
                          <option value="Sekolah">Sekolah / Universitas</option>
                          <option value="Perorangan">Perorangan / Pribadi</option>
                        </select>
                      </div>
                    </div>

                    {formData.asal !== 'Perorangan' && (
                      <div className="modern-field-group animate-fade-in">
                        <label htmlFor="nama_instansi" className="modern-field-label">
                          {getInstansiLabel()} <span className="req-star">*</span>
                        </label>
                        <div className="modern-input-wrapper">
                          <Building size={18} className="input-leading-icon" />
                          <input
                            type="text"
                            id="nama_instansi"
                            name="nama_instansi"
                            required={formData.asal !== 'Perorangan'}
                            value={formData.nama_instansi}
                            onChange={handleInputChange}
                            placeholder="Masukkan nama instansi / lembaga"
                            className="modern-text-input"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 6. Pekerjaan / Jabatan */}
                  <div className="modern-field-group mt-3">
                    <label htmlFor="pekerjaan" className="modern-field-label">
                      Pekerjaan / Jabatan <span className="req-star">*</span>
                    </label>
                    <div className="modern-input-wrapper">
                      <Briefcase size={18} className="input-leading-icon" />
                      <input
                        type="text"
                        id="pekerjaan"
                        name="pekerjaan"
                        required
                        value={formData.pekerjaan}
                        onChange={handleInputChange}
                        placeholder="Contoh: Staff IT, Guru, Dosen, Peneliti, Petani"
                        className="modern-text-input"
                      />
                    </div>
                  </div>
                </div>

                {/* 7. No. Telepon / WhatsApp */}
                <div className="modern-field-group col-span-full-sm md-span-2">
                  <label htmlFor="telepon" className="modern-field-label">
                    No. Telepon / WhatsApp <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper">
                    <Phone size={18} className="input-leading-icon" />
                    <input
                      type="tel"
                      id="telepon"
                      name="telepon"
                      required
                      value={formData.telepon}
                      onChange={handleInputChange}
                      placeholder="081234567890"
                      className="modern-text-input"
                    />
                  </div>
                </div>

                {/* 8. Email */}
                <div className="modern-field-group col-span-full-sm md-span-2">
                  <label htmlFor="email" className="modern-field-label">
                    Email <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper">
                    <Mail size={18} className="input-leading-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="nama@email.com"
                      className="modern-text-input"
                    />
                  </div>
                </div>

                {/* 9. Keperluan */}
                <div className="modern-field-group col-span-2">
                  <label htmlFor="keperluan" className="modern-field-label">
                    Keperluan Kunjungan <span className="req-star">*</span>
                  </label>
                  <div className="modern-input-wrapper textarea-wrapper">
                    <FileText size={18} className="input-leading-icon textarea-icon" />
                    <textarea
                      id="keperluan"
                      name="keperluan"
                      required
                      rows={3}
                      value={formData.keperluan}
                      onChange={handleInputChange}
                      placeholder="Jelaskan secara ringkas maksud & tujuan kunjungan Anda ke BRMP DIY..."
                      className="modern-text-input modern-textarea"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="guestbook-form-footer">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-guest-cancel"
                  disabled={isSubmitting}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="btn-guest-submit-emerald"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="submit-spinner"></span>
                      <span>Menyimpan Data...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Data Tamu</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* ==================================================== */
            /* SUCCESS STATE RECEIPT / TICKET SCREEN               */
            /* ==================================================== */
            <div className="guestbook-success-container">
              <div className="success-icon-pulse-wrapper">
                <div className="success-pulse-ring"></div>
                <div className="success-check-circle">
                  <CheckCircle2 size={46} className="text-white" />
                </div>
              </div>

              <h3 className="success-headline">Terima Kasih Atas Kunjungan Anda!</h3>
              <p className="success-sub">
                Data buku tamu Anda telah resmi tercatat dalam sistem pelayanan terpadu BRMP D.I. Yogyakarta.
              </p>

              {/* Guest Card Receipt Preview */}
              {submittedEntry && (
                <div className="receipt-card-preview" id="printable-receipt">
                  <div className="receipt-header">
                    <div className="receipt-logo">
                      <img src="/images/brmp_emblem.png" alt="BRMP DIY" />
                      <div>
                        <strong>BRMP D.I. YOGYAKARTA</strong>
                        <p>Tiket Registrasi Kunjungan Digital</p>
                      </div>
                    </div>
                    <div className="receipt-id-tag">
                      {submittedEntry.id}
                    </div>
                  </div>

                  <div className="receipt-divider"></div>

                  <div className="receipt-details-grid">
                    <div className="receipt-detail-item">
                      <span className="detail-label">Nama Tamu</span>
                      <strong className="detail-value">{submittedEntry.nama}</strong>
                    </div>
                    <div className="receipt-detail-item">
                      <span className="detail-label">Waktu Registrasi</span>
                      <strong className="detail-value">{submittedEntry.timestamp}</strong>
                    </div>
                    <div className="receipt-detail-item">
                      <span className="detail-label">Asal Instansi / Lembaga</span>
                      <strong className="detail-value">
                        {submittedEntry.asal === 'Perorangan' ? 'Perorangan / Pribadi' : submittedEntry.nama_instansi}
                      </strong>
                    </div>
                    <div className="receipt-detail-item">
                      <span className="detail-label">Pekerjaan</span>
                      <strong className="detail-value">{submittedEntry.pekerjaan}</strong>
                    </div>
                    <div className="receipt-detail-item col-span-2">
                      <span className="detail-label">Keperluan</span>
                      <p className="detail-text-long">{submittedEntry.keperluan}</p>
                    </div>
                  </div>

                  <div className="receipt-footer-note">
                    🌱 Selamat beraktivitas & semoga pelayanan kami memberikan manfaat terbaik.
                  </div>
                </div>
              )}

              {/* Success Action Buttons */}
              <div className="success-actions-row">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="btn-success-action secondary"
                >
                  <RotateCcw size={16} />
                  <span>Isi Formulir Tamu Baru</span>
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="btn-success-action primary"
                >
                  <span>Selesai & Ke Beranda</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
