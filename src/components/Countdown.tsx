import styles from "./Countdown.module.css";
import {useState} from "react";

import {useInterval} from "usehooks-ts";

import {getDisplay, getRemaining} from "@/lib/countdown";

export default function Countdown() {
  const [display, setDisplay] = useState<string>(() => getDisplay());

  useInterval(() => {
    setDisplay(getDisplay());

    if (getRemaining() < 1000) {
      location.reload();
    }
  }, 1000);

  return (
    <div className={styles.countdown}>{display}</div>
  );
}
