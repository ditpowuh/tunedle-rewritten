import styles from "./Modal.module.css";
import {useEffect, useRef} from "react";

import {useEventListener} from "usehooks-ts";

import CloseIcon from "@/assets/close.svg?react";

interface ModalProps {
  children?: React.ReactNode;
  title: string;
  onClose: () => void;
}

export default function Modal({title, onClose, children}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;

    return () => {
      previous?.focus();
    }
  }, []);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key === "Tab") {
      const container = dialogRef.current;

      if (container == null) {
        return;
      }

      const focusable = Array.from(container.querySelectorAll<HTMLElement>("*")).filter((element) => element.tabIndex >= 0);
      let index = focusable.indexOf(document.activeElement as HTMLElement);

      if (index === -1 && event.shiftKey) {
        index = 0;
      }
      index += focusable.length + (event.shiftKey ? -1 : 1);
      index %= focusable.length;

      focusable[index].focus();
      event.preventDefault();
    }
  }
  useEventListener("keydown", handleKeyDown);

  return (
    <>
      <div className={styles.backdrop} onClick={onClose}></div>
      <div className={styles.passthrough}>
        <div ref={dialogRef} className={styles.container} role="dialog" aria-modal={true}>
          <div className={styles.body}>
            <div className={styles.header}>
              <div className={styles.titlewrap}>
                <h2 className={styles.title}>{title}</h2>
              </div>
              <div className={styles.closewrap}>
                <button autoFocus type="button" className={styles.close} onClick={onClose}>
                  <CloseIcon className={styles.closeicon}/>
                </button>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
