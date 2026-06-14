/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type QuestionType = 'PGS' | 'MCMA' | 'KATEGORI';
export type CategoryType = 'Bilangan' | 'Aljabar' | 'Geometri' | 'DataPeluang';

export interface Question {
  id: number;
  type: QuestionType;
  category: CategoryType;
  materi: string;
  stimulusTitle: string;
  stimulusContent: string;
  stimulusTable?: string[][]; // Rich table rows for numerical data
  stimulusSvgType?: string; 
  questionText: string;
  options?: string[]; // Used for PGS
  correctAnswer: number | number[] | string[]; // PGS: index, MCMA: indices[], KATEGORI: ["Benar", "Salah", ...]
  statements?: string[]; // Used for KATEGORI
  statementOptions?: string[]; // ["Benar", "Salah"] or ["Sesuai", "Tidak Sesuai"]
  scoreWeight: number; // Max score for this question (usually 1.0 or proportional)
}

export interface Student {
  nama: string;
  nisn: string;
  kelas: string;
  sekolah: string;
}

export interface ExamResult {
  id: string;
  tanggal: string;
  nama: string;
  nisn: string;
  kelas: string;
  sekolah: string;
  skorAkhir: number;
  bilangan: number; // percentage
  aljabar: number; // percentage
  geometri: number; // percentage
  dataPeluang: number; // percentage
  jumlahBenar: number;
  jumlahSalah: number;
  durasiPengerjaan: string; // e.g., "15 menit 23 detik"
  jumlahPelanggaran: number;
  status: 'Selesai' | 'Dikeluarkan (Curang)';
}

export interface ExamSettings {
  googleAppsScriptUrl: string;
  examDurationMinutes: number;
  maxViolationsAllowed: number;
  isRandomQuestion: boolean;
  isRandomOption: boolean;
}
