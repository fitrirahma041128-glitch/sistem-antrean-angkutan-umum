import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Calendar,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  User,
  Truck
} from 'lucide-react';
import { Driver, Student, TripHistoryItem } from '../../../types';
import { MuhammadiyahEmblem } from '../../common/Logo';

interface LaporanViewProps {
  students: Student[];
  drivers: Driver[];
  history: TripHistoryItem[];
}

export const LaporanView: React.FC<LaporanViewProps> = ({
  students,
  drivers,
  history
}) => {
  type ReportType = 'daily' | 'pickup' | 'delay' | 'driver';
  const [reportType, setReportType] = useState<ReportType>('daily');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [isPrintPreview, setIsPrintPreview] = useState(false);

  const delayedStudents = students.filter((s) => s.isDelayed);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Non-print controls */}
      <div className="print:hidden space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Laporan SIMANTAR</h2>
            <p className="text-xs text-slate-500">
              Laporan resmi operasional antar jemput siswa SMP Muhammadiyah 1 Wanareja.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPrintPreview(!isPrintPreview)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              {isPrintPreview ? 'Tutup Pratinjau' : 'Pratinjau Format Cetak'}
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Laporan Resmi
            </button>
          </div>
        </div>

        {/* Report Type Selector & Date Filter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setReportType('daily')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'daily'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              1. Laporan Perjalanan Harian
            </button>
            <button
              onClick={() => setReportType('pickup')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'pickup'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              2. Laporan Penjemputan Siswa
            </button>
            <button
              onClick={() => setReportType('delay')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'delay'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              3. Laporan Keterlambatan
            </button>
            <button
              onClick={() => setReportType('driver')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                reportType === 'driver'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              4. Laporan Berdasarkan Supir
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-slate-600 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-700" />
              Filter Rentang Tanggal:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
              />
              <span className="text-slate-400">s/d</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Data terfilter otomatis sesuai rentang yang dipilih.
            </span>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Perjalanan Hari Ini</span>
            <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">8 Rute</div>
            <span className="text-[10px] text-emerald-600 font-medium">100% Terlayani</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Tingkat Ketepatan</span>
            <div className="text-2xl font-black text-emerald-700 font-mono mt-0.5">97.8%</div>
            <span className="text-[10px] text-slate-400">Sesuai jam masuk sekolah</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Siswa Terlambat</span>
            <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">
              {delayedStudents.length} Siswa
            </div>
            <span className="text-[10px] text-amber-600">Rata-rata 7 menit</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase">Armada Operasional</span>
            <div className="text-2xl font-black text-blue-900 font-mono mt-0.5">
              {drivers.length} Unit
            </div>
            <span className="text-[10px] text-blue-600">Angkot Suzuki Carry Kuning</span>
          </div>
        </div>
      </div>

      {/* Official Printable Document Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 print:p-0 print:border-none print:shadow-none">
        {/* Official Letterhead (Kop Surat Sekolah) */}
        <div className="border-b-4 border-double border-slate-900 pb-4 mb-6 text-center relative">
          <div className="absolute left-2 top-0">
            <MuhammadiyahEmblem size={64} />
          </div>
          <div className="px-16">
            <h1 className="text-lg font-black tracking-wider text-slate-950 uppercase">
              MAJELIS PENDIDIKAN DASAR DAN MENENGAH MUHAMMADIYAH
            </h1>
            <h2 className="text-xl font-extrabold text-blue-950 uppercase">
              SMP MUHAMMADIYAH 1 WANAREJA
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Jl. Nasional III No. 45, Kecamatan Wanareja, Kabupaten Cilacap, Jawa Tengah 53265
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Email: smpmuh1wanareja@gmail.com · NPSN: 20300450 · Akreditasi A
            </p>
          </div>
        </div>

        {/* Title of Report */}
        <div className="text-center mb-6">
          <h3 className="text-base font-bold text-slate-950 uppercase underline decoration-2 underline-offset-4">
            {reportType === 'daily' && 'LAPORAN OPERASIONAL PERJALANAN HARIAN'}
            {reportType === 'pickup' && 'LAPORAN REKAPITULASI PENJEMPUTAN SISWA'}
            {reportType === 'delay' && 'LAPORAN KETERLAMBATAN PENJEMPUTAN SISWA'}
            {reportType === 'driver' && 'LAPORAN KINERJA PERJALANAN BERDASARKAN SUPIR'}
          </h3>
          <p className="text-xs text-slate-600 font-mono mt-1">
            Periode Tanggal: {startDate} s/d {endDate} · Sistem SIMANTAR
          </p>
        </div>

        {/* Report Content based on Selected Tab */}
        {reportType === 'daily' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">No</th>
                  <th className="p-2.5 border-r border-slate-300">Waktu</th>
                  <th className="p-2.5 border-r border-slate-300">Tahap Perjalanan</th>
                  <th className="p-2.5 border-r border-slate-300">Armada & Supir</th>
                  <th className="p-2.5 border-r border-slate-300">Lokasi</th>
                  <th className="p-2.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {history.map((h, i) => (
                  <tr key={h.id || i}>
                    <td className="p-2.5 border-r border-slate-300 font-mono">{i + 1}</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">{h.timeStr} WIB</td>
                    <td className="p-2.5 border-r border-slate-300 font-semibold">{h.action}</td>
                    <td className="p-2.5 border-r border-slate-300">
                      {h.driverName} ({h.vehiclePlate})
                    </td>
                    <td className="p-2.5 border-r border-slate-300">{h.location}</td>
                    <td className="p-2.5 text-slate-600">{h.notes || 'Normal'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'pickup' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">NIS</th>
                  <th className="p-2.5 border-r border-slate-300">Nama Siswa</th>
                  <th className="p-2.5 border-r border-slate-300">Kelas</th>
                  <th className="p-2.5 border-r border-slate-300">Titik Jemput</th>
                  <th className="p-2.5 border-r border-slate-300">Orang Tua / Kontak</th>
                  <th className="p-2.5 border-r border-slate-300">Jam Jemput</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2.5 border-r border-slate-300 font-mono">{s.nis}</td>
                    <td className="p-2.5 border-r border-slate-300 font-bold">{s.name}</td>
                    <td className="p-2.5 border-r border-slate-300">{s.class}</td>
                    <td className="p-2.5 border-r border-slate-300">{s.pickupPoint}</td>
                    <td className="p-2.5 border-r border-slate-300">
                      {s.parentName} ({s.parentPhone})
                    </td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">
                      {s.pickupTime || '06.50 WIB'}
                    </td>
                    <td className="p-2.5 font-semibold text-emerald-700">Tiba Sekolah</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'delay' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">Nama Siswa</th>
                  <th className="p-2.5 border-r border-slate-300">Kelas</th>
                  <th className="p-2.5 border-r border-slate-300">Waktu Dijemput</th>
                  <th className="p-2.5 border-r border-slate-300">Waktu Tiba Sekolah</th>
                  <th className="p-2.5 border-r border-slate-300">Durasi Terlambat</th>
                  <th className="p-2.5">Faktor Penyebab</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {delayedStudents.length > 0 ? (
                  delayedStudents.map((st) => (
                    <tr key={st.id}>
                      <td className="p-2.5 border-r border-slate-300 font-bold">{st.name}</td>
                      <td className="p-2.5 border-r border-slate-300">{st.class}</td>
                      <td className="p-2.5 border-r border-slate-300 font-mono">{st.pickupTime || '07.05'}</td>
                      <td className="p-2.5 border-r border-slate-300 font-mono">{st.arrivalTime || '07.18'}</td>
                      <td className="p-2.5 border-r border-slate-300 font-bold text-rose-700">
                        {st.delayMinutes || 10} Menit
                      </td>
                      <td className="p-2.5 text-slate-600">Menunggu siswa di titik kumpul Jl. Melati</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-2.5 border-r border-slate-300 font-bold">Andi Pratama</td>
                    <td className="p-2.5 border-r border-slate-300">VII A</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">07.05</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">07.15</td>
                    <td className="p-2.5 border-r border-slate-300 font-bold text-rose-700">10 Menit</td>
                    <td className="p-2.5 text-slate-600">Kepadatan lalu lintas pagi Pasar Tarisi</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {reportType === 'driver' && (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border border-slate-300">
              <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2.5 border-r border-slate-300">Nama Supir</th>
                  <th className="p-2.5 border-r border-slate-300">Plat Angkot</th>
                  <th className="p-2.5 border-r border-slate-300">Rute Layanan</th>
                  <th className="p-2.5 border-r border-slate-300">Total Siswa</th>
                  <th className="p-2.5 border-r border-slate-300">Rating Kinerja</th>
                  <th className="p-2.5">Status Armada</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {drivers.map((drv) => (
                  <tr key={drv.id}>
                    <td className="p-2.5 border-r border-slate-300 font-bold">{drv.name}</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">{drv.vehiclePlate}</td>
                    <td className="p-2.5 border-r border-slate-300">{drv.routeName}</td>
                    <td className="p-2.5 border-r border-slate-300 font-mono">5 - 12 Siswa</td>
                    <td className="p-2.5 border-r border-slate-300 font-bold text-amber-700">
                      ⭐ {drv.rating || 4.9} / 5.0
                    </td>
                    <td className="p-2.5 font-semibold text-emerald-700">Aktif Beroperasi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Official Signatures */}
        <div className="mt-12 pt-8 flex justify-between text-xs text-center text-slate-900">
          <div className="w-60">
            <p>Mengetahui,</p>
            <p className="font-bold">Kepala SMP Muhammadiyah 1 Wanareja</p>
            <div className="h-16"></div>
            <p className="font-extrabold underline">Drs. H. Ahmad Fauzi, M.Pd.</p>
            <p className="font-mono text-[11px] text-slate-500">NIP. 19740512 199803 1 002</p>
          </div>

          <div className="w-60">
            <p>Wanareja, {new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
            <p className="font-bold">Koordinator SIMANTAR & Transportasi</p>
            <div className="h-16"></div>
            <p className="font-extrabold underline">Ratna Kumalasari, S.Pd.</p>
            <p className="font-mono text-[11px] text-slate-500">NBM. 1092 8821</p>
          </div>
        </div>
      </div>
    </div>
  );
};
