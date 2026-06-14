/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { BookOpen, User, GraduationCap, School, ChevronRight, Lock } from 'lucide-react';
import { Student } from '../types';

interface LoginScreenProps {
  onLogin: (student: Student) => void;
  onOpenTeacherDashboard: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onOpenTeacherDashboard }) => {
  const [nama, setNama] = useState('');
  const [nisn, setNisn] = useState('');
  const [kelas, setKelas] = useState('');
  const [sekolah, setSekolah] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nama.trim() || !nisn.trim() || !kelas.trim() || !sekolah.trim()) {
      setError('Semua kolom identitas wajib diisi sebelum masuk ujian.');
      return;
    }

    if (nisn.trim().length < 5) {
      setError('NISN minimal harus terdiri dari 5 digit angka.');
      return;
    }

    setError('');
    onLogin({
      nama: nama.trim(),
      nisn: nisn.trim(),
      kelas: kelas.trim(),
      sekolah: sekolah.trim()
    });
  };

  return (
    <div id="login_container" className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
      {/* Top ANBK Style Header */}
      <header className="bg-blue-600 text-white shadow-md border-b-4 border-amber-400">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600 flex items-center justify-center">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight font-sans">
                TRY OUT TKA NUMERASI SMP 2026
              </h1>
              <p className="text-xs text-blue-100 font-medium">
                Simulasi Asesmen Nasional Berbasis Komputer (ANBK) - Kelas IX
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTeacherDashboard}
            id="btn_to_teacher_dashboard"
            className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 transition-colors border border-blue-500/30 text-white text-xs px-3 py-1.5 rounded-md font-semibold cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5 text-amber-300" />
            Portal Guru / Admin
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden"
        >
          {/* Accent Top Bar */}
          <div className="h-2 bg-gradient-to-r from-blue-500 via-blue-600 to-amber-400"></div>
          
          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">Formulir Masuk Ujian</h2>
              <p className="text-xs text-slate-500 mt-1">
                Silakan lengkapi data diri Anda secara benar dan jujur sebelum memulai simulasi.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                id="login_error"
                className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg font-medium"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-blue-500" />
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  id="input_nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Rian Anggoro"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* NISN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                  NISN (10 Digit)
                </label>
                <input
                  type="text"
                  id="input_nisn"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Contoh: 0098451230"
                  maxLength={12}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm font-mono tracking-wider focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                  required
                />
              </div>

              {/* Kelas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-blue-500" />
                    Kelas IX / Paralel
                  </label>
                  <select
                    id="input_kelas"
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                    required
                  >
                    <option value="">Pilih Kelas...</option>
                    <option value="IX-A">Kelas IX-A</option>
                    <option value="IX-B">Kelas IX-B</option>
                    <option value="IX-C">Kelas IX-C</option>
                    <option value="IX-D">Kelas IX-D</option>
                    <option value="IX-E">Kelas IX-E</option>
                    <option value="IX-F">Kelas IX-F</option>
                    <option value="IX-G">Kelas IX-G</option>
                    <option value="Lainnya">Kelas Lainnya</option>
                  </select>
                </div>

                {/* Optional Text representation of Kelas if 'Lainnya' chosen */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <School className="h-3.5 w-3.5 text-blue-500" />
                    Asal Sekolah
                  </label>
                  <input
                    type="text"
                    id="input_sekolah"
                    value={sekolah}
                    onChange={(e) => setSekolah(e.target.value)}
                    placeholder="Contoh: SMPN 1 Jakarta"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  id="btn_start_exam"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold rounded-lg text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  Masuk Ujian
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          <div className="bg-slate-50 border-t border-slate-200 p-4 text-center">
            <span className="text-[11px] text-slate-400 font-medium font-mono leading-none">
              TAHUN PELAJARAN 2025/2026
            </span>
          </div>
        </motion.div>
      </main>

      {/* Footer / Copyright */}
      <footer className="bg-slate-100 border-t border-slate-200 py-3 text-center text-[10px] text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Try Out ANBK Kemkes/Kemdikbud RI. Sistem Pengawasan Anti-Curang Tersemat.</p>
        </div>
      </footer>
    </div>
  );
};
