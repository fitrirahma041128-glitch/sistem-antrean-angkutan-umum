import React, { useState } from 'react';
import { MessageSquare, CheckCheck, RefreshCw, Send, Smartphone, ShieldCheck, ExternalLink } from 'lucide-react';
import { WhatsAppNotification } from '../../types';
import { MuhammadiyahEmblem } from './Logo';

interface NotificationDrawerProps {
  notifications: WhatsAppNotification[];
  isSimulation: boolean;
  onRefresh: () => void;
  onSendTest?: (phone: string, msg: string) => Promise<void>;
  embedded?: boolean; // if true, renders directly as section (like in the poster)
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  notifications,
  isSimulation,
  onRefresh,
  onSendTest,
  embedded = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testPhone, setTestPhone] = useState('0812-3456-7890');
  const [testMessage, setTestMessage] = useState('SMP Muhammadiyah 1 Wanareja: Halo Bunda, angkot sekolah sudah berangkat.');
  const [sending, setSending] = useState(false);
  const [showTestForm, setShowTestForm] = useState(false);

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSendTest) return;
    setSending(true);
    try {
      await onSendTest(testPhone, testMessage);
      setShowTestForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <MessageSquare className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
              Notifikasi WhatsApp ke Orang Tua
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Gateway: {isSimulation ? 'Mode Simulasi (Fonnte Ready)' : 'Fonnte API Terhubung'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onRefresh}
            title="Muat Ulang"
            className="p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          {onSendTest && (
            <button
              onClick={() => setShowTestForm(!showTestForm)}
              className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md font-medium transition-colors"
            >
              Tes Kirim
            </button>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 flex items-center justify-between text-xs text-emerald-800">
        <span className="flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          Otomatis terkirim saat supir menekan status
        </span>
        <span className="font-mono tabular-nums text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[11px]">
          {notifications.length} Pesan
        </span>
      </div>

      {/* Test Form */}
      {showTestForm && (
        <form onSubmit={handleSendTest} className="p-3 bg-white border-b border-slate-200 text-xs flex flex-col gap-2">
          <div className="font-semibold text-slate-800">Kirim Pesan WhatsApp Percobaan:</div>
          <div className="flex gap-2">
            <input
              type="text"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="0812xxxx"
              className="px-2.5 py-1.5 border border-slate-300 rounded-md w-36 font-mono text-xs focus:outline-sky-500"
              required
            />
            <input
              type="text"
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Isi pesan..."
              className="px-2.5 py-1.5 border border-slate-300 rounded-md flex-1 text-xs focus:outline-sky-500"
              required
            />
            <button
              type="submit"
              disabled={sending}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              {sending ? '...' : 'Kirim'}
            </button>
          </div>
        </form>
      )}

      {/* Message Feed (Styled to match the poster's exact card bubbles!) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5]/30">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Belum ada notifikasi WhatsApp yang terkirim hari ini.
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-3.5 shadow-sm border border-slate-200/80 flex items-start gap-3 transition-all hover:shadow"
            >
              <div className="shrink-0 mt-0.5">
                <MuhammadiyahEmblem size={32} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold text-slate-800 tracking-tight">
                    SMP Muhammadiyah 1 Wanareja
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400 tabular-nums">
                      {item.timeStr || '07.00'}
                    </span>
                    <CheckCheck className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed font-normal">
                  {item.message}
                </p>

                <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="truncate">
                    Tujuan: <strong className="text-slate-600 font-medium">{item.targetName}</strong> ({item.targetPhone})
                  </span>
                  <span className="shrink-0 font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 uppercase">
                    {item.status === 'sent' ? 'Terkirim (API)' : 'Simulasi'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-slate-200 p-2.5 text-center text-[11px] text-slate-500 flex items-center justify-between px-4">
        <span>Fonnte WhatsApp API Gateway Integration</span>
        <span className="text-emerald-700 font-medium flex items-center gap-1">
          <Smartphone className="w-3 h-3" />
          Online
        </span>
      </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba59] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-all group"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="hidden md:inline text-xs font-bold tracking-wide pr-1">
          WhatsApp Log
        </span>
        {notifications.length > 0 && (
          <span className="bg-white text-emerald-800 text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center shadow-sm">
            {notifications.length}
          </span>
        )}
      </button>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="p-3 bg-slate-900 text-white flex items-center justify-between">
              <span className="font-semibold text-sm">Panel WhatsApp Gateway</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Tutup
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};
