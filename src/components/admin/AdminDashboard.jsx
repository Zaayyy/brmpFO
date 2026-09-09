import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  Calendar,
  Building2,
  Briefcase,
  Search,
  Filter,
  Download,
  Printer,
  Trash2,
  Eye,
  LogOut,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  Phone,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { soundManager } from '../../utils/audio';
import {
  getGuestbookEntries,
  deleteGuestbookEntry,
  resetGuestbookData,
  clearAdminAuth,
  exportEntriesToCSV
} from '../../utils/guestbookStore';
import GuestDetailModal from './GuestDetailModal';

export default function AdminDashboard({ onLogout, onBackToFO }) {
  const [entries, setEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAsal, setFilterAsal] = useState('ALL');
  const [filterTime, setFilterTime] = useState('ALL');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Load initial data
    setEntries(getGuestbookEntries());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const promptResetData = () => {
    soundManager.playClick();
    setIsResetConfirmOpen(true);
  };

  const executeResetData = () => {
    const sample = resetGuestbookData();
    setEntries(sample);
    setIsResetConfirmOpen(false);
    soundManager.playSuccess();
    showToast('Data contoh BRMP DIY berhasil dimuat ulang.');
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3200);
  };

  const promptLogout = () => {
    soundManager.playClick();
    setIsLogoutConfirmOpen(true);
  };

  const executeLogout = () => {
    soundManager.playSuccess();
    clearAdminAuth();
    onLogout();
  };

  const promptDelete = (item) => {
    soundManager.playClick();
    setDeleteTarget(item);
  };

  const executeDelete = () => {
    if (!deleteTarget) return;
    const deletedName = deleteTarget.nama;
    const updated = deleteGuestbookEntry(deleteTarget.id);
    setEntries(updated);
    setDeleteTarget(null);
    if (isDetailOpen && selectedEntry?.id === deleteTarget.id) {
      setIsDetailOpen(false);
      setSelectedEntry(null);
    }
    soundManager.playSuccess();
    showToast(`Catatan kunjungan dari "${deletedName}" berhasil dihapus.`);

    const newTotalPages = Math.ceil(updated.length / itemsPerPage) || 1;
    if (currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  };

  const handleViewDetail = (entry) => {
    soundManager.playClick();
    setSelectedEntry(entry);
    setIsDetailOpen(true);
  };

  const handleExportCSV = () => {
    soundManager.playClick();
    exportEntriesToCSV(filteredEntries);
  };

  const handlePrint = () => {
    soundManager.playClick();
    window.print();
  };

  // Live filtered data
  const filteredEntries = useMemo(() => {
    return entries.filter((item) => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchSearch =
        !query ||
        item.nama?.toLowerCase().includes(query) ||
        item.nama_instansi?.toLowerCase().includes(query) ||
        item.pekerjaan?.toLowerCase().includes(query) ||
        item.keperluan?.toLowerCase().includes(query) ||
        item.telepon?.toLowerCase().includes(query);

      // Asal match
      const matchAsal = filterAsal === 'ALL' || item.asal === filterAsal;

      // Time match (simple check against createdAt if available)
      let matchTime = true;
      if (filterTime === 'TODAY' && item.createdAt) {
        const itemDate = new Date(item.createdAt).toDateString();
        const todayDate = new Date().toDateString();
        matchTime = itemDate === todayDate;
      }

      return matchSearch && matchAsal && matchTime;
    });
  }, [entries, searchQuery, filterAsal, filterTime]);

  // Pagination
  const totalPages = Math.ceil(filteredEntries.length / itemsPerPage) || 1;
  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEntries.slice(start, start + itemsPerPage);
  }, [filteredEntries, currentPage, itemsPerPage]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = entries.length;
    const todayCount = entries.filter((item) => {
      if (!item.createdAt) return false;
      return new Date(item.createdAt).toDateString() === new Date().toDateString();
    }).length;

    const instansiCount = entries.filter((item) => item.asal === 'Instansi').length;
    const nonInstansiCount = entries.filter((item) => item.asal !== 'Instansi').length;

    return {
      total,
      todayCount,
      instansiCount,
      nonInstansiCount
    };
  }, [entries]);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentTime);

  const timeString = `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}:${String(currentTime.getSeconds()).padStart(2, '0')} WIB`;

  return (
    <div className="admin-dashboard-root">
      {/* Decorative ambient background orbs */}
      <div className="admin-bg-mesh">
        <div className="mesh-circle circle-emerald"></div>
        <div className="mesh-circle circle-sapphire"></div>
        <div className="mesh-circle circle-gold"></div>
      </div>

      {/* ==================================================== */}
      {/* ADMIN TOP NAVBAR                                    */}
      {/* ==================================================== */}
      <header className="admin-navbar">
        <div className="admin-navbar-inner">
          {/* Left Brand */}
          <div className="admin-brand-section">
            <div className="admin-nav-emblem-wrap">
              <img
                src="/images/brmp_emblem.png"
                alt="Logo BRMP DIY"
                className="admin-nav-emblem"
              />
              <div className="emblem-spark-ring"></div>
            </div>
            <div>
              <div className="admin-gov-tag">
                <span>PEMERINTAH DAERAH D.I. YOGYAKARTA</span>
              </div>
              <h1 className="admin-portal-title">
                Dashboard Pelayanan & Buku Tamu <span>BRMP DIY</span>
              </h1>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="admin-nav-actions">
            <div className="admin-live-clock-badge">
              <Clock size={14} className="text-gold" />
              <span>{timeString}</span>
              <span className="clock-divider">•</span>
              <span className="clock-date">{formattedDate}</span>
            </div>

            <button
              onClick={onBackToFO}
              className="btn-nav-return"
              title="Beralih ke Tampilan Layar Front Office (Kiosk)"
            >
              <ArrowLeft size={16} />
              <span>Front Office</span>
            </button>

            <button
              onClick={promptLogout}
              className="btn-nav-logout"
              title="Keluar dari sesi administrator"
            >
              <LogOut size={16} />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* ==================================================== */}
      {/* DASHBOARD CONTENT BODY                              */}
      {/* ==================================================== */}
      <main className="admin-dashboard-container">
        
        {/* Welcome & Stats Row */}
        <section className="stats-cards-grid">
          {/* Card 1: Total Tamu */}
          <div className="stat-card emerald-stat">
            <div className="stat-card-top">
              <span className="stat-title">Total Kunjungan Tamu</span>
              <div className="stat-icon-wrapper emerald-bg">
                <Users size={22} className="text-emerald-dark" />
              </div>
            </div>
            <div className="stat-number">{stats.total}</div>
            <p className="stat-sub">Semua data registrasi tersimpan</p>
          </div>

          {/* Card 2: Tamu Hari Ini */}
          <div className="stat-card sapphire-stat">
            <div className="stat-card-top">
              <span className="stat-title">Kunjungan Hari Ini</span>
              <div className="stat-icon-wrapper sapphire-bg">
                <Calendar size={22} className="text-sapphire-dark" />
              </div>
            </div>
            <div className="stat-number">{stats.todayCount}</div>
            <p className="stat-sub">Pengunjung tanggal hari ini</p>
          </div>

          {/* Card 3: Instansi Pemerintah */}
          <div className="stat-card gold-stat">
            <div className="stat-card-top">
              <span className="stat-title">Instansi Pemerintah</span>
              <div className="stat-icon-wrapper gold-bg">
                <Building2 size={22} className="text-gold-dark" />
              </div>
            </div>
            <div className="stat-number">{stats.instansiCount}</div>
            <p className="stat-sub">Kunjungan kedinasan / Pemda</p>
          </div>

          {/* Card 4: Swasta, Kampus & Warga */}
          <div className="stat-card purple-stat">
            <div className="stat-card-top">
              <span className="stat-title">Swasta, Kampus & Pribadi</span>
              <div className="stat-icon-wrapper purple-bg">
                <Briefcase size={22} className="text-purple-dark" />
              </div>
            </div>
            <div className="stat-number">{stats.nonInstansiCount}</div>
            <p className="stat-sub">Perusahaan, sekolah & perorangan</p>
          </div>
        </section>

        {/* ==================================================== */}
        {/* DATA TABLE & FILTER SECTION                         */}
        {/* ==================================================== */}
        <section className="admin-table-card">
          {/* Card Controls & Actions Bar */}
          <div className="table-controls-bar">
            {/* Search Input */}
            <div className="search-field-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari nama tamu, instansi, keperluan..."
                className="search-input-field"
              />
              {searchQuery && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  title="Hapus pencarian"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="filter-dropdown-group">
              <div className="filter-select-wrapper">
                <Filter size={16} className="filter-icon" />
                <select
                  value={filterAsal}
                  onChange={(e) => {
                    setFilterAsal(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="ALL">Semua Kategori Asal</option>
                  <option value="Instansi">Instansi Pemerintahan</option>
                  <option value="Perusahaan">Perusahaan Swasta</option>
                  <option value="Sekolah">Sekolah / Universitas</option>
                  <option value="Perorangan">Perorangan / Pribadi</option>
                </select>
              </div>

              <div className="filter-select-wrapper">
                <Calendar size={16} className="filter-icon" />
                <select
                  value={filterTime}
                  onChange={(e) => {
                    setFilterTime(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-select"
                >
                  <option value="ALL">Semua Waktu</option>
                  <option value="TODAY">Hari Ini Saja</option>
                </select>
              </div>
            </div>

            {/* Actions: Export, Print, Reset */}
            <div className="table-action-btns">
              <button
                type="button"
                onClick={handleExportCSV}
                className="btn-action-tool btn-export"
                title="Ekspor daftar ke format file Excel / CSV"
              >
                <FileSpreadsheet size={16} />
                <span>Ekspor CSV</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="btn-action-tool btn-print"
                title="Cetak laporan data tamu"
              >
                <Printer size={16} />
                <span>Cetak Laporan</span>
              </button>

              <button
                type="button"
                onClick={promptResetData}
                className="btn-action-tool btn-reset"
                title="Muat ulang data sampel default"
              >
                <RefreshCw size={15} />
                <span>Data Contoh</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="table-responsive-wrapper">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No</th>
                  <th>Waktu Kunjungan</th>
                  <th>Nama Tamu & Usia</th>
                  <th>Asal & Instansi</th>
                  <th>Pekerjaan / Jabatan</th>
                  <th>Kontak</th>
                  <th>Keperluan</th>
                  <th style={{ width: '130px', textAlign: 'center' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.length > 0 ? (
                  paginatedEntries.map((item, index) => {
                    const rowNumber = (currentPage - 1) * itemsPerPage + index + 1;
                    
                    // Asal Badge Class
                    let badgeClass = 'badge-instansi';
                    if (item.asal === 'Perusahaan') badgeClass = 'badge-perusahaan';
                    if (item.asal === 'Sekolah') badgeClass = 'badge-sekolah';
                    if (item.asal === 'Perorangan') badgeClass = 'badge-perorangan';

                    let waClean = (item.telepon || '').replace(/[^0-9]/g, '');
                    if (waClean.startsWith('0')) waClean = '62' + waClean.slice(1);

                    return (
                      <tr key={item.id} className="data-row">
                        <td className="cell-number">{rowNumber}</td>
                        <td className="cell-time">
                          <span className="timestamp-badge">{item.timestamp}</span>
                        </td>
                        <td className="cell-name">
                          <div className="guest-name-box">
                            <strong>{item.nama}</strong>
                            <span className="guest-sub-meta">
                              {item.usia} thn • Pend: {item.pendidikan}
                            </span>
                          </div>
                        </td>
                        <td className="cell-instansi">
                          <span className={`origin-badge ${badgeClass}`}>
                            {item.asal}
                          </span>
                          <div className="instansi-name-text">
                            {item.asal === 'Perorangan' ? 'Perorangan / Pribadi' : item.nama_instansi}
                          </div>
                        </td>
                        <td className="cell-job">{item.pekerjaan || '-'}</td>
                        <td className="cell-contact">
                          <div className="contact-action-row">
                            {item.telepon ? (
                              <a
                                href={`https://wa.me/${waClean}?text=Halo%20${encodeURIComponent(item.nama)},%20terima%20kasih%20telah%20berkunjung%20ke%20BRMP%20DIY.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-icon-link wa-link"
                                title={`WhatsApp: ${item.telepon}`}
                              >
                                <MessageSquare size={14} />
                                <span>{item.telepon}</span>
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        </td>
                        <td className="cell-purpose">
                          <p className="purpose-text" title={item.keperluan}>
                            {item.keperluan}
                          </p>
                        </td>
                        <td className="cell-actions">
                          <div className="action-buttons-group">
                            <button
                              onClick={() => handleViewDetail(item)}
                              className="btn-table-action view"
                              title="Lihat Detail Tamu"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              onClick={() => promptDelete(item)}
                              className="btn-table-action delete"
                              title="Hapus Data Tamu"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="empty-table-cell">
                      <div className="empty-state-box">
                        <Users size={42} className="text-light empty-icon" />
                        <h4>Tidak Ada Data Tamu Ditemukan</h4>
                        <p>
                          {searchQuery || filterAsal !== 'ALL' || filterTime !== 'ALL'
                            ? 'Silakan coba ubah kata kunci pencarian atau reset filter di atas.'
                            : 'Belum ada data buku tamu yang diinputkan. Data yang diisi lewat formulir Front Office akan otomatis muncul di sini.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          {filteredEntries.length > 0 && (
            <div className="table-pagination-footer">
              <div className="pagination-info">
                Menampilkan{' '}
                <strong>
                  {Math.min((currentPage - 1) * itemsPerPage + 1, filteredEntries.length)}
                </strong>{' '}
                -{' '}
                <strong>
                  {Math.min(currentPage * itemsPerPage, filteredEntries.length)}
                </strong>{' '}
                dari <strong>{filteredEntries.length}</strong> total data
              </div>

              <div className="pagination-nav">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="btn-pagination-arrow"
                  title="Halaman Sebelumnya"
                >
                  <ChevronLeft size={16} />
                  <span>Sebelumnya</span>
                </button>

                <div className="page-number-tag">
                  Halaman <strong>{currentPage}</strong> dari {totalPages}
                </div>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="btn-pagination-arrow"
                  title="Halaman Selanjutnya"
                >
                  <span>Selanjutnya</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Guest Detail Modal */}
      <GuestDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        entry={selectedEntry}
        onDelete={(item) => {
          setIsDetailOpen(false);
          promptDelete(item);
        }}
      />

      {/* Custom Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="modal-backdrop-overlay" onClick={() => setDeleteTarget(null)}>
          <div
            className="kiosk-modal-card confirm-dialog-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-dialog-header danger">
              <div className="confirm-icon-wrap danger">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="confirm-title">Hapus Catatan Kunjungan?</h3>
                <p className="confirm-subtitle">Tindakan ini permanen dan tidak dapat dibatalkan</p>
              </div>
            </div>

            <div className="confirm-dialog-body">
              <div className="confirm-target-box">
                <div className="confirm-target-row">
                  <span className="confirm-target-label">Nama Tamu:</span>
                  <span className="confirm-target-val">{deleteTarget.nama}</span>
                </div>
                <div className="confirm-target-row">
                  <span className="confirm-target-label">Asal / Instansi:</span>
                  <span className="confirm-target-val">
                    {deleteTarget.asal === 'Perorangan' ? 'Perorangan' : deleteTarget.nama_instansi}
                  </span>
                </div>
                <div className="confirm-target-row">
                  <span className="confirm-target-label">Waktu:</span>
                  <span className="confirm-target-val">{deleteTarget.timestamp}</span>
                </div>
              </div>
              <p className="confirm-message-text">
                Apakah Anda yakin ingin menghapus data buku tamu ini dari sistem?
              </p>
            </div>

            <div className="confirm-dialog-footer">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setDeleteTarget(null)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-confirm-danger"
                onClick={executeDelete}
              >
                <Trash2 size={16} />
                <span>Ya, Hapus Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Logout Confirmation Modal */}
      {isLogoutConfirmOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsLogoutConfirmOpen(false)}>
          <div
            className="kiosk-modal-card confirm-dialog-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-dialog-header neutral">
              <div className="confirm-icon-wrap neutral">
                <LogOut size={22} />
              </div>
              <div>
                <h3 className="confirm-title">Keluar dari Dashboard Admin?</h3>
                <p className="confirm-subtitle">Sesi login administrator akan diakhiri</p>
              </div>
            </div>

            <div className="confirm-dialog-body">
              <p className="confirm-message-text">
                Anda akan diarahkan kembali ke halaman login. Pastikan semua perubahan telah tersimpan.
              </p>
            </div>

            <div className="confirm-dialog-footer">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setIsLogoutConfirmOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-confirm-danger"
                onClick={executeLogout}
              >
                <LogOut size={16} />
                <span>Keluar Sesi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Reset Data Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="modal-backdrop-overlay" onClick={() => setIsResetConfirmOpen(false)}>
          <div
            className="kiosk-modal-card confirm-dialog-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-dialog-header warning">
              <div className="confirm-icon-wrap warning">
                <RefreshCw size={22} />
              </div>
              <div>
                <h3 className="confirm-title">Muat Ulang Data Contoh?</h3>
                <p className="confirm-subtitle">Kembalikan daftar ke 4 data sampel awal BRMP DIY</p>
              </div>
            </div>

            <div className="confirm-dialog-body">
              <p className="confirm-message-text">
                Tindakan ini akan memuat kembali 4 data kunjungan sampel bawaan sistem. Apakah Anda ingin melanjutkan?
              </p>
            </div>

            <div className="confirm-dialog-footer">
              <button
                type="button"
                className="btn-confirm-cancel"
                onClick={() => setIsResetConfirmOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn-confirm-warning"
                onClick={executeResetData}
              >
                <RefreshCw size={16} />
                <span>Ya, Muat Data Contoh</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="admin-toast-banner">
          <CheckCircle2 size={18} className="text-emerald" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
