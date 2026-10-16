// Layanan Sinkronisasi Google Spreadsheet untuk Buku Tamu BRMP DIY
// Menggunakan Google Apps Script Web App untuk penyimpanan real-time ke Google Sheet

const SCRIPT_URL_KEY = 'brmp_google_sheet_script_url';
const SHEET_VIEW_URL_KEY = 'brmp_google_sheet_view_url';

export const DEFAULT_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbxwyQ6FsIMB_bGLjJ5JuxtQhG89whys7uxYOSQnlw8v0CSWYWg2kfixglZDQjm7aTY8/exec';

export const getGoogleSheetConfig = () => {
  const scriptUrl =
    localStorage.getItem(SCRIPT_URL_KEY) ||
    import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL ||
    DEFAULT_SCRIPT_URL;
  const sheetUrl =
    localStorage.getItem(SHEET_VIEW_URL_KEY) ||
    import.meta.env.VITE_GOOGLE_SHEET_VIEW_URL ||
    '';
  return { scriptUrl, sheetUrl };
};

export const saveGoogleSheetConfig = ({ scriptUrl, sheetUrl }) => {
  if (scriptUrl !== undefined) {
    localStorage.setItem(SCRIPT_URL_KEY, (scriptUrl || '').trim());
  }
  if (sheetUrl !== undefined) {
    localStorage.setItem(SHEET_VIEW_URL_KEY, (sheetUrl || '').trim());
  }
};

/**
 * Mengirim data tamu baru ke Google Spreadsheet via Google Apps Script Web App
 */
export const submitToGoogleSheet = async (entryData) => {
  const { scriptUrl } = getGoogleSheetConfig();
  if (!scriptUrl) {
    console.warn('Google Sheet Web App URL belum dikonfigurasi. Data hanya disimpan lokal.');
    return { success: false, reason: 'unconfigured' };
  }

  try {
    // Kirim menggunakan fetch POST dengan text/plain payload agar tidak terblokir preflight CORS di Google Script
    const payload = JSON.stringify(entryData);
    
    // Method 1: Coba POST langsung
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Google Apps Script me-redirect ke Googleusercontent, no-cors mencegah error CORS
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payload
    });

    return { success: true };
  } catch (err) {
    console.error('Gagal mengirim ke Google Sheets:', err);
    // Coba fallback via GET params jika POST jaringan terblokir
    try {
      const params = new URLSearchParams({
        action: 'insert',
        id: entryData.id || '',
        timestamp: entryData.timestamp || '',
        nama: entryData.nama || '',
        usia: String(entryData.usia || ''),
        pendidikan: entryData.pendidikan || '',
        asal: entryData.asal || '',
        nama_instansi: entryData.nama_instansi || '-',
        pekerjaan: entryData.pekerjaan || '',
        telepon: entryData.telepon || '',
        email: entryData.email || '',
        keperluan: entryData.keperluan || ''
      });
      await fetch(`${scriptUrl}?${params.toString()}`, { mode: 'no-cors' });
      return { success: true, fallback: true };
    } catch (fallbackErr) {
      console.error('Fallback GET juga gagal:', fallbackErr);
      return { success: false, error: err };
    }
  }
};

/**
 * Mengambil data buku tamu dari Google Spreadsheet (untuk sinkronisasi Admin)
 */
export const fetchFromGoogleSheet = async () => {
  const { scriptUrl } = getGoogleSheetConfig();
  if (!scriptUrl) {
    throw new Error('URL Google Apps Script belum disetel.');
  }

  const url = `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}action=read&t=${Date.now()}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const result = await response.json();
  if (result.status === 'success' && Array.isArray(result.data)) {
    return result.data;
  }
  throw new Error(result.message || 'Format data dari Spreadsheet tidak sesuai.');
};

/**
 * Template Kode Google Apps Script untuk dipasang di Google Sheets
 */
export const GOOGLE_APPS_SCRIPT_CODE = `// ========================================================
// KODE GOOGLE APPS SCRIPT - BUKU TAMU DIGITAL BRMP DIY
// Pasang script ini di Google Spreadsheet:
// Menu "Ekstensi" (Extensions) > "Apps Script"
// ========================================================

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(15000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Buku Tamu");
    if (!sheet) {
      sheet = ss.getSheets()[0];
      sheet.setName("Buku Tamu");
    }

    // Buat Header jika sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Waktu Kunjungan",
        "ID Kunjungan",
        "Nama Lengkap",
        "Usia",
        "Pendidikan Terakhir",
        "Kategori Asal",
        "Nama Instansi / Lembaga",
        "Pekerjaan / Jabatan",
        "No. Telepon / WhatsApp",
        "Email",
        "Keperluan Kunjungan"
      ]);
      var headerRange = sheet.getRange(1, 1, 1, 11);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#059669");
      headerRange.setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }

    var action = (e && e.parameter && e.parameter.action) || 'insert';

    // 1. ACTION: READ (Mengambil seluruh data)
    if (action === 'read') {
      var rows = sheet.getDataRange().getValues();
      var data = [];
      for (var i = 1; i < rows.length; i++) {
        var row = rows[i];
        if (!row[0] && !row[1] && !row[2]) continue;
        data.push({
          id: String(row[1] || ('GUEST-' + i)),
          timestamp: row[0] ? String(row[0]) : '',
          nama: String(row[2] || ''),
          usia: Number(row[3]) || 0,
          pendidikan: String(row[4] || ''),
          asal: String(row[5] || ''),
          nama_instansi: String(row[6] || '-'),
          pekerjaan: String(row[7] || ''),
          telepon: String(row[8] || ''),
          email: String(row[9] || ''),
          keperluan: String(row[10] || '')
        });
      }
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        count: data.length,
        data: data.reverse() // Tamu terbaru di atas
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. ACTION: INSERT (Menyimpan tamu baru)
    var item = {};
    if (e && e.postData && e.postData.contents) {
      try {
        item = JSON.parse(e.postData.contents);
      } catch (err) {
        item = e.parameter || {};
      }
    } else if (e && e.parameter) {
      item = e.parameter;
    }

    var telpVal = item.telepon ? "'" + item.telepon : '';
    sheet.appendRow([
      item.timestamp || Utilities.formatDate(new Date(), "GMT+7", "dd MMMM yyyy, HH:mm 'WIB'"),
      item.id || ('GUEST-' + new Date().getTime()),
      item.nama || '',
      item.usia || '',
      item.pendidikan || '',
      item.asal || '',
      item.nama_instansi || '-',
      item.pekerjaan || '',
      telpVal,
      item.email || '',
      item.keperluan || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil disimpan ke Google Sheets'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
`;
