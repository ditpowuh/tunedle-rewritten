import styles from "./HelpModal.module.css";

import Button from "@/components/Button";

import MusicIcon from "@/assets/music.svg?react";
import SpeakerIcon from "@/assets/speaker.svg?react";
import ThumbUpIcon from "@/assets/thumb-up.svg?react";

interface HelpModalProps {
  onClose: () => void;
}

export default function HelpModal({onClose}: HelpModalProps) {
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.iconwrap}>
          <MusicIcon className={styles.iconmusic}/>
        </div>
        <div>
          <p>Listen to the intro, then find the correct song in the list from the search bar below.</p>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.iconwrap}>
          <SpeakerIcon className={styles.iconspeaker}/>
        </div>
        <div>
          <p>Skipping or incorrectly guessing unlock more of the intro.</p>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.iconwrap}>
          <ThumbUpIcon className={styles.iconthumb}/>
        </div>
        <div>
          <p>Answer in as few tries as possible and share your score!</p>
        </div>
      </div>
      <div className={styles.playwrap}>
        <Button primary onClick={onClose}>Play</Button>
      </div>
    </div>
  );
}
