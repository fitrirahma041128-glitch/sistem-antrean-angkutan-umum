import React, { useState } from 'react';
import { Plus, Search, MapPin, Navigation, Clock, CheckCircle2, ChevronRight, X } from 'lucide-react';
import { Route } from '../../../types';
import { RouteMap } from '../../common/RouteMap';

interface DataRuteViewProps {
  routes: Route[];
  onAddRoute: (route: Partial<Route>) => Promise<void>;
}

export const DataRuteView: React.FC<DataRuteViewProps> = ({ routes, onAddRoute }) => {
  const [selectedRoute, setSelectedRoute] = useState<Route>(routes[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startLocation: 'SMP Muhammadiyah 1 Wanareja',
    destination: 'SMP Muhammadiyah 1 Wanareja',
    distanceKm: 8,
    estimatedDurationMinutes: 30,
    pickupPointsStr: 'Jl. Melati, Masjid Adimulya, Dusun Cihaur, Pasar Tarisi'
  });

  const handleOpenAdd = () => {
    setFormData({
      name: `Rute Wanareja Wilayah ${routes.length + 1}`,
      description: 'Jalur penjemputan baru',
      startLocation: 'SMP Muhammadiyah 1 Wanareja',
      destination: 'SMP Muhammadiyah 1 Wanareja',
      distanceKm: 7.5,
      estimatedDurationMinutes: 28,
      pickupPointsStr: 'Pos Ronda 1, Pertigaan Balai Desa, Warung Kopi'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const points = formData.pickupPointsStr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    await onAddRoute({
      name: formData.name,
      description: formData.description,
      startLocation: formData.startLocation,
      destination: formData.destination,
      distanceKm: Number(formData.distanceKm),
      estimatedDurationMinutes: Number(formData.estimatedDurationMinutes),
      pickupPoints: points
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Rute Antar Jemput</h2>
          <p className="text-xs text-slate-500">
            Jalur trayek angkot penjemputan siswa di sekitar wilayah Kecamatan Wanareja dan desa sekitar.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Rute Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Routes list */}
        <div className="lg:col-span-5 space-y-3">
          {routes.map((rt) => (
            <div
              key={rt.id}
              onClick={() => setSelectedRoute(rt)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedRoute?.id === rt.id
                  ? 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-slate-900">{rt.name}</h3>
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-100/60 px-2 py-0.5 rounded">
                  {rt.distanceKm} Km
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {rt.description}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  ± {rt.estimatedDurationMinutes} Menit
                </span>
                <span className="flex items-center gap-1 font-medium text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                  {rt.pickupPoints.length} Titik Kumpul
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Route Details and Interactive Map */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Detail Rute:</span>
              <h3 className="text-lg font-bold text-slate-900">{selectedRoute?.name}</h3>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Rute Aktif Wanareja
            </span>
          </div>

          {/* Interactive Map */}
          <RouteMap heightClass="h-72" />

          {/* Pickup Points Sequence */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
              Titik Penjemputan di Rute Ini:
            </h4>
            <div className="space-y-2">
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  A
                </div>
                <div>
                  <strong className="text-blue-950 font-bold">Titik Awal: {selectedRoute?.startLocation}</strong>
                  <div className="text-[11px] text-blue-700">Pemberangkatan angkot sekolah</div>
                </div>
              </div>

              {selectedRoute?.pickupPoints.map((point, index) => (
                <div
                  key={index}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-sky-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <strong className="text-slate-800 font-semibold">{point}</strong>
                    <div className="text-[11px] text-slate-400">Titik kumpul & penjemputan siswa</div>
                  </div>
                </div>
              ))}

              <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs">
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                  B
                </div>
                <div>
                  <strong className="text-emerald-950 font-bold">Tujuan: {selectedRoute?.destination}</strong>
                  <div className="text-[11px] text-emerald-700">Tiba di sekolah tepat waktu</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Add Route */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">Tambah Rute Trayek Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Rute</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rute Cigintung - Sekolah"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi Jalur</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Melewati jembatan dan permukiman warga..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 h-16 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jarak (Km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.distanceKm}
                    onChange={(e) => setFormData({ ...formData, distanceKm: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimasi Waktu (Menit)</label>
                  <input
                    type="number"
                    value={formData.estimatedDurationMinutes}
                    onChange={(e) => setFormData({ ...formData, estimatedDurationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Titik-titik Penjemputan (Pisahkan dengan koma)
                </label>
                <textarea
                  value={formData.pickupPointsStr}
                  onChange={(e) => setFormData({ ...formData, pickupPointsStr: e.target.value })}
                  placeholder="Pos Ronda, Balai Desa, Pasar"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 h-18 resize-none font-mono"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  Simpan Rute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
