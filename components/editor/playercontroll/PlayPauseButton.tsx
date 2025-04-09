import type {PlayerRef} from '@remotion/player';
import {useCallback, useEffect, useState} from 'react';
import { FaPause, FaPlay } from 'react-icons/fa';

export const PlayPauseButton: React.FC<{
  playerRef: React.RefObject<PlayerRef>;
}> = ({playerRef}) => {
  const [playing, setPlaying] = useState(false);
 
  useEffect(() => {
    const {current} = playerRef;
    setPlaying(current?.isPlaying() ?? false);
    if (!current) return;
 
    const onPlay = () => {
      setPlaying(true);
    };
 
    const onPause = () => {
      setPlaying(false);
    };
 
    current.addEventListener('play', onPlay);
    current.addEventListener('pause', onPause);
 
    return () => {
      current.removeEventListener('play', onPlay);
      current.removeEventListener('pause', onPause);
    };
  }, [playerRef]);
 
  const onToggle = useCallback(() => {
    playerRef.current?.toggle();
  }, [playerRef]);
 
  return (
    <button onClick={onToggle} type="button">
      {playing ?  <FaPause /> :  <FaPlay />}
    </button>
  );
};