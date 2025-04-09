import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp, LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";

const EmojiEditTool: React.FC = () => {
  const dispatch = useDispatch();
  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  // const Activeid = useSelector(
  //   (state: RootState) => state.slices.present.Activeid
  // );
  const Activeid = useSelector(
    (state: RootState) => state.editorTool.Activeid
  );

  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [opacity, setOpacity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [animationType, setanimationType] = useState('');
  const [color, setcolor] = useState("#000000");
  const [colorpickercondition, setcolorpickercondition] = useState(false);
  const [transform, settransform] = useState("");


  const prevState = useRef({
    animationType,
    width: 640,
    height: 360,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    opacity: 1,
    color,
    transform
  });

  useEffect(() => {
    const activeImage = Allclips.find((image) => image.id === Activeid);

    if (activeImage?.type === "emoji") {
      setWidth(activeImage.properties.width);
      setHeight(activeImage.properties.height);
      setOpacity(activeImage.properties.opacity || 1);
      setRotation(activeImage.properties.rotation || 0);
      setPositionX(activeImage.properties.left);
      setPositionY(activeImage.properties.top);
      setanimationType(activeImage.properties.animationType)
      setcolor(activeImage.properties.color);
      settransform(activeImage.properties.transform);
      setcolorpickercondition(activeImage.properties.svgtext !== "" ? true : false)
    }
  }, [Activeid, Allclips]);

  useEffect(() => {
    const activeImage = Allclips.find((emoji) => emoji.id === Activeid);

    if (activeImage) {
      if (
        prevState.current.animationType !== animationType ||

        prevState.current.width !== width ||
        prevState.current.height !== height ||
        prevState.current.positionX !== positionX ||
        prevState.current.opacity !== opacity ||
        prevState.current.rotation !== rotation ||
        prevState.current.transform !== transform ||
        prevState.current.color !== color ||
        prevState.current.positionY !== positionY
      ) {
        dispatch(
          updateClip({
            id: Activeid,
            properties: {
              width,
              height,
              rotation,
              opacity,
              transform,
              color: color,
              animationType,
              left: positionX,
              top: positionY,
            },
          })
        );

        prevState.current = {
          animationType,
          width,
          height,
          transform,
          color: color,
          positionX,
          positionY,
          rotation,
          opacity,
        };
      }
    }
  }, [transform, color, animationType, width, height, positionX, positionY, Activeid,
    Allclips, rotation, opacity, dispatch]);



  const toggleFlip = (axis: string) => {
    settransform((prev) =>
      prev === `scale${axis}(-1)` ? "scale(1,1)" : `scale${axis}(-1)`
    );
  };
  const [activeTab, setActiveTab] = useState<"elements" | "animation">("elements");

  return (
    <div className="kd-editor-panel">

      <div className="kd-tab-list style-2">
        <button
          onClick={() => setActiveTab("elements")}
          className={`kd-tab-btn ${activeTab === "elements" ? "active" : ""}`}
        >
          Image
        </button>
        <button
          onClick={() => setActiveTab("animation")}
          className={`kd-tab-btn ${activeTab === "animation" ? "active" : ""}`}
        >
          Animation
        </button>
      </div>




      {/* Control Panel */}
      <div >
        {activeTab === "elements" && (

          <div>

            <h2 className="text-xl font-semibold mb-4 text-white">Edit Elements Properties</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Width & Height */}
              <div>
                <label className="theme-small-text mb-2">Width</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="kd-form-input"
                />
              </div>
              <div>
                <label className="theme-small-text mb-2">Height</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="kd-form-input"
                />
              </div>

              {/* Opacity */}
              <div>
                <label className="theme-small-text mb-2">Opacity</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full kd-range-input"
                />
              </div>

              {/* Rotation */}
              <div>
                <label className="theme-small-text mb-2">Rotation (°)</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full kd-range-input"
                />
              </div>
              {/* transform */}
            
              <div>
                <label className="theme-small-text mb-2">Flip</label>
                <div className="flex gap-2">
                  <button className="btn-bx" onClick={() => toggleFlip("X")}>
                    <LuFlipHorizontal2 className="text-white" />
                  </button>
                  <button className="btn-bx" onClick={() => toggleFlip("Y")}>
                    <LuFlipVertical2 className="text-white" />
                  </button>
                </div>
              </div>


              {/* Position */}
              <div>
                <label className="theme-small-text mb-2">Position X (px)</label>
                <input
                  type="number"
                  value={positionX}
                  onChange={(e) => setPositionX(Number(e.target.value))}
                  className="kd-form-input"
                />
              </div>
              <div>
                <label className="theme-small-text mb-2">Position Y (px)</label>
                <input
                  type="number"
                  value={positionY}
                  onChange={(e) => setPositionY(Number(e.target.value))}
                  className="kd-form-input"
                />
              </div>
            </div>


            {/* color */}

            {colorpickercondition &&
              <div>
                <label className="theme-small-text mb-2">color Picker</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setcolor(e.target.value)}
                  className="kd-form-input style-2"
                />
              </div>

            }
          </div>
        )}




        {/* Animated image Options */}
        {activeTab === "animation" && (
          <div className="grid grid-cols-2 gap-2 mt-2">

            {/* Slide Left */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Slide Left");
              }}
            >
              <button>
                <div className="text-2xl"><LuArrowLeft /></div>
                <div className="text-sm mt-1">Slide Left</div>
              </button>
            </div>

            {/* Slide Right */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Slide Right");
              }}
            >
              <button>
                <div className="text-2xl"><LuArrowRight /></div>
                <div className="text-sm mt-1">Slide Right</div>
              </button>
            </div>

            {/* Slide Top */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Slide Top");
              }}
            >
              <button>
                <div className="text-2xl"><LuArrowUp /></div>
                <div className="text-sm mt-1">Slide Top</div>
              </button>
            </div>

            {/* Slide Bottom */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Slide Bottom");
              }}
            >
              <button className="text-center">
                <div className="text-2xl"><LuArrowDown /></div>
                <div className="text-sm mt-1">Slide Bottom</div>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmojiEditTool;


