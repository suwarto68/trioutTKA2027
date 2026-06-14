/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  CornerDownRight, 
  AlertTriangle, 
  LogOut, 
  BarChart3, 
  HelpCircle,
  Clock,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Image
} from 'lucide-react';
import { Student, Question, ExamResult } from '../types';
import { QuestionSvg } from './QuestionSvg';
import { gradeQuestionAnswer, isQuestionAnswered } from '../utils/examHelper';

interface ResultScreenProps {
  student: Student;
  questions: Question[];
  userAnswers: Record<number, any>;
  violations: number;
  durationString: string;
  onFinished: () => void;
  onSubmitToSpreadsheet: (res: ExamResult) => Promise<boolean>;
}

const BASE_SVG_WIDTHS: Record<string, number> = {
  'kulkas': 150,
  'martabak': 150,
  'diskon': 140,
  'peta': 280,
  'bakteri': 150,
  'sel-mikroskop': 150,
  'mercusuar': 160,
  'jembatan-maket': 200,
  'roti-gandum': 150,
  'diskon-ganda': 180,
  'paket-atk': 150,
  'taman-bunga': 180,
  'truk-cargo': 170,
  'lift-barang': 150,
  'pelajaran-pilihan': 180,
  'taksi': 260,
  'grafik-kursi': 280,
  'korek': 240,
  'kedai-mie': 150,
  'peternakan-kambing-ayam': 150,
  'lapangan-futsal': 180,
  'botol-handsanitizer': 150,
  'sudut-jembatan': 240,
  'taman-segitiga': 160,
  'ubin-aula': 150,
  'bayangan-pohon': 200,
  'jendela-trapesium': 170,
  'tiang-antena': 150,
  'sepeda-gunung': 150,
  'bak-mandi': 160,
  'prisma-gazebo': 155,
  'bangun-3d': 150,
  'pelayaran-kapal': 170,
  'pigura-foto': 140,
  'tim-basket': 160,
  'nilai-matematika': 190,
  'diagram-hobi': 140,
  'kelereng-wadah': 140,
  'persentase-ekskul': 140,
  'grafik-panen': 280,
};

