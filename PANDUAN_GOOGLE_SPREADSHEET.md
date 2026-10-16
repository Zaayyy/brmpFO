# 📊 Panduan Integrasi Google Spreadsheet - Buku Tamu Digital BRMP DIY

Website Front Office Kiosk ini telah dilengkapi dengan sistem **Cloud Sync Real-Time** menggunakan **Google Apps Script & Google Sheets**. 

Dengan integrasi ini:
- Setiap kali tamu mengisi formulir buku tamu di website/kiosk, datanya **langsung otomatis tersimpan ke baris Google Spreadsheet**.
- Admin / Petugas dapat **membuka dan mengakses spreadsheet kapan saja** melalui Google Drive, PC, maupun smartphone.
- Admin Dashboard dapat menyinkronkan data secara langsung dari spreadsheet (*two-way live sync*).
- Jika internet sempat terputus, sistem tetap menyimpan data di *cache* lokal sehingga tidak ada data yang hilang.

---

## 🚀 Langkah Cepat Menghubungkan Google Spreadsheet (Hanya 2 Menit)

### Langkah 1: Buat File Google Spreadsheet Baru
1. Buka [Google Sheets (klik di sini)](https://sheets.new) di browser Anda.
2. Beri nama spreadsheet di pojok kiri atas, contoh: **"Buku Tamu BRMP DIY"**.

---

### Langkah 2: Buka Apps Script
1. Di halaman spreadsheet tersebut, klik menu **Ekstensi (Extensions)** > pilih **Apps Script**.
2. Jendela editor kode Google Apps Script akan terbuka. Hapus seluruh baris kode contoh `function myFunction() { ... }` yang ada di editor.

---

### Langkah 3: Salin dan Tempel Kode Berikut
Tempelkan kode di bawah ini ke dalam editor Apps Script:

```javascript
// ========================================================
// KODE GOOGLE APPS SCRIPT - BUKU TAMU DIGITAL BRMP DIY
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

    // 1. ACTION: READ (Mengambil data buku tamu untuk Admin Dashboard)
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
        data: data.reverse() // Data tamu terbaru di atas
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // 2. ACTION: INSERT (Menyimpan formulir tamu baru)
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
```

3. Klik ikon disket **Simpan (Save)** di atas editor.
