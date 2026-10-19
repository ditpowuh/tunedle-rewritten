import styles from "./Player.module.css";
import {useEffect, useImperativeHandle, useRef, useState} from "react";
import clsx from "clsx";

import {useScript, useTimeout} from "usehooks-ts";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

import Button from "@/components/Button";
import LoadbarSound from "@/components/LoadbarSound";
import LoaderSpinner from "@/components/LoaderSpinner";

import ChevronDownIcon from "@/assets/chevron-down.svg?react";
import PlayIcon from "@/assets/play.svg?react";
import ReloadIcon from "@/assets/reload.svg?react";
import VolumeXIcon from "@/assets/volume-x.svg?react";

import {config} from "@/lib/game";
import {createPlayerIframe, getWidget, widgetEvents} from "@/lib/soundcloud";

import type {PlayerHandle} from "@/types/game";
import type {SoundcloudSound} from "@/types/soundcloud";

dayjs.extend(duration);

interface PlayerProps {
  ref?: React.Ref<PlayerHandle>;
  songId: number;
  songUrl: string;
  answer: string;
  trackDuration: number;
  currentAttempt: number;
  gameIsActive: boolean;
  musicIsPlaying: boolean;
  playerIsReady: boolean;
  onUpdateSong: (sound: SoundcloudSound) => void;
  onUpdatePlaying: (playing: boolean) => void;
}

