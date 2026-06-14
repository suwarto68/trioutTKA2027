/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Question, QuestionType } from '../types';

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Prepares the exam questions for a specific student. 
 * Optionally shuffles the questions and visual choices of PGS/MCMA.
 */
export function prepareExamQuestions(
  questions: Question[],
  shuffleQuestions: boolean,
  shuffleOptions: boolean
): Question[] {
  let targetQuestions = [...questions];

  if (shuffleQuestions) {
    targetQuestions = shuffleArray(targetQuestions);
  }

  return targetQuestions.map((q) => {
    if (shuffleOptions && q.options && q.options.length > 0) {
      const originalOptions = q.options;
      // Pair options with initial index to remap the correct answers
      const pairedOptions = originalOptions.map((opt, index) => ({ opt, index }));
      const shuffledPair = shuffleArray(pairedOptions);

      const newOptions = shuffledPair.map((x) => x.opt);

      let newCorrectAnswer: number | number[] | string[];
      if (q.type === 'PGS') {
        const originalCorrect = q.correctAnswer as number;
        newCorrectAnswer = shuffledPair.findIndex((x) => x.index === originalCorrect);
      } else if (q.type === 'MCMA') {
        const originalCorrect = q.correctAnswer as number[];
        newCorrectAnswer = shuffledPair
          .map((x, newIdx) => (originalCorrect.includes(x.index) ? newIdx : -1))
          .filter((idx) => idx !== -1);
      } else {
        // Statements / categories do not shuffle choices, just copy
        newCorrectAnswer = q.correctAnswer;
      }

      return {
        ...q,
        options: newOptions,
        correctAnswer: newCorrectAnswer,
      };
    }
    return q;
  });
}

/**
 * Grades an individually answered question according to the specific criteria.
 * - PGS: Single choice correct index => score 1 or 0
 * - MCMA: Proportional: (CorrectChecked - IncorrectChecked) / TotalCorrect, min 0
 * - KATEGORI: score per statement correct => score sum / totalStatements
 */
export function gradeQuestionAnswer(
  q: Question,
  userAnswer: number | number[] | string[] | undefined
): number {
  if (userAnswer === undefined || userAnswer === null) {
    return 0;
  }

  if (q.type === 'PGS') {
    const ans = userAnswer as number;
    const correct = q.correctAnswer as number;
    return ans === correct ? q.scoreWeight : 0;
  }

  if (q.type === 'MCMA') {
    const ans = userAnswer as number[];
    const correct = q.correctAnswer as number[];

    if (ans.length === 0) return 0;

    const totalCorrectOptionsClient = correct.length;
    let correctChecked = 0;
    let incorrectChecked = 0;

    ans.forEach((index) => {
      if (correct.includes(index)) {
        correctChecked++;
      } else {
        incorrectChecked++;
      }
    });

    const netScore = (correctChecked - incorrectChecked) / totalCorrectOptionsClient;
    return Math.max(0, netScore) * q.scoreWeight;
  }

  if (q.type === 'KATEGORI') {
    const ans = userAnswer as string[]; // e.g. ["Benar", "Salah"]
    const correct = q.correctAnswer as string[];
    const statementsCount = q.statements?.length || 1;

    let matchCount = 0;
    for (let i = 0; i < statementsCount; i++) {
      if (ans[i] && ans[i] === correct[i]) {
        matchCount++;
      }
    }

    return (matchCount / statementsCount) * q.scoreWeight;
  }

  return 0;
}

/**
 * Checks if a question has been fully or partially answered
 */
export function isQuestionAnswered(
  q: Question,
  answer: number | number[] | string[] | undefined
): boolean {
  if (answer === undefined || answer === null) return false;

  if (q.type === 'PGS') {
    return typeof answer === 'number';
  }

  if (q.type === 'MCMA') {
    const arr = answer as number[];
    return arr.length > 0;
  }

  if (q.type === 'KATEGORI') {
    const arr = answer as string[];
    const totalStatements = q.statements?.length || 0;
    // Visually marked as answered if at least one statement has been answered,
    // or we can require all statement items to be clicked
    const answeredCount = arr.filter(Boolean).length;
    return answeredCount === totalStatements && totalStatements > 0;
  }

  return false;
}
