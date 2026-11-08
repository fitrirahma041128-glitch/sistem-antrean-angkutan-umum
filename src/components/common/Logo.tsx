import React from 'react';

export const MuhammadiyahEmblem: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="46" fill="#15803d" stroke="#facc15" strokeWidth="2.5" />
      {/* Sun rays */}
      <g stroke="#facc15" strokeWidth="2" strokeLinecap="round">
        <line x1="50" y1="8" x2="50" y2="16" />
        <line x1="50" y1="84" x2="50" y2="92" />
        <line x1="8" y1="50" x2="16" y2="50" />
        <line x1="84" y1="50" x2="92" y2="50" />
        <line x1="20" y1="20" x2="26" y2="26" />
        <line x1="74" y1="74" x2="80" y2="80" />
        <line x1="80" y1="20" x2="74" y2="26" />
        <line x1="20" y1="80" x2="26" y2="74" />
      </g>
      {/* Inner sun circle */}
      <circle cx="50" cy="50" r="28" fill="#166534" stroke="#facc15" strokeWidth="1.5" />
      {/* Arabic stylized calligraphy center */}
      <path
        d="M38 52C38 45 44 40 50 40C56 40 62 45 62 52C62 58 56 62 50 62C44 62 38 58 38 52Z"
        fill="#facc15"
      />
      <circle cx="50" cy="51" r="5" fill="#166534" />
      {/* Syahadatain symbols / text curve representation */}
      <circle cx="50" cy="35" r="2.5" fill="#ffffff" />
      <circle cx="42" cy="45" r="2" fill="#ffffff" />
      <circle cx="58" cy="45" r="2" fill="#ffffff" />
      {/* Outer ribbon banner text representation */}
      <path
        d="M26 80 Q50 88 74 80"
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const AngkotIllustration: React.FC<{ size?: number; className?: string }> = ({ size = 56, className = '' }) => {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 120 78"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Angkot Yellow Body */}
      <path
        d="M10 52V34C10 30 13 26 17 25L32 20C34 19 37 18 40 18H96C102 18 107 23 107 29V52H10Z"
        fill="#EAB308"
        stroke="#CA8A04"
        strokeWidth="2"
      />
      {/* Front hood slope */}
      <path
        d="M96 22L112 36C114 38 116 41 116 44V52H107V22H96Z"
        fill="#EAB308"
        stroke="#CA8A04"
        strokeWidth="1.5"
      />
      {/* Angkot Green/Blue side stripe common on Wanareja angkot */}
      <rect x="10" y="44" width="105" height="4" fill="#0284C7" />
      
      {/* Windows */}
      <path d="M18 26H35V40H18V26Z" fill="#38BDF8" opacity="0.8" rx="2" />
      <path d="M40 24H65V40H40V24Z" fill="#38BDF8" opacity="0.8" rx="2" />
      <path d="M70 24H93V40H70V24Z" fill="#38BDF8" opacity="0.8" rx="2" />
      <path d="M97 26H107V40H97V26Z" fill="#38BDF8" opacity="0.8" rx="2" />

      {/* Front windshield */}
      <path d="M96 24L110 38H96V24Z" fill="#7DD3FC" opacity="0.9" />

      {/* Headlight & Bumper */}
      <rect x="112" y="44" width="4" height="6" fill="#FEF08A" rx="1" />
      <rect x="8" y="50" width="110" height="4" fill="#334155" rx="2" />

      {/* Wheels */}
      <circle cx="32" cy="56" r="12" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <circle cx="32" cy="56" r="5" fill="#CBD5E1" />
      <circle cx="92" cy="56" r="12" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
      <circle cx="92" cy="56" r="5" fill="#CBD5E1" />

      {/* Route destination text box */}
      <rect x="42" y="12" width="44" height="8" rx="2" fill="#0F172A" />
      <text x="64" y="18" fill="#FACC15" fontSize="6" fontWeight="bold" textAnchor="middle">
        WANAREJA
      </text>
    </svg>
  );
};

export const SimantarLogo: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
  showSubtitle?: boolean;
}> = ({ size = 'md', variant = 'dark', showSubtitle = true }) => {
  const isLight = variant === 'light';

  const iconSizes = {
    sm: 32,
    md: 42,
    lg: 52
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3">
      {/* Map Pin with Vehicle inside */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={iconSizes[size]}
          height={iconSizes[size]}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M24 4C14.059 4 6 12.059 6 22C6 33.5 24 44 24 44C24 44 42 33.5 42 22C42 12.059 33.941 4 24 4Z"
            fill="#0284C7"
          />
          <circle cx="24" cy="21" r="13" fill="#ffffff" />
          {/* Mini Yellow Angkot */}
          <rect x="16" y="17" width="16" height="8" rx="1.5" fill="#EAB308" />
          <rect x="18" y="19" width="4" height="3" rx="0.5" fill="#0284C7" />
          <rect x="23" y="19" width="4" height="3" rx="0.5" fill="#0284C7" />
          <circle cx="19" cy="25" r="1.8" fill="#0F172A" />
          <circle cx="29" cy="25" r="1.8" fill="#0F172A" />
        </svg>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`font-black tracking-tight ${titleSizes[size]} ${isLight ? 'text-white' : 'text-slate-900'}`}>
            SIMANTAR
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white uppercase tracking-wider">
            v1.0
          </span>
        </div>
        {showSubtitle && (
          <span className={`text-xs font-medium leading-none ${isLight ? 'text-slate-300' : 'text-slate-600'}`}>
            Sistem Monitoring Antar Jemput Siswa
          </span>
        )}
      </div>
    </div>
  );
};
