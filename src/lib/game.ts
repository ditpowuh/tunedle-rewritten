import seedrandom from "seedrandom";

import {songs} from "@/lib/songs";

import type {GameConfig, Guess, StatsEntry, StatsSummary} from "@/types/game";
import type {Song} from "@/types/songs";

const queue: Song[] = getSongsShuffled();
export const answersOfSongs: string[] = [...new Set(queue.map((song) => song.answer))];

export const config: GameConfig = {
  attemptIntervalAlt: [1000, 2000, 4000, 7000, 11000, 16000],
  maxAttempts: 6
};

export function getRandomMessage(messages: string[]): string {
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function getSongsShuffled(): Song[] {
  const result = [...songs];
  const rng = seedrandom("tunedle");

  let currentIndex = result.length;
  while (currentIndex != 0) {
    const randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;
    [result[currentIndex], result[randomIndex]] = [result[randomIndex], result[currentIndex]];
  }

  return result;
}

export function getDayNumber(): number {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000;
}

export function getSongForToday(): Song {
  return queue[getDayNumber() % queue.length];
}

export function computeStats(userStats: StatsEntry[], daysSince: number): StatsSummary {
  const histogram: number[] = new Array(config.maxAttempts + 1).fill(0);

  let played = 0;
  let won = 0;
  let maxCount = 0;

  let streaks: number[] = [];

  if (userStats.length > 0) {
    const days: number[] = [];

    for (let i = 0; i < daysSince + 1; i++) {
      days.push(0);
    }

    for (const entry of userStats) {
      if (entry.hasFinished) {
        played++;
        if (entry.gotCorrect) {
          days[entry.id] = 1;
          won++;
          histogram[entry.score - 1]++;
          if (histogram[entry.score - 1] > maxCount) {
            maxCount = histogram[entry.score - 1];
          }
        }
        else {
          histogram[config.maxAttempts]++;
          if (histogram[config.maxAttempts] > maxCount) {
            maxCount = histogram[config.maxAttempts];
          }
        }
      }
    }
    streaks = days.reduce<number[]>((acc, value) => {
      if (value) {
        acc[acc.length - 1]++;
      }
      else {
        acc.push(0);
      }
      return acc;
    }, [0]);
  }
  return {
    hasStats: userStats.length > 0,
    played,
    won,
    winRate: played > 0 ? ((won / played) * 100).toFixed(1) : "0",
    currentStreak: streaks.slice(-1)[0] ?? 0,
    maxStreak: streaks.length > 0 ? Math.max(...streaks) : 0,
    histogram,
    maxCount
  };
}

export function createShareText(guessList: Guess[], gotCorrect: boolean): string {
  let result = "";

  if (gotCorrect) {
    if (guessList.length < config.maxAttempts / 3) {
      result += "🔊";
    }
    else if (guessList.length < (config.maxAttempts / 3) * 2) {
      result += "🔉";
    }
    else if (guessList.length <= config.maxAttempts) {
      result += "🔈";
    }
  }
  else {
    result += "🔇";
  }

  for (let i = 0; i < config.maxAttempts; i++) {
    if (guessList.length > i) {
      if (guessList[i].isCorrect) {
        result += "🟩";
      }
      else if (guessList[i].isSkipped) {
        result += "⬛️";
      }
      else {
        result += "🟥";
      }
    }
    else {
      result += "⬜️";
    }
  }

  return "🎵 Tunedle 🎵\n\n" + result;
}

