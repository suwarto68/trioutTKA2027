/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  Settings, 
  Lock, 
  FileDown, 
  Trophy, 
  BarChart4, 
  HelpCircle, 
  Activity, 
  AlertCircle, 
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { ExamResult, ExamSettings } from '../types';

interface TeacherDashboardProps {
  onBackToLogin: () => void;
  localResults: ExamResult[];
  onClearLocalResults: () => void;
  settings: ExamSettings;
  onSaveSettings: (newSet: ExamSettings) => void;
  onImportMockRecords: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onBackToLogin,
  localResults,
  onClearLocalResults,
  settings,
  onSaveSettings,
  onImportMockRecords,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinCode, setPinCode] = useState('');
  const [pinError, setPinError] = useState('');

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortField, setSortField] = useState<'skorAkhir' | 'nama' | 'durasi' | 'pelanggaran'>('skorAkhir');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Apps Script Guide states
  const [showScriptGuide, setShowScriptGuide] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Settings customizer states
  const [scriptUrl, setScriptUrl] = useState(settings.googleAppsScriptUrl);
  const [duration, setDuration] = useState(settings.examDurationMinutes);
  const [maxViolations, setMaxViolations] = useState(settings.maxViolationsAllowed);
  const [isRandQ, setIsRandQ] = useState(settings.isRandomQuestion);
  const [isRandO, setIsRandO] = useState(settings.isRandomOption);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  useEffect(() => {
    setScriptUrl(settings.googleAppsScriptUrl);
    setDuration(settings.examDurationMinutes);
    setMaxViolations(settings.maxViolationsAllowed);
    setIsRandQ(settings.isRandomQuestion);
    setIsRandO(settings.isRandomOption);
  }, [settings]);

  // Default login pin is 'guru2026'
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === 'guru2026') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('PIN yang Anda masukkan salah. Gunakan PIN bawaan: "guru2026".');
    }
  };

  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      googleAppsScriptUrl: scriptUrl,
      examDurationMinutes: Number(duration),
      maxViolationsAllowed: Number(maxViolations),
      isRandomQuestion: isRandQ,
      isRandomOption: isRandO,
    });
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 3000);
  };

  const triggerCopyScriptCode = () => {
    const code = `/**
 * Google Apps Script Backend for TRY OUT TKA NUMERASI SMP 2026
 * 
 * deployment Panduan:
 * 1. Buka Google Sheets baru di akun Google anda.
 * 2. Klik menu 'Extensions' -> 'Apps Script'.
 * 3. Hapus seluruh kode bawaan ganti dengan seluruh kode di bawah ini.
 * 4. Klik tombol simpan (ikon Floppy disk).
 * 5. Klik 'Deploy' -> 'New deployment'.
 * 6. Pilih tipe 'Web app'.
 * 7. Konfigurasi: 
 *    - Description: TKA Numerasi Web App Backend
 *    - Execute as: Me (akun email anda)
 *    - Who has access: Anyone (Wajib diisi "Anyone" untuk CORS publik)
 * 8. Klik 'Deploy', setujui otorisasi akun.
 * 9. Salin URL Web App yang berakhiran '/exec' masukkan ke input pengaturan di dashboard ini.
 */

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: "running", message: "TKA Numerasi SMP 2026 Gas API is online." }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  // bypass CORS issues preflight
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Periksa apakah headers kosong atau belum diisi
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Tanggal",
        "Nama Siswa",
        "NISN",
        "Kelas",
        "Sekolah",
        "Skor Akhir",
        "Bilangan %",
        "Aljabar %",
        "Geometri %",
        "DataPeluang %",
        "Jumlah Benar",
        "Jumlah Salah",
        "Durasi Pengerjaan",
        "Jumlah Pelanggaran",
        "Status"
      ]);
    }
    
    sheet.appendRow([
      data.tanggal || new Date().toLocaleString(),
      data.nama,
      "'" + data.nisn, // beri tanda kutip agar diperlakukan sebagai teks nomor di Excel
      data.kelas,
      data.sekolah,
      data.skorAkhir,
      data.bilangan,
      data.aljabar,
      data.geometri,
      data.dataPeluang,
      data.jumlahBenar,
      data.jumlahSalah,
      data.durasiPengerjaan,
      data.jumlahPelanggaran,
      data.status
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", received: data.nama }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doOptions(e) {
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
}`;
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filtered and Sorted list
  const processedResults = React.useMemo(() => {
    let list = [...localResults];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(item => 
        item.nama.toLowerCase().includes(q) || 
        item.nisn.includes(q) || 
        item.sekolah.toLowerCase().includes(q)
      );
    }

    // Class filter
    if (classFilter) {
      list = list.filter(item => item.kelas === classFilter);
    }

    // Status filter
    if (statusFilter) {
      if (statusFilter === 'Curang') {
        list = list.filter(item => item.jumlahPelanggaran > settings.maxViolationsAllowed);
      } else {
        list = list.filter(item => item.jumlahPelanggaran <= settings.maxViolationsAllowed);
      }
    }

    // Sorting
    list.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      return sortOrder === 'asc' 
        ? valA - valB 
        : valB - valA;
    });

    return list;
  }, [localResults, searchQuery, classFilter, statusFilter, sortField, sortOrder, settings]);

  // General statistics
  const analyticsSummary = React.useMemo(() => {
    const results = processedResults;
    if (results.length === 0) return {
      avgScore: 0,
      totalCount: 0,
      cheaterCount: 0,
      perCategoryMastery: { Bilangan: 0, Aljabar: 0, Geometri: 0, DataPeluang: 0 }
    };

    let sum = 0;
    let cheatCount = 0;
    let sumBilangan = 0;
    let sumAljabar = 0;
    let sumGeometri = 0;
    let sumDataPeluang = 0;

    results.forEach(r => {
      sum += r.skorAkhir;
      if (r.jumlahPelanggaran > settings.maxViolationsAllowed) {
        cheatCount++;
      }
      sumBilangan += r.bilangan;
      sumAljabar += r.aljabar;
      sumGeometri += r.geometri;
      sumDataPeluang += r.dataPeluang;
    });

    const total = results.length;

    return {
      avgScore: Math.round(sum / total),
      totalCount: total,
      cheaterCount: cheatCount,
      perCategoryMastery: {
        Bilangan: Math.round(sumBilangan / total),
        Aljabar: Math.round(sumAljabar / total),
        Geometri: Math.round(sumGeometri / total),
        DataPeluang: Math.round(sumDataPeluang / total)
      }
    };
  }, [processedResults, settings]);

  // Export CSV (Excel format compliant)
  const handleExportCSV = () => {
    if (processedResults.length === 0) {
      alert('Tidak ada records untuk diekspor.');
      return;
    }

    let csvContent = '\uFEFF'; // BOM to support Excel UTF-8
    // Columns
    csvContent += 'No,Tanggal,Nama Siswa,NISN,Kelas,Sekolah,Skor Akhir,Bilangan %,Aljabar %,Geometri %,Data Peluang %,Jumlah Benar,Jumlah Salah,Durasi,Pelanggaran,Status\n';

    processedResults.forEach((r, index) => {
      const csvRow = [
        index + 1,
        `"${r.tanggal}"`,
        `"${r.nama}"`,
        `'${r.nisn}`, // text notation for excels
        `"${r.kelas}"`,
        `"${r.sekolah}"`,
        r.skorAkhir,
        `${r.bilangan}%`,
        `${r.aljabar}%`,
        `${r.geometri}%`,
        `${r.dataPeluang}%`,
        r.jumlahBenar,
        r.jumlahSalah,
        `"${r.durasiPengerjaan}"`,
        r.jumlahPelanggaran,
        r.jumlahPelanggaran > settings.maxViolationsAllowed ? 'Diskualifikasi (Curang)' : 'Valid (Selesai)'
      ];
      csvContent += csvRow.join(',') + '\n';
    });

    // Create blobs
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `TKA_Numerasi_2026_Rekap_${classFilter || 'Semua_Kelas'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF (optimized browser layout print)
  const handlePrintPDF = () => {
    window.print();
  };

  const toggleSort = (field: 'skorAkhir' | 'nama' | 'durasi' | 'pelanggaran') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 font-sans">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-7 rounded-xl shadow-xl border border-slate-200 max-w-sm w-full text-center"
        >
          <div className="bg-blue-100 text-blue-600 h-14 w-14 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Otorisasi Guru Admin</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Dashboard ini dikhususkan untuk rekap nilai dan admin sekolah. Masukkan PIN Akses keamanan.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                id="input_pin_guru"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="PIN Pengawas Guru (bawaan: guru2026)"
                className="w-full text-center px-4 py-2 border border-slate-300 rounded-lg font-mono text-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                required
              />
            </div>
            {pinError && (
              <p id="pin_error_msg" className="text-red-500 text-xs font-semibold text-center">{pinError}</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onBackToLogin}
                className="flex-1 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="submit"
                id="btn_submit_pin"
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-md transition-colors cursor-pointer"
              >
                Buka Kunci
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div id="teacher_dashboard_container" className="min-h-screen bg-slate-50 font-sans pb-12 print:bg-white print:pb-0">
      
      {/* Top Admin Header */}
      <header className="bg-slate-900 border-b-4 border-amber-400 text-white shadow-md print:hidden">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBackToLogin}
              className="p-2 hover:bg-slate-800 transition-colors rounded-lg text-slate-400 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">TRY OUT TKA NUMERASI 2026 Admin Panel</h1>
              <p className="text-[11px] text-slate-400 font-mono">PANEL PENGAWAS & REKAPITULASI DATA NILAI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScriptGuide(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="h-3.5 w-3.5 text-blue-400" />
              Sains apps Script (CORS)
            </button>
            <button
              onClick={onBackToLogin}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Keluar ke Ujian
            </button>
          </div>
        </div>
      </header>

      {/* Main dashboard space */}
      <main className="max-w-7xl mx-auto px-4 py-8 print:p-0 print:py-4">
        
        {/* Printable/PDF top banner representation */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 mb-6">
          <h1 className="text-2xl font-black uppercase text-slate-900">REKAPITULASI EVALUASI BELAJAR SISWA</h1>
          <h2 className="text-xl font-extrabold text-slate-700">TRY OUT TKA NUMERASI SMP TAHUN 2026</h2>
          <p className="text-xs text-slate-500 font-medium font-serif mt-1">
            Data Unduhan Laporan Resmi Guru Pengawas. Tanggal Cetak: {new Date().toLocaleDateString('id-ID')}
          </p>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 print:grid-cols-4 print:gap-2">
          {/* Total Siswa */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Total Partisipan</p>
              <p id="stat_total_partisipan" className="text-2xl font-black text-slate-800">{analyticsSummary.totalCount}</p>
              <p className="text-[10px] text-slate-400">Siswa Kelas IX Terdata</p>
            </div>
          </div>

          {/* Rata-Rata Nilai */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Rataan Nilai Kelas</p>
              <p id="stat_rata_rata" className="text-2xl font-black text-slate-800">{analyticsSummary.avgScore} <span className="text-sm font-bold text-slate-400">/100</span></p>
              <p className="text-[10px] text-emerald-600 font-semibold">Predikat: {analyticsSummary.avgScore >= 80 ? 'Baik / Sangat Baik' : 'Cukup'}</p>
            </div>
          </div>

          {/* Indeks Pelanggaran */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4">
            <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Diskualifikasi / Rawan</p>
              <p id="stat_pelanggaran_total" className="text-2xl font-black text-slate-800">{analyticsSummary.cheaterCount} <span className="text-sm font-medium text-slate-400">Siswa</span></p>
              <p className="text-[10px] text-rose-500 font-medium">Batas Toleransi: {settings.maxViolationsAllowed}x Pindah Tab</p>
            </div>
          </div>

          {/* Integrasi Status */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200 flex items-center gap-4 print:hidden">
            <div className="h-12 w-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Url API GAS</p>
              <p className="text-sm font-extrabold text-slate-800 truncate max-w-[150px]">
                {settings.googleAppsScriptUrl ? 'SINKRON ONLINE' : 'MODE LOKAL'}
              </p>
              <p className="text-[10px] text-slate-400">Klik setting manual kustom</p>
            </div>
          </div>
        </div>

        {/* DETAILED TOPIC SUMMARY RECAPPING */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 mb-8 print:border-none print:shadow-none print:px-0">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 print:text-xs">
            <BarChart4 className="h-4 w-4 text-blue-600" />
            Rekap Rataan Penguasaan Per-Kategori Materi Siswa (Dalam %)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-center">
              <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">1. Bilangan</p>
              <p id="recap_bilangan" className="text-2xl font-black text-blue-900 mt-1">{analyticsSummary.perCategoryMastery.Bilangan}%</p>
            </div>
            <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-center">
              <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">2. Aljabar</p>
              <p id="recap_aljabar" className="text-2xl font-black text-emerald-900 mt-1">{analyticsSummary.perCategoryMastery.Aljabar}%</p>
            </div>
            <div className="bg-violet-50/50 p-4 rounded-lg border border-violet-100 text-center">
              <p className="text-[11px] font-bold text-violet-800 uppercase tracking-wide">3. Geometri</p>
              <p id="recap_geometri" className="text-2xl font-black text-violet-900 mt-1">{analyticsSummary.perCategoryMastery.Geometri}%</p>
            </div>
            <div className="bg-amber-50/50 p-4 rounded-lg border border-amber-100 text-center">
              <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">4. Data & Peluang</p>
              <p id="recap_datapeluang" className="text-2xl font-black text-amber-900 mt-1">{analyticsSummary.perCategoryMastery.DataPeluang}%</p>
            </div>
          </div>
        </div>

        {/* CONTROLS BAR: SEARCH, FILTERS, EXPORT */}
        <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200 mb-6 flex flex-col md:flex-row justify-between gap-4 print:hidden">
          {/* Left search */}
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NISN, atau asal sekolah..."
                className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
              />
            </div>

            {/* Filter Kelas */}
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
            >
              <option value="">Semua Kelas</option>
              <option value="IX-A">Kelas IX-A</option>
              <option value="IX-B">Kelas IX-B</option>
              <option value="IX-C">Kelas IX-C</option>
              <option value="IX-D">Kelas IX-D</option>
              <option value="IX-E">Kelas IX-E</option>
              <option value="IX-F">Kelas IX-F</option>
              <option value="IX-G">Kelas IX-G</option>
              <option value="Lainnya">Lainnya</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-slate-200 bg-white rounded-lg text-sm"
            >
              <option value="">Semua Kehadiran</option>
              <option value="Valid">Peserta Valid</option>
              <option value="Curang">Didiskualifikasi (Curang)</option>
            </select>
          </div>

          {/* Exporters and mock insertions */}
          <div className="flex flex-wrap items-center gap-2">
            
            {localResults.length === 0 && (
              <button
                onClick={onImportMockRecords}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
              >
                + Inject 5 Siswa Demo
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileDown className="h-4 w-4" />
              Sains MS Excel (CSV)
            </button>
            
            <button
              onClick={handlePrintPDF}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileDown className="h-4 w-4" />
              Cetak / Ekspor PDF
            </button>

            {localResults.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Yakin ingin mereset/menghapus seluruh database nilai di PC pengawas ini?')) {
                    onClearLocalResults();
                  }
                }}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-lg text-xs cursor-pointer transition-colors"
                title="Hapus penyimpanan lokal"
              >
                Reset DB Lokal
              </button>
            )}
          </div>
        </div>

        {/* LIST TABLE PARTICIPANTS STATE */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden print:border-none print:shadow-none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 print:bg-slate-100">
                <tr className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">
                  <th className="px-4 py-3 text-center">Rank</th>
                  <th className="px-4 py-3 cursor-pointer select-none" onClick={() => toggleSort('nama')}>
                    Nama Siswa {sortField === 'nama' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3">NISN</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Sekolah</th>
                  <th className="px-4 py-3 text-center cursor-pointer select-none" onClick={() => toggleSort('skorAkhir')}>
                    Nilai Akhir {sortField === 'skorAkhir' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-center print:hidden">Bil%</th>
                  <th className="px-4 py-3 text-center print:hidden">Alj%</th>
                  <th className="px-4 py-3 text-center print:hidden">Geo%</th>
                  <th className="px-4 py-3 text-center print:hidden">Plo%</th>
                  <th className="px-4 py-3 text-center cursor-pointer select-none" onClick={() => toggleSort('durasi')}>
                    Durasi {sortField === 'durasi' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-center cursor-pointer select-none" onClick={() => toggleSort('pelanggaran')}>
                    Pelanggaran {sortField === 'pelanggaran' && (sortOrder === 'asc' ? '▲' : '▼')}
                  </th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody id="student_scores_tbody" className="divide-y divide-slate-100 text-slate-700">
                {processedResults.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-8 text-xs text-slate-400 font-medium">
                      Belum ada laporan lembar jawaban siswa yang terekam dalam filter ini.
                    </td>
                  </tr>
                ) : (
                  processedResults.map((r, index) => {
                    const isCheated = r.jumlahPelanggaran > settings.maxViolationsAllowed;
                    
                    return (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 text-center font-bold font-mono text-slate-500">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-900">
                          {r.nama}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-slate-600">
                          {r.nisn}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {r.kelas}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {r.sekolah}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black font-mono inline-block ${
                            r.skorAkhir >= 90 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            r.skorAkhir >= 80 ? 'bg-blue-50 text-blue-750 border border-blue-250' :
                            r.skorAkhir >= 70 ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-red-50 text-red-700 border border-red-200'
                          }`}>
                            {r.skorAkhir}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-xs text-slate-600 print:hidden">
                          {r.bilangan}%
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-xs text-slate-600 print:hidden">
                          {r.aljabar}%
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-xs text-slate-600 print:hidden">
                          {r.geometri}%
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-xs text-slate-600 print:hidden">
                          {r.dataPeluang}%
                        </td>
                        <td className="px-4 py-3 text-center text-xs whitespace-nowrap">
                          {r.durasiPengerjaan}
                        </td>
                        <td className="px-4 py-3 text-center font-bold font-mono text-xs">
                          <span className={r.jumlahPelanggaran > 0 ? 'text-red-500' : 'text-slate-400'}>
                            {r.jumlahPelanggaran}x
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCheated 
                              ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}>
                            {isCheated ? 'Diskualifikasi' : 'Valid'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SETTINGS AND CONFIG CONTROL BOX */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 print:hidden">
          
          {/* Settings Form */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5 border-b pb-2">
              <Settings className="h-4 w-4 text-blue-600" />
              Sistem Konfigurasi Try Out
            </h3>

            <form onSubmit={handleSaveSettingsSubmit} className="space-y-4">
              {/* Web App URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Google Apps Script Web App URL
                </label>
                <input
                  type="url"
                  value={scriptUrl}
                  onChange={(e) => setScriptUrl(e.target.value)}
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono outline-none focus:ring-1 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Opsional. Masukkan URL Web App hasil deployment script Google Apps Anda untuk synchronizing data otomatis.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Durasi Pengerjaan (Menit)
                  </label>
                  <input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    min={5}
                    max={360}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold outline-none"
                    required
                  />
                </div>

                {/* Max Violations */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                    Maks Pelanggaran Pindah Tab
                  </label>
                  <input
                    type="number"
                    value={maxViolations}
                    onChange={(e) => setMaxViolations(Number(e.target.value))}
                    min={1}
                    max={10}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-bold outline-none"
                    required
                  />
                </div>
              </div>

              {/* Shuffling configs */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Randomisasi Peserta
                </label>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRandQ}
                      onChange={(e) => setIsRandQ(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Acak Urutan Soal 1 - 40 untuk setiap peserta
                  </label>
                  
                  <label className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isRandO}
                      onChange={(e) => setIsRandO(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    Acak Pilihan Ganda Jawaban (A, B, C, D) per peserta
                  </label>
                </div>
              </div>

              {settingsSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-750 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  Konfigurasi berhasil disimpan!
                </div>
              )}

              <button
                type="submit"
                id="btn_save_settings"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold rounded-lg text-xs shadow-md cursor-pointer"
              >
                Simpan Konfigurasi
              </button>
            </form>
          </div>

          {/* Quick Info Guides */}
          <div className="bg-slate-800 text-slate-200 p-6 rounded-xl border border-slate-700 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4 text-amber-400" />
                Cara Kerja Anti-Curang Terpasang
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                Sistem secara berkala mengecek fokus frame browser pengerjaan ujian. 
                Apabila siswa **membuka tab baru, meminimalkan browser, menekan tombol alt-tab, atau keluar dari modus tampilan layar penuh**, sistem akan seketika membekukan lembar soal dan menayangkan popup tanda peringatan pelanggaran.
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Apabila jumlah indeks pelanggaran melebihi batas toleransi yaitu **{settings.maxViolationsAllowed} kali**, lembar jawaban siswa akan **otomatis terkunci dan tersubmit langsung** dengan stempel status **Dikeluarkan (Curang)**.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-[10px] text-slate-400 font-mono tracking-wide uppercase">
                SECURITY LOGIC VERSI v2.06
              </span>
              <button
                onClick={onBackToLogin}
                className="w-full sm:w-auto px-4 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg text-xs cursor-pointer text-center"
              >
                Kembali ke Portal Login
              </button>
            </div>
          </div>

        </div>

      </main>

      {/* SCRIPT INSTALLATION DOCUMENTATION MODAL OVERLAY */}
      {showScriptGuide && (
        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto print:hidden">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl shadow-2xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start pb-4 border-b border-slate-200 mb-4">
              <div>
                <h3 className="text-lg font-black text-slate-900">Integrasi Google Apps Script (GAS)</h3>
                <p className="text-xs text-slate-500 font-medium">Langkah menghubungkan Try Out ke Google Spreadsheet Sekolah</p>
              </div>
              <button 
                onClick={() => setShowScriptGuide(false)}
                className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded font-bold text-xs"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 font-sans text-xs text-slate-700">
              <ol className="list-decimal pl-5 space-y-2 text-slate-600 leading-relaxed">
                <li>Buka Google Drive Anda, lalu buat sebuah **Google Spreadsheet** baru dengan judul: <span className="font-bold underline text-blue-600">"Hasil Try Out TKA Numerasi 2026"</span>.</li>
                <li>Pada bilah menu Spreadsheet tersebut, pilih menu <span className="font-bold text-slate-800">Extensions (Ekstensi)</span> kemudian klik <span className="font-bold text-slate-800">Apps Script</span>.</li>
                <li>Hapus template fungsi default <code className="bg-slate-100 font-mono text-rose-500 p-0.5 rounded">myFunction()</code> yang muncul di dalam editor Apps Script.</li>
                <li>Salin seluruh blok kode script backend di bawah ini dan tempelkan *(paste)* sepenuhnya ke halaman editor tersebut.</li>
              </ol>

              {/* Copyable script code block */}
              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 font-mono font-normal text-[10px] relative">
                <button
                  onClick={triggerCopyScriptCode}
                  className="absolute right-3 top-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold p-1 px-2.5 rounded text-[10px] flex items-center gap-1 transition-all"
                >
                  {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  {isCopied ? 'Tersalin' : 'Salin Kode'}
                </button>
                <p className="text-slate-400 border-b border-slate-800 pb-2 mb-2 font-bold uppercase tracking-wider text-[9px]">Google Apps Script code (GAS)</p>
                <pre className="max-h-48 overflow-y-auto whitespace-pre scrollbar-thin">
{`function doPost(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Tanggal", "Nama Siswa", "NISN", "Kelas", "Sekolah", 
        "Skor Akhir", "Bilangan %", "Aljabar %", "Geometri %", 
        "DataPeluang %", "Jumlah Benar", "Jumlah Salah", 
        "Durasi Pengerjaan", "Jumlah Pelanggaran", "Status"
      ]);
    }
    sheet.appendRow([
      data.tanggal || new Date().toLocaleString(),
      data.nama,
      "'" + data.nisn,
      data.kelas,
      data.sekolah,
      data.skorAkhir,
      data.bilangan,
      data.aljabar,
      data.geometri,
      data.dataPeluang,
      data.jumlahBenar,
      data.jumlahSalah,
      data.durasiPengerjaan,
      data.jumlahPelanggaran,
      data.status
    ]);
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}`}
                </pre>
              </div>

              <ol className="list-decimal pl-5 space-y-2 text-slate-600 leading-relaxed" start={5}>
                <li>Klik tombol <span className="font-bold text-slate-800">Save (Simpan)</span> dengan ikon disket di atas editor.</li>
                <li>Klik tombol biru bernama <span className="font-bold text-blue-600">Deploy (Terapkan)</span> pada bagian atas kanan editor, lalu pilih <span className="font-bold text-slate-800">New deployment (Penerapan baru)</span>.</li>
                <li>Klik tombol gerigi di samping 'Select type', pastikan memilih tipe <span className="transparent font-bold text-slate-800">Web app</span>.</li>
                <li>Ubah setelan otorisasi akses:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li><span className="font-bold">Execute as:</span> Me (pilih akun Gmail Anda)</li>
                    <li><span className="font-bold">Who has access:</span> <span className="text-rose-600 font-extrabold underline">Anyone</span></li>
                  </ul>
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">
                    *Catatan: Sangat penting memilih "Anyone" agar siswa dari koneksi internet manapun dapat mencatatkan skor tanpa bentrok login Google.
                  </p>
                </li>
                <li>Klik <span className="font-bold bg-blue-100 text-blue-700 px-1 rounded">Deploy</span>. Setujui permintaan perizinan akun Google jika muncul.</li>
                <li>Salin alamat tautan **Web App URL** yang tampil di box terakhir (berakhiran <code className="bg-slate-100 p-0.5 rounded">/exec</code>).</li>
                <li>Tempelkan tautan tersebut ke kolom input **"Google Apps Script Web App URL"** di halaman dashboard ini, lalu klik **Simpan Konfigurasi**.</li>
              </ol>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-[11px] text-blue-800 font-medium">
                Kini, setiap kali siswa menekan tombol "Selesai Ujian", hasil kerja mereka beserta skor persentase sub-materi akan seketika tercatat rapi di Google Sheets Anda secara real-time!
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-6 flex justify-end">
              <button
                onClick={() => setShowScriptGuide(false)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
              >
                Saya Mengerti & Selesai
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
