import React, { useState } from 'react';
import { User, Lock, ArrowRight, Shield, Truck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../../types';
import { MuhammadiyahEmblem, SimantarLogo, AngkotIllustration } from '../common/Logo';

interface LoginViewProps {
  onLoginSuccess: (role: UserRole, user: any) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRoleChange = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setErrorMessage('');
    if (selectedRole === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('budi');
      setPassword('supir123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, role })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal. Periksa username dan password.');
      }

      onLoginSuccess(role, data.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal terhubung ke server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#0B1E38] to-slate-900 flex items-center justify-center p-4 sm:p-6">
      {/* Background Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header Branding */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#0F172A] p-6 text-white text-center relative">
          <div className="flex justify-center mb-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md shadow-inner">
              <MuhammadiyahEmblem size={56} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl font-black tracking-wider text-white">SIMANTAR</span>
            <span className="text-[10px] bg-sky-500 text-white font-bold px-2 py-0.5 rounded-full uppercase">
              Wanareja
            </span>
          </div>

          <p className="text-xs text-sky-200 font-medium">
            Sistem Monitoring Antar Jemput Siswa
          </p>
          <p className="text-[11px] text-slate-300 font-normal">
            SMP Muhammadiyah 1 Wanareja
          </p>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2">
            <AngkotIllustration size={44} />
          </div>
        </div>

        {/* Login Body */}
        <div className="p-6 pt-7">
          {/* Role Tabs */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider text-center">
              Pilih Peran Pengguna:
            </div>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => handleRoleChange('admin')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'admin'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin / Guru
              </button>
              <button
                type="button"
                onClick={() => handleRoleChange('driver')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  role === 'driver'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-4 h-4" />
                Supir Angkot
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Username / Nama Pengguna
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === 'admin' ? 'admin' : 'budi / supir1'}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Kata Sandi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <>
                  <span>Masuk Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 text-center">
              Akses Cepat Pengujian (1-Klik):
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setRole('admin');
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-center transition-colors"
              >
                🔑 Admin (admin123)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('driver');
                  setUsername('budi');
                  setPassword('supir123');
                }}
                className="py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium text-center transition-colors"
              >
                🚐 Supir Budi (supir123)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            © 2026 SMP Muhammadiyah 1 Wanareja · SIMANTAR
          </p>
        </div>
      </div>
    </div>
  );
};
