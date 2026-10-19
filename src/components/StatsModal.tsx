import styles from "./StatsModal.module.css";
import clsx from "clsx";

import WrongIcon from "@/assets/wrong.svg?react";

import {computeStats} from "@/lib/game";
import type {StatsEntry} from "@/types/game";

interface StatsModalProps {
  userStats: StatsEntry[];
  daysSince: number;
  todaysScore: number;
  hasFinished: boolean;
  guessRef: number;
}

export default function StatsModal({userStats, daysSince, todaysScore, hasFinished, guessRef}: StatsModalProps) {
  const stats = computeStats(userStats, daysSince);

  if (!stats.hasStats) {
    return (
      <div className={styles.empty}>Play daily to see your stats</div>
    );
  }

  const bars = [];
  for (let index = 0; index < stats.histogram.length; index++) {
    const value = stats.histogram[index];
    const isLast = index === stats.histogram.length - 1;
    const todayRow = hasFinished && index === todaysScore - 1;
    const highlightWin = todayRow && guessRef !== 0;
    const highlightLoss = hasFinished && index === todaysScore && guessRef === 0;

    let label: React.ReactNode;
    if (isLast) {
      label = (
        <WrongIcon className={clsx(styles.labelicon, highlightLoss && styles.labelloss)}/>
      );
    }
    else {
      label = (
        <span className={clsx(todayRow && styles.labelstrong, highlightWin && styles.labelwin, highlightLoss && styles.labelloss)}>{index + 1}°</span>
      );
    }

    bars.push(
      <div key={index} className={styles.barcolumn}>
        <div className={styles.bararea}>
          <div className={styles.bar} style={{height: `${stats.maxCount > 0 ? (value / stats.maxCount) * 100 : 0}%`}}>
            <div className={clsx(styles.barcount, highlightWin && styles.barcountwin, highlightLoss && styles.barcountloss)}>
              {value > 0 ? value : " "}
            </div>
          </div>
        </div>
        <div className={styles.barlabel}>{label}</div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.bars}>{bars}</div>
      <div className={styles.numbers}>
        <div className={styles.number}>
          <div className={styles.numbervalue}>{stats.played}</div>
          <div className={styles.numberlabel}>Played</div>
        </div>
        <div className={styles.number}>
          <div className={styles.numbervalue}>{stats.won}</div>
          <div className={styles.numberlabel}>Won</div>
        </div>
        <div className={styles.number}>
          <div className={styles.numbervalue}>
            <span>{stats.winRate}</span>
            <span>%</span>
          </div>
          <div className={styles.numberlabel}>Win rate</div>
        </div>
      </div>
      <div className={`${styles.numbers} ${styles.numberstight}`}>
        <div className={styles.number}>
          <div className={styles.numbervalue}>{stats.currentStreak}</div>
          <div className={styles.numberlabel}>Current Streak</div>
        </div>
        <div className={styles.number}>
          <div className={styles.numbervalue}>{stats.maxStreak}</div>
          <div className={styles.numberlabel}>Max Streak</div>
        </div>
      </div>
    </div>
  );
}
