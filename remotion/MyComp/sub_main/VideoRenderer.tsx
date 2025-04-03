import React from "react";
import { VideoClip } from "../../../app/store/clipsSlice";
import { AbsoluteFill, OffthreadVideo } from "remotion";

interface videoRendererProps {
  clip: VideoClip;
}

const VideoRenderer: React.FC<videoRendererProps> = ({ clip }) => {
  // const isWebm = clip.properties.src.endsWith(".webm");
  const parentdiv: React.CSSProperties = {
    position: "absolute",
    top: `${clip.properties.top}px`,
    left: `${clip.properties.left}px`,
    zIndex: 100 - clip.properties.zindex,
    display: "flex",
    overflow: "hidden",
    rotate: `${clip.properties.rotation}deg`,
    width: `${clip.properties.width}px`,
    height: `${clip.properties.height}px`,
    boxSizing: "border-box",

  }
  return (
    <AbsoluteFill style={parentdiv}>
      <OffthreadVideo
        transparent
        volume={clip.properties.volume}
        // playbackRate={clip.properties.volume}
        src={clip.properties.src}
        // startFrom={clip.properties.TrimStart}
        // endAt={clip.properties.TrimEnd}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          // width: `${clip.properties.width}px`,
          transform:clip.properties.transform,
          borderRadius:`${clip.properties.borderRadius}px`,
          // height: `${clip.properties.height}px`,
          userSelect: "none",
        }}
      />
    </AbsoluteFill>
  )
}
export default VideoRenderer;