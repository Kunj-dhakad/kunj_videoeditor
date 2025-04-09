import React from "react";
import { AudioClip } from "../../../app/store/clipsSlice";
import { AbsoluteFill, Audio } from "remotion";

interface videoRendererProps {
  clip: AudioClip;
}

const AudioRenderer: React.FC<videoRendererProps> = ({ clip }) => {
const volume=clip.properties.volume;
  return (
    <AbsoluteFill>
      <Audio
        // loop
        // playbackRate={1}
        // muted={false}
        // eslint-disable-next-line @remotion/volume-callback
        volume={volume}
        // volume={(f) => interpolate(f, [0, 1], [0, clip.properties.volume])}
        src={clip.properties.src} />
    </AbsoluteFill>
  )
}
export default AudioRenderer;