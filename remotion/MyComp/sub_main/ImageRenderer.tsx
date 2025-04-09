import React from "react";
import { AbsoluteFill, Img } from "remotion";
import { ImageClip } from "../../../app/store/clipsSlice";
import {
  Animated,
  Fade,
  Move,
  Scale,

  // Scale
} from 'remotion-animated';

interface ImageRendererProps {
  clip: ImageClip;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({ clip }) => {

  const parentdiv: React.CSSProperties = {
    position: "absolute",
    top: `${clip.properties.top}px`,
    left: `${clip.properties.left}px`,
    zIndex: 100 - clip.properties.zindex,
    display: "flex",
    // overflow: "hidden",
    rotate: `${clip.properties.rotation}deg`,
    width: `${clip.properties.width}px`,
    height: `${clip.properties.height}px`,
    boxSizing: "border-box",

  }

  const imageStyle: React.CSSProperties = {
    width: `${clip.properties.width}px`,
    height: `${clip.properties.height}px`,
    opacity: clip.properties.opacity,
    transform: clip.properties.transform,
    borderRadius: `${clip.properties.borderRadius}px`,
    // rotate: `${clip.properties.rotation}deg`,
    userSelect: "none",
    filter: `brightness(${clip.properties.brightness}%) 
         grayscale(${clip.properties.grayscale}%) 
       blur(${clip.properties.blur}px)
        contrast(${clip.properties.contrast}%)
        hue-rotate(${clip.properties.hueRotate}deg)
        sepia(${clip.properties.sepia}%)
         saturate(${clip.properties.saturate})
        `,
  };

  return (
    <>

      {clip.properties.animationType === "normal" && (
        <AbsoluteFill style={parentdiv}>
          <Img src={clip.properties.src} style={imageStyle} />
        </AbsoluteFill>
      )}

      {clip.properties.animationType === "Slide Top" && (
        <AbsoluteFill style={parentdiv}>
          <Animated animations={[
            Move({ y: -40, start: 1, }),
            Fade({ to: 1, initial: 0, start: 1, duration: 30 }),
          ]}
          >
            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>

      )}

      {clip.properties.animationType === "Slide Bottom" && (
        <AbsoluteFill style={parentdiv}>
          <Animated animations={[
            Move({ y: 40, start: 1, }),
            Fade({ to: 1, initial: 0, start: 1, duration: 30 }),
          ]}
          >

            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>

      )}


      {clip.properties.animationType === "Slide Left" && (
        <AbsoluteFill style={parentdiv}>
          <Animated animations={[
            Move({ x: -40, start: 1, }),
            Fade({ to: 1, initial: 0, start: 1, duration: 30 }),
          ]}
          >

            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>

      )}

      {clip.properties.animationType === "Slide Right" && (
        <AbsoluteFill style={parentdiv}>
          <Animated animations={[
            Move({ x: 40, start: 1, }),
            Fade({ to: 1, initial: 0, start: 1, duration: 30 }),
          ]}
          >
            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>

      )}

      {clip.properties.animationType === "Fade in" && (
        <AbsoluteFill style={{ ...parentdiv }}>
          <Animated animations={[
            Fade({ to: 1, initial: 0, start: 1, duration: 60 }),]}
          >

            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>
      )}

      {clip.properties.animationType === "Zoom in" && (

        <AbsoluteFill style={{ ...parentdiv }}>
          <Animated
            animations={[
              Scale({ by: 1, initial: 3, start: 1, }),
            ]}
          >
            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>

      )}

      {clip.properties.animationType === "Zoom out" && (
        <AbsoluteFill style={{ ...parentdiv }}>
          <Animated
            animations={[
              Scale({ by: 1, initial: 0.5 }),

            ]}
          >

            <Img src={clip.properties.src} style={imageStyle} />
          </Animated>
        </AbsoluteFill>
      )}

    </>
  )
};
