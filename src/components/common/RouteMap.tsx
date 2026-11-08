import React, { useState } from 'react';
import { School, MapPin, Navigation, Compass, Plus, Minus, Layers } from 'lucide-react';
import { TripStage } from '../../types';
import { AngkotIllustration } from './Logo';

interface RouteMapProps {
  currentStage?: TripStage;
  driverName?: string;
  vehiclePlate?: string;
  heightClass?: string;
  showDetailsOverlay?: boolean;
}

export const RouteMap: React.FC<RouteMapProps> = ({
  currentStage = 'departed_school',
  driverName = 'Budi Santoso',
  vehiclePlate = 'B 1234 KZ',
  heightClass = 'h-72',
  showDetailsOverlay = true
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  // Coordinates mapping along the route path (SVG percentage coordinates)
  const waypoints = [
    { id: 'school', name: 'SMP Muhammadiyah 1 Wanareja', x: 22, y: 72, isSchool: true },
    { id: 'stop1', name: 'Jl. Melati No. 12', x: 42, y: 55, isPickup: true },
    { id: 'stop2', name: 'Masjid Al-Hidayah Adimulya', x: 60, y: 42, isPickup: true },
    { id: 'stop3', name: 'Gapura Dusun Cihaur', x: 78, y: 32, isPickup: true },
    { id: 'stop4', name: 'Pasar Tarisi', x: 86, y: 22, isPickup: true }
  ];

  // Vehicle coordinate based on current trip stage
  let vehicleCoord = { x: 22, y: 72, label: 'Di Sekolah' };
  let statusText = 'Dalam Perjalanan';

  if (currentStage === 'not_started') {
    vehicleCoord = { x: 22, y: 72, label: 'Standby di Sekolah' };
    statusText = 'Siap Berangkat';
  } else if (currentStage === 'departed_school') {
    vehicleCoord = { x: 34, y: 62, label: 'Menuju Jl. Melati' };
    statusText = 'Menuju Titik Jemput';
  } else if (currentStage === 'at_pickup') {
    vehicleCoord = { x: 50, y: 48, label: 'Di Titik Jemput Adimulya' };
    statusText = 'Penjemputan Siswa';
  } else if (currentStage === 'students_boarded') {
    vehicleCoord = { x: 58, y: 45, label: 'Menuju Sekolah' };
    statusText = 'Membawa Siswa Menuju Sekolah';
  } else if (currentStage === 'arrived_school') {
    vehicleCoord = { x: 22, y: 72, label: 'Sampai di Sekolah' };
    statusText = 'Tiba di Sekolah';
  }

  return (
    <div className={`relative w-full ${heightClass} bg-[#e5ece5] rounded-xl overflow-hidden border border-slate-200 select-none shadow-inner`}>
      {/* SVG Canvas Map */}
      <svg
        className="w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
        viewBox="0 0 500 320"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle grid pattern representing town blocks */}
          <pattern id="roadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="#e9efe6" />
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5dfd1" strokeWidth="1" />
          </pattern>

          {/* Linear gradient for route */}
          <linearGradient id="routeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>

        {/* Map Base background */}
        <rect width="500" height="320" fill="url(#roadGrid)" />

        {/* Green area / fields / parks in Wanareja */}
        <path d="M 10 20 Q 90 40 140 10 Q 180 60 110 110 Q 30 90 10 20 Z" fill="#d7e8cb" opacity="0.8" />
        <path d="M 320 180 Q 400 160 480 200 Q 460 290 380 280 Q 330 240 320 180 Z" fill="#d7e8cb" opacity="0.8" />
        <path d="M 380 30 Q 450 10 490 60 Q 460 120 400 90 Z" fill="#dcefd2" opacity="0.9" />

        {/* River (Sungai Cijalu / Cigintung branch in Wanareja) */}
        <path
          d="M 0 140 C 120 160, 200 130, 290 190 C 360 240, 420 230, 500 270"
          fill="none"
          stroke="#93c5fd"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Secondary Roads */}
        <g stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 280 L 480 280" />
          <path d="M 120 20 L 120 300" />
          <path d="M 360 20 L 360 300" />
          <path d="M 250 50 L 450 160" />
        </g>
        <g stroke="#cbd5e1" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 20 280 L 480 280" />
          <path d="M 120 20 L 120 300" />
          <path d="M 360 20 L 360 300" />
          <path d="M 250 50 L 450 160" />
        </g>

        {/* Main Road (Jl. Nasional III Wanareja) */}
        <path
          d="M 40 240 C 130 230, 210 190, 310 170 C 380 150, 430 110, 480 90"
          fill="none"
          stroke="#fef08a"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 40 240 C 130 230, 210 190, 310 170 C 380 150, 430 110, 480 90"
          fill="none"
          stroke="#eab308"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Active Route Path Polyline (Wanareja - Madusari) */}
        <path
          d="M 110 230 Q 160 210 210 175 T 300 135 T 390 102 T 430 70"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.5"
        />
        <path
          d="M 110 230 Q 160 210 210 175 T 300 135 T 390 102 T 430 70"
          fill="none"
          stroke="#0284c7"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="8 3"
        />

        {/* Waypoints / Stops */}
        {/* Stop 1: Jl. Melati */}
        <g transform="translate(210, 175)">
          <circle r="8" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
          <circle r="3.5" fill="#0284c7" />
          <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#0f172a">Jl. Melati</text>
        </g>

        {/* Stop 2: Adimulya */}
        <g transform="translate(300, 135)">
          <circle r="8" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
          <circle r="3.5" fill="#0284c7" />
          <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#0f172a">Masjid Adimulya</text>
        </g>

        {/* Stop 3: Dusun Cihaur */}
        <g transform="translate(390, 102)">
          <circle r="8" fill="#ffffff" stroke="#0284c7" strokeWidth="3" />
          <circle r="3.5" fill="#0284c7" />
          <text x="12" y="4" fontSize="10" fontWeight="bold" fill="#0f172a">Cihaur</text>
        </g>

        {/* Stop 4: Pasar Tarisi */}
        <g transform="translate(430, 70)">
          <circle r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
          <circle r="3.5" fill="#ffffff" />
          <text x="-10" y="-12" fontSize="10" fontWeight="bold" fill="#991b1b">Pasar Tarisi</text>
        </g>

        {/* School Pin: SMP Muhammadiyah 1 Wanareja */}
        <g transform="translate(110, 230)">
          {/* Shadow */}
          <ellipse cx="0" cy="8" rx="14" ry="5" fill="#000000" opacity="0.2" />
          {/* Base Pin Circle */}
          <circle r="18" fill="#1e3a8a" stroke="#ffffff" strokeWidth="3" />
          {/* School Icon */}
          <path
            d="M-8 -2 L0 -8 L8 -2 L8 8 L-8 8 Z"
            fill="#ffffff"
          />
          <rect x="-3" y="1" width="6" height="7" fill="#1e3a8a" />
          <text x="-45" y="32" fontSize="11" fontWeight="bold" fill="#1e3a8a">
            SMP Muhammadiyah 1
          </text>
        </g>

        {/* Moving Angkot Vehicle Indicator */}
        <g
          transform={`translate(${
            currentStage === 'departed_school' ? 160 :
            currentStage === 'at_pickup' ? 260 :
            currentStage === 'students_boarded' ? 340 :
            currentStage === 'arrived_school' ? 120 : 110
          }, ${
            currentStage === 'departed_school' ? 200 :
            currentStage === 'at_pickup' ? 155 :
            currentStage === 'students_boarded' ? 120 :
            currentStage === 'arrived_school' ? 210 : 230
          })`}
          className="transition-all duration-700 ease-out"
        >
          {/* Pulse Ripple */}
          <circle r="22" fill="#eab308" opacity="0.25" className="animate-ping" />
          {/* Vehicle Icon Badge */}
          <rect x="-18" y="-14" width="36" height="26" rx="6" fill="#eab308" stroke="#ffffff" strokeWidth="2" />
          <rect x="-14" y="-10" width="8" height="8" rx="1" fill="#38bdf8" />
          <rect x="-3" y="-10" width="8" height="8" rx="1" fill="#38bdf8" />
          <rect x="8" y="-10" width="6" height="8" rx="1" fill="#38bdf8" />
          <circle cx="-9" cy="8" r="3" fill="#1e293b" />
          <circle cx="9" cy="8" r="3" fill="#1e293b" />
        </g>
      </svg>

      {/* Top Left: DEMO SIMULASI GPS Badge (Requirement #8) */}
      <div className="absolute top-3 left-3 flex items-center gap-2">
        <span className="bg-amber-500 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded shadow-sm tracking-wide">
          DEMO GPS SIMULASI
        </span>
        <span className="bg-white/90 backdrop-blur-xs text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm border border-slate-200/80">
          Wanareja, Cilacap
        </span>
      </div>

      {/* Top Right: Zoom & Control Toolbar */}
      <div className="absolute top-3 right-3 flex flex-col gap-1 bg-white/90 backdrop-blur-xs rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <button
          onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.8))}
          className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
          title="Perbesar"
        >
          <Plus className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 w-full" />
        <button
          onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
          className="p-1.5 hover:bg-slate-100 text-slate-700 transition-colors"
          title="Perkecil"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Center / Floating Status Bubble (Exact match to poster's "Angkot 01 Dalam Perjalanan") */}
      {showDetailsOverlay && (
        <div className="absolute top-12 right-12 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-md border border-slate-200/90 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <AngkotIllustration size={32} />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <span>Angkot 01</span>
              <span className="font-mono text-[10px] text-slate-500 font-normal">({vehiclePlate})</span>
            </div>
            <div className="text-[11px] text-sky-700 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span>{statusText}</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Legend */}
      <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded text-[10px] text-slate-600 flex items-center gap-3 border border-slate-200">
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-900 inline-block" />
          Sekolah
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
          Titik Kumpul Siswa
        </span>
        <span className="flex items-center gap-1 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          Posisi Angkot
        </span>
      </div>
    </div>
  );
};
