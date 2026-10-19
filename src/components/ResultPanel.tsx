import styles from "./ResultPanel.module.css";
import clsx from "clsx";
import {useState} from "react";

import {isMobile, isFirefox} from "react-device-detect";
import {useCopyToClipboard, useTimeout} from "usehooks-ts";

import Button from "@/components/Button";
import Countdown from "@/components/Countdown";

import ShareIcon from "@/assets/share.svg?react";

import {config, getRandomMessage, createShareText} from "@/lib/game";

import type {Guess} from "@/types/game";

interface ResultPanelProps {
  guessList: Guess[];
  gotCorrect: boolean;
}

export default function ResultPanel({guessList, gotCorrect}: ResultPanelProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [message] = useState(() => getRandomMessage(gotCorrect ? correctMessages : didNotGetCorrectMessages));

  const [_, copyToClipboard] = useCopyToClipboard();

  useTimeout(() => setCopied(false), copied ? 2000 : null);

  const correctMessages: string[] = [
    "Woohoo!",
    "Great job!",
    "Nice work!"
  ];

  const didNotGetCorrectMessages: string[] = [
    "Good effort!",
    "Better luck next time!",
    "So close!"
  ];

  let sentence: string;
  if (!gotCorrect) {
    sentence = "You didn't get today's Tunedle. Nice try!";
  }
  else {
    const seconds = config.attemptIntervalAlt[guessList.length - 1] / 1000;
    sentence = "You got today's Tunedle within " + seconds + " second" + (seconds > 1 ? "s" : "") + ".";
  }

  const share = () => {
    const text = createShareText(guessList, gotCorrect);
    if (!navigator.share || !isMobile || isFirefox) {
      copyToClipboard(text).then((success) => {
        if (success) {
          setCopied(true);
        }
      });
      return;
    }
    navigator.share({text}).catch(console.error);
    return undefined;
  }

  const bars = [];
  for (let index = 0; index < config.maxAttempts; index++) {
    const guess = index < guessList.length ? guessList[index] : null;
    const barClass = clsx(guess == null && styles.barunused, guess?.isSkipped && styles.barskipped, guess?.isCorrect && styles.barcorrect, guess != null && !guess.isSkipped && !guess.isCorrect && styles.barwrong);
    bars.push(<div key={index} className={barClass}></div>);
  }

  return (
    <>
      <div className={styles.summary}>
        <p className={styles.message}>{message}</p>
        <div className={styles.bars}>{bars}</div>
        <p className={styles.sentence}>{sentence}</p>
        {copied && (
          <div className={styles.copied}>Copied to clipboard!</div>
        )}
        <div className={styles.sharewrap}>
          <Button primary onClick={share}>
            Copy Results as Emojis
            <ShareIcon className={styles.shareicon}/>
          </Button>
        </div>
      </div>
      <div className={styles.nextsong}>
        <div className={styles.nextlabel}>Next song in:</div>
        <Countdown/>
      </div>
    </>
  );
}
