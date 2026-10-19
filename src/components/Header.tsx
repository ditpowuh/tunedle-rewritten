import styles from "./Header.module.css";

import Button from "@/components/Button";

import HelpIcon from "@/assets/help.svg?react";
import InfoIcon from "@/assets/info.svg?react";
import StatsIcon from "@/assets/stats.svg?react";

interface HeaderProps {
  onInfo: () => void;
  onStats: () => void;
  onHelp: () => void;
}

export default function Header({onInfo, onStats, onHelp}: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <div className={styles.group}>
            <Button onClick={onInfo}>
              <InfoIcon className={styles.icon}/>
            </Button>
          </div>
          <h1 className={styles.title}>Tunedle</h1>
          <div className={`${styles.group} ${styles.groupend}`}>
            <Button onClick={onStats}>
              <StatsIcon className={styles.icon}/>
            </Button>
            <Button onClick={onHelp}>
              <HelpIcon className={styles.icon}/>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
