import styles from "./Countdown.module.css";
import {useState} from "react";

import {useInterval} from "usehooks-ts";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export default function Countdown() {
  const [display, setDisplay] = useState<string>(() => getDisplay());

  const getRemaining = (): number => {
    const target = dayjs().hour(23).minute(59).second(59).millisecond(0);
    return target.diff(dayjs());
  }

  const getDisplay = (): string => {
    return dayjs.duration(Math.max(0, getRemaining())).format("HH:mm:ss");
  }

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
