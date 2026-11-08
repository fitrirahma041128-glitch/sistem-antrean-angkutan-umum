import React, { useState } from 'react';
import {
  Settings,
  MessageSquare,
  Key,
  Shield,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Eye,
  EyeOff,
  Send
} from 'lucide-react';
import { SystemSettings } from '../../../types';

interface PengaturanViewProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: Partial<SystemSettings>) => Promise<void>;
  onResetDemo: () => Promise<void>;
  onSendTestMessage: (phone: string, msg: string) => Promise<void>;
}

export const PengaturanView: React.FC<PengaturanViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemo,
  onSendTestMessage
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [showToken, setShowToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [testPhone, setTestPhone] = useState('0812-3456-7890');
  const [testMsg, setTestMsg] = useState('SMP Muhammadiyah 1 Wanareja: Tes integrasi Fonnte WhatsApp Gateway berhasil.');
  const [testingSend, setTestingSend] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingSend(true);
    try {
      await onSendTestMessage(testPhone, testMsg);
      setTestSuccess(true);
      setTimeout(() => setTestSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingSend(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Pengaturan SIMANTAR</h2>
        <p className="text-xs text-slate-500">
          Konfigurasi WhatsApp Gateway Fonnte, template pesan notifikasi otomatis, dan preferensi sistem sekolah.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* WhatsApp Gateway Fonnte Section */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Integrasi WhatsApp Gateway (Fonnte API)
                </h3>
                <p className="text-xs text-slate-500">
                  Kirim pesan otomatis langsung ke nomor WhatsApp orang tua siswa secara real-time.
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                formData.fonnteApiToken
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {formData.fonnteApiToken ? '● Fonnte API Terkonfigurasi' : '● Mode Simulasi (Fonnte Ready)'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Fonnte API Token
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={formData.fonnteApiToken}
                  onChange={(e) => setFormData({ ...formData, fonnteApiToken: e.target.value })}
                  placeholder="Masukkan API Token dari https://fonnte.com"
                  className="w-full px-3 py-2 pr-10 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>
                  Bila token dikosongkan, sistem otomatis beroperasi dalam <strong>Mode Simulasi</strong> dan notifikasi tersimpan di Log WhatsApp.
                </span>
                <a
                  href="https://fonnte.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline flex items-center gap-1 shrink-0 font-medium ml-2"
                >
                  Daftar Fonnte <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nomor Pengirim Sekolah</label>
                <input
                  type="text"
                  value={formData.senderPhone}
                  onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                  placeholder="0812-9876-5432"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Gateway</label>
                <div className="p-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-700 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">
                    {formData.fonnteApiToken ? 'Terkoneksi ke Server Fonnte' : 'Aktif dalam Mode Simulasi Interaktif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp Automated Templates (The 4 stages from Requirement #6) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">
              Template Pesan Otomatis WhatsApp ke Orang Tua
            </h3>
            <p className="text-xs text-slate-500">
              Variabel yang dapat digunakan:{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[NAMA_ORTU]</code>,{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[NAMA_SISWA]</code>,{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[NAMA_SUPIR]</code>,{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[PLAT]</code>,{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[LOKASI]</code>,{' '}
              <code className="text-blue-900 bg-blue-50 px-1 py-0.5 rounded font-mono">[WAKTU]</code>
            </p>
          </div>

          <div className="space-y-4 text-xs">
            {/* 1. Berangkat */}
            <div>
              <label className="block font-bold text-blue-900 mb-1">
                1. Notifikasi: Supir Berangkat dari Sekolah
              </label>
              <textarea
                value={formData.templates.departed}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templates: { ...formData.templates, departed: e.target.value }
                  })
                }
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-sky-500"
              />
            </div>

            {/* 2. Tiba Titik Jemput */}
            <div>
              <label className="block font-bold text-emerald-800 mb-1">
                2. Notifikasi: Supir Tiba di Titik Penjemputan
              </label>
              <textarea
                value={formData.templates.at_pickup}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templates: { ...formData.templates, at_pickup: e.target.value }
                  })
                }
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-sky-500"
              />
            </div>

            {/* 3. Siswa Sudah Naik */}
            <div>
              <label className="block font-bold text-amber-800 mb-1">
                3. Notifikasi: Siswa Sudah Naik Kendaraan
              </label>
              <textarea
                value={formData.templates.boarded}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templates: { ...formData.templates, boarded: e.target.value }
                  })
                }
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-sky-500"
              />
            </div>

            {/* 4. Siswa Sampai Sekolah */}
            <div>
              <label className="block font-bold text-purple-900 mb-1">
                4. Notifikasi: Siswa Sampai di Sekolah
              </label>
              <textarea
                value={formData.templates.arrived}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    templates: { ...formData.templates, arrived: e.target.value }
                  })
                }
                rows={2}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:outline-sky-500"
              />
            </div>
          </div>
        </div>

        {/* School Identity */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-bold text-sm text-slate-900">Identitas Sekolah</h3>
            <p className="text-xs text-slate-500">Profil SMP Muhammadiyah 1 Wanareja</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nama Sekolah</label>
              <input
                type="text"
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subjudul / Wilayah</label>
              <input
                type="text"
                value={formData.schoolSubtext}
                onChange={(e) => setFormData({ ...formData, schoolSubtext: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={formData.schoolAddress}
                onChange={(e) => setFormData({ ...formData, schoolAddress: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={async () => {
              if (window.confirm('Reset seluruh data dummy demo kembali ke kondisi awal?')) {
                await onResetDemo();
                alert('Data demo berhasil direset.');
              }
            }}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Data Demo
          </button>

          <div className="flex items-center gap-3">
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Pengaturan berhasil disimpan!
              </span>
            )}
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
