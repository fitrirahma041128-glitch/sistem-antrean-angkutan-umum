import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Truck,
  MapPin,
  Calendar,
  Radio,
  Clock,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Smartphone,
  ChevronDown,
  Shield,
  HelpCircle
} from 'lucide-react';
import {
  DashboardStats,
  Driver,
  Parent,
  Route,
  Schedule,
  Student,
  SystemSettings,
  Trip,
  TripHistoryItem,
  Vehicle,
  WhatsAppNotification
} from '../../types';
import { MuhammadiyahEmblem, SimantarLogo, AngkotIllustration } from '../common/Logo';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { DashboardView } from './views/DashboardView';
import { DataSiswaView } from './views/DataSiswaView';
import { DataOrangTuaView } from './views/DataOrangTuaView';
import { DataSupirView } from './views/DataSupirView';
import { DataKendaraanView } from './views/DataKendaraanView';
import { DataRuteView } from './views/DataRuteView';
import { JadwalView } from './views/JadwalView';
import { MonitoringView } from './views/MonitoringView';
import { RiwayatView } from './views/RiwayatView';
import { LaporanView } from './views/LaporanView';
import { PengaturanView } from './views/PengaturanView';
import { api } from '../../services/api';

interface AdminLayoutProps {
  currentUser: any;
  onLogout: () => void;
  onSwitchToDriver: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentUser,
  onLogout,
  onSwitchToDriver
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Application Data States
  const [stats, setStats] = useState<DashboardStats & { delayedStudents: Student[] }>({
    totalStudents: 248,
    totalDrivers: 12,
    totalVehicles: 8,
    totalRoutes: 15,
    todayTripsCount: 4,
    delayedStudentsCount: 1,
    delayedStudents: []
  });
  const [students, setStudents] = useState<Student[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [history, setHistory] = useState<TripHistoryItem[]>([]);
  const [notifications, setNotifications] = useState<WhatsAppNotification[]>([]);
  const [settings, setSettings] = useState<SystemSettings>({
    schoolName: 'SMP Muhammadiyah 1 Wanareja',
    schoolSubtext: 'Kecamatan Wanareja, Kabupaten Cilacap, Jawa Tengah',
    schoolAddress: 'Jl. Nasional III No. 45, Wanareja, Cilacap 53265',
    fonnteApiToken: '',
    senderPhone: '0812-9876-5432',
    isSimulationMode: true,
    morningStart: '06:30',
    morningEnd: '08:00',
    templates: {
      departed: 'SMP Muhammadiyah 1 Wanareja: Halo Bunda, angkot sekolah sudah berangkat menuju rumah ananda.',
      at_pickup: 'SMP Muhammadiyah 1 Wanareja: Ananda sudah sampai di titik penjemputan (Jl. Melati).',
      boarded: 'SMP Muhammadiyah 1 Wanareja: Ananda sudah naik angkot sekolah.',
      arrived: 'SMP Muhammadiyah 1 Wanareja: Ananda sudah sampai sekolah dengan selamat. 🙏'
    }
  });

  const loadAllData = async () => {
    try {
      const [
        statsData,
        studentsData,
        parentsData,
        driversData,
        vehiclesData,
        routesData,
        schedulesData,
        tripData,
        historyData,
        logsData,
        settingsData
      ] = await Promise.all([
        api.getStats(),
        api.getStudents(),
        api.getParents(),
        api.getDrivers(),
        api.getVehicles(),
        api.getRoutes(),
        api.getSchedules(),
        api.getCurrentTrip(),
        api.getTripHistory(),
        api.getWhatsAppLogs(),
        api.getSettings()
      ]);

      setStats(statsData);
      setStudents(studentsData);
      setParents(parentsData);
      setDrivers(driversData);
      setVehicles(vehiclesData);
      setRoutes(routesData);
      setSchedules(schedulesData);
      setCurrentTrip(tripData);
      setHistory(historyData);
      setNotifications(logsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
    // Auto polling every 10 seconds for real-time tracking updates
    const interval = setInterval(() => {
      loadAllData();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // CRUD Student Handlers
  const handleAddStudent = async (data: Partial<Student>) => {
    await api.createStudent(data);
    await loadAllData();
  };

  const handleUpdateStudent = async (id: string, data: Partial<Student>) => {
    await api.updateStudent(id, data);
    await loadAllData();
  };

  const handleDeleteStudent = async (id: string) => {
    await api.deleteStudent(id);
    await loadAllData();
  };

  // CRUD Driver Handlers
  const handleAddDriver = async (data: Partial<Driver>) => {
    await api.createDriver(data);
    await loadAllData();
  };

  const handleUpdateDriver = async (id: string, data: Partial<Driver>) => {
    await api.updateDriver(id, data);
    await loadAllData();
  };

  const handleDeleteDriver = async (id: string) => {
    await api.deleteDriver(id);
    await loadAllData();
  };

  // CRUD Vehicle Handlers
  const handleAddVehicle = async (data: Partial<Vehicle>) => {
    await api.createVehicle(data);
    await loadAllData();
  };

  const handleUpdateVehicle = async (id: string, data: Partial<Vehicle>) => {
    await api.updateVehicle(id, data);
    await loadAllData();
  };

  const handleDeleteVehicle = async (id: string) => {
    await api.deleteVehicle(id);
    await loadAllData();
  };

  // Route Handlers
  const handleAddRoute = async (data: Partial<Route>) => {
    await api.createRoute(data);
    await loadAllData();
  };

  // Settings Handlers
  const handleUpdateSettings = async (data: Partial<SystemSettings>) => {
    const res = await api.updateSettings(data);
    setSettings(res.settings);
  };

  const handleResetDemo = async () => {
    await api.resetDemo();
    await loadAllData();
  };

  const handleSendTestWhatsApp = async (phone: string, msg: string) => {
    const res = await api.sendTestWhatsApp(phone, msg);
    setNotifications((prev) => [res.log, ...prev]);
  };

  // Sidebar Menu Items matching the poster & prompt
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Data Siswa', icon: Users },
    { id: 'parents', label: 'Data Orang Tua', icon: UserCheck },
    { id: 'drivers', label: 'Data Supir', icon: Shield },
    { id: 'vehicles', label: 'Data Kendaraan', icon: Truck },
    { id: 'routes', label: 'Data Rute', icon: MapPin },
    { id: 'schedules', label: 'Jadwal Antar Jemput', icon: Calendar },
    { id: 'monitoring', label: 'Monitoring Perjalanan', icon: Radio },
    { id: 'history', label: 'Riwayat Penjemputan', icon: Clock },
    { id: 'reports', label: 'Laporan', icon: FileText },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* 1. Mobile Sidebar Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden"
        />
      )}

      {/* 2. Modern Navy Sidebar (Matches poster: "Website Admin / Guru (Tata Usaha)") */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0B1E38] text-white z-50 flex flex-col justify-between transition-transform duration-200 border-r border-slate-800 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* School Badge & SIMANTAR Title */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="shrink-0 p-1 bg-white/10 rounded-xl">
                <MuhammadiyahEmblem size={38} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-white tracking-wider">
                    SIMANTAR
                  </span>
                  <span className="text-[10px] bg-sky-500 text-white font-bold px-1.5 py-0.2 rounded">
                    Wanareja
                  </span>
                </div>
                <span className="text-[10px] text-sky-200/90 font-medium leading-tight">
                  SMP Muhammadiyah 1 Wanareja
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
              Menu Utama
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer User & Logout */}
        <div className="p-4 border-t border-slate-800 bg-[#081528]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                TU
              </div>
              <div className="truncate">
                <div className="text-xs font-bold text-white truncate">Admin / Tata Usaha</div>
                <div className="text-[10px] text-slate-400 truncate">Ibu Ratna Kumalasari</div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onSwitchToDriver}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-400" />
              <span>Buka HP Supir</span>
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 capitalize">
                {menuItems.find((m) => m.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistem Monitoring Antar Jemput Siswa · SMP Muhammadiyah 1 Wanareja
              </p>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Driver Mode Switcher for seamless testing */}
            <button
              onClick={onSwitchToDriver}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 rounded-xl text-xs font-semibold transition-colors shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-sky-600" />
              <span>Simulasi HP Supir (Android)</span>
            </button>

            {/* School Tag Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-600">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>SIMANTAR Aktif</span>
            </div>

            {/* User Avatar Menu */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                TU
              </div>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                Admin TU
              </span>
            </div>
          </div>
        </header>

        {/* View Viewport */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              currentTrip={currentTrip}
              recentActivity={history}
              onNavigate={(id) => setActiveTab(id)}
            />
          )}

          {activeTab === 'students' && (
            <DataSiswaView
              students={students}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
            />
          )}

          {activeTab === 'parents' && (
            <DataOrangTuaView
              parents={parents}
              onSendTestMessage={handleSendTestWhatsApp}
            />
          )}

          {activeTab === 'drivers' && (
            <DataSupirView
              drivers={drivers}
              vehicles={vehicles}
              onAddDriver={handleAddDriver}
              onUpdateDriver={handleUpdateDriver}
              onDeleteDriver={handleDeleteDriver}
            />
          )}

          {activeTab === 'vehicles' && (
            <DataKendaraanView
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
            />
          )}

          {activeTab === 'routes' && (
            <DataRuteView
              routes={routes}
              onAddRoute={handleAddRoute}
            />
          )}

          {activeTab === 'schedules' && (
            <JadwalView schedules={schedules} />
          )}

          {activeTab === 'monitoring' && (
            <MonitoringView
              currentTrip={currentTrip}
              drivers={drivers}
              students={students}
              onRefresh={loadAllData}
            />
          )}

          {activeTab === 'history' && (
            <RiwayatView history={history} />
          )}

          {activeTab === 'reports' && (
            <LaporanView
              students={students}
              drivers={drivers}
              history={history}
            />
          )}

          {activeTab === 'settings' && (
            <PengaturanView
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetDemo={handleResetDemo}
              onSendTestMessage={handleSendTestWhatsApp}
            />
          )}
        </main>
      </div>

      {/* Floating or drawer WhatsApp notification log matching poster */}
      <NotificationDrawer
        notifications={notifications}
        isSimulation={settings.isSimulationMode}
        onRefresh={loadAllData}
        onSendTest={handleSendTestWhatsApp}
      />
    </div>
  );
};
