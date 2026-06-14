/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Student, Question, ExamResult, ExamSettings } from './types';
import { QUESTIONS_DB } from './data/questions';
import { prepareExamQuestions } from './utils/examHelper';
import { LoginScreen } from './components/LoginScreen';
import { ExamScreen } from './components/ExamScreen';
import { ResultScreen } from './components/ResultScreen';
import { TeacherDashboard } from './components/TeacherDashboard';

type ScreenType = 'LOGIN' | 'EXAM' | 'RESULT' | 'TEACHER_DASHBOARD';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('LOGIN');
  const [student, setStudent] = useState<Student | null>(null);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [violations, setViolations] = useState<number>(0);
  const [durationString, setDurationString] = useState<string>('');

  // Local student records database (cached in localStorage)
  const [localResults, setLocalResults] = useState<ExamResult[]>([]);

  // Default Try Out Settings
  const [settings, setSettings] = useState<ExamSettings>({
    googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbxurPnc5a82LYq4hevrcn-e1uUrD6rej2R7l312ZqBwR8TK7exXJN0VZN88RBz_OI389g/exec',
    examDurationMinutes: 120,
    maxViolationsAllowed: 3, // 4th violation logs them out
    isRandomQuestion: true,
    isRandomOption: true,
  });

  // Load cache on mount
  useEffect(() => {
    const cachedSettings = localStorage.getItem('tka_numerasi_settings');
    if (cachedSettings) {
      try {
        const parsed = JSON.parse(cachedSettings);
        if (!parsed.googleAppsScriptUrl) {
          parsed.googleAppsScriptUrl = 'https://script.google.com/macros/s/AKfycbxurPnc5a82LYq4hevrcn-e1uUrD6rej2R7l312ZqBwR8TK7exXJN0VZN88RBz_OI389g/exec';
          localStorage.setItem('tka_numerasi_settings', JSON.stringify(parsed));
        }
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse settings cache', e);
      }
    } else {
      localStorage.setItem('tka_numerasi_settings', JSON.stringify({
        googleAppsScriptUrl: 'https://script.google.com/macros/s/AKfycbxurPnc5a82LYq4hevrcn-e1uUrD6rej2R7l312ZqBwR8TK7exXJN0VZN88RBz_OI389g/exec',
        examDurationMinutes: 120,
        maxViolationsAllowed: 3,
        isRandomQuestion: true,
        isRandomOption: true,
      }));
    }

    const cachedResults = localStorage.getItem('tka_numerasi_results');
    if (cachedResults) {
      try {
        setLocalResults(JSON.parse(cachedResults));
      } catch (e) {
        console.error('Failed to parse results cache', e);
      }
    } else {
      // pre-inject some realistic demo scores for the teacher to view charts instantly
      injectDemoRecords();
    }
  }, []);

  const injectDemoRecords = () => {
    const demo: ExamResult[] = [
      {
        id: 'TO-demo-1',
        tanggal: '13 Juni 2026 09.45',
        nama: 'Ahmad Budi Wicaksono',
        nisn: '0098451120',
        kelas: 'IX-A',
        sekolah: 'SMP Negeri 1 Sleman',
        skorAkhir: 94,
        bilangan: 100,
        aljabar: 92,
        geometri: 92,
        dataPeluang: 100,
        jumlahBenar: 38,
        jumlahSalah: 2,
        durasiPengerjaan: '85 menit 12 detik',
        jumlahPelanggaran: 0,
        status: 'Selesai',
      },
      {
        id: 'TO-demo-2',
        tanggal: '13 Juni 2026 10.12',
        nama: 'Amanda Siti Lestari',
        nisn: '0097125304',
        kelas: 'IX-A',
        sekolah: 'SMP Negeri 1 Sleman',
        skorAkhir: 82,
        bilangan: 80,
        aljabar: 83,
        geometri: 83,
        dataPeluang: 83,
        jumlahBenar: 33,
        jumlahSalah: 7,
        durasiPengerjaan: '98 menit 45 detik',
        jumlahPelanggaran: 1,
        status: 'Selesai',
      },
      {
        id: 'TO-demo-3',
        tanggal: '13 Juni 2026 11.00',
        nama: 'Rian Muhammad Fauzi',
        nisn: '0096123049',
        kelas: 'IX-B',
        sekolah: 'SMP Negeri 1 Sleman',
        skorAkhir: 75,
        bilangan: 70,
        aljabar: 75,
        geometri: 75,
        dataPeluang: 83,
        jumlahBenar: 30,
        jumlahSalah: 10,
        durasiPengerjaan: '104 menit 20 detik',
        jumlahPelanggaran: 2,
        status: 'Selesai',
      },
      {
        id: 'TO-demo-4',
        tanggal: '14 Juni 2026 08.05',
        nama: 'Danang Nugroho',
        nisn: '0095111223',
        kelas: 'IX-C',
        sekolah: 'SMP Negeri 1 Sleman',
        skorAkhir: 62,
        bilangan: 60,
        aljabar: 58,
        geometri: 67,
        dataPeluang: 67,
        jumlahBenar: 25,
        jumlahSalah: 15,
        durasiPengerjaan: '115 menit 0 detik',
        jumlahPelanggaran: 0,
        status: 'Selesai',
      },
      {
        id: 'TO-demo-5',
        tanggal: '14 Juni 2026 09.00',
        nama: 'Jessica Clara Olivia',
        nisn: '0091245592',
        kelas: 'IX-B',
        sekolah: 'SMP Negeri 1 Sleman',
        skorAkhir: 48,
        bilangan: 50,
        aljabar: 42,
        geometri: 50,
        dataPeluang: 50,
        jumlahBenar: 19,
        jumlahSalah: 21,
        durasiPengerjaan: '42 menit 10 detik',
        // Max violations 3 means 4th logs out, they had 4 violations
        jumlahPelanggaran: 4,
        status: 'Dikeluarkan (Curang)',
      }
    ];
    setLocalResults(demo);
    localStorage.setItem('tka_numerasi_results', JSON.stringify(demo));
  };

  const handleStudentLogin = (studentInfo: Student) => {
    // 1. Prepare shuffled questions database
    const prepared = prepareExamQuestions(
      QUESTIONS_DB,
      settings.isRandomQuestion,
      settings.isRandomOption
    );

    // 2. Clear previous session answers and mount
    setStudent(studentInfo);
    setExamQuestions(prepared);
    setUserAnswers({});
    setViolations(0);
    setDurationString('');

    // 3. Enter Exam
    setActiveScreen('EXAM');
  };

  const handleFinishExam = (
    finalUserAnswers: Record<number, any>, 
    violationsCount: number, 
    durationSeconds: number
  ) => {
    setUserAnswers(finalUserAnswers);
    setViolations(violationsCount);

    // Convert seconds to human localized string
    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    const readableTime = mins > 0 ? `${mins} menit ${secs} detik` : `${secs} detik`;
    setDurationString(readableTime);

    // Store in active stats
    setActiveScreen('RESULT');
  };

  const handleSaveSettings = (newSettings: ExamSettings) => {
    setSettings(newSettings);
    localStorage.setItem('tka_numerasi_settings', JSON.stringify(newSettings));
  };

  const handleClearLocalResults = () => {
    setLocalResults([]);
    localStorage.removeItem('tka_numerasi_results');
  };

  const handleForceImportMock = () => {
    injectDemoRecords();
  };

  // Submit actual endpoint logic
  const handleSubmitToSpreadsheet = async (result: ExamResult): Promise<boolean> => {
    // Add current result to local list as well for teacher overview
    const nextResults = [result, ...localResults.filter(x => x.id !== result.id)];
    setLocalResults(nextResults);
    localStorage.setItem('tka_numerasi_results', JSON.stringify(nextResults));

    if (!settings.googleAppsScriptUrl) {
      // Not configured, return false to trigger local-mode caution badge
      return false;
    }

    try {
      // Submit towards Apps Script.
      // We use 'no-cors' mode so fetch doesn't throw a blocking CORS error.
      // Apps Script doGet/doPost naturally supports receiving CORS payloads when structured.
      const response = await fetch(settings.googleAppsScriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(result),
      });
      return true;
    } catch (err) {
      console.warn('Network transmission skipped or rejected by target CORS configuration.', err);
      // Even if network fails, we saved locally - we tell Result page it ran locally or can retry
      return false;
    }
  };

  return (
    <div id="main_app_wrapper" className="min-h-screen bg-slate-50 transition-all">
      {activeScreen === 'LOGIN' && (
        <LoginScreen
          onLogin={handleStudentLogin}
          onOpenTeacherDashboard={() => setActiveScreen('TEACHER_DASHBOARD')}
        />
      )}

      {activeScreen === 'EXAM' && student && (
        <ExamScreen
          student={student}
          questions={examQuestions}
          settings={settings}
          onFinishExam={handleFinishExam}
        />
      )}

      {activeScreen === 'RESULT' && student && (
        <ResultScreen
          student={student}
          questions={examQuestions}
          userAnswers={userAnswers}
          violations={violations}
          durationString={durationString}
          onFinished={() => setActiveScreen('LOGIN')}
          onSubmitToSpreadsheet={handleSubmitToSpreadsheet}
        />
      )}

      {activeScreen === 'TEACHER_DASHBOARD' && (
        <TeacherDashboard
          onBackToLogin={() => setActiveScreen('LOGIN')}
          localResults={localResults}
          onClearLocalResults={handleClearLocalResults}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onImportMockRecords={handleForceImportMock}
        />
      )}
    </div>
  );
}
