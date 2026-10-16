import React, { useState, useEffect } from 'react';
import {
  X,
  FileSpreadsheet,
  Link2,
  ExternalLink,
  Check,
  Copy,
  RefreshCw,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  getGoogleSheetConfig,
  saveGoogleSheetConfig,
  fetchFromGoogleSheet,
  GOOGLE_APPS_SCRIPT_CODE
} from '../../utils/googleSheetsService';

export default function GoogleSheetsModal({
  isOpen,
  onClose,
  onSyncComplete,
  showToast
}) {
  const [scriptUrl, setScriptUrl] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const config = getGoogleSheetConfig();
      setScriptUrl(config.scriptUrl || '');
      setSheetUrl(config.sheetUrl || '');
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = async () => {
    soundManager.playClick();
    try {
      await navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
      if (showToast) showToast('Kode Google Apps Script berhasil disalin!');
    } catch {
      alert('Gagal menyalin otomatis. Silakan blok dan salin kode secara manual.');
    }
  };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    soundManager.playSuccess();
    saveGoogleSheetConfig({ scriptUrl, sheetUrl });
    if (showToast) showToast('Konfigurasi Google Spreadsheet berhasil disimpan.');
  };

  const handleTestAndSync = async () => {
    if (!scriptUrl.trim()) {
      alert('Mohon masukkan URL Google Apps Script Web App terlebih dahulu.');
      return;
    }

    soundManager.playClick();
    setIsTesting(true);
    setTestResult(null);

    // Simpan dulu URL yang diinput
    saveGoogleSheetConfig({ scriptUrl, sheetUrl });

    try {
      const data = await fetchFromGoogleSheet();
      setTestResult({
        success: true,
        message: `Koneksi Berhasil! Ditemukan ${data.length} data pengunjung di Spreadsheet.`
      });
      soundManager.playSuccess();
      if (onSyncComplete) {
        onSyncComplete(data);
      }
      if (showToast) showToast(`Berhasil menyinkronkan ${data.length} data dari Google Spreadsheet!`);
    } catch (err) {
      console.error('Test connection error:', err);
      setTestResult({
        success: false,
        message: `Koneksi Gagal: ${err.message || 'Periksa kembali URL Apps Script dan izin aksesnya (Anyone).'}`
      });
      soundManager.playClick();
    } finally {
      setIsTesting(false);
    }
  };

  const isConfigured = Boolean(scriptUrl && scriptUrl.trim());

  return (
    <div className="modal-backdrop-overlay" onClick={onClose}>
      <div
        className="kiosk-modal-card"
        style={{ maxWidth: '780px', width: '92%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="modal-top-bar" style={{ background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)', color: '#ffffff' }}>
          <div className="modal-title-group">
            <div className="modal-icon-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#ffffff' }}>
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="modal-title" style={{ color: '#ffffff' }}>
                Integrasi Cloud Google Spreadsheet
              </h3>
              <p className="modal-desc" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Simpan & akses data buku tamu secara dinamis kapan saja di Google Sheet
              </p>
            </div>
          </div>
          <button className="modal-close-icon-btn" onClick={onClose} aria-label="Tutup" style={{ color: '#ffffff' }}>
            <X size={22} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="modal-body-container" style={{ overflowY: 'auto', padding: '1.5rem', flex: 1 }}>
          
          {/* Status Banner */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.85rem 1.2rem',
              borderRadius: '12px',
              marginBottom: '1.25rem',
              background: isConfigured ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
              border: `1.5px solid ${isConfigured ? '#10b981' : '#f59e0b'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isConfigured ? (
                <CheckCircle2 size={22} className="text-emerald" style={{ color: '#059669' }} />
              ) : (
                <AlertCircle size={22} style={{ color: '#d97706' }} />
              )}
              <div>
                <strong style={{ fontSize: '0.95rem', color: '#1f2937', display: 'block' }}>
                  {isConfigured ? 'Google Apps Script Terpasang' : 'Belum Dihubungkan ke Spreadsheet'}
                </strong>
                <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                  {isConfigured
                    ? 'Setiap tamu baru yang mengisi formulir akan otomatis tersimpan ke baris Spreadsheet.'
                    : 'Masukkan URL Web App dari Google Spreadsheet agar data tersimpan dinamis ke cloud.'}
                </span>
              </div>
            </div>

            {sheetUrl && (
              <a
                href={sheetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-action-tool"
                style={{
                  background: '#059669',
                  color: '#ffffff',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  fontSize: '0.82rem'
                }}
              >
                <ExternalLink size={14} />
                <span>Buka Spreadsheet</span>
              </a>
            )}
          </div>

          {/* Form Konfigurasi URL */}
          <form onSubmit={handleSaveConfig} style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Apps Script Web App URL */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#374151', marginBottom: '0.35rem' }}>
                  URL Google Apps Script Web App <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <div className="field-input-wrap">
                  <Link2 size={18} className="field-icon text-emerald" />
                  <input
                    type="url"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                    className="text-input"
                    required
                  />
                </div>
                <small style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                  URL yang diperoleh setelah klik <strong>Deploy &gt; New deployment &gt; Web app</strong> di Google Sheets.
                </small>
              </div>

              {/* Direct Sheet URL for quick access */}
              <div>
                <label style={{ display: 'block', fontWeight: 700, fontSize: '0.88rem', color: '#374151', marginBottom: '0.35rem' }}>
                  Tautan Langsung Google Spreadsheet (Opsional)
                </label>
                <div className="field-input-wrap">
                  <FileSpreadsheet size={18} className="field-icon text-emerald" />
                  <input
                    type="url"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiM.../edit"
                    className="text-input"
                  />
                </div>
                <small style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: '0.25rem', display: 'block' }}>
                  Digunakan untuk membuka sheet langsung melalui tombol "Buka Spreadsheet" di dashboard.
                </small>
              </div>

              {/* Action Buttons Row */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className="btn-action-tool"
                  style={{
                    background: '#059669',
                    color: '#ffffff',
                    padding: '0.65rem 1.25rem'
                  }}
                >
                  <Check size={16} />
                  <span>Simpan Pengaturan</span>
                </button>

                <button
                  type="button"
                  onClick={handleTestAndSync}
                  disabled={isTesting}
                  className="btn-action-tool"
                  style={{
                    background: '#f0fdf4',
                    borderColor: '#86efac',
                    color: '#166534',
                    padding: '0.65rem 1.25rem'
                  }}
                >
                  <RefreshCw size={16} className={isTesting ? 'spin-icon' : ''} />
                  <span>{isTesting ? 'Menguji & Mengambil Data...' : 'Uji Koneksi & Sinkronkan Data'}</span>
                </button>
              </div>

              {/* Test Connection Alert Message */}
              {testResult && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    background: testResult.success ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${testResult.success ? '#10b981' : '#ef4444'}`,
                    color: testResult.success ? '#065f46' : '#991b1b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {testResult.success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                  <span>{testResult.message}</span>
                </div>
              )}
            </div>
          </form>

          {/* Tutorial & Script Code Accordion */}
          <div
            style={{
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#f8fafc'
            }}
          >
            <button
              type="button"
              onClick={() => setShowTutorial(!showTutorial)}
              style={{
                width: '100%',
                padding: '0.9rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f1f5f9',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                color: '#1e293b',
                fontSize: '0.92rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={18} color="#059669" />
                <span>Petunjuk Mudah: Cara Menghubungkan Google Sheets (Hanya 2 Menit)</span>
              </div>
              {showTutorial ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {showTutorial && (
              <div style={{ padding: '1.25rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.6 }}>
                <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li>
                    Buka <strong><a href="https://sheets.new" target="_blank" rel="noopener noreferrer" style={{ color: '#059669' }}>Google Sheets baru (klik di sini)</a></strong> dan beri nama file, misalnya <em>"Buku Tamu BRMP DIY"</em>.
                  </li>
                  <li>
                    Di spreadsheet tersebut, klik menu <strong>Ekstensi (Extensions)</strong> &gt; <strong>Apps Script</strong>.
                  </li>
                  <li>
                    Hapus kode yang ada di editor, lalu <strong>salin dan tempel kode script</strong> berikut ini:
                  </li>
                </ol>

                {/* Code Block with Copy Button */}
                <div style={{ position: 'relative', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: isCopied ? '#059669' : '#334155',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      zIndex: 2
                    }}
                  >
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{isCopied ? 'Tersalin!' : 'Salin Kode Script'}</span>
                  </button>
                  <pre
                    style={{
                      background: '#0f172a',
                      color: '#f8fafc',
                      padding: '1rem',
                      borderRadius: '8px',
                      fontSize: '0.76rem',
                      overflowX: 'auto',
                      maxHeight: '220px',
                      fontFamily: 'monospace'
                    }}
                  >
                    {GOOGLE_APPS_SCRIPT_CODE}
                  </pre>
                </div>

                <ol start={4} style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li>
                    Klik tombol biru <strong>Terapkan (Deploy)</strong> di kanan atas &gt; pilih <strong>Deployment baru (New deployment)</strong>.
                  </li>
                  <li>
                    Klik ikon <strong>Gerigi (Select type)</strong> di samping kanan tulisan 'Pilih jenis' &gt; pilih <strong>Aplikasi web (Web app)</strong>.
                  </li>
                  <li>
                    Atur setelan berikut:
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                      <li><strong>Deskripsi</strong>: Buku Tamu Web FO</li>
                      <li><strong>Jalankan sebagai (Execute as)</strong>: <code>Saya (email Anda)</code></li>
                      <li>
                        <strong>Siapa yang memiliki akses (Who has access)</strong>: <strong style={{ color: '#059669' }}>Siapa saja (Anyone)</strong> *(Sangat penting agar pengunjung web umum bisa mengirim data)*
                      </li>
                    </ul>
                  </li>
                  <li>
                    Klik <strong>Terapkan (Deploy)</strong>, berikan izin akses (klik 'Lanjutan' / 'Advanced' &gt; 'Buka Buku Tamu (tidak aman)').
                  </li>
                  <li>
                    Salin <strong>URL Aplikasi Web (Web App URL)</strong> yang berakhiran <code>/exec</code>, lalu tempelkan ke kolom input di atas, kemudian klik <strong>Simpan Pengaturan</strong>!
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onClose}
            className="btn-action-tool btn-reset"
            style={{ padding: '0.5rem 1.25rem' }}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
