import styles from "./HighlightedMatch.module.css";

interface HighlightedMatchProps {
  value: string;
  positions: number[];
}

export default function HighlightedMatch({value, positions}: HighlightedMatchProps) {
  const marked = new Set(positions);
  const nodes: React.ReactNode[] = [];

  let buffer = "";
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    if (marked.has(index)) {
      if (buffer) {
        nodes.push(buffer);
        buffer = "";
      }
      nodes.push(<mark key={index} className={styles.mark}>{character}</mark>);
    }
    else {
      buffer += character;
    }
  }
  if (buffer) {
    nodes.push(buffer);
  }
  return (
    <>{nodes}</>
  );
}