export const ResultScreen: React.FC<ResultScreenProps> = ({
  student,
  questions,
  userAnswers,
  violations,
  durationString,
  onFinished,
  onSubmitToSpreadsheet,
}) => {
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number>(0);
  const [spreadsheetSuccess, setSpreadsheetSuccess] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(true);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [reviewZoom, setReviewZoom] = useState<number>(100);

  const handleUnlockReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'guru2026') {
      setIsAdminUnlocked(true);
      setPasswordError('');
    } else {
      setPasswordError('Password salah! Pembahasan dilindungi kode akses admin.');
    }
  };

  // Calculate scores
  const resultsInfo = React.useMemo(() => {
    let totalScore = 0;
    let maxPossibleScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    // Material categories scores
    const categoryTotals: Record<string, { earned: number; max: number }> = {
      Bilangan: { earned: 0, max: 0 },
      Aljabar: { earned: 0, max: 0 },
      Geometri: { earned: 0, max: 0 },
      DataPeluang: { earned: 0, max: 0 },
    };

    questions.forEach((q) => {
      const earned = gradeQuestionAnswer(q, userAnswers[q.id]);
      totalScore += earned;
      maxPossibleScore += q.scoreWeight;

      const fullyAnswered = isQuestionAnswered(q, userAnswers[q.id]);
      if (earned === q.scoreWeight) {
        correctCount++;
      } else {
        wrongCount++;
      }

      const catKey = q.category;
      if (categoryTotals[catKey]) {
        categoryTotals[catKey].earned += earned;
        categoryTotals[catKey].max += q.scoreWeight;
      }
    });

    const finalScore = Math.round((totalScore / maxPossibleScore) * 100);

    // Categories ranges
    let kategori = 'Perlu Pembinaan';
    let brandColor = 'text-red-600 bg-red-50 border-red-200';
    let barColor = 'bg-red-500';

    if (finalScore >= 90) {
      kategori = 'Sangat Baik';
      brandColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
      barColor = 'bg-emerald-600';
    } else if (finalScore >= 80) {
      kategori = 'Baik';
      brandColor = 'text-blue-600 bg-blue-50 border-blue-200';
      barColor = 'bg-blue-600';
    } else if (finalScore >= 70) {
      kategori = 'Cukup';
      brandColor = 'text-amber-600 bg-amber-50 border-amber-200';
      barColor = 'bg-amber-500';
    }

    const mastery: Record<string, number> = {};
    Object.keys(categoryTotals).forEach((key) => {
      mastery[key] = categoryTotals[key].max > 0 
        ? Math.round((categoryTotals[key].earned / categoryTotals[key].max) * 100) 
        : 0;
    });

    return {
      finalScore,
      kategori,
      brandColor,
      barColor,
      correctCount,
      wrongCount,
      mastery,
    };
  }, [questions, userAnswers]);

  useEffect(() => {
    // Fire confetti for High Achievers (score >= 70)
    if (resultsInfo.finalScore >= 70) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2563eb', '#10b981', '#facc15', '#ef4444', '#8b5cf6'],
      });
    }

    // Submit results automatically to spreadsheet
    const runSubmission = async () => {
      const res: ExamResult = {
        id: `TO-${Date.now()}-${student.nisn}`,
        tanggal: new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        nama: student.nama,
        nisn: student.nisn,
        kelas: student.kelas,
        sekolah: student.sekolah,
        skorAkhir: resultsInfo.finalScore,
        bilangan: resultsInfo.mastery['Bilangan'],
        aljabar: resultsInfo.mastery['Aljabar'],
        geometri: resultsInfo.mastery['Geometri'],
        dataPeluang: resultsInfo.mastery['DataPeluang'],
        jumlahBenar: resultsInfo.correctCount,
        jumlahSalah: resultsInfo.wrongCount,
        durasiPengerjaan: durationString,
        jumlahPelanggaran: violations,
        status: violations > 3 ? 'Dikeluarkan (Curang)' : 'Selesai',
      };

      try {
        const success = await onSubmitToSpreadsheet(res);
        setSpreadsheetSuccess(success);
      } catch (err) {
        setSpreadsheetSuccess(false);
      } finally {
        setIsSubmitting(false);
      }
    };

    runSubmission();
  }, [student, resultsInfo, violations, durationString]);

  const activeQuestion = questions[selectedReviewIdx];
  const activeAnswer = userAnswers[activeQuestion?.id];
  const earnedScore = activeQuestion ? gradeQuestionAnswer(activeQuestion, activeAnswer) : 0;
  const isCorrect = activeQuestion ? earnedScore === activeQuestion.scoreWeight : false;

  const lowestMasteryArea = React.useMemo(() => {
    const list = Object.entries(resultsInfo.mastery) as [string, number][];
    list.sort((a, b) => a[1] - b[1]);
    return list[0];
  }, [resultsInfo.mastery]);

  const getMentoringAdvice = (category: string) => {
    switch (category) {
      case 'Bilangan':
        return 'Fokuslah meningkatkan pemahaman pada konsep pecahan, perbandingan skala, dan pengoperasian bilangan kompleks / bilangan berpangkat.';
      case 'Aljabar':
        return 'Pelajari lebih dalam perumusan sistem persamaan dua variabel (SPLDV) dan relasi pemodelan grafik fungsi matematis.';
      case 'Geometri':
        return 'Ulas kembali Teorema Pythagoras, formula kesebangunan trapesium/segitiga, serta penentuan luas permukaan bangun ruang lengkung.';
      case 'DataPeluang':
        return 'Pertajam kemampuan mengolah analisis statistika nilai tengah (median), peluang pengambilan acak, dan penguraian infografis.';
      default:
        return 'Pertahankan performa belajarmu dengan terus konsisten mengerjakan latihan bank soal numerasi.';
    }
  };

  return (
    <div id="result_screen" className="min-h-screen bg-slate-50 font-sans pb-12">
      {/* Top Elegant Banner */}
      <div className="bg-blue-600 text-white py-10 px-4 shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <span className="bg-blue-700 text-amber-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              Laporan Evaluasi Simulasi
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              HASIL TRY OUT TKA NUMERASI 2026
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              Ujian berbasis komputer telah diselesaikan. Seluruh lembar jawaban siswa telah dinilai secara otomatis dan terunggah ke sistem pusat.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-blue-700/50 backdrop-blur-xs p-4 rounded-xl border border-blue-500/30">
            <Clock className="h-10 w-10 text-amber-300" />
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-blue-200">Waktu Pengerjaan</p>
              <p className="text-lg font-extrabold">{durationString}</p>
              <p className="text-[10px] text-blue-200">{violations > 0 ? `${violations}x Pelanggaran` : 'Bebas Pelanggaran'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile and Main Scores */}
        <div className="lg:col-span-4 space-y-6">
          {/* Student Profile Card */}
          <div className="bg-white p-5 rounded-xl shadow-xs border border-slate-200">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
              Identitas Peserta
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Nama Lengkap</p>
                <p className="text-sm font-black text-slate-800">{student.nama}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">NISN</p>
                  <p className="text-sm font-mono font-bold text-slate-700">{student.nisn}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Kelas</p>
                  <p className="text-sm font-bold text-slate-700">{student.kelas}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Asal Sekolah</p>
                <p className="text-sm font-semibold text-slate-700">{student.sekolah}</p>
              </div>
            </div>
          </div>

          {/* Core Score Circle */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200 text-center flex flex-col items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Perolehan Nilai Akhir
            </h3>
            
            {/* Circular representation */}
            <div className="relative w-40 h-40 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="80" 
                  cy="80" 
                  r="72" 
                  stroke="#f1f5f9" 
                  strokeWidth="12" 
                  fill="transparent" 
                />
                <circle 
                  cx="80" 
                  cy="80" 
                  r="72" 
                  stroke={resultsInfo.finalScore >= 90 ? '#10b981' : resultsInfo.finalScore >= 80 ? '#2563eb' : resultsInfo.finalScore >= 70 ? '#f59e0b' : '#ef4444'} 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 * (1 - resultsInfo.finalScore / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-slate-800 font-mono">{resultsInfo.finalScore}</span>
                <span className="text-[11px] text-slate-400 uppercase font-bold">skala 100</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-lg border text-sm font-bold w-full ${resultsInfo.brandColor}`}>
              Predikat: {resultsInfo.kategori}
            </div>

            {/* Quick counters */}
            <div className="grid grid-cols-2 gap-4 w-full mt-6 pt-6 border-t border-slate-100">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-bold">Benar</span>
                </div>
                <span className="text-xl font-black text-slate-800">{resultsInfo.correctCount} Soal</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-rose-500 font-bold mb-1">
                  <XCircle className="h-4 w-4" />
                  <span className="text-sm font-bold font-sans">Salah</span>
                </div>
                <span className="text-xl font-black text-slate-800">{resultsInfo.wrongCount} Soal</span>
              </div>
            </div>
          </div>

          {/* Database upload status */}
          <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-200">
            <h4 className="text-xs font-bold text-slate-500 mb-2">Sinkronisasi Cloud Spreadsheet:</h4>
            {isSubmitting ? (
              <div className="flex items-center gap-2 text-xs text-blue-600 font-semibold">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                Menyimpan hasil ke Google Sheets...
              </div>
            ) : spreadsheetSuccess ? (
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg text-[11px] text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                Data berhasil disinkronkan ke Spreadsheet Guru!
              </div>
            ) : (
              <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-700 font-medium flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <span className="font-bold">Mode Lokal Aktif</span>
                </div>
                <p className="text-[10px] text-slate-500">
                  Data disimpan secara lokal di browser. Integrasi Spreadsheet dapat dikonfigurasi melalui menu setting admin.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Topic Analytics and Question Reviews */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Topic mastery bar chart */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              Persentase Penguasaan Materi Numerasi
            </h3>

            <div className="space-y-4">
              {/* Bilangan */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>1. Bilangan (10 Soal)</span>
                  <span className="text-blue-600 font-bold">{resultsInfo.mastery['Bilangan']}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${resultsInfo.mastery['Bilangan']}%` }}
                  ></div>
                </div>
              </div>

              {/* Aljabar */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>2. Aljabar (12 Soal)</span>
                  <span className="text-blue-600 font-bold">{resultsInfo.mastery['Aljabar']}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${resultsInfo.mastery['Aljabar']}%` }}
                  ></div>
                </div>
              </div>

              {/* Geometri */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>3. Geometri dan Pengukuran (12 Soal)</span>
                  <span className="text-blue-600 font-bold">{resultsInfo.mastery['Geometri']}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 rounded-full"
                    style={{ width: `${resultsInfo.mastery['Geometri']}%` }}
                  ></div>
                </div>
              </div>

              {/* Data Peluang */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>4. Data dan Peluang (6 Soal)</span>
                  <span className="text-blue-600 font-bold">{resultsInfo.mastery['DataPeluang']}%</span>
                </div>
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${resultsInfo.mastery['DataPeluang']}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Smart mentoring advice */}
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-xl p-4 mt-6">
              <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                <Award className="h-4 w-4" />
                Rekomendasi Peningkatan Belajar
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Bidang penguasaan terendah Anda berada di kategori <span className="font-bold text-blue-700">{lowestMasteryArea[0]} ({lowestMasteryArea[1]}%)</span>. 
                {getMentoringAdvice(lowestMasteryArea[0])}
              </p>
            </div>
          </div>

          {/* Interactive Question Feedback / Reviewer */}
          <div className="bg-white p-6 rounded-xl shadow-xs border border-slate-200">
            {!isAdminUnlocked ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="bg-amber-50 text-amber-600 p-4 rounded-full mb-4 border border-amber-200 animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-base font-black text-slate-800 mb-1">
                  Ulas Jawaban Lembar Soal Terkunci
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mb-5 leading-relaxed font-medium">
                  Fitur pembahasan ini tersembunyi. Silakan hubungi Guru/Proktor untuk memasukkan password admin guna membuka ulasan jawaban dan lembar soal matematika.
                </p>
                <form onSubmit={handleUnlockReview} className="w-full max-w-xs space-y-3">
                  <div>
                    <input
                      type="password"
                      placeholder="Masukkan Password Admin (guru2026)"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold tracking-wide placeholder:font-medium text-center"
                      id="input_admin_password"
                    />
                  </div>
                  {passwordError && (
                    <p className="text-[11px] text-rose-500 font-bold bg-rose-50 border border-rose-100 py-1.5 px-3 rounded" id="txt_password_error">
                      {passwordError}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
                    id="btn_unlock_review"
                  >
                    Buka Pembelian Jawaban
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-emerald-600" />
                    Ulas Jawaban Lembar Soal (1 s.d. 40)
                  </h3>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Akses Admin Aktif. Silakan ulas pembahasan matematika di bawah ini.
                  </span>
                </div>

                {/* Grid numbers selector */}
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mb-6">
                  {questions.map((q, idx) => {
                    const isCorrectAns = gradeQuestionAnswer(q, userAnswers[q.id]) === q.scoreWeight;
                    const active = selectedReviewIdx === idx;
                    
                    return (
                      <button
                        key={`rev-${q.id}`}
                        onClick={() => setSelectedReviewIdx(idx)}
                        id={`btn_review_no_${q.id}`}
                        className={`h-9 rounded-lg font-bold text-xs font-mono transition-all flex flex-col items-center justify-center relative cursor-pointer outline-none border ${
                          active 
                            ? 'ring-2 ring-blue-500 ring-offset-1 z-10 scale-110' 
                            : ''
                        } ${
                          isCorrectAns 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        <span>{idx + 1}</span>
                        <span className="text-[8px] absolute bottom-0.5">
                          {isCorrectAns ? '✔' : '✘'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Question Detail Drawer */}
                {activeQuestion && (
                  <motion.div
                    key={activeQuestion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3 mb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded font-mono">
                          SOAL NO {selectedReviewIdx + 1}
                        </span>
                        <span className="bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                          {activeQuestion.category}
                        </span>
                      </div>
                      <span className="text-slate-500 font-semibold italic text-[11px]">
                        Sub-Materi: {activeQuestion.materi}
                      </span>
                    </div>

                    {/* Stimulus */}
                    <div className="mb-4 bg-white border border-slate-200 rounded-lg p-4 max-h-80 overflow-y-auto shadow-2xs scrollbar-thin">
                      <h4 className="text-xs font-black text-blue-600 uppercase mb-2">STIMULUS: {activeQuestion.stimulusTitle}</h4>
                      <p className="text-xs text-slate-700 tracking-wide leading-relaxed font-sans whitespace-pre-line mb-3">
                        {activeQuestion.stimulusContent}
                      </p>
                      
                      {activeQuestion.stimulusTable && (
                        <div className="overflow-x-auto mb-3">
                          <table className="min-w-full divide-y divide-slate-200 text-[11px] text-slate-700">
                            <thead>
                              <tr className="bg-slate-100 font-bold">
                                {activeQuestion.stimulusTable[0].map((th, i) => (
                                  <th key={i} className="px-3 py-1.5 text-left border-b border-slate-200">{th}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {activeQuestion.stimulusTable.slice(1).map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  {row.map((td, i) => (
                                    <td key={i} className="px-3 py-1.5 border-b border-slate-100">{td}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {activeQuestion.stimulusSvgType && (
                        <div className="my-3 border border-slate-200/60 rounded-xl p-3 bg-slate-50/50">
                          <div className="flex items-center justify-between mb-2 text-slate-500">
                            <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1 font-sans">
                              <Image className="h-3 w-3 text-emerald-600" /> Ilustrasi Gambar
                            </span>
                            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => setReviewZoom(prev => Math.max(50, prev - 25))}
                                className="p-0.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                title="Perkecil Gambar"
                              >
                                <ZoomOut className="h-3 w-3" />
                              </button>
                              <span className="text-[9px] font-extrabold font-mono px-1 min-w-[30px] text-center text-slate-600">
                                {reviewZoom}%
                              </span>
                              <button
                                type="button"
                                onClick={() => setReviewZoom(prev => Math.min(250, prev + 25))}
                                className="p-0.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                                title="Perbesar Gambar"
                              >
                                <ZoomIn className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReviewZoom(100)}
                                className="px-1.5 py-0.5 hover:bg-slate-100 rounded-md text-slate-500 hover:text-slate-800 transition-colors text-[8px] font-bold uppercase cursor-pointer"
                                title="Reset Ukuran"
                              >
                                Reset
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-center items-center overflow-auto p-1" style={{ width: '100%' }}>
                            <div 
                              className="transition-all duration-150 ease-out" 
                              style={{ 
                                width: '100%', 
                                maxWidth: `${(BASE_SVG_WIDTHS[activeQuestion.stimulusSvgType] || 180) * (reviewZoom / 100)}px` 
                              }}
                            >
                              <QuestionSvg type={activeQuestion.stimulusSvgType} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Question */}
                    <div className="mb-4">
                      <h4 className="text-xs font-black text-slate-500 uppercase mb-1">PERTANYAAN:</h4>
                      <p className="text-sm font-bold text-slate-800 leading-snug">{activeQuestion.questionText}</p>
                    </div>

                    {/* Your answer comparison */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-200/60 mt-3 text-xs">
                      
                      {/* Student answer */}
                      <div className="bg-white p-3.5 rounded-lg border border-slate-200">
                        <p className="font-bold text-slate-500 uppercase tracking-widest text-[9px] mb-2">Jawaban Siswa Anda:</p>
                        {activeQuestion.type === 'PGS' ? (
                          <div>
                            {activeAnswer !== undefined ? (
                              <div className="flex items-start gap-2">
                                <span className={`p-1 rounded-full ${isCorrect ? 'text-emerald-700 bg-emerald-50' : 'text-rose-600 bg-rose-50'}`}>
                                  {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                </span>
                                <div>
                                  <p className="font-semibold text-slate-800">{activeQuestion.options?.[activeAnswer]}</p>
                                  <span className={`text-[10px] font-bold ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}`}>
                                    {isCorrect ? 'Kunci Benar (Skor 1.0)' : 'Jawaban Salah (Skor 0.0)'}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-400 italic">Peserta tidak mengisi lembar jawaban.</p>
                            )}
                          </div>
                        ) : activeQuestion.type === 'MCMA' ? (
                          <div>
                            {activeAnswer && activeAnswer.length > 0 ? (
                              <div className="space-y-1.5">
                                {activeQuestion.options?.map((opt, oIdx) => {
                                  const checked = (activeAnswer as number[]).includes(oIdx);
                                  const isOptionCorr = (activeQuestion.correctAnswer as number[]).includes(oIdx);
                                  
                                  return (
                                    <div key={oIdx} className="flex items-center gap-2 text-slate-700 text-[11px]">
                                      <input type="checkbox" checked={checked} disabled className="rounded text-blue-600" />
                                      <span className={checked ? 'font-semibold text-slate-800' : 'text-slate-400'}>
                                        {opt}
                                      </span>
                                      {checked && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${isOptionCorr ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'}`}>
                                          {isOptionCorr ? 'Pilihan Tepat' : 'Salah Klik'}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                                <div className="pt-2 text-[10px] font-bold text-blue-600">
                                  Skor Proporsional Diperoleh: {earnedScore.toFixed(2)} / 1.0
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-400 italic">Peserta tidak mengisi lembar jawaban.</p>
                            )}
                          </div>
                        ) : (
                          // KATEGORI
                          <div>
                            {activeAnswer && (activeAnswer as string[]).length > 0 ? (
                              <div className="space-y-2">
                                {activeQuestion.statements?.map((stmt, sIdx) => {
                                  const stdAns = (activeAnswer as string[])[sIdx];
                                  const isStmtCorr = stdAns === (activeQuestion.correctAnswer as string[])[sIdx];
                                  
                                  return (
                                    <div key={sIdx} className="bg-slate-100 p-2 rounded-md">
                                      <p className="text-[10px] text-slate-700 italic font-medium">"{stmt}"</p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${stdAns === 'Benar' || stdAns === 'Sesuai' ? 'bg-blue-100 text-blue-700' : 'bg-slate-300 text-slate-700'}`}>
                                          Jawaban: {stdAns || 'Kosong'}
                                        </span>
                                        <span className={`text-[9px] font-bold ${isStmtCorr ? 'text-emerald-600' : 'text-rose-500'}`}>
                                          {isStmtCorr ? '✔ Sesuai Kunci' : '✘ Tidak Cocok'}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                                <div className="pt-2 text-[10px] font-bold text-blue-600">
                                  Skor Pernyataan Diperoleh: {earnedScore.toFixed(2)} / 1.0
                                </div>
                              </div>
                            ) : (
                              <p className="text-slate-400 italic">Peserta tidak mengisi lembar jawaban.</p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Kunci Jawaban Resmi */}
                      <div className="bg-blue-50/40 p-3.5 rounded-lg border border-blue-100 text-slate-700">
                        <p className="font-bold text-blue-600 uppercase tracking-widest text-[9px] mb-2">Kunci Jawaban Resmi:</p>
                        {activeQuestion.type === 'PGS' ? (
                          <p className="font-semibold text-slate-800">
                            {activeQuestion.options?.[activeQuestion.correctAnswer as number]}
                          </p>
                        ) : activeQuestion.type === 'MCMA' ? (
                          <ul className="list-disc pl-4 space-y-1 text-slate-800">
                            {(activeQuestion.correctAnswer as number[]).map((cIdx) => (
                              <li key={cIdx} className="font-medium text-[11px]">{activeQuestion.options?.[cIdx]}</li>
                            ))}
                          </ul>
                        ) : (
                          <div className="space-y-1.5">
                            {activeQuestion.statements?.map((_, sIdx) => (
                              <div key={sIdx} className="text-[11px] font-medium flex items-center gap-2 text-slate-800">
                                <CornerDownRight className="h-3..5 w-3.5 text-blue-500" />
                                <span>Pernyataan {sIdx + 1}: </span>
                                <span className="font-black text-blue-600 uppercase">{(activeQuestion.correctAnswer as string[])[sIdx]}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="mt-3 pt-3 border-t border-blue-200/40 text-[11px] font-medium text-slate-600 leading-relaxed font-sans">
                          <span className="font-black text-blue-700 block text-[9px] uppercase mb-0.5">Analisis Matematika Pembahasan:</span>
                          Jawabannya logis karena didasarkan pada proporsi matematis yang diuraikan di stimulus di atas. Periksa kembali langkah penghitungan dari teks stimulus.
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
            <button
              onClick={onFinished}
              id="btn_logout_result"
              className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              Kembali ke Menu Login
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
