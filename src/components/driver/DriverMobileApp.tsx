import React, { useState, useEffect } from 'react';
import {
  Home,
  Clock,
  User,
  Users,
  MapPin,
  Phone,
  Navigation,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  LogOut,
  Send,
  AlertCircle,
  Smartphone,
  ExternalLink,
  Info
} from 'lucide-react';
import { Student, Trip, TripHistoryItem, TripStage, WhatsAppNotification } from '../../types';
import { AngkotIllustration, MuhammadiyahEmblem } from '../common/Logo';
import { RouteMap } from '../common/RouteMap';
import { api } from '../../services/api';

interface DriverMobileAppProps {
  currentUser: any;
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
  onNotificationSent?: (notif: WhatsAppNotification[]) => void;
}

export const DriverMobileApp: React.FC<DriverMobileAppProps> = ({
  currentUser,
  onLogout,
  onSwitchToAdmin,
  onNotificationSent
}) => {
  // Navigation tabs within Driver App
  type DriverTab = 'home' | 'students' | 'student_detail' | 'route' | 'status_picker' | 'history' | 'profile' | 'splash';
  const [activeTab, setActiveTab] = useState<DriverTab>('home');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [history, setHistory] = useState<TripHistoryItem[]>([]);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);

  // Load Driver Data
  const loadData = async () => {
    try {
      const [allStudents, trip, tripHist] = await Promise.all([
        api.getStudents(),
        api.getCurrentTrip(),
        api.getTripHistory()
      ]);

      // Filter students for this driver/trip (or first 5)
      const myStudents = allStudents.filter((s) => s.driverId === 'drv-1' || !s.driverId).slice(0, 5);
      setStudents(myStudents.length > 0 ? myStudents : allStudents.slice(0, 5));
      setCurrentTrip(trip);
      setHistory(tripHist);
    } catch (err) {
      console.error('Error loading driver data:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update Trip Status Handler
  const handleUpdateStatus = async (stage: TripStage, notes?: string) => {
    setLoadingAction(stage);
    try {
      const res = await api.updateTripStatus(stage, notes);
      setCurrentTrip(res.currentTrip);
      setHistory((prev) => [res.historyItem, ...prev]);

      // Refresh students
      const updatedStudents = await api.getStudents();
      setStudents(updatedStudents.slice(0, 5));

      if (onNotificationSent && res.newNotifications?.length > 0) {
        onNotificationSent(res.newNotifications);
      }

      setFeedbackMessage({
        text: `Berhasil! ${res.message}. WhatsApp terkirim ke orang tua.`,
        type: 'success'
      });

      setTimeout(() => {
        setFeedbackMessage(null);
      }, 4000);
    } catch (err: any) {
      setFeedbackMessage({
        text: err.message || 'Gagal memperbarui status',
        type: 'info'
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const getStudentStatusBadge = (status: string) => {
    switch (status) {
      case 'arrived':
        return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Sampai Sekolah</span>;
      case 'boarded':
        return <span className="text-[10px] font-semibold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full">Sudah Naik</span>;
      case 'pickup_point':
        return <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">Di Titik Jemput</span>;
      default:
        return <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">Menunggu</span>;
    }
  };

  // 1. Splash Screen View
  const renderSplashScreen = () => (
    <div className="flex flex-col items-center justify-between h-full bg-gradient-to-b from-[#0F172A] via-[#1E3A8A] to-[#0F172A] text-white p-6 py-12 text-center animate-in fade-in duration-300">
      <div className="w-full flex justify-end">
        <button
          onClick={() => setActiveTab('home')}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-slate-200"
        >
          Lewati
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md mb-4 shadow-lg border border-white/10">
          <MuhammadiyahEmblem size={64} />
        </div>
        <h1 className="text-2xl font-black tracking-wider text-white mb-1">
          SIMANTAR
        </h1>
        <p className="text-xs text-sky-200 font-medium">
          SMP Muhammadiyah 1 Wanareja
        </p>
        <p className="text-[11px] text-slate-300 max-w-[220px] mt-1">
          Sistem Monitoring Antar Jemput Siswa Berbasis Mobile & WhatsApp
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <AngkotIllustration size={90} />
        </div>
        <button
          onClick={() => setActiveTab('home')}
          className="w-full max-w-xs py-3 px-6 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-sm shadow-lg transition-transform active:scale-95"
        >
          Mulai Antar Jemput
        </button>
      </div>
    </div>
  );

  // 2. Dashboard View
  const renderHome = () => (
    <div className="flex flex-col h-full overflow-y-auto pb-20">
      {/* Top Driver Header (Matches poster: "Halo, Budi Santoso 👋 Supir") */}
      <div className="bg-gradient-to-r from-blue-900 to-sky-800 text-white p-5 rounded-b-2xl shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center font-bold text-lg text-white">
              BS
            </div>
            <div>
              <div className="text-xs text-sky-200">Selamat Datang,</div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Halo, {currentUser?.name || 'Budi Santoso'} 👋
              </h2>
              <span className="text-[11px] bg-sky-500/30 text-sky-100 px-2 py-0.5 rounded font-medium">
                Supir Angkot 01
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('splash')}
            title="Lihat Splash Screen"
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Vehicle Info Card */}
        <div className="bg-white text-slate-900 rounded-xl p-3.5 shadow-sm border border-white/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg bg-amber-100 flex items-center justify-center p-1">
              <AngkotIllustration size={36} />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                {currentTrip?.vehiclePlate || 'B 1234 KZ'}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Angkot 01 · Kuning Wanareja
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-1 rounded">
              {students.length} Siswa
            </span>
            <div className="text-[10px] text-slate-400 mt-1">Rute Wanareja</div>
          </div>
        </div>
      </div>

      {/* Schedule Banner */}
      <div className="p-4 space-y-4">
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-sky-600" />
            <div>
              <div className="text-[11px] font-semibold text-slate-600">Jadwal Penjemputan Hari Ini</div>
              <div className="text-xs font-bold text-sky-900">07.00 - 08.00 WIB (Pagi)</div>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            Aktif
          </span>
        </div>

        {/* Feedback alert if any */}
        {feedbackMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Quick Action Navigation Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setActiveTab('students')}
            className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-sky-400 hover:shadow-sm text-left flex flex-col justify-between transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-700 mb-2">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Daftar Siswa</div>
              <div className="text-[11px] text-slate-500">Lihat 5 siswa hari ini</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('route')}
            className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-sky-400 hover:shadow-sm text-left flex flex-col justify-between transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 mb-2">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Lihat Rute</div>
              <div className="text-[11px] text-slate-500">Peta & titik jemput</div>
            </div>
          </button>
        </div>

        {/* Core 4 Action Buttons Section (Exact match from the poster) */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Status Perjalanan Saat Ini:
            </h3>
            <span className="text-[10px] font-mono text-slate-400">
              {currentTrip?.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mb-4">
            Tekan tombol sesuai tahapan perjalanan untuk mencatat waktu dan mengirim notifikasi otomatis ke orang tua siswa melalui WhatsApp.
          </p>

          <div className="space-y-2.5">
            {/* 1. Berangkat dari Sekolah (Blue) */}
            <button
              onClick={() => handleUpdateStatus('departed_school')}
              disabled={loadingAction !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-sm ${
                currentTrip?.status === 'departed_school'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1'
                  : 'bg-blue-700 hover:bg-blue-800 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Navigation className="w-4 h-4 fill-white" />
                <span className="text-left font-extrabold tracking-wide">1. Berangkat dari Sekolah</span>
              </div>
              <span className="text-[11px] font-mono bg-blue-900/40 px-2 py-0.5 rounded">
                {currentTrip?.departureTime || '06.40 WIB'}
              </span>
            </button>

            {/* 2. Sudah Sampai di Titik Penjemputan (Green) */}
            <button
              onClick={() => handleUpdateStatus('at_pickup')}
              disabled={loadingAction !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-sm ${
                currentTrip?.status === 'at_pickup'
                  ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 ring-offset-1'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span className="text-left font-extrabold tracking-wide">2. Sudah Sampai di Titik Penjemputan</span>
              </div>
              <span className="text-[11px] font-mono bg-emerald-900/40 px-2 py-0.5 rounded">
                {currentTrip?.atPickupTime || '06.50 WIB'}
              </span>
            </button>

            {/* 3. Siswa Sudah Naik (Orange) */}
            <button
              onClick={() => handleUpdateStatus('students_boarded')}
              disabled={loadingAction !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-sm ${
                currentTrip?.status === 'students_boarded'
                  ? 'bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-1'
                  : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span className="text-left font-extrabold tracking-wide">3. Siswa Sudah Naik</span>
              </div>
              <span className="text-[11px] font-mono bg-amber-900/40 px-2 py-0.5 rounded">
                {currentTrip?.boardedTime || '07.00 WIB'}
              </span>
            </button>

            {/* 4. Sampai di Sekolah (Purple / Deep Navy) */}
            <button
              onClick={() => handleUpdateStatus('arrived_school')}
              disabled={loadingAction !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-between transition-all shadow-sm ${
                currentTrip?.status === 'arrived_school'
                  ? 'bg-purple-800 text-white ring-2 ring-purple-300 ring-offset-1'
                  : 'bg-purple-700 hover:bg-purple-800 text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-left font-extrabold tracking-wide">4. Sampai di Sekolah</span>
              </div>
              <span className="text-[11px] font-mono bg-purple-950/40 px-2 py-0.5 rounded">
                {currentTrip?.arrivalTime || '07.15 WIB'}
              </span>
            </button>
          </div>
        </div>

        {/* Live Mini Route Map Preview */}
        <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Visualisasi Rute Wanareja</span>
            <button
              onClick={() => setActiveTab('route')}
              className="text-[11px] text-sky-600 font-semibold hover:underline"
            >
              Layar Penuh &rarr;
            </button>
          </div>
          <RouteMap
            currentStage={currentTrip?.status}
            driverName={currentUser?.name}
            vehiclePlate={currentTrip?.vehiclePlate}
            heightClass="h-44"
            showDetailsOverlay={false}
          />
        </div>
      </div>
    </div>
  );

  // 3. Daftar Siswa View (Matches poster: "Daftar Siswa - Siswa Hari Ini")
  const renderStudentsList = () => (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <div className="bg-blue-900 text-white p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => setActiveTab('home')} className="p-1 hover:bg-white/10 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold">Daftar Siswa Hari Ini</h2>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="text-xs text-slate-500 font-medium">
          Daftar 5 siswa penjemputan Angkot 01 Rute Wanareja:
        </div>

        {students.map((student) => (
          <div
            key={student.id}
            onClick={() => {
              setSelectedStudent(student);
              setActiveTab('student_detail');
            }}
            className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs hover:border-sky-400 cursor-pointer flex items-center justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center font-bold text-sky-800 text-sm">
                {student.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">{student.name}</div>
                <div className="text-[11px] text-slate-500">Kelas {student.class}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{student.pickupPoint}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getStudentStatusBadge(student.status)}
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 4. Detail Siswa View (Matches poster: "Detail Siswa: Andi Pratama, Kelas VII A, Alamat, Orang Tua")
  const renderStudentDetail = () => {
    if (!selectedStudent) return null;
    return (
      <div className="flex flex-col h-full bg-slate-50 pb-20">
        <div className="bg-blue-900 text-white p-4 flex items-center gap-3 shrink-0">
          <button onClick={() => setActiveTab('students')} className="p-1 hover:bg-white/10 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold">Detail Siswa</h2>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* Student Profile Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-xs">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
              {selectedStudent.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
            <span className="inline-block mt-1 text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
              Kelas {selectedStudent.class} · NIS {selectedStudent.nis}
            </span>

            <div className="mt-4 pt-4 border-t border-slate-100 text-left space-y-3">
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Alamat Lengkap:</div>
                <div className="text-xs font-medium text-slate-800 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span>{selectedStudent.address}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Titik Penjemputan:</div>
                <div className="text-xs font-semibold text-blue-900 bg-blue-50 p-2 rounded-lg mt-0.5">
                  {selectedStudent.pickupPoint}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Orang Tua / Wali:</div>
                <div className="text-xs font-medium text-slate-800 mt-0.5">
                  {selectedStudent.parentName}
                </div>
                <div className="text-xs font-mono text-slate-600 flex items-center gap-1.5 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedStudent.parentPhone}</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase">Status Antar Jemput:</div>
                <div className="mt-1">{getStudentStatusBadge(selectedStudent.status)}</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={`https://wa.me/${selectedStudent.parentPhone.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Send className="w-4 h-4" />
                Hubungi Orang Tua via WhatsApp
              </a>

              <button
                onClick={() => setActiveTab('route')}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <MapPin className="w-4 h-4" />
                Lihat Lokasi di Peta Rute
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. Rute Perjalanan View (Matches poster: "Rute Perjalanan - Estimasi Tiba 15 Menit")
  const renderRouteView = () => (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <div className="bg-blue-900 text-white p-4 flex items-center gap-3 shrink-0">
        <button onClick={() => setActiveTab('home')} className="p-1 hover:bg-white/10 rounded">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-base font-bold">Rute Antar Jemput</h2>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Route Map */}
        <RouteMap
          currentStage={currentTrip?.status}
          driverName={currentUser?.name}
          vehiclePlate={currentTrip?.vehiclePlate}
          heightClass="h-72"
        />

        {/* Estimation Banner */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sky-200 text-sky-800 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500">Estimasi Tiba</div>
              <div className="text-sm font-bold text-sky-950">15 Menit ke SMP Muhammadiyah 1</div>
            </div>
          </div>
          <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-md border border-slate-200 text-slate-700">
            8.5 Km
          </span>
        </div>

        {/* Sequential Stops */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
            Titik Penjemputan Berurutan:
          </h4>
          <ol className="relative border-l-2 border-sky-200 ml-3 space-y-4 text-xs">
            <li className="ml-4">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-blue-900 border-2 border-white"></span>
              <strong className="text-slate-900 font-bold">SMP Muhammadiyah 1 Wanareja</strong>
              <div className="text-[11px] text-slate-500">Titik Keberangkatan & Tujuan Akhir</div>
            </li>
            <li className="ml-4">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white"></span>
              <strong className="text-slate-900 font-bold">Jl. Melati No. 12 (Pos Ronda 2)</strong>
              <div className="text-[11px] text-slate-500">Jemput: Andi Pratama (Kelas VII A)</div>
            </li>
            <li className="ml-4">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white"></span>
              <strong className="text-slate-900 font-bold">Masjid Al-Hidayah Adimulya</strong>
              <div className="text-[11px] text-slate-500">Jemput: Siti Aisyah (Kelas VII A)</div>
            </li>
            <li className="ml-4">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-sky-500 border-2 border-white"></span>
              <strong className="text-slate-900 font-bold">Gapura Dusun Cihaur & Tarisi</strong>
              <div className="text-[11px] text-slate-500">Jemput: Rizky Maulana, Dewi Anggraini, Fajar Nugroho</div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  );

  // 6. Riwayat Perjalanan View (Matches poster: "Riwayat Perjalanan")
  const renderHistoryView = () => (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <div className="bg-blue-900 text-white p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('home')} className="p-1 hover:bg-white/10 rounded">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold">Riwayat Perjalanan</h2>
        </div>
        <span className="text-xs bg-white/10 px-2.5 py-1 rounded-full text-sky-200">
          Hari Ini
        </span>
      </div>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="text-xs text-slate-500 font-medium">
          Log pencatatan waktu perjalanan Angkot 01:
        </div>

        {history.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            Belum ada log perjalanan untuk hari ini.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{item.action}</span>
                  <span className="text-xs font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                    {item.timeStr} WIB
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">{item.location}</div>
                {item.notes && (
                  <div className="text-[10px] text-slate-400 mt-1 italic">{item.notes}</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 7. Profile Tab View
  const renderProfileView = () => (
    <div className="flex flex-col h-full bg-slate-50 pb-20">
      <div className="bg-blue-900 text-white p-5 text-center shrink-0">
        <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center font-bold text-2xl text-white mx-auto mb-2">
          BS
        </div>
        <h2 className="text-base font-bold">{currentUser?.name || 'Budi Santoso'}</h2>
        <p className="text-xs text-sky-200">Supir Antar Jemput SMP Muhammadiyah 1 Wanareja</p>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-3">
          <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Informasi Kendaraan & Lisensi
          </h4>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kendaraan:</span>
            <span className="font-semibold text-slate-800">Angkot 01 (Kuning)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Plat Nomor:</span>
            <span className="font-mono font-bold text-slate-900">B 1234 KZ</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Nomor SIM A:</span>
            <span className="font-mono text-slate-800">9208-1123-0001</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Kapasitas:</span>
            <span className="font-semibold text-slate-800">12 Siswa</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Wilayah Rute:</span>
            <span className="font-semibold text-slate-800">Wanareja - Madusari</span>
          </div>
        </div>

        {onSwitchToAdmin && (
          <button
            onClick={onSwitchToAdmin}
            className="w-full py-2.5 px-4 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Beralih ke Portal Admin Web
          </button>
        )}

        <button
          onClick={onLogout}
          className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-rose-200"
        >
          <LogOut className="w-4 h-4" />
          Keluar dari Aplikasi (Logout)
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900/90 py-6 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Top Device Bar Controller for easy evaluator viewing */}
      <div className="w-full max-w-sm mb-3 flex items-center justify-between text-xs text-slate-300 px-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-sky-400" />
            SIMANTAR Mobile Supir
          </span>
        </div>
        <div className="flex items-center gap-2">
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[11px] font-semibold transition-colors"
            >
              Lihat Web Admin &rarr;
            </button>
          )}
          <button
            onClick={onLogout}
            className="p-1 hover:text-white"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Realistic Mobile Device Container */}
      <div
        className={`w-full max-w-sm bg-white rounded-[38px] shadow-2xl border-[8px] border-slate-800 overflow-hidden flex flex-col h-[740px] relative transition-all`}
      >
        {/* Phone Notch / Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-b-xl z-30 flex items-center justify-center">
          <div className="w-10 h-1.5 bg-slate-700 rounded-full"></div>
          <div className="w-2 h-2 bg-slate-700 rounded-full ml-3"></div>
        </div>

        {/* Screen Content */}
        <div className="flex-1 overflow-hidden flex flex-col pt-4 relative bg-slate-50">
          {activeTab === 'splash' && renderSplashScreen()}
          {activeTab === 'home' && renderHome()}
          {activeTab === 'students' && renderStudentsList()}
          {activeTab === 'student_detail' && renderStudentDetail()}
          {activeTab === 'route' && renderRouteView()}
          {activeTab === 'history' && renderHistoryView()}
          {activeTab === 'profile' && renderProfileView()}
        </div>

        {/* Phone Bottom Navigation (Matches poster: Beranda, Riwayat, Profil) */}
        {activeTab !== 'splash' && (
          <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around z-20 shadow-md">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                activeTab === 'home' || activeTab === 'students' || activeTab === 'route'
                  ? 'text-blue-900 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px]">Beranda</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'text-blue-900 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-[10px]">Riwayat</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-900 font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px]">Profil</span>
            </button>
          </div>
        )}

        {/* Mobile Home indicator bar */}
        <div className="h-4 bg-white flex items-center justify-center shrink-0">
          <div className="w-28 h-1 bg-slate-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
