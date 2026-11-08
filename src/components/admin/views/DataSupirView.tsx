import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Phone, Truck, Award, Star, X } from 'lucide-react';
import { Driver, Vehicle } from '../../../types';
import { AngkotIllustration } from '../../common/Logo';

interface DataSupirViewProps {
  drivers: Driver[];
  vehicles: Vehicle[];
  onAddDriver: (driver: Partial<Driver>) => Promise<void>;
  onUpdateDriver: (id: string, driver: Partial<Driver>) => Promise<void>;
  onDeleteDriver: (id: string) => Promise<void>;
}

export const DataSupirView: React.FC<DataSupirViewProps> = ({
  drivers,
  vehicles,
  onAddDriver,
  onUpdateDriver,
  onDeleteDriver
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    simNumber: '',
    vehiclePlate: 'B 1234 KZ',
    vehicleName: 'Angkot 01',
    routeName: 'Rute Wanareja - Madusari',
    status: 'active' as 'active' | 'in_transit' | 'off'
  });

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.vehiclePlate.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
  );

  const handleOpenAdd = () => {
    setEditingDriver(null);
    setFormData({
      name: '',
      phone: '0812-',
      simNumber: '9208-1123-0005',
      vehiclePlate: 'B 1234 KZ',
      vehicleName: 'Angkot 01',
      routeName: 'Rute Wanareja - Madusari',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d: Driver) => {
    setEditingDriver(d);
    setFormData({
      name: d.name,
      phone: d.phone,
      simNumber: d.simNumber,
      vehiclePlate: d.vehiclePlate,
      vehicleName: d.vehicleName,
      routeName: d.routeName,
      status: d.status
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingDriver) {
      await onUpdateDriver(editingDriver.id, formData);
    } else {
      await onAddDriver(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Data Supir Antar Jemput</h2>
          <p className="text-xs text-slate-500">
            Daftar pengemudi resmi angkot SMP Muhammadiyah 1 Wanareja dengan lisensi SIM dan armada penugasan.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Tambah Supir Baru
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
            placeholder="Cari nama supir, plat nomor, atau kontak..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total Supir: <span className="font-mono text-blue-900 font-bold">{filtered.length} Orang</span>
        </div>
      </div>

      {/* Drivers Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((driver) => (
          <div
            key={driver.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-900 font-bold flex items-center justify-center text-lg">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{driver.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{driver.rating || 4.9}</span>
                      <span className="text-slate-400">· Rating</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    driver.status === 'in_transit'
                      ? 'bg-amber-100 text-amber-800'
                      : driver.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {driver.status === 'in_transit' ? 'Perjalanan' : driver.status === 'active' ? 'Aktif' : 'Libur'}
                </span>
              </div>

              {/* Driver Details */}
              <div className="space-y-2 py-2 text-xs border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kendaraan:</span>
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <AngkotIllustration size={20} />
                    <span>{driver.vehicleName}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nomor Plat:</span>
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                    {driver.vehiclePlate}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Nomor SIM A:</span>
                  <span className="font-mono text-slate-700">{driver.simNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kontak Telepon:</span>
                  <a
                    href={`tel:${driver.phone}`}
                    className="font-mono text-emerald-700 font-medium flex items-center gap-1 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{driver.phone}</span>
                  </a>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">Rute Layanan:</span>
                  <span className="text-[11px] font-medium text-slate-700 text-right truncate max-w-[170px]">
                    {driver.routeName}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(driver)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => {
                  if (window.confirm(`Yakin ingin menghapus supir ${driver.name}?`)) {
                    onDeleteDriver(driver.id);
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
                {editingDriver ? 'Edit Data Supir' : 'Tambah Supir Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Supir</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0813-xxxx-xxxx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor SIM A</label>
                  <input
                    type="text"
                    value={formData.simNumber}
                    onChange={(e) => setFormData({ ...formData, simNumber: e.target.value })}
                    placeholder="9208-1123-xxxx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Armada</label>
                  <input
                    type="text"
                    value={formData.vehicleName}
                    onChange={(e) => setFormData({ ...formData, vehicleName: e.target.value })}
                    placeholder="Angkot 01"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Plat Polisi</label>
                  <input
                    type="text"
                    value={formData.vehiclePlate}
                    onChange={(e) => setFormData({ ...formData, vehiclePlate: e.target.value })}
                    placeholder="B 1234 KZ"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rute Penugasan</label>
                <input
                  type="text"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  placeholder="Rute Wanareja - Madusari"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Keaktifan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-sky-500"
                >
                  <option value="active">Aktif (Siap Bertugas)</option>
                  <option value="in_transit">Sedang Bertugas (Dalam Perjalanan)</option>
                  <option value="off">Libur / Istirahat</option>
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
                  Simpan Supir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
