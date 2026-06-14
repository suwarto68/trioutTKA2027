/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  Maximize2, 
  User, 
  HelpCircle,
  FileSpreadsheet,
  CheckCheck,
  BookOpen
} from 'lucide-react';
import { Student, Question, ExamSettings } from '../types';
import { QuestionSvg } from './QuestionSvg';
import { isQuestionAnswered } from '../utils/examHelper';

interface ExamScreenProps {
  student: Student;
  questions: Question[];
  settings: ExamSettings;
  onFinishExam: (userAnswers: Record<number, any>, violations: number, durationSeconds: number) => void;
}

export const ExamScreen: React.FC<ExamScreenProps> = ({
  student,
  questions,
  settings,
  onFinishExam,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [doubtfulList, setDoubtfulList] = useState<number[]>([]); // stores question IDs
  
  // Timer States
  const [timeLeft, setTimeLeft] = useState<number>(settings.examDurationMinutes * 60);
  const totalDurationSeconds = settings.examDurationMinutes * 60;

  // Font Size Accessibility State
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  // Anti-Cheat (Kecurangan) States
  const [violations, setViolations] = useState<number>(0);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [isFullscreenOn, setIsFullscreenOn] = useState<boolean>(false);
  const [showFullscreenRequiredOverlay, setShowFullscreenRequiredOverlay] = useState<boolean>(false);

  // Submit confirmation modal state
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // 1. Countdown timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit('Waktu ujian Anda telah habis! Lembar jawaban dikirim otomatis.');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time remaining (e.g. "01:54:23")
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 2. Anti-Cheat Monitoring listeners
  useEffect(() => {
    // Focus and visibility monitoring
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        registerViolation('Mendeteksi membuka tab browser baru atau meminimalkan layar.');
      }
    };

    const handleWindowBlur = () => {
      registerViolation('Mendeteksi berpindah fokus dari jendela ujian (alt-tab / aplikasi eksternal).');
    };

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreenOn(isCurrentlyFullscreen);
      if (!isCurrentlyFullscreen) {
        // If they exited fullscreen, warn them and demand re-entry
        setShowFullscreenRequiredOverlay(true);
        registerViolation('Mendeteksi keluar dari modus tampilan layar penuh (Fullscreen).');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Initial check and request fullscreen gracefully
    requestFullscreenIfPossible();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [violations]);

  const requestFullscreenIfPossible = () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen().then(() => {
          setIsFullscreenOn(true);
          setShowFullscreenRequiredOverlay(false);
        }).catch(() => {
          // If browser rejected fullscreen (iframe constraint block in sandbox preview),
          // don't fail, just alert in overlay that fullscreen is ideal
          setIsFullscreenOn(false);
        });
      }
    } catch (err) {
      setIsFullscreenOn(false);
    }
  };

  const registerViolation = (message: string) => {
    const newViolationsCount = violations + 1;
    setViolations(newViolationsCount);
    setWarningMessage(message);

    if (newViolationsCount > settings.maxViolationsAllowed) {
      handleAutoSubmit('Batas toleransi kecurangan habis! Anda didiskualifikasi dari ujian.');
    } else {
      setShowWarningModal(true);
    }
  };

  const handleAutoSubmit = (reason: string) => {
    alert(reason);
    // Submit in its current form
    const durationNeeded = totalDurationSeconds - timeLeft;
    onFinishExam(userAnswers, violations, durationNeeded);
  };

  // 3. Navigation Controls
  const activeQuestion = questions[currentIdx];

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleToggleDoubtful = () => {
    if (!activeQuestion) return;
    const qId = activeQuestion.id;
    setDoubtfulList((prev) => 
      prev.includes(qId) ? prev.filter((id) => id !== qId) : [...prev, qId]
    );
  };

  // Answer selections modifications
  const handlePgsSelect = (optionIdx: number) => {
    if (!activeQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: optionIdx
    }));
  };

  const handleMcmaToggle = (optionIdx: number) => {
    if (!activeQuestion) return;
    const currentAns = (userAnswers[activeQuestion.id] as number[]) || [];
    let nextAns: number[];

    if (currentAns.includes(optionIdx)) {
      nextAns = currentAns.filter((idx) => idx !== optionIdx);
    } else {
      nextAns = [...currentAns, optionIdx];
    }

    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: nextAns
    }));
  };

  const handleStatementSelect = (statementIdx: number, value: string) => {
    if (!activeQuestion) return;
    const currentAns = (userAnswers[activeQuestion.id] as string[]) || Array(activeQuestion.statements?.length || 0).fill('');
    const nextAns = [...currentAns];
    nextAns[statementIdx] = value;

    setUserAnswers((prev) => ({
      ...prev,
      [activeQuestion.id]: nextAns
    }));
  };

  const handleFinalSubmit = () => {
    const totalQuestions = questions.length;
    const answeredCount = questions.filter((q) => isQuestionAnswered(q, userAnswers[q.id])).length;
    const remainingCount = totalQuestions - answeredCount;

    if (remainingCount > 0) {
      if (confirm(`Peringatan: Masih ada ${remainingCount} soal yang BELUM ANDA JAWAB. Apakah Anda yakin ingin mengakhiri ujian sekarang?`)) {
        submitExamData();
      }
    } else {
      setShowConfirmSubmitModal(true);
    }
  };

  const submitExamData = () => {
    setShowConfirmSubmitModal(false);
    // exit fullscreen if active
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    const durationNeeded = totalDurationSeconds - timeLeft;
    onFinishExam(userAnswers, violations, durationNeeded);
  };

  // Get CSS for font sizing
  const getFontSizeClass = () => {
    if (fontSize === 'sm') return 'text-xs sm:text-xs';
    if (fontSize === 'lg') return 'text-base sm:text-lg';
    return 'text-sm sm:text-sm';
  };

  return (
    <div id="exam_screen_container" ref={containerRef} className="min-h-screen bg-slate-100 font-sans flex flex-col justify-between select-none">
      
      {/* 2. TOP BANNER SIMULASI */}
      <header className="bg-slate-900 text-white shadow-md border-b-2 border-amber-400 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & title context */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white shadow-sm flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-wide uppercase">
                TRY OUT TKA NUMERASI SMP 2026
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Peserta: <span className="text-slate-100 font-bold">{student.nama} ({student.kelas})</span> | NISN: <span className="text-slate-100 font-mono font-semibold">{student.nisn}</span>
              </p>
            </div>
          </div>

          {/* Right Timer Widget */}
          <div className="flex items-center gap-4">
            {/* Font Resize Quick Controls */}
            <div className="flex items-center bg-slate-850 p-1 rounded-md border border-slate-700 text-xs">
              <span className="text-[10px] uppercase font-bold px-2 text-slate-400">Ukuran Teks:</span>
              <button 
                onClick={() => setFontSize('sm')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${fontSize === 'sm' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}
              >
                A-
              </button>
              <button 
                onClick={() => setFontSize('md')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${fontSize === 'md' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}
              >
                Normal
              </button>
              <button 
                onClick={() => setFontSize('lg')} 
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${fontSize === 'lg' ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:text-white'}`}
              >
                A+
              </button>
            </div>

            {/* Timer Box */}
            <div className="flex items-center gap-2 bg-amber-400 text-slate-900 font-semibold px-4 py-1.5 rounded-lg border-2 border-amber-300 shadow-xs animate-pulse">
              <Clock className="h-4 w-4" />
              <div className="text-right">
                <p className="text-[8px] uppercase tracking-wider font-extrabold leading-none text-slate-800">Sisa Waktu</p>
                <p id="exam_countdown_timer" className="text-sm font-black font-mono leading-tight">{formatTime(timeLeft)}</p>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* 3. MAIN WORKSPACE / PLAYGROUND FRAME */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
        
        {/* LEFT VIEWPORT (65% width): STIMULUS AND QUESTION BLOCK */}
        <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden h-full">
          
          {/* Question Indicator Title row */}
          <div className="bg-white px-4 py-2.5 rounded-xl shadow-xs border border-slate-200 flex justify-between items-center shrink-0">
            <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase tracking-wider">
              {activeQuestion?.category} // {activeQuestion?.materi}
            </span>
            <div className="text-right">
              <span id="current_question_no" className="text-sm font-black text-slate-800 font-mono">
                SOAL NOMOR: {currentIdx + 1} S.D 40
              </span>
            </div>
          </div>

          {/* Primary dual-card container - scrollable viewport */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[450px]">
            
            {/* STIMULUS PANEL (Scrollable) */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col overflow-y-auto max-h-[500px] scrollbar-thin">
              <div className="border-b border-blue-100 pb-2 mb-3 shrink-0">
                <span className="text-[9px] uppercase tracking-widest font-black text-blue-500 block">Stimulus Pendukung</span>
                <h3 id="stimulus_title" className="text-xs font-black text-slate-800 uppercase">{activeQuestion?.stimulusTitle}</h3>
              </div>

              {/* Text / Markdown stimulus representation */}
              <div className={`text-slate-700 leading-relaxed space-y-3 prose max-w-none ${getFontSizeClass()} flex-1`}>
                <p className="whitespace-pre-line font-medium text-[13px]">{activeQuestion?.stimulusContent}</p>
                
                {activeQuestion?.stimulusTable && (
                  <div className="overflow-x-auto my-3 border border-slate-200 rounded-lg shadow-2xs">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-[11px]">
                      <thead>
                        <tr className="bg-slate-50 font-bold text-slate-700">
                          {activeQuestion.stimulusTable[0].map((th, index) => (
                            <th key={index} className="px-3 py-2 border-b border-slate-200">{th}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {activeQuestion.stimulusTable.slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50/50">
                            {row.map((td, tIdx) => (
                              <td key={tIdx} className="px-3 py-2 border-b border-slate-100 font-medium">{td}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeQuestion?.stimulusSvgType && (
                  <div className="my-4">
                    <QuestionSvg type={activeQuestion.stimulusSvgType} />
                  </div>
                )}
              </div>
            </div>

            {/* CHALLENGE AND ANSWER OPTIONS PANEL (Scrollable) */}
            <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col overflow-y-auto max-h-[500px] scrollbar-thin justify-between">
              
              <div>
                <div className="border-b border-slate-100 pb-2 mb-4 shrink-0">
                  <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Pertanyaan</span>
                  <h4 className="text-xs font-bold text-slate-500">
                    Format: {activeQuestion?.type === 'PGS' ? 'Pilihan Ganda Sederhana' : activeQuestion?.type === 'MCMA' ? 'Pilihan Ganda Kompleks (Checkbox)' : 'Pernyataan Kategori Kriteria'}
                  </h4>
                </div>

                <p id="question_text" className="text-slate-800 font-extrabold text-[14px] leading-snug mb-5 font-sans">
                  {activeQuestion?.questionText}
                </p>

                {/* RENDERING SELECTIONS BY QUESTION TYPE */}
                <div className="space-y-3">
                  
                  {/* PGS (Single option choice) */}
                  {activeQuestion?.type === 'PGS' && activeQuestion.options?.map((opt, oIdx) => {
                    const isSelected = userAnswers[activeQuestion.id] === oIdx;
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handlePgsSelect(oIdx)}
                        id={`btn_option_${activeQuestion.id}_${oIdx}`}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold leading-relaxed transition-all duration-150 flex items-center justify-between cursor-pointer outline-none ${
                          isSelected 
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex-1">{opt}</span>
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-350 bg-white'}`}>
                          {isSelected && <div className="h-2 w-2 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    );
                  })}

                  {/* MCMA (Multiple option checkboxes) */}
                  {activeQuestion?.type === 'MCMA' && activeQuestion.options?.map((opt, oIdx) => {
                    const currentAnswersList = (userAnswers[activeQuestion.id] as number[]) || [];
                    const isChecked = currentAnswersList.includes(oIdx);
                    
                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleMcmaToggle(oIdx)}
                        id={`btn_checkbox_${activeQuestion.id}_${oIdx}`}
                        className={`w-full text-left px-4 py-3 rounded-xl border text-xs font-semibold leading-relaxed transition-all duration-150 flex items-center justify-between cursor-pointer outline-none ${
                          isChecked 
                            ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-xs' 
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex-1">{opt}</span>
                        <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-350 bg-white'}`}>
                          {isChecked && <div className="text-[10px] font-black">✔</div>}
                        </div>
                      </button>
                    );
                  })}

                  {/* KATEGORI (Statement checklist grid) */}
                  {activeQuestion?.type === 'KATEGORI' && (
                    <div id="statements_grid" className="space-y-3.5">
                      {activeQuestion.statements?.map((itemText, sIdx) => {
                        const stateOptions = activeQuestion.statementOptions || ['Benar', 'Salah'];
                        const valueStored = (userAnswers[activeQuestion.id] as string[]) || [];
                        const valueSelected = valueStored[sIdx];

                        return (
                          <div key={sIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                            <p className="text-xs font-semibold text-slate-800 leading-relaxed font-sans italic">
                              "{itemText}"
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {stateOptions.map((optionLabel) => {
                                const isSelected = valueSelected === optionLabel;
                                return (
                                  <button
                                    key={optionLabel}
                                    type="button"
                                    onClick={() => handleStatementSelect(sIdx, optionLabel)}
                                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black uppercase text-center border cursor-pointer outline-none transition-all ${
                                      isSelected
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                        : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-600'
                                    }`}
                                  >
                                    {optionLabel}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

              {/* Status info message helper */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                Pilih jawaban di atas. Jawaban otomatis tersimpan saat Anda berpindah nomor soal.
              </div>

            </div>

          </div>

        </div>

        {/* RIGHT VIEWPORT (35% width): QUESTION MAP NAV CONTAINER */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between max-h-[570px] overflow-hidden">
          
          <div>
            <div className="border-b border-slate-100 pb-2 mb-4">
              <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 block">Peta Soal Ujian</span>
              <h3 className="text-xs font-black text-slate-800">NAVIGASI NOMOR 1 s.d. 40</h3>
            </div>

            {/* 1 - 40 Grid */}
            <div className="grid grid-cols-5 gap-1.5 overflow-y-auto max-h-[350px] pr-1 scrollbar-thin">
              {questions.map((q, idx) => {
                const isActive = currentIdx === idx;
                const isAnswered = isQuestionAnswered(q, userAnswers[q.id]);
                const isDoubtful = doubtfulList.includes(q.id);

                // Determinating box colors by ANBK criteria
                let colorClass = 'bg-slate-50 text-slate-700 border-slate-250'; // Gray (unanswered)
                if (isDoubtful) {
                  colorClass = 'bg-yellow-400 border-yellow-500 text-slate-900 font-extrabold'; // Yellow (doubtful)
                } else if (isAnswered) {
                  colorClass = 'bg-teal-600 border-teal-700 text-white font-extrabold'; // Teal (answered)
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    id={`btn_nav_no_${idx + 1}`}
                    className={`h-9.5 rounded-lg border text-[11px] font-mono leading-none flex items-center justify-center transition-all cursor-pointer outline-none relative hover:scale-105 ${
                      isActive 
                        ? 'ring-3 ring-blue-500 ring-offset-2 z-10 font-black text-sm scale-110' 
                        : ''
                    } ${colorClass}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color legends */}
          <div className="border-t border-slate-100 pt-4 mt-4 space-y-2.5 text-[10px]">
            <div className="flex justify-between font-bold">
              <span className="text-slate-400 uppercase tracking-widest text-[8px]">Keterangan Warna:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex items-center gap-1.5">
                <div className="h-4.5 w-4.5 bg-teal-600 border border-teal-700 rounded-sm"></div>
                <span className="font-semibold text-slate-600 leading-tight">Sudah Dijawab</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4.5 w-4.5 bg-yellow-400 border border-yellow-500 rounded-sm"></div>
                <span className="font-semibold text-slate-600 leading-tight">Ragu-Ragu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-4.5 w-4.5 bg-slate-50 border border-slate-250 rounded-sm"></div>
                <span className="font-semibold text-slate-600 leading-tight">Belum Dijawab</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* 4. FOOTER CONTROLS BAR */}
      <footer className="bg-white border-t border-slate-300 py-3.5 px-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentIdx === 0}
            id="btn_prev_soal"
            className="w-full sm:w-auto px-4 py-2 text-xs font-black uppercase tracking-wider rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent flex items-center justify-center gap-1 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Soal Sebelumnya
          </button>

          {/* Doubtful Flag Toggle */}
          <button
            onClick={handleToggleDoubtful}
            id="btn_doubtful"
            className={`w-full sm:w-auto px-5 py-2 text-xs font-black uppercase tracking-wider border rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              doubtfulList.includes(activeQuestion?.id)
                ? 'bg-yellow-400 border-yellow-500 text-slate-900 shadow-sm'
                : 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50/50'
            }`}
          >
            <input 
              type="checkbox" 
              checked={doubtfulList.includes(activeQuestion?.id)}
              onChange={() => {}} // handled by button click
              className="rounded text-amber-600 border-amber-400 pointer-events-none" 
            />
            Tandai Ragu-Ragu
          </button>

          {/* Next or Finish Button */}
          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleFinalSubmit}
              id="btn_finish_exam"
              className="w-full sm:w-auto px-6 py-2 bg-red-650 hover:bg-red-700 text-white font-extrabold uppercase tracking-wide rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer animate-bounce"
            >
              <CheckCheck className="h-4 w-4" />
              Selesai Ujian
            </button>
          ) : (
            <button
              onClick={handleNext}
              id="btn_next_soal"
              className="w-full sm:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              Soal Berikutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

        </div>
      </footer>

      {/* MODAL WINDOWS OVERLAYS */}
      <AnimatePresence>
        
        {/* Anti-cheat Popup Warning Modal */}
        {showWarningModal && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              id="warning_modal"
              className="bg-white rounded-xl shadow-2xl border-t-8 border-red-500 p-6 max-w-sm w-full text-center"
            >
              <div className="bg-red-100 text-red-600 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Peringatan Kecurangan!</h3>
              
              <div className="my-3 p-3 bg-red-50 rounded-lg text-xs text-red-600 font-medium">
                {warningMessage}
              </div>

              <p className="text-xs text-slate-500 mb-5 leading-normal">
                Dilarang keras meminimalkan jendela, menekan tombol keyboard di luar ujian, membuka browser lain, atau tab tambahan selama ujian berlangsung.
              </p>
              
              <div className="space-y-2">
                <div className="text-xs text-slate-700 font-bold bg-slate-100 py-1.5 rounded-lg border">
                  Pelanggaran Anda: <span className="text-red-600">{violations} / {settings.maxViolationsAllowed} kali</span>
                </div>
                <button
                  onClick={() => {
                    setShowWarningModal(false);
                    requestFullscreenIfPossible();
                  }}
                  id="btn_close_warning"
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow-sm transition-colors"
                >
                  Saya Mengerti & Lanjutkan Ujian
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* DEMAND FULLSCREEN REQUIREMENT OVERLAY */}
        {showFullscreenRequiredOverlay && (
          <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900 p-6 border border-slate-700 max-w-md w-full text-center text-white rounded-2xl shadow-2xl"
            >
              <div className="bg-red-500 text-white h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black text-amber-400">Aktifkan Layar Penuh (Fullscreen)</h3>
              <p className="text-xs text-slate-350 mt-2 mb-6 leading-relaxed">
                Untuk mencegah kecurangan simulasi ANBK dan mematuhi tata tertib, ujian wajib dilaksanakan dalam mode layar penuh.
              </p>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    requestFullscreenIfPossible();
                  }}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold rounded-lg text-xs cursor-pointer shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <Maximize2 className="h-4 w-4" />
                  Aktifkan Layar Penuh
                </button>
                <div className="text-slate-400 border-t border-slate-800 pt-3 text-[10px] space-y-1">
                  <p>Klik tombol di atas untuk melanjutkan ujian.</p>
                  <p className="italic text-slate-500">(Jika terhambat di Iframe sandbox, Anda disarankan membukanya di Tab Baru via menu setelan)</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Confirm Submit Ujian Modal */}
        {showConfirmSubmitModal && (
          <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl p-6.5 max-w-sm w-full text-center"
            >
              <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-black text-slate-800">Selesaikan Ujian Simulasi?</h3>
              <p className="text-xs text-slate-500 mt-2 mb-5 leading-normal">
                Seluruh {questions.length} lembar soal telah Anda jawab secara lengkap. Apakah Anda yakin ingin mengakhiri sesi ujian? Lembar hasil akan dinilai seketika.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmSubmitModal(false)}
                  className="flex-1 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold rounded-lg text-xs cursor-pointer"
                >
                  Belum, Periksa Lagi
                </button>
                <button
                  onClick={submitExamData}
                  id="btn_confirm_finish"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs cursor-pointer shadow-md"
                >
                  Ya, Selesai Ujian
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
};
