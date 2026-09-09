import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, ArrowLeft, Sparkles, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';
import { setAdminAuth } from '../../utils/guestbookStore';

export default function AdminLogin({ onLoginSuccess, onBackToFO }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    soundManager.playClick();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      // Standard credentials check
      const validUser = username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'brmp';
      const validPass = password === 'admin' || password === 'admin123' || password === 'brmp2026';

      if (validUser && validPass) {
        soundManager.playSuccess();
        setAdminAuth(rememberMe);
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMsg('Username atau kata sandi tidak valid. Silakan periksa kembali.');
      }
    }, 500);
  };

  return (
    <div className="admin-login-screen">
      {/* Ambient background glows */}
      <div className="admin-ambient-orb orb-1"></div>
      <div className="admin-ambient-orb orb-2"></div>

      <div className="admin-login-card">
        {/* Top Back Link */}
        <button type="button" onClick={onBackToFO} className="login-back-btn">
          <ArrowLeft size={18} />
          <span>Kembali ke Front Office</span>
        </button>

        {/* Decorative Brand Header with Emblem */}
        <div className="admin-login-header">
          <div className="admin-emblem-wrapper">
            <img
              src="/images/brmp_emblem.png"
              alt="Logo Resmi BRMP DIY"
              className="admin-emblem-image"
            />
            <div className="emblem-halo-effect"></div>
          </div>
          
          <div className="admin-badge-pill">
            <ShieldCheck size={14} className="text-emerald" />
            <span>PORTAL ADMINISTRATOR BRMP DIY</span>
          </div>

          <h2 className="admin-card-title">Login Dashboard Admin</h2>
          <p className="admin-card-sub">
            Masuk untuk memantau data buku tamu digital dan layanan registrasi tamu.
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="login-error-box animate-shake">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group-login">
            <label className="login-field-label">Username</label>
            <div className="login-input-box">
              <User size={18} className="login-input-icon" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username admin"
                className="login-input-element"
                autoFocus
              />
            </div>
          </div>

          <div className="form-group-login">
            <label className="login-field-label">Kata Sandi</label>
            <div className="login-input-box">
              <Lock size={18} className="login-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="login-input-element"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="login-options-row">
            <label className="remember-checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Ingat sesi login saya</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-admin-submit"
          >
            {isLoading ? (
              <>
                <span className="submit-spinner"></span>
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Dashboard</span>
                <Sparkles size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="admin-login-footer">
          <p>© {new Date().getFullYear()} Balai Pengawasan dan Sertifikasi Benih • BRMP DIY</p>
        </div>
      </div>
    </div>
  );
}
