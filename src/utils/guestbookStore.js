// Data Store & Management for BRMP DIY Guestbook (Buku Tamu Digital)

const STORAGE_KEY = 'brmp_guestbook_entries';
const ADMIN_AUTH_KEY = 'brmp_admin_session';

const INITIAL_SAMPLE_DATA = [
  {
    id: 'GUEST-1741334001',
    timestamp: '07 Maret 2026, 08:15 WIB',
    createdAt: '2026-03-07T08:15:00',
    nama: 'Dr. Ir. Bambang Sutrisno, M.P.',
    usia: 48,
    pendidikan: 'S3',
    asal: 'Instansi',
    nama_instansi: 'Dinas Pertanian dan Ketahanan Pangan Kab. Sleman',
    pekerjaan: 'Kepala Bidang Tanaman Pangan',
    telepon: '081234567890',
    email: 'bambang.sutrisno@slemankab.go.id',
    keperluan: 'Koordinasi pengawasan sertifikasi benih padi varietas unggul lokal dan monitoring mutu lab.',
  },
  {
    id: 'GUEST-1741334002',
    timestamp: '07 Maret 2026, 08:28 WIB',
    createdAt: '2026-03-07T08:28:00',
    nama: 'Dewi Anggraini, S.P.',
    usia: 29,
    pendidikan: 'S1',
    asal: 'Perusahaan',
    nama_instansi: 'PT. Agro Nusantara Sejahtera',
    pekerjaan: 'Quality Control Agribisnis',
    telepon: '085712345678',
    email: 'dewi.agronusantara@gmail.com',
    keperluan: 'Konsultasi prosedur sertifikasi benih jagung hibrida dan pengujian daya kecambah di laboratorium.',
  },
  {
    id: 'GUEST-1741334003',
    timestamp: '07 Maret 2026, 08:35 WIB',
    createdAt: '2026-03-07T08:35:00',
    nama: 'Fajar Prasetyo',
    usia: 21,
    pendidikan: 'SMA',
    asal: 'Sekolah',
    nama_instansi: 'Fakultas Pertanian Universitas Gadjah Mada',
    pekerjaan: 'Mahasiswa Agroteknologi',
    telepon: '081398765432',
    email: 'fajar.prasetyo@mail.ugm.ac.id',
    keperluan: 'Permohonan izin kunjungan praktikum lapangan dan pengamatan teknologi kultur jaringan benih.',
  },
  {
    id: 'GUEST-1741334004',
    timestamp: '06 Maret 2026, 14:10 WIB',
    createdAt: '2026-03-06T14:10:00',
    nama: 'Supriyanto',
    usia: 52,
    pendidikan: 'SMA',
    asal: 'Perorangan',
    nama_instansi: '-',
    pekerjaan: 'Petani Penangkar Benih Bantul',
    telepon: '082133445566',
    email: 'supriyanto.benih@gmail.com',
    keperluan: 'Konsultasi mutu benih padi sawah dan bimbingan teknis uji benih berlabel.',
  }
];

export const getGuestbookEntries = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
      return INITIAL_SAMPLE_DATA;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error accessing guestbook storage:', err);
    return INITIAL_SAMPLE_DATA;
  }
};

export const saveGuestbookEntry = (entryData) => {
  try {
    const current = getGuestbookEntries();
    const now = new Date();
    
    // Format Indonesian timestamp
    const dateFormatted = new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(now);
    
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${dateFormatted}, ${hours}:${minutes} WIB`;

    const newEntry = {
      id: `GUEST-${Date.now()}`,
      createdAt: now.toISOString(),
      timestamp,
      nama: entryData.nama?.trim() || '',
      usia: Number(entryData.usia) || 0,
      pendidikan: entryData.pendidikan || '',
      asal: entryData.asal || '',
      nama_instansi: entryData.asal === 'Perorangan' ? '-' : (entryData.nama_instansi?.trim() || '-'),
      pekerjaan: entryData.pekerjaan?.trim() || '',
      telepon: entryData.telepon?.trim() || '',
      email: entryData.email?.trim() || '',
      keperluan: entryData.keperluan?.trim() || ''
    };

    const updated = [newEntry, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newEntry;
  } catch (err) {
    console.error('Error saving guestbook entry:', err);
    throw err;
  }
};

export const deleteGuestbookEntry = (id) => {
  try {
    const current = getGuestbookEntries();
    const filtered = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (err) {
    console.error('Error deleting entry:', err);
    return getGuestbookEntries();
  }
};

export const resetGuestbookData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_DATA));
  return INITIAL_SAMPLE_DATA;
};

// Admin Session helpers
export const checkAdminAuth = () => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === 'true' || sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const setAdminAuth = (rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem(ADMIN_AUTH_KEY, 'true');
  } else {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
  }
};

export const clearAdminAuth = () => {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  sessionStorage.removeItem(ADMIN_AUTH_KEY);
};

// Export to CSV helper
export const exportEntriesToCSV = (entries) => {
  if (!entries || !entries.length) return;

  const headers = [
    'ID Kunjungan',
    'Waktu Kunjungan',
    'Nama Lengkap',
    'Usia',
    'Pendidikan Terakhir',
    'Kategori Asal',
    'Nama Instansi / Lembaga',
    'Pekerjaan / Jabatan',
    'No. Telepon / WhatsApp',
    'Email',
    'Keperluan Kunjungan'
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = entries.map(item => [
    escapeCSV(item.id),
    escapeCSV(item.timestamp),
    escapeCSV(item.nama),
    escapeCSV(item.usia),
    escapeCSV(item.pendidikan),
    escapeCSV(item.asal),
    escapeCSV(item.nama_instansi),
    escapeCSV(item.pekerjaan),
    escapeCSV(item.telepon),
    escapeCSV(item.email),
    escapeCSV(item.keperluan)
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(';'),
    ...rows.map(r => r.join(';'))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const nowStr = new Date().toISOString().slice(0, 10);
  link.setAttribute('href', url);
  link.setAttribute('download', `buku_tamu_brmp_diy_${nowStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
