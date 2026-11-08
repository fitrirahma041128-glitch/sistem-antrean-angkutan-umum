import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Truck, Calendar, CheckCircle2, Wrench, X } from 'lucide-react';
import { Vehicle } from '../../../types';
import { AngkotIllustration } from '../../common/Logo';

interface DataKendaraanViewProps {
  vehicles: Vehicle[];
  onAddVehicle: (veh: Partial<Vehicle>) => Promise<void>;
  onUpdateVehicle: (id: string, veh: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
}

export const DataKendaraanView: React.FC<DataKendaraanViewProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    plateNumber: '',
    capacity: 12,
    type: 'Suzuki Carry Futura 1.5 (Kuning)',
    status: 'active' as 'active' | 'maintenance' | 'idle',
    driverName: 'Budi Santoso'
  });

  const filtered = vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setFormData({
      code: `Angkot 0${vehicles.length + 1}`,
      name: `Angkot Wanareja 0${vehicles.length + 1}`,
      plateNumber: 'R 8' + Math.floor(100 + Math.random() * 899) + ' KZ',
      capacity: 12,
      type: 'Suzuki Carry Futura 1.5 (Kuning)',
      status: 'active',
      driverName: 'Supir Baru'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      code: v.code,
      name: v.name,
      plateNumber: v.plateNumber,
      capacity: v.capacity,
      type: v.type,
      status: v.status,
      driverName: v.driverName || 'Belum ditugaskan'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      await onUpdateVehicle(editingVehicle.id, formData);
    } else {
      await onAddVehicle(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Kendaraan Angkot Sekolah</h2>
          <p className="text-xs text-slate-500">
            Armada angkot kuning resmi SMP Muhammadiyah 1 Wanareja dengan plat nomor dan kapasitas siswa.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Armada Angkot
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari armada, plat nomor, atau supir..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total Armada: <span className="font-mono text-blue-900 font-bold">{filtered.length} Unit</span>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((veh) => (
          <div
            key={veh.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center p-1">
                    <AngkotIllustration size={42} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{veh.name}</h3>
                    <div className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded inline-block mt-0.5">
                      {veh.plateNumber}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    veh.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : veh.status === 'maintenance'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {veh.status === 'active' ? 'Laik Jalan' : veh.status === 'maintenance' ? 'Servis' : 'Cadangan'}
                </span>
              </div>

              <div className="space-y-2 py-2 text-xs border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Tipe Kendaraan:</span>
                  <span className="font-semibold text-slate-800">{veh.type}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kapasitas Kursi:</span>
                  <span className="font-semibold text-slate-800 font-mono">{veh.capacity} Penumpang</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Supir Penanggung Jawab:</span>
                  <span className="font-semibold text-sky-800">{veh.driverName || 'Budi Santoso'}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Servis Terakhir:</span>
                  <span className="font-mono text-slate-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{veh.lastServiceDate || '2026-10-15'}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(veh)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Yakin ingin menghapus armada ${veh.name}?`)) {
                    onDeleteVehicle(veh.id);
                  }
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-blue-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingVehicle ? 'Edit Data Armada' : 'Tambah Armada Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Armada</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Angkot 01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Plat Polisi</label>
                  <input
                    type="text"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    placeholder="B 1234 KZ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Armada</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Angkot Wanareja 01"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipe / Merk Mobil</label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Suzuki Carry Futura"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kapasitas Siswa</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    min={4}
                    max={20}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Supir Penanggung Jawab</label>
                <input
                  type="text"
                  value={formData.driverName}
                  onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                  placeholder="Budi Santoso"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Kelaikan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                >
                  <option value="active">Laik Jalan (Aktif)</option>
                  <option value="maintenance">Dalam Perawatan (Servis)</option>
                  <option value="idle">Cadangan (Standby)</option>
                </select>
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
                  Simpan Armada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
