import styles from "./InfoModal.module.css";

export default function InfoModal() {
  return (
    <div className={styles.text}>
      <p className={styles.paragraph}>
        A clone of Heardle, that have songs of my choosing.
      </p>
      <p className={styles.paragraph}>
        Songs are selected from from my playlist and overall music taste, which is usually some more obscure artists.
      </p>
      <p className={styles.small}>
        Uses <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Soundcloud</a> to play.
        Created by <a href="https://ditpowuh.com" target="_blank" rel="noopener noreferrer">ditpowuh</a>.
      </p>
    </div>
  );
}
