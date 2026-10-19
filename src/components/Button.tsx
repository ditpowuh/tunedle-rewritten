import styles from "./Button.module.css";
import clsx from "clsx";

interface ButtonProps {
  children?: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  onClick?: () => void;
}

export default function Button({children, primary, secondary, onClick}: ButtonProps) {
  return (
    <button type="button" className={clsx(styles.button, primary && styles.primary, secondary && styles.secondary)} onClick={onClick}>
      {children}
    </button>
  );
}
