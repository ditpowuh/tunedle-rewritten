import styles from "./GuessList.module.css";
import clsx from "clsx";

import ChevronRightIcon from "@/assets/chevron-right.svg?react";
import SkippedIcon from "@/assets/skipped.svg?react";
import SoundcloudIcon from "@/assets/soundcloud.svg?react";
import WrongIcon from "@/assets/wrong.svg?react";

import type {Guess, TrackInfo} from "@/types/game";

interface GuessListProps {
  guessList: Guess[];
  maxAttempts: number;
  hasFinished: boolean;
  gotCorrect: boolean;
  track: TrackInfo;
  url: string;
}

export default function GuessList({guessList, maxAttempts, hasFinished, gotCorrect, track, url}: GuessListProps) {
  if (hasFinished) {
    return (
      <div className={styles.answerwrap}>
        <a className={styles.answerlink} href={url} title={`Listen to ${track.artist} - ${track.title} on SoundCloud`}>
          <div className={clsx(styles.answercard, gotCorrect ? styles.answercorrect : styles.answerwrong)}>
            {track.img && (
              <img className={styles.artwork} src={track.img} alt={`${track.artist} - ${track.title}`}/>
            )}
            {track.artist && (
              <div className={styles.answertext}>
                <p className={styles.answerartist}>{track.artist}</p>
                <p className={styles.answertitle}>{track.title}</p>
              </div>
            )}
            <div className={styles.logowrap}>
              <SoundcloudIcon/>
            </div>
            <div>
              <ChevronRightIcon/>
            </div>
          </div>
        </a>
      </div>
    );
  }

  const rows = [];

  for (let index = 0; index < maxAttempts; index++) {
    const guess = index < guessList.length ? guessList[index] : null;

    rows.push(
      <div key={index} className={clsx(styles.row, index === guessList.length && styles.rowcurrent)}>
        {guess === null && (
          <div className={styles.placeholder}></div>
        )}
        {guess !== null && (
          <>
            <div className={styles.status}>
              {guess.isSkipped && (
                <SkippedIcon className={styles.iconskipped}/>
              )}
              {!guess.isSkipped && (
                <>
                  {!guess.isCorrect && (
                    <WrongIcon className={styles.iconwrong}/>
                  )}
                </>
              )}
            </div>
            <div className={styles.guess}>
              {guess.isSkipped && (
                <div className={styles.skippedtext}>SKIPPED</div>
              )}
              {!guess.isSkipped && (
                <div className={styles.guesstext}>{guess.answer}</div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className={styles.list}>{rows}</div>
  );
}
