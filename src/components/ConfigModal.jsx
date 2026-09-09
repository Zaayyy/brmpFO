import React, { useState } from 'react';
import { X, Settings, Link2, Globe, Check, Volume2, ClipboardList } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ConfigModal({
  isOpen,
  onClose,
  websiteUrl,
  setWebsiteUrl,
  guestbookType,
  setGuestbookType,
  externalGuestUrl,
  setExternalGuestUrl,
  questionnaireUrl,
  setQuestionnaireUrl,
}) {
  const [tempWebUrl, setTempWebUrl] = useState(websiteUrl);
  const [tempGuestType, setTempGuestType] = useState(guestbookType);
  const [tempGuestUrl, setTempGuestUrl] = useState(externalGuestUrl);
  const [tempQuestionnaireUrl, setTempQuestionnaireUrl] = useState(questionnaireUrl);
  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    soundManager.playSuccess();
    setWebsiteUrl(tempWebUrl);
    setGuestbookType(tempGuestType);
    setExternalGuestUrl(tempGuestUrl);
    if (setQuestionnaireUrl) {
      setQuestionnaireUrl(tempQuestionnaireUrl);
    }
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 900);
  };

  const handleTestSound = () => {
    soundManager.playSuccess();
  };

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="kiosk-modal-card config-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-top-bar dark-gradient-bar">
          <div className="modal-title-group">
            <div className="modal-icon-badge dark-badge">
              <Settings size={22} />
            </div>
            <div>
              <h3 className="modal-title">Pengaturan Front Office Kiosk</h3>
              <p className="modal-desc">Konfigurasi URL & Mode Layanan Front Desk</p>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Tutup">
            <X size={22} />
          </button>
        </div>

        <div className="modal-body-container">
          <form onSubmit={handleSave} className="config-form">
            <div className="form-grid-layout">
              
              {/* URL Website BRMP */}
              <div className="form-field-group col-span-2">
                <label className="field-label">URL Website Resmi BRMP DIY</label>
                <div className="field-input-wrap">
                  <Globe size={18} className="field-icon text-sapphire" />
                  <input
                    type="url"
                    required
                    value={tempWebUrl}
                    onChange={(e) => setTempWebUrl(e.target.value)}
                    placeholder="https://brmpdiy.my.id/"
                    className="text-input"
                  />
                </div>
                <small className="help-text">Tautan yang dituju ketika tombol Website Resmi diklik (default: https://brmpdiy.my.id/).</small>
              </div>

              {/* URL Kuesioner Kepuasan Masyarakat */}
              <div className="form-field-group col-span-2">
                <label className="field-label">URL Kuesioner Kepuasan Masyarakat (Google Form)</label>
                <div className="field-input-wrap">
                  <ClipboardList size={18} className="field-icon text-gold" />
                  <input
                    type="url"
                    required
                    value={tempQuestionnaireUrl}
                    onChange={(e) => setTempQuestionnaireUrl(e.target.value)}
                    placeholder="https://docs.google.com/forms/d/e/..."
                    className="text-input"
                  />
                </div>
                <small className="help-text">Tautan Google Form / instrumen survei kepuasan masyarakat yang dibuka saat tombol kuesioner diklik.</small>
              </div>

              {/* Tipe Aksi Buku Tamu */}
              <div className="form-field-group col-span-2">
                <label className="field-label">Mode Buku Tamu</label>
                <div className="radio-selection-group">
                  <label className={`radio-card-option ${tempGuestType === 'modal' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="guestType"
                      value="modal"
                      checked={tempGuestType === 'modal'}
                      onChange={() => setTempGuestType('modal')}
                    />
                    <div>
                      <strong>Formulir Interaktif di Layar Kiosk</strong>
                      <p>Pengunjung mengisi langsung di layar sentuh dengan tiket antrean digital otomatis.</p>
                    </div>
                  </label>

                  <label className={`radio-card-option ${tempGuestType === 'external' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="guestType"
                      value="external"
                      checked={tempGuestType === 'external'}
                      onChange={() => setTempGuestType('external')}
                    />
                    <div>
                      <strong>Tautan Eksternal (Google Form / Portal Dinas)</strong>
                      <p>Membuka link web/Google Form buku tamu yang telah disiapkan secara eksternal.</p>
                    </div>
                  </label>
                </div>
              </div>

              {tempGuestType === 'external' && (
                <div className="form-field-group col-span-2">
                  <label className="field-label">URL Eksternal Buku Tamu</label>
                  <div className="field-input-wrap">
                    <Link2 size={18} className="field-icon text-emerald" />
                    <input
                      type="url"
                      required
                      value={tempGuestUrl}
                      onChange={(e) => setTempGuestUrl(e.target.value)}
                      placeholder="https://forms.gle/contoh-buku-tamu"
                      className="text-input"
                    />
                  </div>
                </div>
              )}

              {/* Sound Test */}
              <div className="form-field-group col-span-2">
                <div className="sound-test-box">
                  <div className="sound-info">
                    <Volume2 size={20} className="text-gold" />
                    <span>Uji Coba Suara Efek Interaktif</span>
                  </div>
                  <button type="button" onClick={handleTestSound} className="btn-test-sound">
                    Tes Audio
                  </button>
                </div>
              </div>

            </div>

            {savedAlert && (
              <div className="saved-success-msg">
                <Check size={18} /> Pengaturan berhasil disimpan!
              </div>
            )}

            <div className="form-action-footer">
              <button type="button" onClick={onClose} className="btn-modal-cancel">
                Batal
              </button>
              <button type="submit" className="btn-modal-primary-emerald">
                Simpan Perubahan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
