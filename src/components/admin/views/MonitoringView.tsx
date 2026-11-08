import React, { useState } from 'react';
import { Radio, Truck, MapPin, Clock, Users, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { Driver, Student, Trip } from '../../../types';
import { RouteMap } from '../../common/RouteMap';
import { AngkotIllustration } from '../../common/Logo';

interface MonitoringViewProps {
  currentTrip: Trip | null;
  drivers: Driver[];
  students: Student[];
  onRefresh: () => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  currentTrip,
  drivers,
  students,
  onRefresh
}) => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('drv-1');

  const activeDriver = drivers.find((d) => d.id === selectedDriverId) || drivers[0];
  const driverStudents = students.filter((s) => s.driverId === activeDriver?.id || !s.driverId).slice(0, 5);

  const getStageLabel = (stage?: string) => {
    switch (stage) {
      case 'departed_school':
        return 'Berangkat dari Sekolah (Menuju Titik Kumpul)';
      case 'at_pickup':
        return 'Sudah Tiba di Titik Penjemputan';
      case 'students_boarded':
        return 'Siswa Sudah Naik ke Angkot';
      case 'arrived_school':
        return 'Sudah Sampai di SMP Muhammadiyah 1 Wanareja';
      default:
        return 'Belum Dimulai / Standby';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Monitoring Perjalanan Real-Time</h2>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE GPS
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Pemantauan langsung posisi armada angkot dan status penjemputan siswa di Wanareja.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          Segarkan Data
        </button>
      </div>

      {/* Driver Fleet Selector Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-2 shrink-0">
          Pilih Armada:
        </span>
        {drivers.map((drv) => (
          <button
            key={drv.id}
            onClick={() => setSelectedDriverId(drv.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0 ${
              selectedDriverId === drv.id
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AngkotIllustration size={18} />
            <span>{drv.vehicleName} ({drv.vehiclePlate})</span>
            <span className="text-[10px] opacity-80">· {drv.name}</span>
          </button>
        ))}
      </div>

      {/* Main Monitoring Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Map Section (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Peta Pelacakan: {activeDriver?.vehicleName}
              </h3>
              <p className="text-xs text-slate-500">
                Rute: {activeDriver?.routeName}
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded">
              Plat: {activeDriver?.vehiclePlate}
            </span>
          </div>

          <RouteMap
            currentStage={currentTrip?.status}
            driverName={activeDriver?.name}
            vehiclePlate={activeDriver?.vehiclePlate}
            heightClass="h-96"
          />

          {/* Timing details required by requirement #8 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
              <span className="text-[11px] font-semibold text-blue-700 uppercase">Waktu Keberangkatan</span>
              <div className="font-mono text-base font-extrabold text-blue-950 mt-0.5">
                {currentTrip?.departureTime || '06.40 WIB'}
              </div>
              <span className="text-[10px] text-blue-600">Dari SMP Muhammadiyah 1</span>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase">Waktu Penjemputan</span>
              <div className="font-mono text-base font-extrabold text-emerald-950 mt-0.5">
                {currentTrip?.atPickupTime || '06.50 WIB'}
              </div>
              <span className="text-[10px] text-emerald-600">Di titik kumpul Jl. Melati & Cihaur</span>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
              <span className="text-[11px] font-semibold text-purple-700 uppercase">Waktu Tiba di Sekolah</span>
              <div className="font-mono text-base font-extrabold text-purple-950 mt-0.5">
                {currentTrip?.arrivalTime || '07.15 WIB'}
              </div>
              <span className="text-[10px] text-purple-600">Siswa turun dengan selamat</span>
            </div>
          </div>
        </div>

        {/* Right Section: Status Perjalanan & Daftar Siswa di Angkot (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Driver & Trip Info Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Informasi Perjalanan:
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Supir:</span>
                <span className="font-bold text-slate-900">{activeDriver?.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Plat Kendaraan:</span>
                <span className="font-mono font-bold text-blue-900">{activeDriver?.vehiclePlate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jumlah Siswa:</span>
                <span className="font-bold text-emerald-700 font-mono">{driverStudents.length} Siswa</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kapasitas Kursi:</span>
                <span className="font-mono text-slate-700">12 Penumpang</span>
              </div>
              <div className="pt-1">
                <span className="text-slate-500 block mb-1">Status Perjalanan:</span>
                <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-900 font-bold rounded-lg text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{getStageLabel(currentTrip?.status)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Passenger Checklist */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Siswa di Dalam Armada:
              </h4>
              <span className="text-[11px] font-mono text-sky-700 font-bold">
                {driverStudents.length} Anak
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {driverStudents.map((st) => (
                <div
                  key={st.id}
                  className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-slate-900">{st.name}</div>
                    <div className="text-[11px] text-slate-500">Kelas {st.class} · {st.pickupPoint}</div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Sudah Naik
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