export default function Player({ref, songId, songUrl, answer, trackDuration, currentAttempt, gameIsActive, musicIsPlaying, playerIsReady, onUpdateSong, onUpdatePlaying}: PlayerProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<ReturnType<typeof getWidget> | null>(null);
  const limitRef = useRef(0);
  const stoppedRef = useRef(false);
  const onUpdateSongRef = useRef(onUpdateSong);
  const onUpdatePlayingRef = useRef(onUpdatePlaying);

  const [unavailable, setUnavailable] = useState<"blocked" | "missing" | null>(null);
  const [position, setPosition] = useState<number>(0);
  const [hasPlayedOnce, setHasPlayedOnce] = useState<boolean>(false);
  const [loadFailed, setLoadFailed] = useState<boolean>(false);

  const scriptStatus = useScript("https://w.soundcloud.com/player/api.js");

  useTimeout(() => {
    setLoadFailed(true);
  }, 6000);

  useEffect(() => {
    const host = hostRef.current;
    if (host == null) {
      return;
    }
    const iframe = createPlayerIframe(songId, songUrl);
    host.appendChild(iframe);

    if (scriptStatus === "ready") {
      const widget = getWidget(iframe);
      widgetRef.current = widget;

      const events = widgetEvents();

      widget.bind(events.READY, () => {

        widget.getCurrentSound((sound) => {
          if (sound == null) {
            setUnavailable("missing");
            onUpdateSongRef.current({policy: "", artwork_url: null, duration: 0, genre: "", release_date: ""});
            return;
          }
          if (sound.policy === "BLOCK") {
            setUnavailable("blocked");
          }
          onUpdateSongRef.current(sound);
        });

        widget.bind(events.PAUSE, () => {
          onUpdatePlayingRef.current(false);
        });

        widget.bind(events.PLAY, () => {
          stoppedRef.current = false;
          setHasPlayedOnce(true);
          onUpdatePlayingRef.current(true);
        });

        widget.bind(events.PLAY_PROGRESS, (event) => {
          const current = event?.currentPosition ?? 0;
          if (stoppedRef.current) {
            return;
          }
          setPosition(current);
          if (current > limitRef.current) {
            stoppedRef.current = true;
            widget.pause();
            widget.seekTo(0);
            setPosition(0);
          }
        });

      });
    }
    return () => {
      iframe.remove();
      widgetRef.current = null;
    }
  }, [songId, songUrl, scriptStatus]);

  useEffect(() => {
    onUpdateSongRef.current = onUpdateSong;
    onUpdatePlayingRef.current = onUpdatePlaying;
    limitRef.current = limitMs;
  });

  const intervals = config.attemptIntervalAlt;
  const limitMs = gameIsActive ? intervals[Math.min(currentAttempt, intervals.length) - 1] : trackDuration;
  const barWidthPercent = gameIsActive ? (intervals[Math.min(currentAttempt, intervals.length) - 1] / intervals[intervals.length - 1]) * 100 : 100;
  const totalMs = gameIsActive ? intervals[intervals.length - 1] : trackDuration;

  const resetAndPlay = () => {
    stoppedRef.current = false;
    widgetRef.current?.seekTo(0);
    setPosition(0);
    widgetRef.current?.play();
  }

  const togglePlayState = () => {
    const widget = widgetRef.current;
    if (widget === null) {
      return;
    }
    if (musicIsPlaying) {
      stoppedRef.current = true;
      widget.pause();
      widget.seekTo(0);
      setPosition(0);
    }
    else {
      stoppedRef.current = false;
      widget.seekTo(0);
      setPosition(0);
      widget.play();
    }
  }

  useImperativeHandle(ref, () => ({resetAndPlay}), []);

  const fillPercent = limitMs > 0 ? (position / limitMs) * 100 : 0;

  const ticks = [];
  if (gameIsActive) {
    for (let index = 0; index < intervals.length; index++) {
      ticks.push(<div key={index} className={clsx(styles.tick, index < currentAttempt - 1 && styles.tickpast, index > currentAttempt - 1 && styles.tickfuture, index === currentAttempt - 1 && styles.tickcurrent)} style={{left: `${(intervals[index] / intervals[intervals.length - 1]) * 100}%`}}></div>);
    }
  }

  let content;
  if (!playerIsReady) {
    content = (
      <div className={styles.loadingbox}>
        {loadFailed && (
          <>
            <p className={styles.errortext}>There was an error loading the player. Please reload and try again.</p>
            <div className={styles.errorbuttonwrap}>
              <Button onClick={() => location.reload()}>
                <ReloadIcon className={styles.icon24}/>
              </Button>
            </div>
          </>
        )}
        {!loadFailed && (
          <>
            <LoaderSpinner/>
            <p>Loading player...</p>
          </>
        )}
      </div>
    );
  }
  else if (unavailable != null) {
    content = (
      <div className={styles.blockedwrap}>
        <div className={styles.blockedcard}>
          <div className={styles.blockedrow}>
            <div className={styles.blockedicon}>
              <VolumeXIcon className={styles.icon24}/>
            </div>
            <div>
              <p className={styles.blockedtext}>
                {unavailable === "blocked" ? "Oh no! Seems like today's track is unavailable on SoundCloud in your location" : "Oh no! Seems like today's track is no longer available on SoundCloud"}
              </p>
              {gameIsActive && (
                <p className={styles.blockedhint}>
                  Sorry! The answer is <a href={unavailable === "missing" ? `https://soundcloud.com/search?q=${encodeURIComponent(answer)}` : songUrl}>here</a>.
                  So if you want to maintain your streak... We won't tell...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  else {
    content = (
      <>
        {(!hasPlayedOnce && currentAttempt === 1) && (
          <div className={styles.hint}>
            <p>Turn up the volume and tap to start the track!</p>
            <ChevronDownIcon className={styles.hinticon}/>
          </div>
        )}
        <div className={styles.progresssection}>
          <div className={styles.progressinner}>
            <div className={styles.progresstrack}>
              <div className={styles.progresslimit} style={{width: `${barWidthPercent}%`}}>
                <div className={styles.progressfill} style={{width: `${fillPercent}%`}}></div>
              </div>
              {gameIsActive && (
                <>
                  <div className={styles.endlinelight}></div>
                  {ticks}
                  <div className={styles.endlinedark}></div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styles.controlssection}>
          <div className={styles.controlsinner}>
            <div className={styles.controlsrow}>
              <div className={styles.timewrap}>
                <div>{dayjs.duration(position).format("m:ss")}</div>
              </div>
              <div className={styles.playwrap}>
                <Button onClick={togglePlayState}>
                  <div className={styles.playcircle}>
                    {musicIsPlaying && (
                      <div className={styles.loadbarwrap}>
                        <LoadbarSound playing/>
                      </div>
                    )}
                    {!musicIsPlaying && (
                      <div className={styles.playiconwrap}>
                        <PlayIcon className={styles.icon24}/>
                      </div>
                    )}
                  </div>
                </Button>
              </div>
              <div>{dayjs.duration(totalMs).format("m:ss")}</div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={styles.player}>
      {content}
      <div className={styles.hidden} ref={hostRef}></div>
    </div>
  );
}
