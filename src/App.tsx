import styles from "./App.module.css";
import {useMemo, useRef, useState} from "react";

import {useEventListener, useLocalStorage} from "usehooks-ts";

import GuessForm from "@/components/GuessForm";
import GuessList from "@/components/GuessList";
import Header from "@/components/Header";
import HelpModal from "@/components/HelpModal";
import InfoModal from "@/components/InfoModal";
import Modal from "@/components/Modal";
import Player from "@/components/Player";
import ResultPanel from "@/components/ResultPanel";
import StatsModal from "@/components/StatsModal";

import {config, answersOfSongs, getDayNumber, getSongForToday} from "@/lib/game";

import type {ModalName, PlayerHandle, StatsEntry, TrackInfo} from "@/types/game";
import type {SoundcloudSound} from "@/types/soundcloud";

export default function App() {
  const playerRef = useRef<PlayerHandle>(null);
  const documentRef = useRef<Document>(document);

  const dayNumber = useMemo(() => getDayNumber(), []);
  const song = useMemo(() => getSongForToday(), []);

  const [userStats, setUserStats] = useLocalStorage<StatsEntry[]>("userStats", () => [{
    id: dayNumber,
    guessList: [],
    hasFinished:
    false,
    gotCorrect: false,
    score: 0
  }]);
  const [firstTime, setFirstTime] = useLocalStorage<boolean>("firstTime", true);

  const [options, setOptions] = useState<string[]>(answersOfSongs);
  const [track, setTrack] = useState<TrackInfo>({
    artist: "",
    title: "",
    img: null,
    duration: 0
  });
  const [gameState, setGameState] = useState({
    gameIsActive: false,
    musicIsPlaying: false,
    playerIsReady: false
  });
  const [modal, setModal] = useState<{name: ModalName; title: string} | null>(firstTime ? {name: "help", title: "How to play"} : null);

  const todaysEntry = userStats.find((entry) => entry.id === dayNumber) ?? {
    id: dayNumber,
    guessList: [],
    hasFinished: false,
    gotCorrect: false,
    score: 0
  };

  const closeModal = () => {
    setFirstTime(false);
    setModal(null);
  }

  const handleVisibility = () => {
    if (!document.hidden && getDayNumber() !== dayNumber) {
      location.reload();
    }
  }
  useEventListener("visibilitychange", handleVisibility, documentRef);

  const handleUpdateSong = (sound: SoundcloudSound) => {
    setTrack({
      artist: song.answer.split(" - ")[0],
      title: song.answer.split(" - ")[1],
      img: sound.artwork_url,
      duration: sound.duration
    });
    setOptions((previous) => [...new Set([...previous, song.answer])]);
    setGameState((previous) => ({...previous, playerIsReady: true, gameIsActive: !todaysEntry.hasFinished}));
  }

  const handleUpdatePlaying = (playing: boolean) => {
    setGameState((previous) => ({...previous, musicIsPlaying: playing}));
  }

  const handleGuess = (guess: string, isSkipped: boolean) => {
    const isCorrect = !isSkipped && guess === song.answer;
    const guessList = [...todaysEntry.guessList, {answer: guess, isCorrect, isSkipped}];
    const finished = guessList.length === config.maxAttempts || isCorrect;
    const nextEntry: StatsEntry = {
      ...todaysEntry,
      guessList,
      hasFinished: finished ? true : todaysEntry.hasFinished,
      gotCorrect: finished ? isCorrect : todaysEntry.gotCorrect,
      score: finished ? guessList.length : todaysEntry.score
    };
    const nextStats = userStats.some((entry) => entry.id === dayNumber) ? userStats.map((entry) => (entry.id === dayNumber ? nextEntry : entry)) : [...userStats, nextEntry];
    setUserStats(nextStats);
    if (finished) {
      setGameState((previous) => ({...previous, gameIsActive: false}));
      playerRef.current?.resetAndPlay();
    }
  }

  return (
    <main className={styles.main}>
      {modal != null && (
        <Modal title={modal.title} onClose={closeModal}>
          {modal.name === "help" && (
            <HelpModal onClose={closeModal}/>
          )}
          {modal.name === "info" && (
            <InfoModal/>
          )}
          {modal.name === "results" && (
            <StatsModal userStats={userStats} daysSince={dayNumber} todaysScore={todaysEntry.guessList.length} hasFinished={todaysEntry.hasFinished} guessRef={todaysEntry.gotCorrect ? todaysEntry.guessList.length + 1 : 0}/>
          )}
        </Modal>
      )}
      <div className={styles.headerwrap}>
        <Header onInfo={() => setModal({name: "info", title: "About"})} onStats={() => setModal({name: "results", title: "Stats"})} onHelp={() => setModal({name: "help", title: "How to play"})}/>
      </div>
      <div className={styles.column}>
        <div className={styles.scroll}>
          <GuessList guessList={todaysEntry.guessList} maxAttempts={config.maxAttempts} hasFinished={todaysEntry.hasFinished} gotCorrect={todaysEntry.gotCorrect} track={track} url={song.url}/>
          {todaysEntry.hasFinished && (
            <ResultPanel guessList={todaysEntry.guessList} gotCorrect={todaysEntry.gotCorrect}/>
          )}
        </div>
      </div>
      <Player ref={playerRef} songId={dayNumber} songUrl={song.url} answer={song.answer} trackDuration={track.duration} currentAttempt={todaysEntry.guessList.length + 1} gameIsActive={gameState.gameIsActive} musicIsPlaying={gameState.musicIsPlaying} playerIsReady={gameState.playerIsReady} onUpdateSong={handleUpdateSong} onUpdatePlaying={handleUpdatePlaying}/>
      {!todaysEntry.hasFinished && gameState.gameIsActive && (
        <GuessForm options={options} currentAttempt={todaysEntry.guessList.length + 1} onGuess={handleGuess}/>
      )}
    </main>
  );
}
