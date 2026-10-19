import styles from "./LoaderSpinner.module.css";

export default function LoaderSpinner() {
  return (
    <div className={styles.wrap}>
      <span className={styles.spinner}></span>
    </div>
  );
}
