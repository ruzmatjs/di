export type Level = 1 | 2 | 3 | 4 | 5;

export interface Topic {
  id: number;
  level: Level;
  title: string;
  tag: 'intervyu' | 'amaliy' | 'murakkab';
  /** Qisqa tavsif — ro'yxatda ko'rinadi */
  short: string;
  /** Asosiy tushuntirish — paragraflar massivi */
  content: string[];
  /** Kod misoli */
  code?: string;
  /** Intervyuda beriladigan tipik savol */
  interviewQuestion?: string;
}

export interface QuizQuestion {
  id: number;
  level: Level;
  question: string;
  /** Kod parchasi bo'lsa */
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LevelMeta {
  level: Level;
  name: string;
  icon: string;
  difficulty: string;
}

export const LEVELS: LevelMeta[] = [
  { level: 1, name: 'Asoslar', icon: '01', difficulty: 'oson' },
  { level: 2, name: 'Provider konfiguratsiyasi', icon: '02', difficulty: "o'rta" },
  { level: 3, name: 'Injector tree va resolution', icon: '03', difficulty: "o'rta+" },
  { level: 4, name: "Ilg'or mavzular", icon: '04', difficulty: 'qiyin' },
  { level: 5, name: 'Real-world patterns', icon: '05', difficulty: 'amaliyot' },
];
