import styles from "./GuessForm.module.css";
import {useState, useRef, useMemo} from "react";
import clsx from "clsx";

import Button from "@/components/Button";
import HighlightedMatch from "@/components/HighlightedMatch";

import ClearIcon from "@/assets/clear.svg?react";
import SearchIcon from "@/assets/search.svg?react";

import {config} from "@/lib/game";
import {normalize, searchAnswers} from "@/lib/search";

interface GuessFormProps {
  options: string[];
  currentAttempt: number;
  onGuess: (guess: string, isSkipped: boolean) => void;
}

export default function GuessForm({options, currentAttempt, onGuess}: GuessFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const results = useMemo(() => searchAnswers(query, options), [query, options]);
  const showList = open && results.length > 0;

  const clear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setQuery("");
    setOpen(false);
    setActiveIndex(-1);
  }

  const submit = () => {
    const match = options.find((option) => normalize(option) === normalize(query.trim()));
    if (match != null) {
      onGuess(match, false);
      clear();
    }
    else {
      inputRef.current?.focus();
    }
  }

  const skip = () => {
    onGuess(query, true);
    clear();
  }

  const select = (value: string) => {
    if (inputRef.current) {
      inputRef.current.value = value;
    }
    setQuery(value);
    setOpen(false);
    setActiveIndex(-1);
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, results.length - 1));
    }
    else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, -1));
    }
    else if (event.key === "Enter") {
      event.preventDefault();
      if (showList && activeIndex >= 0) {
        select(results[activeIndex].value);
      }
      else {
        submit();
      }
    }
    else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  const handleInputFocus = () => {
    setOpen(true);
  }

  const handleInputBlur = () => {
    setOpen(false);
    setActiveIndex(-1);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.inputarea}>
        <div className={styles.wrapper}>
          <SearchIcon className={styles.searchicon}/>
          <input ref={inputRef} id="autoComplete" className={clsx(styles.input, showList && styles.inputopen)} type="search" dir="ltr" spellCheck={false} autoCorrect="off" autoComplete="off" autoCapitalize="off" placeholder="Know it? Search for the artist / title" onChange={handleInputChange} onFocus={handleInputFocus} onBlur={handleInputBlur} onKeyDown={handleKeyDown}/>
          <button type="button" className={styles.clear} onClick={clear}>
            <ClearIcon className={styles.clearicon}/>
          </button>
          {showList && (
            <ul className={styles.list}>
              {
                results.map((result, index) => (
                  <li key={result.value} className={clsx(styles.item, index === activeIndex && styles.itemactive)} onMouseDown={(event) => event.preventDefault()} onClick={() => select(result.value)}>
                    {result.positions.length > 0 && (
                      <HighlightedMatch value={result.value} positions={result.positions}/>
                    )}
                    {!(result.positions.length > 0) && (
                      <span>{result.value}</span>
                    )}
                  </li>
                ))
              }
            </ul>
          )}
        </div>
        <div className={styles.actions}>
          <Button secondary onClick={skip}>
            <span>Skip</span>
            <span className={clsx(styles.skipextra, currentAttempt >= config.maxAttempts && styles.hidden)}>(+{currentAttempt}s)</span>
          </Button>
          <Button primary onClick={submit}>Submit</Button>
        </div>
      </div>
    </div>
  );
}

