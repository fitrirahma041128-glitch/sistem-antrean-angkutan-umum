import React from 'react';
import {
  Users,
  UserCheck,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  AlertTriangle,
  Radio,
  BookOpen,
  Settings,
  FileText
} from 'lucide-react';
import { DashboardStats, Student, Trip, TripHistoryItem } from '../../../types';
import { RouteMap } from '../../common/RouteMap';

interface DashboardViewProps {
  stats: DashboardStats & { delayedStudents: Student[] };
  currentTrip: Trip | null;
  recentActivity: TripHistoryItem[];
  onNavigate: (viewId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  currentTrip,
  recentActivity,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Top 4 Stat Cards (Exact match to poster: 248 Siswa, 12 Supir, 8 Kendaraan, 15 Rute) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div
          onClick={() => onNavigate('students')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {stats.totalStudents || 248}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Total Siswa Terdaftar
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 transition-colors" />
        </div>

        {/* Card 2: Total Supir */}
        <div
          onClick={() => onNavigate('drivers')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {stats.totalDrivers || 12}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Total Supir Aktif
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </div>

        {/* Card 3: Total Kendaraan */}
        <div
          onClick={() => onNavigate('vehicles')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {stats.totalVehicles || 8}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Kendaraan Angkot
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 transition-colors" />
        </div>

        {/* Card 4: Total Rute Aktif */}
        <div
          onClick={() => onNavigate('routes')}
          className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <MapPin className="w-7 h-7" />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight font-mono tabular-nums">
                {stats.totalRoutes || 15}
              </div>
              <div className="text-xs font-semibold text-slate-500 mt-0.5">
                Rute Aktif Wanareja
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
        </div>
      </div>

      {/* 2. Middle Row: Live Monitoring Perjalanan & Aktivitas Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Monitoring Perjalanan */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <h3 className="text-base font-bold text-slate-900">
                Monitoring Perjalanan
              </h3>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live
              </span>
            </div>

            <button
              onClick={() => onNavigate('monitoring')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1"
            >
              Lihat Detail Monitoring &rarr;
            </button>
          </div>

          {/* Interactive Map */}
          <RouteMap
            currentStage={currentTrip?.status}
            driverName={currentTrip?.driverName}
            vehiclePlate={currentTrip?.vehiclePlate}
            heightClass="h-80"
          />

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400">Armada Beroperasi: </span>
              <strong className="text-slate-800 font-bold">Angkot 01 (B 1234 KZ)</strong> · Supir: Budi Santoso
            </div>
            <div>
              <span className="text-slate-400">Estimasi Rute: </span>
              <span className="font-semibold text-sky-700">Wanareja - Madusari (35 Menit)</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Aktivitas Terbaru Timeline */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Aktivitas Terbaru</h3>
            <button
              onClick={() => onNavigate('history')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {recentActivity.slice(0, 4).map((activity, idx) => (
              <div key={activity.id || idx} className="relative">
                {/* Timeline dot */}
                <div
                  className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                    idx === 0
                      ? 'bg-emerald-500 ring-emerald-100'
                      : idx === 1
                      ? 'bg-amber-500 ring-amber-100'
                      : 'bg-sky-500 ring-sky-100'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded">
                    {activity.timeStr} WIB
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activity.vehiclePlate || 'B 1234 KZ'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-800 mt-1">
                  {activity.action}
                </p>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {activity.location}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Bottom Row: Manajemen Data Quick Access & Laporan Keterlambatan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quick Management Shortcuts (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-4">Manajemen Data</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('students')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Data Siswa
              </span>
            </button>

            <button
              onClick={() => onNavigate('drivers')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Data Supir
              </span>
            </button>

            <button
              onClick={() => onNavigate('vehicles')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Truck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Data Kendaraan
              </span>
            </button>

            <button
              onClick={() => onNavigate('routes')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Data Rute
              </span>
            </button>

            <button
              onClick={() => onNavigate('reports')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Laporan
              </span>
            </button>

            <button
              onClick={() => onNavigate('settings')}
              className="p-4 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900">
                Pengaturan
              </span>
            </button>
          </div>
        </div>

        {/* Laporan Keterlambatan Table (Exact match to poster) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Laporan Keterlambatan
              </h3>
              <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-medium">
                Hari Ini
              </span>
            </div>
            <button
              onClick={() => onNavigate('reports')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800"
            >
              Lihat Semua &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Siswa</th>
                  <th className="py-2.5 px-3">Kelas</th>
                  <th className="py-2.5 px-3">Waktu</th>
                  <th className="py-2.5 px-3 text-right">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.delayedStudents && stats.delayedStudents.length > 0 ? (
                  stats.delayedStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-800">
                        {st.name}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {st.class}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-700">
                        {st.pickupTime || '07.10'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                          Terlambat {st.delayMinutes || 10} mnt
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">
                      Andi Pratama
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      VII A
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-700">
                      07.10
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="inline-block text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        Terlambat 10 mnt
                      </span>
                    </td>
                  </tr>
                )}
                {/* Extra sample row for realism */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    Dimas Aditya
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    VII C
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-700">
                    07.18
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="inline-block text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      Terlambat 5 mnt
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
