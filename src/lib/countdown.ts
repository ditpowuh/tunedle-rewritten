import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function getRemaining(): number {
  const target = dayjs().hour(23).minute(59).second(59).millisecond(0);
  return target.diff(dayjs());
}

export function getDisplay(): string {
  return dayjs.duration(Math.max(0, getRemaining())).format("HH:mm:ss");
}
