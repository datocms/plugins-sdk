import classNames from 'classnames';
import React, {
  type CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Status } from '../../../icons/index';
import { useTranslation } from '../../i18n';
import RawButton from '../../semantic/RawButton';

export type AudioPlayback = {
  isPlaying: boolean;
  /** The played part of the file, from 0 to 100 */
  progress: number;
  toggle: () => void;
};

// One sound plays at a time on the page: when a player starts, it stops all
// the others. The set is for the whole page, thus no provider is necessary.
const pauseListeners = new Set<() => void>();

/** Stops all the players of the page */
export function pauseAllPlayers() {
  for (const pause of pauseListeners) pause();
}

/**
 * Calls `pause` when another player starts. Call `pauseAllPlayers` before
 * a player starts. Returns the function that removes the listener.
 */
export function addPauseListener(pause: () => void) {
  pauseListeners.add(pause);

  return () => {
    pauseListeners.delete(pause);
  };
}

/**
 * Plays a sound file. The waveform of a preview and the play action of a
 * card use this hook. The hook makes the audio element at the first play,
 * thus a page with many cards does not load the files. Give `null` for no
 * file.
 */
export function useAudioPlayback(url: string | null): AudioPlayback {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const listenersRef = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // A new file starts from the beginning. At unmount, stop the sound and
  // remove the listeners before the "pause" event can change the state.
  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);

    return () => {
      listenersRef.current?.abort();
      listenersRef.current = null;
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [url]);

  useEffect(
    () =>
      addPauseListener(() => {
        audioRef.current?.pause();
      }),
    [],
  );

  const toggle = useCallback(() => {
    if (!url) {
      return;
    }

    if (!audioRef.current) {
      // The element does not use CORS. Thus a copy of the file in the cache of
      // the browser always plays, also a copy without the CORS header
      const audio = new Audio(url);
      const listeners = new AbortController();
      const { signal } = listeners;

      audio.addEventListener('play', () => setIsPlaying(true), { signal });
      audio.addEventListener('pause', () => setIsPlaying(false), { signal });
      // At the end of the file the waveform is empty again
      audio.addEventListener('ended', () => setProgress(0), { signal });
      audio.addEventListener(
        'timeupdate',
        () => {
          // The duration is not known until the metadata of the file loads
          if (Number.isFinite(audio.duration) && audio.duration > 0) {
            setProgress((audio.currentTime / audio.duration) * 100);
          }
        },
        { signal },
      );

      audioRef.current = audio;
      listenersRef.current = listeners;
    }

    const audio = audioRef.current;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    pauseAllPlayers();
    // The browser can refuse to play (for example, a file that it cannot
    // decode). Then the button stays on "play".
    audio.play().catch(() => {});
  }, [url]);

  return useMemo(
    () => ({ isPlaying, progress, toggle }),
    [isPlaying, progress, toggle],
  );
}

type AudioPlayPauseProps = {
  url: string;
  width: number;
  height: number;
  /**
   * The playback of a parent that has its own play control (a card puts it
   * in its actions). Then the waveform shows its progress, and there is no
   * button on the waveform.
   */
  playback?: AudioPlayback;
};

/** The waveform of a sound file, with a play button */
export const AudioPlayPause = React.memo(function AudioPlayPause({
  url,
  width,
  height,
  playback,
}: AudioPlayPauseProps) {
  const { t } = useTranslation();
  const ownPlayback = useAudioPlayback(playback ? null : url);
  const { isPlaying, progress, toggle } = playback ?? ownPlayback;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // The preview can be in a link or in a card that the click selects
      e.stopPropagation();
      e.preventDefault();
      toggle();
    },
    [toggle],
  );

  // The played part of the waveform has the accent color (see
  // _AudioPlayPause.css)
  const waveStyle = useMemo(
    () =>
      ({
        '--AudioPlayPause-progress': `${progress}%`,
      }) as CSSProperties,
    [progress],
  );

  let style: CSSProperties;

  if (width > 110) {
    const scale = Math.min(width / 300, height / 200);
    style = { width: `${300 * scale}px`, height: `${200 * scale}px` };
  } else {
    style = { width, height };
  }

  return (
    <div
      className={classNames('AudioPlayPause', {
        big: width >= 100,
        small: width < 100,
      })}
      style={style}
    >
      <div className="AudioPlayPause__wave" style={waveStyle} />
      {!playback && (
        <RawButton
          className={classNames('AudioPlayPause__button', {
            'button button--icon-only button--primary': width >= 100,
          })}
          ariaLabel={t(isPlaying ? 'audioPlayer.pause' : 'audioPlayer.play')}
          onClick={handleClick}
        >
          {isPlaying ? <Status.PauseIcon /> : <Status.PlayIcon />}
        </RawButton>
      )}
    </div>
  );
});
