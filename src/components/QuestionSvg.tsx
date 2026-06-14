/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface QuestionSvgProps {
  type: string | undefined;
}

export const QuestionSvg: React.FC<QuestionSvgProps> = ({ type }) => {
  if (!type) return null;

  switch (type) {
    case 'kulkas':
      return (
        <svg viewBox="0 0 200 240" className="w-full max-w-[150px] h-auto mx-auto border border-blue-100 rounded-lg p-2 bg-blue-50/20">
          <rect x="25" y="10" width="150" height="220" rx="12" fill="#e2e8f0" stroke="#475569" strokeWidth="3" />
          <rect x="32" y="18" width="136" height="80" rx="6" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
          <text x="100" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="11">Freezer Suhu</text>
          <text x="100" y="80" textAnchor="middle" fontWeight="black" fill="#ef4444" fontSize="18">-12°C</text>
          <rect x="32" y="112" width="136" height="106" rx="6" fill="#94a3b8" stroke="#475569" strokeWidth="1.5" />
          <text x="100" y="155" textAnchor="middle" fontWeight="bold" fill="#1e293b" fontSize="12">Daging Sapi</text>
          <text x="100" y="180" textAnchor="middle" fill="#0284c7" fontSize="9.5" fontWeight="semibold">+3°C setiap 4 menit</text>
          <line x1="25" y1="106" x2="175" y2="106" stroke="#334155" strokeWidth="3" />
        </svg>
      );

    case 'martabak':
      return (
        <svg viewBox="0 0 200 200" className="w-full max-w-[150px] h-auto mx-auto border border-amber-100 bg-amber-50/20 rounded-lg p-2">
          <circle cx="100" cy="100" r="75" fill="#fbbf24" stroke="#b45309" strokeWidth="3.5" />
          <circle cx="100" cy="100" r="68" fill="#fef08a" stroke="#d97706" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="100" y1="25" x2="100" y2="175" stroke="#78350f" strokeWidth="1.5" />
          <line x1="25" y1="100" x2="175" y2="100" stroke="#78350f" strokeWidth="1.5" />
          <line x1="47" y1="47" x2="153" y2="153" stroke="#78350f" strokeWidth="1.5" />
          <line x1="153" y1="47" x2="47" y2="153" stroke="#78350f" strokeWidth="1.5" />
          <path d="M 100 100 L 100 25 A 75 75 0 0 1 175 100 ZM 100 100 L 175 100 A 75 75 0 0 1 153 153 Z" fill="#ea580c" opacity="0.35" />
          <text x="100" y="193" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">Sisa Terigu: 5/8 kg | Resep: 3/8 kg</text>
        </svg>
      );

    case 'diskon':
      return (
        <svg viewBox="0 0 200 100" className="w-full max-w-[140px] h-auto mx-auto">
          <path d="M 10 20 L 130 20 L 160 50 L 130 80 L 10 80 Z" fill="#2563eb" />
          <circle cx="135" cy="50" r="6" fill="#f8fafc" />
          <text x="70" y="44" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="12">DISKON</text>
          <text x="70" y="70" textAnchor="middle" fill="#facc15" fontWeight="black" fontSize="22">20%</text>
          <path d="M 15 10 L 135 10 L 165 40 L 135 70 L 15 70 Z" fill="#ef4444" opacity="0.85" transform="rotate(-6, 100, 45)" />
          <text x="70" y="45" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(-6, 100, 45)">Toko Cemerlang</text>
        </svg>
      );

    case 'peta':
      return (
        <svg viewBox="0 0 320 160" className="w-full max-w-[280px] h-auto border border-blue-100 rounded-lg p-3 bg-blue-50/20 mx-auto">
          <path d="M 0 40 L 320 40 M 0 80 L 320 80 M 0 120 L 320 120 M 80 0 L 80 160 M 160 0 L 160 160 M 240 0 L 240 160" stroke="#e2e8f0" strokeWidth="0.5" />
          <path d="M 40 80 Q 150 110, 280 60" fill="none" stroke="#2563eb" strokeWidth="5" strokeLinecap="round" strokeDasharray="5,4" />
          <path d="M 40 80 Q 150 110, 280 60" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
          <circle cx="40" cy="80" r="8" fill="#ef4444" stroke="#ffffff" strokeWidth="2" />
          <text x="50" y="65" fontSize="11" fontWeight="bold" fill="#0f172a">Semarang</text>
          <circle cx="280" cy="60" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
          <text x="260" y="82" fontSize="11" fontWeight="bold" fill="#0f172a">Surakarta</text>
          <rect x="95" y="10" width="130" height="26" rx="5" fill="#ffffff" stroke="#cbd5e1" />
          <text x="160" y="27" textAnchor="middle" fontSize="10" fill="#334155" fontWeight="bold">Skala Peta 1 : 1.250.000</text>
          <text x="160" y="145" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ef4444">Jarak Peta = 8 cm</text>
        </svg>
      );

    case 'bakteri':
      return (
        <svg viewBox="0 0 200 180" className="w-full max-w-[150px] h-auto mx-auto border border-emerald-100 bg-emerald-50/20 rounded-lg p-2">
          <circle cx="100" cy="80" r="70" fill="#f0fdf4" stroke="#10b981" strokeWidth="2" />
          <circle cx="100" cy="80" r="65" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="3,3" />
          {[55, 78, 115, 128, 92, 118].map((cx, idx) => (
            <circle key={idx} cx={cx} cy={50 + (idx * 15) % 65} r={3 + (idx % 3)} fill="#047857" opacity="0.8" />
          ))}
          <text x="100" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">Pembelahan Bakteri (2x / 20m)</text>
        </svg>
      );

    case 'sel-mikroskop':
      return (
        <svg viewBox="0 0 200 180" className="w-full max-w-[150px] h-auto mx-auto border border-violet-100 bg-violet-50/10 rounded-lg p-2">
          <circle cx="100" cy="80" r="68" fill="#111827" stroke="#374151" strokeWidth="4" />
          <line x1="100" y1="12" x2="100" y2="148" stroke="#4b5563" strokeWidth="1" strokeDasharray="3,3" />
          <line x1="32" y1="80" x2="168" y2="80" stroke="#4b5563" strokeWidth="1" strokeDasharray="3,3" />
          <ellipse cx="85" cy="70" rx="18" ry="12" fill="#818cf8" stroke="#e0e7ff" opacity="0.8" />
          <circle cx="85" cy="70" r="4" fill="#312e81" />
          <circle cx="125" cy="95" r="12" fill="#c084fc" stroke="#e0e7ff" opacity="0.7" />
          <text x="100" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e1b4b">Notasi Bentuk Baku Baku</text>
        </svg>
      );

    case 'mercusuar':
      return (
        <svg viewBox="0 0 220 180" className="w-full max-w-[160px] h-auto mx-auto border border-sky-100 bg-sky-50/20 rounded-lg p-2">
          <path d="M 0 140 Q 55 135, 110 140 T 220 140 L 220 180 L 0 180 Z" fill="#0284c7" />
          <path d="M 100 140 L 105 45 L 115 45 L 120 140 Z" fill="#f1f5f9" stroke="#334155" />
          <path d="M 105 45 Q 110 38, 115 45 Z" fill="#475569" />
          <path d="M 110 50 L 15 20 L 15 50 Z" fill="#ef4444" opacity="0.3" />
          <path d="M 110 50 L 205 30 L 205 70 Z" fill="#22c55e" opacity="0.3" />
          <text x="110" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">Mercusuar: KPK (8s, 12s, 15s)</text>
        </svg>
      );

    case 'jembatan-maket':
      return (
        <svg viewBox="0 0 240 140" className="w-full max-w-[200px] h-auto mx-auto border border-indigo-50 bg-slate-50 rounded-lg p-2">
          <rect x="15" y="25" width="90" height="50" rx="4" fill="#6366f1" opacity="0.1" stroke="#6366f1" />
          <text x="60" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4f46e5">Maket 1:400</text>
          <text x="60" y="62" textAnchor="middle" fontSize="8" fill="#64748b">80 cm | 4.5 cm</text>
          <text x="120" y="55" fontSize="14" fill="#6366f1">➔</text>
          <rect x="135" y="25" width="90" height="50" rx="4" fill="#10b981" opacity="0.1" stroke="#10b981" />
          <text x="180" y="45" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857">Sebenarnya</text>
          <text x="180" y="62" textAnchor="middle" fontSize="8" fill="#64748b">320 m | 18 m</text>
        </svg>
      );

    case 'roti-gandum':
      return (
        <svg viewBox="0 0 200 150" className="w-full max-w-[150px] h-auto mx-auto border border-amber-100 bg-amber-50/10 rounded-lg p-2">
          <rect x="30" y="40" width="55" height="60" rx="4" fill="#fef3c7" stroke="#b45309" strokeWidth="2" />
          <text x="57" y="70" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#b45309">Gandum</text>
          <text x="57" y="85" textAnchor="middle" fontSize="9" fill="#78350f">500 gram</text>
          <rect x="115" y="50" width="50" height="50" rx="4" fill="#bfdbfe" stroke="#2563eb" strokeWidth="2" />
          <line x1="115" y1="70" x2="165" y2="70" stroke="#2563eb" strokeDasharray="2,2" />
          <text x="140" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e40af">Air 350ml</text>
          <text x="100" y="135" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">Proporsi Bahan Roti</text>
        </svg>
      );

    case 'diskon-ganda':
      return (
        <svg viewBox="0 0 220 120" className="w-full max-w-[180px] h-auto mx-auto">
          <rect x="10" y="10" width="200" height="100" rx="8" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
          <text x="110" y="45" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="15">DOUBLE DISKON</text>
          <text x="110" y="75" textAnchor="middle" fill="#facc15" fontWeight="black" fontSize="22">40% + 20%</text>
          <text x="110" y="95" textAnchor="middle" fill="#ffffff" fontSize="9">Potongan Efektif: 52%</text>
        </svg>
      );

    case 'paket-atk':
      return (
        <svg viewBox="0 0 200 130" className="w-full max-w-[150px] h-auto mx-auto border border-blue-100 bg-blue-50/10 rounded p-2">
          <rect x="35" y="35" width="45" height="45" rx="3" fill="#3b82f6" opacity="0.8" />
          <text x="57" y="62" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="10">5x Buku</text>
          <rect x="110" y="30" width="40" height="50" rx="3" fill="#facc15" opacity="0.8" />
          <text x="130" y="60" textAnchor="middle" fill="#334155" fontWeight="bold" fontSize="10">3y Pensil</text>
          <text x="100" y="112" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1e293b">Sisa: 100rb - 5x - 3y</text>
        </svg>
      );

    case 'taman-bunga':
      return (
        <svg viewBox="0 0 220 150" className="w-full max-w-[180px] h-auto mx-auto border border-green-100 bg-green-50/20 rounded p-2">
          <rect x="35" y="30" width="150" height="80" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
          <text x="110" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857">Panjang = (2x + 5) m</text>
          <text x="16" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#047857" transform="rotate(-90, 16, 75)">Lebar = (x - 2) m</text>
          <text x="110" y="75" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#065f46">Luas = 2x² + x - 10</text>
        </svg>
      );

    case 'truk-cargo':
      return (
        <svg viewBox="0 0 240 140" className="w-full max-w-[170px] h-auto mx-auto">
          <line x1="10" y1="120" x2="230" y2="120" stroke="#475569" strokeWidth="2" />
          <circle cx="70" cy="115" r="10" fill="#334155" />
          <circle cx="160" cy="115" r="10" fill="#334155" />
          <path d="M 40 100 L 40 70 L 65 70 L 80 85 L 80 100 Z" fill="#ef4444" />
          <rect x="85" y="50" width="115" height="50" fill="#94a3b8" stroke="#475569" />
          <text x="142" y="75" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Truk 1.500kg + Paket</text>
          <text x="142" y="90" textAnchor="middle" fontSize="8" fill="#475569">Berat Total = 2.200 kg</text>
        </svg>
      );

    case 'lift-barang':
      return (
        <svg viewBox="0 0 180 180" className="w-full max-w-[150px] h-auto mx-auto border border-slate-200 bg-slate-50/20 rounded p-2">
          <rect x="25" y="15" width="130" height="150" fill="none" stroke="#dc2626" strokeWidth="2" />
          <rect x="40" y="25" width="100" height="28" fill="#fee2e2" />
          <text x="90" y="42" textAnchor="middle" fontSize="9" fontWeight="extrabold" fill="#991b1b">KAPASITAS MAKS: 800 kg</text>
          <circle cx="55" cy="120" r="12" fill="#2563eb" />
          <text x="55" y="100" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1d4ed8">Kurir (80kg)</text>
          <rect x="95" y="110" width="40" height="40" fill="#f59e0b" rx="2" />
          <text x="115" y="132" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ffffff">n Box</text>
          <text x="115" y="142" textAnchor="middle" fontSize="7.5" fill="#ffffff">@ 45kg</text>
        </svg>
      );

    case 'pelajaran-pilihan':
      return (
        <svg viewBox="0 0 250 160" className="w-full max-w-[180px] h-auto mx-auto border border-slate-200 bg-slate-50/10 rounded p-2">
          <g fill="#3b82f6" fontSize="9" fontWeight="bold" textAnchor="middle">
            <rect x="20" y="15" width="55" height="24" rx="3" /> <text x="47" y="30" fill="#fff">Anton</text>
            <rect x="20" y="50" width="55" height="24" rx="3" /> <text x="47" y="65" fill="#fff">Budi</text>
            <rect x="20" y="85" width="55" height="24" rx="3" /> <text x="47" y="100" fill="#fff">Cantika</text>
            <rect x="20" y="120" width="55" height="24" rx="3" /> <text x="47" y="135" fill="#fff">Dodi</text>
          </g>
          <g fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
            <rect x="170" y="15" width="60" height="24" rx="3" /> <text x="200" y="30" fill="#fff">MTK</text>
            <rect x="170" y="50" width="60" height="24" rx="3" /> <text x="200" y="65" fill="#fff">IPA</text>
            <rect x="170" y="85" width="60" height="24" rx="3" /> <text x="200" y="100" fill="#fff">IPS</text>
            <rect x="170" y="120" width="60" height="24" rx="3" /> <text x="200" y="135" fill="#fff">B.Inggris</text>
          </g>
          <line x1="75" y1="27" x2="170" y2="27" stroke="#94a3b8" />
          <line x1="75" y1="27" x2="170" y2="62" stroke="#94a3b8" />
          <line x1="75" y1="62" x2="170" y2="97" stroke="#94a3b8" />
          <line x1="75" y1="97" x2="170" y2="27" stroke="#4f46e5" strokeWidth="2" />
          <line x1="75" y1="132" x2="170" y2="62" stroke="#4f46e5" strokeWidth="2" />
        </svg>
      );

    case 'taksi':
      return (
        <svg viewBox="0 0 320 200" className="w-full max-w-[260px] h-auto border border-blue-100 rounded-lg p-2 bg-blue-50/20 mx-auto">
          <line x1="40" y1="20" x2="40" y2="170" stroke="#475569" strokeWidth="2" />
          <line x1="40" y1="170" x2="300" y2="170" stroke="#475569" strokeWidth="2" />
          <line x1="40" y1="120" x2="140" y2="120" stroke="#cbd5e1" strokeDasharray="3,3" />
          <line x1="140" y1="120" x2="140" y2="170" stroke="#cbd5e1" strokeDasharray="3,3" />
          <line x1="40" y1="45" x2="290" y2="45" stroke="#cbd5e1" strokeDasharray="3,3" />
          <line x1="290" y1="45" x2="290" y2="170" stroke="#cbd5e1" strokeDasharray="3,3" />
          <line x1="40" y1="170" x2="295" y2="42" fill="none" stroke="#2563eb" strokeWidth="3" />
          <text x="300" y="185" textAnchor="end" fontSize="9" fontWeight="bold" fill="#475569">Jarak (Km)</text>
          <text x="15" y="15" textAnchor="start" fontSize="9" fontWeight="bold" fill="#475569">Tarif (Rp)</text>
          <circle cx="140" cy="120" r="5" fill="#ef4444" />
          <text x="140" y="185" textAnchor="middle" fontSize="10">10 km</text>
          <text x="32" y="124" textAnchor="end" fontSize="10">80.000</text>
          <circle cx="290" cy="45" r="5" fill="#ef4444" />
          <text x="290" y="185" textAnchor="middle" fontSize="10">25 km</text>
          <text x="32" y="49" textAnchor="end" fontSize="10">155.000</text>
          <text x="200" y="90" fontSize="11" fill="#2563eb" fontWeight="bold">F(x) = ax + b</text>
        </svg>
      );

    case 'grafik-kursi':
      return (
        <svg viewBox="0 0 350 180" className="w-full max-w-[280px] h-auto border border-slate-100 bg-slate-50/30 p-2 rounded mx-auto">
          <path d="M 60 20 C 120 10, 230 10, 290 20" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
          <text x="175" y="36" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#475569">LAYAR UTAMA BIOSKOP</text>
          {[100, 130, 160, 190, 220, 250].map((cx, i) => (
            <rect key={`r1-${i}`} x={cx - 10} y="55" width="20" height="15" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
          ))}
          <text x="60" y="66" fontSize="9" fill="#64748b" fontWeight="semibold">Baris 1 (12)</text>
          {[85, 115, 145, 175, 205, 235, 265].map((cx, i) => (
            <rect key={`r2-${i}`} x={cx - 10} y="85" width="20" height="15" rx="3" fill="#94a3b8" stroke="#64748b" />
          ))}
          <text x="60" y="96" fontSize="9" fill="#64748b" fontWeight="semibold">Baris 2 (15)</text>
          <circle cx="175" cy="125" r="3" fill="#94a3b8" />
          <circle cx="175" cy="138" r="3" fill="#94a3b8" />
          <circle cx="175" cy="151" r="3" fill="#94a3b8" />
          <text x="175" y="170" textAnchor="middle" fontSize="10" fill="#2563eb" fontWeight="bold">Barisan Aritmatika b = 3</text>
        </svg>
      );

    case 'korek':
      return (
        <svg viewBox="0 0 320 130" className="w-full max-w-[240px] h-auto mx-auto border border-amber-100 bg-amber-50/20 rounded p-2">
          {/* Pattern of matches (Triangle) */}
          <polygon points="30,100 90,100 60,45" fill="none" stroke="#b45309" strokeWidth="3" />
          <line x1="90" y1="100" x2="150" y2="100" stroke="#b45309" strokeWidth="3" />
          <line x1="150" y1="100" x2="120" y2="45" stroke="#b45309" strokeWidth="3" />
          <line x1="90" y1="100" x2="120" y2="45" stroke="#b45309" strokeWidth="3" />
          <circle cx="60" cy="45" r="5" fill="#ef4444" />
          <circle cx="120" cy="45" r="5" fill="#ef4444" />
          <text x="60" y="118" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">Pola 1 (3 batang)</text>
          <text x="120" y="118" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#78350f">Pola 2 (5 batang)</text>
          <text x="240" y="70" textAnchor="middle" fontSize="12" fontWeight="black" fill="#2563eb">Un = 2n + 1</text>
        </svg>
      );

    case 'kedai-mie':
      return (
        <svg viewBox="0 0 200 130" className="w-full max-w-[150px] h-auto mx-auto border border-violet-100 bg-violet-50/10 rounded p-2">
          <text x="100" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#5b21b6">KEDAI MIE LARIS</text>
          <rect x="15" y="40" width="80" height="55" rx="4" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="55" y="55" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7c3aed">Paket A (38rb)</text>
          <text x="55" y="72" textAnchor="middle" fontSize="7.5" fill="#6d28d9">2 Mie + 1 Teh</text>
          <rect x="105" y="40" width="80" height="55" rx="4" fill="#ffffff" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="145" y="55" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#7c3aed">Paket B (59rb)</text>
          <text x="145" y="72" textAnchor="middle" fontSize="7.5" fill="#6d28d9">3 Mie + 2 Teh</text>
        </svg>
      );

    case 'peternakan-kambing-ayam':
      return (
        <svg viewBox="0 0 200 130" className="w-full max-w-[150px] h-auto mx-auto border border-emerald-100 bg-emerald-50/10 rounded p-2">
          <rect x="20" y="45" width="160" height="50" rx="3" fill="#10b981" opacity="0.1" stroke="#059669" />
          <text x="100" y="30" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#047857">Peternakan Kep. Kamp</text>
          <text x="100" y="68" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#065f46">35 Kepala</text>
          <text x="100" y="85" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#b45309">110 Kaki</text>
        </svg>
      );

    case 'lapangan-futsal':
      return (
        <svg viewBox="0 0 220 140" className="w-full max-w-[180px] h-auto mx-auto border border-emerald-450 bg-emerald-700 p-2 rounded-lg">
          <rect x="15" y="15" width="190" height="110" fill="#047857" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="110" y1="15" x2="110" y2="125" stroke="#ffffff" />
          <circle cx="110" cy="70" r="22" fill="none" stroke="#ffffff" />
          <text x="110" y="65" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ffffff">Tarif Lapangan</text>
          <text x="110" y="82" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#facc15">F(t) = 80.000t + 50.000</text>
        </svg>
      );

    case 'botol-handsanitizer':
      return (
        <svg viewBox="0 0 200 140" className="w-full max-w-[150px] h-auto mx-auto border border-teal-50 bg-teal-500/5 rounded p-2">
          <rect x="45" y="55" width="25" height="45" rx="3" fill="#e2e8f0" stroke="#475569" />
          <text x="57" y="82" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#334155">60ml</text>
          <text x="57" y="115" textAnchor="middle" fontSize="8" fontWeight="bold">Rp 10.000</text>
          <rect x="120" y="35" width="35" height="65" rx="3" fill="#94a3b8" stroke="#334155" />
          <text x="137" y="72" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1e293b">250ml</text>
          <text x="137" y="115" textAnchor="middle" fontSize="8" fontWeight="bold">Rp 25.000</text>
        </svg>
      );

    case 'sudut-jembatan':
      return (
        <svg viewBox="0 0 320 180" className="w-full max-w-[240px] h-auto mx-auto border border-blue-50 bg-slate-50/20 p-2 rounded">
          <line x1="30" y1="50" x2="290" y2="50" stroke="#334155" strokeWidth="2.5" />
          <line x1="30" y1="130" x2="290" y2="130" stroke="#334155" strokeWidth="2.5" />
          <line x1="80" y1="160" x2="240" y2="20" stroke="#2563eb" strokeWidth="3" />
          <text x="240" y="44" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#ef4444">(4x - 10)°</text>
          <text x="80" y="145" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#2563eb">(2x + 40)°</text>
          <text x="160" y="165" textAnchor="middle" fontSize="10" fill="#475569" fontWeight="bold">Konstruksi Garis Sejajar</text>
        </svg>
      );

    case 'taman-segitiga':
      return (
        <svg viewBox="0 0 220 150" className="w-full max-w-[160px] h-auto mx-auto border border-emerald-100 bg-emerald-50/10 rounded p-2">
          <polygon points="45,35 45,120 165,120" fill="#a7f3d0" stroke="#059669" strokeWidth="2" />
          <text x="25" y="80" fontSize="10.5" fontWeight="bold" fill="#047857">15 m</text>
          <text x="105" y="138" fontSize="10.5" fontWeight="bold" fill="#047857">20 m</text>
          <text x="110" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#065f46">Taman Segitiga Siku-Siku</text>
        </svg>
      );

    case 'ubin-aula':
      return (
        <svg viewBox="0 0 200 140" className="w-full max-w-[150px] h-auto mx-auto border border-slate-200 bg-slate-50 rounded p-2">
          <rect x="25" y="25" width="150" height="90" fill="none" stroke="#334155" strokeWidth="2" />
          <line x1="62" y1="25" x2="62" y2="115" stroke="#cbd5e1" />
          <line x1="100" y1="25" x2="100" y2="115" stroke="#cbd5e1" />
          <line x1="138" y1="25" x2="138" y2="115" stroke="#cbd5e1" />
          <line x1="25" y1="55" x2="175" y2="55" stroke="#cbd5e1" />
          <line x1="25" y1="85" x2="175" y2="85" stroke="#cbd5e1" />
          <text x="100" y="130" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Lantai: 12m × 8m | Ubin: 40cm × 40cm</text>
        </svg>
      );

    case 'bayangan-pohon':
      return (
        <svg viewBox="0 0 260 150" className="w-full max-w-[200px] h-auto mx-auto border border-amber-50 bg-amber-50/10 p-2 rounded">
          <line x1="10" y1="120" x2="250" y2="120" stroke="#475569" strokeWidth="1.5" />
          <line x1="50" y1="120" x2="50" y2="80" stroke="#2563eb" strokeWidth="2" />
          <circle cx="50" cy="76" r="4" fill="#2563eb" />
          <text x="50" y="66" textAnchor="middle" fontSize="8" fontWeight="bold">150cm</text>
          <path d="M 170 120 Q 165 75, 160 35" fill="none" stroke="#78350f" strokeWidth="3" />
          <path d="M 160 35 Q 140 30, 135 40 M 160 35 Q 180 30, 185 40 M 160 35 Q 160 10, 170 10" fill="none" stroke="#059669" strokeWidth="2" />
          <text x="160" y="25" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#047857">Pohon ?</text>
          <text x="110" y="140" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#475569">Rasio Tinggi : Bayangan</text>
        </svg>
      );

    case 'jendela-trapesium':
      return (
        <svg viewBox="0 0 240 140" className="w-full max-w-[170px] h-auto mx-auto border border-slate-200 bg-cyan-50/10 rounded p-2">
          <polygon points="35,110 100,110 100,40 50,40" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <polygon points="205,110 140,110 140,40 190,40" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <text x="86" y="55" fontSize="8" fontWeight="bold">115°</text>
          <text x="144" y="55" fontSize="8" fontWeight="bold">115°</text>
          <text x="120" y="130" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#1e293b">Elemen Kekongruenan</text>
        </svg>
      );

    case 'tiang-antena':
      return (
        <svg viewBox="0 0 200 160" className="w-full max-w-[150px] h-auto mx-auto border border-blue-50 bg-slate-50 p-2 rounded">
          <line x1="20" y1="130" x2="180" y2="130" stroke="#475569" strokeWidth="1.5" />
          <line x1="50" y1="130" x2="50" y2="30" stroke="#334155" strokeWidth="4" />
          <line x1="50" y1="30" x2="140" y2="130" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="35" y="80" fontSize="10" fontWeight="bold" fill="#2563eb">12 m</text>
          <text x="95" y="145" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#2563eb">5 m</text>
          <text x="120" y="75" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#dc2626">Kawat = ?</text>
        </svg>
      );

    case 'sepeda-gunung':
      return (
        <svg viewBox="0 0 200 150" className="w-full max-w-[150px] h-auto mx-auto border border-slate-100 bg-slate-50/30 p-2 rounded">
          <circle cx="100" cy="70" r="45" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="2,2" />
          <circle cx="100" cy="70" r="48" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="52" y1="70" x2="148" y2="70" stroke="#ef4444" strokeWidth="1.5" />
          <text x="100" y="64" textAnchor="middle" fontSize="9.5" fill="#ef4444" fontWeight="bold">d = 70 cm</text>
          <text x="100" y="135" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b">Kemudi Berputar 500 Kali</text>
        </svg>
      );

    case 'bak-mandi':
      return (
        <svg viewBox="0 0 220 180" className="w-full max-w-[160px] h-auto mx-auto border border-indigo-100 bg-sky-50/10 rounded p-2">
          <rect x="30" y="50" width="110" height="75" fill="none" stroke="#94a3b8" strokeDasharray="3,3" />
          <rect x="65" y="75" width="110" height="75" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" opacity="0.5" />
          <line x1="30" y1="50" x2="65" y2="75" stroke="#0284c7" strokeWidth="2" />
          <line x1="140" y1="50" x2="175" y2="75" stroke="#0284c7" strokeWidth="2" />
          <path d="M 85 20 L 85 40 L 95 40 L 95 60" fill="none" stroke="#38bdf8" strokeWidth="4" strokeLinecap="round" />
          <text x="110" y="165" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#0369a1">Dimensi: 120 × 80 × 60 cm</text>
        </svg>
      );

    case 'prisma-gazebo':
      return (
        <svg viewBox="0 0 200 160" className="w-full max-w-[155px] h-auto mx-auto border border-amber-200 bg-amber-50/10 p-2 rounded">
          <polygon points="35,110 110,110 72,50" fill="#ffedd5" stroke="#c2410c" strokeWidth="2" />
          <line x1="35" y1="110" x2="115" y2="80" stroke="#c2410c" strokeWidth="2" />
          <line x1="110" y1="110" x2="190" y2="80" stroke="#c2410c" strokeWidth="2" />
          <line x1="72" y1="50" x2="152" y2="20" stroke="#c2410c" strokeWidth="2" />
          <text x="72" y="125" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#7c2d12">Alas Siku-Siku (3m & 4m)</text>
          <text x="135" y="112" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#ea580c">Panjang 6m</text>
        </svg>
      );

    case 'bangun-3d':
      return (
        <svg viewBox="0 0 220 180" className="w-full max-w-[150px] h-auto mx-auto border border-slate-100 bg-white p-2 rounded">
          <ellipse cx="110" cy="40" rx="70" ry="20" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="40" y1="40" x2="40" y2="130" stroke="#1e293b" strokeWidth="3" />
          <line x1="180" y1="40" x2="180" y2="130" stroke="#1e293b" strokeWidth="3" />
          <path d="M 40 130 A 70 20 0 0 0 180 130" fill="none" stroke="#1e293b" strokeWidth="3" />
          <line x1="110" y1="40" x2="180" y2="40" stroke="#ef4444" strokeWidth="1.5" />
          <text x="145" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ef4444">r = 7 cm</text>
          <text x="110" y="90" textAnchor="middle" fontSize="10.5" fontWeight="bold" fill="#2563eb">Tinggi t = 20 cm</text>
        </svg>
      );

    case 'pelayaran-kapal':
      return (
        <svg viewBox="0 0 250 170" className="w-full max-w-[170px] h-auto mx-auto border border-sky-50 bg-sky-50/5 p-2 rounded">
          <line x1="50" y1="130" x2="50" y2="40" stroke="#0284c7" strokeWidth="3" />
          <line x1="50" y1="40" x2="180" y2="40" stroke="#0284c7" strokeWidth="3" />
          <line x1="50" y1="130" x2="180" y2="40" stroke="#dc2626" strokeWidth="2" strokeDasharray="3,2" />
          <text x="32" y="90" fontSize="9" fontWeight="bold" fill="#0284c7">90 mil (U)</text>
          <text x="115" y="30" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0284c7">120 mil (T)</text>
          <text x="115" y="105" textAnchor="middle" fontSize="10.5" fontWeight="extrabold" fill="#b91c1c" transform="rotate(-34, 115, 105)">Dermaga C</text>
        </svg>
      );

    case 'pigura-foto':
      return (
        <svg viewBox="0 0 200 180" className="w-full max-w-[140px] h-auto mx-auto border border-stone-200 bg-stone-50 p-2 rounded">
          <rect x="25" y="15" width="150" height="150" fill="#fde68a" stroke="#d97706" strokeWidth="3" />
          <rect x="40" y="30" width="120" height="110" fill="#93c5fd" />
          <text x="100" y="13" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#92400e">Karton: 30cm × 40cm</text>
          <text x="100" y="85" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e3a8a">Foto Sebangun</text>
          <text x="100" y="152" textAnchor="middle" fontSize="7.5" fill="#334155">Sisa atas, kiri, kanan = 3cm</text>
        </svg>
      );

    case 'tim-basket':
      return (
        <svg viewBox="0 0 220 150" className="w-full max-w-[160px] h-auto mx-auto border border-amber-100 bg-amber-50/10 rounded p-2">
          <rect x="40" y="55" width="18" height="75" fill="#fca5a5" rx="2" />
          <text x="49" y="45" textAnchor="middle" fontSize="8" fontWeight="bold">8 Inti</text>
          <text x="49" y="90" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1e293b" transform="rotate(-90, 49, 90)">176 cm</text>
          <rect x="140" y="50" width="18" height="80" fill="#86efac" rx="2" />
          <text x="149" y="40" textAnchor="middle" fontSize="8" fontWeight="bold">10 Tim</text>
          <text x="149" y="90" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#166534" transform="rotate(-90, 149, 90)">177 cm</text>
          <text x="95" y="85" fontSize="13" fontWeight="bold" fill="#94a3b8">➔</text>
        </svg>
      );

    case 'nilai-matematika':
      return (
        <svg viewBox="0 0 240 160" className="w-full max-w-[190px] h-auto mx-auto border border-blue-50 bg-sky-50/5 rounded p-2">
          <line x1="30" y1="130" x2="230" y2="130" stroke="#475569" strokeWidth="1.5" />
          <rect x="42" y="90" width="22" height="40" fill="#60a5fa" />
          <text x="53" y="142" textAnchor="middle" fontSize="8">60</text>
          <rect x="78" y="50" width="22" height="80" fill="#3b82f6" />
          <text x="89" y="142" textAnchor="middle" fontSize="8">70</text>
          <rect x="114" y="30" width="22" height="100" fill="#1d4ed8" />
          <text x="125" y="142" textAnchor="middle" fontSize="8">80</text>
          <rect x="150" y="70" width="22" height="60" fill="#3b82f6" />
          <text x="161" y="142" textAnchor="middle" fontSize="8">90</text>
          <rect x="186" y="110" width="22" height="20" fill="#93c5fd" />
          <text x="197" y="142" textAnchor="middle" fontSize="8">100</text>
          <text x="130" y="15" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1d4ed8">Statistik Nilai Matematika</text>
        </svg>
      );

    case 'diagram-hobi':
      return (
        <svg viewBox="0 0 200 180" className="w-full max-w-[140px] h-auto mx-auto border border-rose-100 bg-rose-50/10 rounded p-2">
          <circle cx="100" cy="80" r="50" fill="none" stroke="#e2e8f0" strokeWidth="18" />
          <circle cx="100" cy="80" r="50" fill="none" stroke="#f43f5e" strokeWidth="18" strokeDasharray="110 314" />
          <circle cx="100" cy="80" r="50" fill="none" stroke="#3b82f6" strokeWidth="18" strokeDasharray="78.5 314" strokeDashoffset="-110" />
          <circle cx="100" cy="80" r="38" fill="#ffffff" />
          <text x="100" y="83" textAnchor="middle" fontSize="9.5" fontWeight="black" fill="#1e293b">120 Orang</text>
          <text x="100" y="160" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#be123c">Modus Olahraga Favorit</text>
        </svg>
      );

    case 'kelereng-wadah':
      return (
        <svg viewBox="0 0 180 170" className="w-full max-w-[140px] h-auto mx-auto border border-violet-100 bg-violet-50/10 rounded p-2">
          <path d="M 50 30 L 130 30 L 130 45 Q 160 52, 160 95 L 160 140 Q 160 150, 145 150 L 35 150 Q 20 150, 20 140 L 20 95 Q 20 52, 50 45 Z" fill="none" stroke="#475569" strokeWidth="2.5" />
          {/* colorful mini dots */}
          <circle cx="50" cy="110" r="7" fill="#ef4444" />
          <circle cx="70" cy="120" r="7" fill="#ef4444" />
          <circle cx="60" cy="138" r="7" fill="#3b82f6" />
          <circle cx="85" cy="138" r="7" fill="#3b82f6" />
          <circle cx="110" cy="138" r="7" fill="#22c55e" />
          <circle cx="130" cy="125" r="7" fill="#ef4444" />
          <text x="90" y="80" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#1e293b">20 Kelereng</text>
          <text x="90" y="100" textAnchor="middle" fontSize="8" fill="#475569">8 Merah | 7 Biru | 5 Hijau</text>
        </svg>
      );

    case 'persentase-ekskul':
      return (
        <svg viewBox="0 0 200 180" className="w-full max-w-[140px] h-auto mx-auto border border-slate-200 bg-slate-50/20 rounded p-2">
          <circle cx="100" cy="80" r="50" fill="none" stroke="#e2e8f0" strokeWidth="20" />
          <circle cx="100" cy="80" r="50" fill="none" stroke="#4f46e5" strokeWidth="20" strokeDasharray="138.2 314" />
          <circle cx="100" cy="80" r="50" fill="none" stroke="#ec4899" strokeWidth="20" strokeDasharray="62.8 314" strokeDashoffset="-138.2" />
          <circle cx="100" cy="80" r="38" fill="#ffffff" />
          <text x="100" y="83" textAnchor="middle" fontSize="9.5" fontWeight="black" fill="#1e293b">200 Siswa</text>
          <text x="100" y="160" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4f46e5">Pramuka (Wajib) 44%</text>
        </svg>
      );

    case 'grafik-panen':
      return (
        <svg viewBox="0 0 350 180" className="w-full max-w-[280px] h-auto border border-stone-200 bg-stone-50/50 p-2 rounded mx-auto">
          <line x1="40" y1="10" x2="40" y2="150" stroke="#475569" strokeWidth="1.5" />
          <line x1="40" y1="150" x2="330" y2="150" stroke="#475569" strokeWidth="1.5" />
          <text x="75" y="165" textAnchor="middle" fontSize="9.5" fill="#475569">2021</text>
          <rect x="60" y="82.5" width="30" height="67.5" fill="#10b981" rx="2" />
          <text x="75" y="75" textAnchor="middle" fontSize="8.5" fontWeight="bold">45t</text>
          <text x="125" y="165" textAnchor="middle" fontSize="9.5" fill="#475569">2022</text>
          <rect x="110" y="75" width="30" height="75" fill="#059669" rx="2" />
          <text x="125" y="68" textAnchor="middle" fontSize="8.5" fontWeight="bold">50t</text>
          <text x="175" y="165" textAnchor="middle" fontSize="9.5" fill="#475569">2023</text>
          <rect x="160" y="60" width="30" height="90" fill="#047857" rx="2" />
          <text x="175" y="53" textAnchor="middle" fontSize="8.5" fontWeight="bold">60t</text>
          <text x="225" y="165" textAnchor="middle" fontSize="9.5" fill="#475569">2024</text>
          <rect x="210" y="67.5" width="30" height="82.5" fill="#10b981" rx="2" />
          <text x="225" y="60" textAnchor="middle" fontSize="8.5" fontWeight="bold">55t</text>
          <text x="275" y="165" textAnchor="middle" fontSize="9.5" fill="#475569">2025</text>
          <rect x="260" y="45" width="30" height="105" fill="#065f46" rx="2" />
          <text x="275" y="38" textAnchor="middle" fontSize="8.5" fontWeight="bold">70t</text>
          <text x="180" y="20" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#065f46">Hasil Panen Padi Desa Sukatani</text>
        </svg>
      );

    default:
      return null;
  }
};
