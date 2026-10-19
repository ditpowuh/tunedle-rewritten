export type GameConfig = {
  readonly attemptIntervalAlt: readonly number[];
  readonly maxAttempts: number;
};

export type Guess = {
  answer: string;
  isCorrect: boolean;
  isSkipped: boolean;
};

export type TrackInfo = {
  artist: string;
  title: string;
  img: string | null;
  duration: number;
};

export type StatsEntry = {
  id: number;
  guessList: Guess[];
  hasFinished: boolean;
  gotCorrect: boolean;
  score: number;
};

export type StatsSummary = {
  hasStats: boolean;
  played: number;
  won: number;
  winRate: string;
  currentStreak: number;
  maxStreak: number;
  histogram: number[];
  maxCount: number;
};

export type ModalName = "help" | "info" | "results";

export type PlayerHandle = {
  resetAndPlay: () => void;
};
