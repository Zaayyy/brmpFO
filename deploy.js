import 'dotenv/config';
import { Client } from 'basic-ftp';
import path from 'path';
import fs from 'fs';

async function deploy() {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER;
  const password = process.env.FTP_PASSWORD;
  const port = parseInt(process.env.FTP_PORT || '21', 10);
  const remoteDir = process.env.FTP_REMOTE_DIR || '/public_html';
  const secure = process.env.FTP_SECURE === 'true';

  // Validasi konfigurasi
  if (!host || !user || !password || host.includes('namadomainanda.com') || user.includes('username_ftp')) {
    console.error('\n⚠️  KREDENSIAL FTP BELUM LENGKAP ATAU MASIH DEFAULT!');
    console.error('👉 Silakan buka file ".env" dan masukkan data akun FTP Rumahweb Anda:');
    console.error('   - FTP_HOST');
    console.error('   - FTP_USER');
    console.error('   - FTP_PASSWORD\n');
    process.exit(1);
  }

  const distPath = path.resolve('./dist');
  if (!fs.existsSync(distPath)) {
    console.error('\n❌ Folder "./dist" tidak ditemukan. Jalankan "npm run build" terlebih dahulu.\n');
    process.exit(1);
  }

  const client = new Client();
  client.ftp.verbose = true;
  client.ftp.timeout = 60000;

  try {
    console.log(`\n🔌 Menghubungkan ke FTP server: ${host}:${port} ...`);
    await client.access({
      host,
      user,
      password,
      port,
      secure
    });

    console.log(`\n🚀 Berhasil terhubung! Memulai upload isi "./dist" ke "${remoteDir}" ...`);
    await client.uploadFromDir(distPath, remoteDir);

    console.log('\n========================================');
    console.log('🎉 DEPLOY BERHASIL KE RUMAHWEB!');
    console.log('🌐 Silakan periksa website Anda di browser.');
    console.log('========================================\n');
  } catch (err) {
    console.error('\n❌ Terjadi kesalahan saat deploy FTP:', err);
    console.error('💡 Tips: Pastikan host, username, password, dan remote directory sudah benar di file .env.');
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
