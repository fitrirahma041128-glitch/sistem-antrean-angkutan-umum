import React, { useState } from 'react';
import { Search, Phone, Send, User, MessageCircle, Heart } from 'lucide-react';
import { Parent } from '../../../types';

interface DataOrangTuaViewProps {
  parents: Parent[];
  onSendTestMessage?: (phone: string, msg: string) => Promise<void>;
}

export const DataOrangTuaView: React.FC<DataOrangTuaViewProps> = ({
  parents,
  onSendTestMessage
}) => {
  const [search, setSearch] = useState('');
  const [activeMessageModal, setActiveMessageModal] = useState<Parent | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const filtered = parents.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search)
  );

  const handleOpenSend = (parent: Parent) => {
    setActiveMessageModal(parent);
    setCustomMsg(
      `SMP Muhammadiyah 1 Wanareja: Assalamu'alaikum Ibu/Bapak ${parent.name}, terkait penjemputan ananda ${parent.studentName} (${parent.studentClass}), armada angkot akan segera bergerak.`
    );
    setSentSuccess(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessageModal || !onSendTestMessage) return;
    setSending(true);
    try {
      await onSendTestMessage(activeMessageModal.phone, customMsg);
      setSentSuccess(true);
      setTimeout(() => {
        setActiveMessageModal(null);
        setSentSuccess(false);
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Data Orang Tua / Wali Siswa</h2>
        <p className="text-xs text-slate-500">
          Daftar kontak nomor WhatsApp orang tua untuk integrasi notifikasi sistem SIMANTAR.
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama orang tua atau siswa..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total: <span className="font-mono text-blue-900 font-bold">{filtered.length} Orang Tua</span>
        </div>
      </div>

      {/* Parents Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Nama Orang Tua</th>
                <th className="py-3 px-4">Relasi</th>
                <th className="py-3 px-4">Siswa Terkait</th>
                <th className="py-3 px-4">Nomor WhatsApp</th>
                <th className="py-3 px-4">Alamat Rumah</th>
                <th className="py-3 px-4 text-right">Kirim Pesan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{parent.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      {parent.relation || 'Orang Tua'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{parent.studentName}</div>
                    <div className="text-[11px] text-slate-500">Kelas {parent.studentClass}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-mono font-medium text-emerald-800 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{parent.phone}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 max-w-xs truncate">
                    {parent.address}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenSend(parent)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        Kirim WA
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct WhatsApp message modal */}
      {activeMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#075E54] text-white px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-300" />
                <h3 className="font-bold text-sm">
                  Kirim Notifikasi WhatsApp Fonnte
                </h3>
              </div>
              <button
                onClick={() => setActiveMessageModal(null)}
                className="text-white/80 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Tutup
              </button>
            </div>

            <form onSubmit={handleSend} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Penerima:</label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">{activeMessageModal.name}</div>
                  <div className="text-[11px] text-slate-600">
                    Orang tua dari: {activeMessageModal.studentName} ({activeMessageModal.studentClass})
                  </div>
                  <div className="font-mono text-emerald-700 font-semibold mt-0.5">
                    {activeMessageModal.phone}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Pesan WhatsApp:</label>
                <textarea
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg focus:outline-sky-500 h-28 resize-none font-sans"
                  required
                />
              </div>

              {sentSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg font-semibold text-center">
                  Alhamdulillah! Pesan berhasil diproses oleh WhatsApp Gateway.
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMessageModal(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  {sending ? 'Mengirim...' : 'Kirim Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
