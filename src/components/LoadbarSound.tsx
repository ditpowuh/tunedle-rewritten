import styles from "./LoadbarSound.module.css";
import clsx from "clsx";

interface LoadbarSoundProps {
  playing?: boolean;
}

export default function LoadbarSound({playing}: LoadbarSoundProps) {
  return (
    <div className={styles.wrap}>
      <span className={clsx(styles.bar, playing && styles.playing)}></span>
    </div>
  );
}
