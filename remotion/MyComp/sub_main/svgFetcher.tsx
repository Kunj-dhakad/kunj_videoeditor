import React from "react";
import { EmojiClip } from "../../../app/store/clipsSlice";
import { AbsoluteFill, Img } from "remotion";
import { Animated, Fade, Move,
  //  Rotate 
  } from "remotion-animated";
interface SvgFetcherProps {
  clip: EmojiClip;
}

export const SvgFetcher: React.FC<SvgFetcherProps> = ({ clip }) => {
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
    rotate: `${clip.properties.rotation}deg`,
    transform:clip.properties.transform,
    userSelect: "none",

  };

  return (
    // <div>
    //   {clip.properties.svgtext === "" ? (
    //     <AbsoluteFill style={parentdiv}>
    //       <Img src={clip.properties.src} style={imageStyle} />

    //     </AbsoluteFill>




    //   ) : (
    //     <AbsoluteFill style={parentdiv}>
    //       <AbsoluteFill
    //         dangerouslySetInnerHTML={{ __html: clip.properties.svgtext }}
    //         style={{
    //           width: clip.properties.width, height: clip.properties.height, opacity: clip.properties.opacity,
    //           // color:clip.properties.colors
    //         }}>

    //       </AbsoluteFill>
    //     </AbsoluteFill>

    //   )}

    // </div>


    <div>
              <AbsoluteFill style={parentdiv}>

      <Animated
        animations={
          clip.properties.animationType === "Slide Top"
            ? [Move({ y: -40, start: 1,  }),
              Fade({ to: 1, initial: 0, start: 1,duration:30 }),
              // Rotate({ degreesX: 180 })

            ]
            : clip.properties.animationType === "Slide Bottom"
              ? [Move({ y: 40, start: 1,  }),
                Fade({ to: 1, initial: 0, start: 1,duration:30 }), 

              ]
              : clip.properties.animationType === "Slide Left"
                ? [Move({ x: -40, start: 1,  }),
                  Fade({ to: 1, initial: 0, start: 1,duration:30 }), 

                ]
                : clip.properties.animationType === "Slide Right"
                  ? [Move({ x: 40, start: 1,  }),
                    Fade({ to: 1, initial: 0, start: 1,duration:30 }), 

                  ]
                  : [] 
        }
      >
          {clip.properties.svgtext === "" ? (
            <Img src={clip.properties.src} style={imageStyle} />
          ) : (
            <AbsoluteFill
              dangerouslySetInnerHTML={{ __html: clip.properties.svgtext }}
              style={{
                width: clip.properties.width,
                height: clip.properties.height,
                opacity: clip.properties.opacity,
                color:clip.properties.color
              }}
            />
          )}
      </Animated>
      </AbsoluteFill>

    </div>


  );
};
