import {useState} from 'react';
import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

import { PlayerContext } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const [progress, setProgress] = useState(0);

  const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState, playNext, playPrevious, hasNext,
    hasPrevious, toggleLoop, isLooping, toggleShuffle, isShuffling } = useContext(PlayerContext);

  const episode = episodeList[currentEpisodeIndex];

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if(!audioRef.current) {
      return;
    }

    if(isPlaying) {
      audioRef.current.play();
    }else {
      audioRef.current.pause();
    }

  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover" />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong>Selecione um podcast para ouvir</strong>
        </div>
      )}

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>

          <div className={styles.slider}>
            { episode ? (
              <Slider 
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                max={episode.duration}
                value={progress}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>

          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio 
            ref={audioRef} 
            src={episode.url} 
            autoPlay={true} 
            loop={isLooping}
            onPlay={() => setPlayingState(true)} 
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          >
        </audio>) }

        <div className={styles.buttons}>
          <button type="button" disabled={!episode} onClick={toggleShuffle} className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="embaralhar" />
          </button>

          <button type="button" disabled={!episode || !hasPrevious} onClick={playPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>

          <button type="button" className={styles.playButton} onClick={togglePlay} disabled={!episode}>
            <img src={isPlaying ? "/pause.svg" : "/play.svg"} alt="Tocar" />
          </button>

          <button type="button" disabled={!episode || !hasNext} onClick={playNext}>
            <img src="/play-next.svg" alt="Tocar pr??xima" />
          </button>

          <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
} 