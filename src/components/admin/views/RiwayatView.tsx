import React, { useState } from 'react';
import { Calendar, Search, Filter, CheckCircle2, Download, Clock } from 'lucide-react';
import { TripHistoryItem } from '../../../types';

interface RiwayatViewProps {
  history: TripHistoryItem[];
}

export const RiwayatView: React.FC<RiwayatViewProps> = ({ history }) => {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.action.toLowerCase().includes(search.toLowerCase()) ||
      item.driverName.toLowerCase().includes(search.toLowerCase()) ||
      item.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());

    const matchesAction = filterAction === 'all' || item.stage === filterAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Riwayat Penjemputan Siswa</h2>
          <p className="text-xs text-slate-500">
            Log rekaman digital setiap tahapan perjalanan dan waktu kejadian antar jemput siswa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700 font-semibold shadow-xs">
            📅 {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center gap-3 justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari supir, lokasi, aksi..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            Tahapan:
          </span>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors shrink-0 ${
              filterAction === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterAction('departed_school')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors shrink-0 ${
              filterAction === 'departed_school'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Berangkat
          </button>
          <button
            onClick={() => setFilterAction('at_pickup')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors shrink-0 ${
              filterAction === 'at_pickup'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tiba Jemput
          </button>
          <button
            onClick={() => setFilterAction('students_boarded')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors shrink-0 ${
              filterAction === 'students_boarded'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Siswa Naik
          </button>
          <button
            onClick={() => setFilterAction('arrived_school')}
            className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors shrink-0 ${
              filterAction === 'arrived_school'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sampai Sekolah
          </button>
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">Waktu Kejadian</th>
                <th className="py-3 px-4">Aktivitas / Status</th>
                <th className="py-3 px-4">Supir & Kendaraan</th>
                <th className="py-3 px-4">Lokasi Kejadian</th>
                <th className="py-3 px-4">Catatan Sistem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded inline-block">
                      {item.timeStr} WIB
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.date}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{item.action}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      {item.stage}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">{item.driverName}</div>
                    <div className="font-mono text-[11px] text-blue-900 font-bold">
                      {item.vehiclePlate}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 max-w-xs">
                    {item.location}
                  </td>

                  <td className="py-3 px-4 text-slate-500 italic max-w-xs">
                    {item.notes || 'Status tercatat otomatis'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
