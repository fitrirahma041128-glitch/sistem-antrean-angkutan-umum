import React, { useState } from 'react';
import { Calendar, Clock, Plus, Truck, User, CheckCircle2, ArrowRight } from 'lucide-react';
import { Schedule } from '../../../types';

interface JadwalViewProps {
  schedules: Schedule[];
}

export const JadwalView: React.FC<JadwalViewProps> = ({ schedules }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'morning' | 'afternoon'>('all');

  const filtered = schedules.filter((s) => {
    if (activeFilter === 'morning') return s.type === 'morning_pickup';
    if (activeFilter === 'afternoon') return s.type === 'afternoon_dropoff';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Jadwal Operasional Antar Jemput</h2>
          <p className="text-xs text-slate-500">
            Jadwal keberangkatan penjemputan pagi dan pengantaran pulang siswa SMP Muhammadiyah 1 Wanareja.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setActiveFilter('morning')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'morning'
                ? 'bg-blue-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Pagi (Jemput)
          </button>
          <button
            onClick={() => setActiveFilter('afternoon')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeFilter === 'afternoon'
                ? 'bg-blue-900 text-white'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            Sore (Antar Pulang)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((sch) => (
          <div
            key={sch.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                    sch.type === 'morning_pickup'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {sch.type === 'morning_pickup' ? '🌅 Penjemputan Pagi' : '🌇 Pengantaran Pulang'}
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    sch.status === 'in_progress'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sch.status === 'completed'
                      ? 'bg-slate-100 text-slate-600'
                      : 'bg-blue-50 text-blue-800'
                  }`}
                >
                  {sch.status === 'in_progress' ? 'Berjalan' : sch.status === 'completed' ? 'Selesai' : 'Terjadwal'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-1">{sch.routeName}</h3>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-4">
                <Calendar className="w-3.5 h-3.5" />
                <span>{sch.day}</span>
              </div>

              <div className="space-y-2 py-2 text-xs border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jam Operasional:</span>
                  <div className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <Clock className="w-3 h-3 text-blue-600" />
                    <span>{sch.timeStart} - {sch.timeEnd} WIB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Supir Petugas:</span>
                  <span className="font-semibold text-slate-800">{sch.driverName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Plat Angkot:</span>
                  <span className="font-mono text-slate-700">{sch.vehiclePlate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Jumlah Siswa:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {sch.studentCount} Siswa
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-sky-700 font-semibold">
              <span>Status Operasional</span>
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Sesuai Jadwal
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
