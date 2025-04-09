import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import { LuArrowDown, LuArrowLeft, LuArrowRight, LuArrowUp, LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";

const ImageEditTool: React.FC = () => {
  const Activeid = useSelector(
    (state: RootState) => state.editorTool.Activeid
  );
  const dispatch = useDispatch();

  // if (Activeid === '') {
  //   dispatch(setActiveid(''));
  //   return null; 
  // }

  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  // const Activeid = useSelector(
  //   (state: RootState) => state.slices.present.Activeid
  // );


  const [width, setWidth] = useState(640);
  const [height, setHeight] = useState(360);
  const [opacity, setOpacity] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(0);
  const [animationType, setanimationType] = useState('');

  const [transform, settransform] = useState("");
  const [borderRadius, setborderRadius] = useState("");
  // Filters
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(1);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [blur, setBlur] = useState(0);
  const [saturate, setSaturate] = useState(1);
  const [hueRotate, setHueRotate] = useState(0);


  const prevState = useRef({
    animationType,
    width: 640,
    height: 360,
    positionX: 0,
    positionY: 0,
    rotation: 0,
    opacity: 1,
    brightness,
    borderRadius,
    transform,
    grayscale,
    blur, contrast, hueRotate, sepia, saturate
  });

  useEffect(() => {
    const activeImage = Allclips.find((image) => image.id === Activeid);

    if (activeImage?.type === "image") {
      setanimationType(activeImage.properties.animationType)
      setWidth(activeImage.properties.width);
      setHeight(activeImage.properties.height);
      setOpacity(activeImage.properties.opacity || 1);
      setRotation(activeImage.properties.rotation || 0);
      setPositionX(activeImage.properties.left);
      setPositionY(activeImage.properties.top);
      setBrightness(activeImage.properties.brightness || 1);
      setContrast(activeImage.properties.contrast || 1);
      setGrayscale(activeImage.properties.grayscale || 0);
      setSepia(activeImage.properties.sepia || 0);
      setBlur(activeImage.properties.blur || 0);
      setSaturate(activeImage.properties.saturate || 1);
      setHueRotate(activeImage.properties.hueRotate || 0);
      setborderRadius(activeImage.properties.borderRadius);
      settransform(activeImage.properties.transform);
    }
  }, [Activeid, Allclips]);

  useEffect(() => {
    const activeImage = Allclips.find((image) => image.id === Activeid);

    if (activeImage) {
      if (
        prevState.current.animationType !== animationType ||
        prevState.current.width !== width ||
        prevState.current.height !== height ||
        prevState.current.positionX !== positionX ||
        prevState.current.opacity !== opacity ||
        prevState.current.rotation !== rotation ||
        prevState.current.brightness !== brightness ||
        prevState.current.grayscale !== grayscale ||
        prevState.current.contrast !== contrast ||
        prevState.current.hueRotate !== hueRotate ||
        prevState.current.sepia !== sepia ||
        prevState.current.saturate !== saturate ||
        prevState.current.borderRadius !== borderRadius ||
        prevState.current.transform !== transform ||
        prevState.current.blur !== blur ||

        prevState.current.positionY !== positionY
      ) {
        dispatch(
          updateClip({
            id: Activeid,
            properties: {
              animationType,
              width,
              height,
              rotation,
              opacity,
              borderRadius,
              transform,
              brightness,
              grayscale,
              blur,
              contrast,
              hueRotate,
              sepia,
              saturate,
              left: positionX,
              top: positionY,
            },
          })
        );

        prevState.current = {
          animationType,
          width,
          height,
          positionX,
          positionY,
          rotation,
          borderRadius,
          transform,
          opacity,
          brightness,
          grayscale,
          blur,
          contrast,
          hueRotate,
          sepia, saturate
        };
      }
    }
  }, [animationType, width, height, positionX, positionY, Activeid,
    Allclips, rotation, borderRadius, transform, opacity, brightness, grayscale, blur, contrast, hueRotate, sepia, saturate, dispatch]);


  const toggleFlip = (axis: string) => {
    settransform((prev) =>
      prev === `scale${axis}(-1)` ? "scale(1,1)" : `scale${axis}(-1)`
    );
  };

  const [activeTab, setActiveTab] = useState<"Image" | "animation">("Image");

  return (

    <div className="kd-editor-panel">
        <div className="kd-tab-list style-2">
          <button
            onClick={() => setActiveTab("Image")}
            className={`kd-tab-btn ${activeTab === "Image" ? "active" : ""}`}
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
        {activeTab === "Image" && (

          <div>
       
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
                  max="180"
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
                <div className="btn-bx" onClick={() => toggleFlip("X")}>
                  <LuFlipHorizontal2 className="text-white" />
                </div>
                <div className="btn-bx" onClick={() => toggleFlip("Y")}>
                  <LuFlipVertical2 className="text-white" />
                </div>
              </div>
            </div>


              {/* borderRadius */}
              <div>
              <label className="theme-small-text mb-2">Border Radius</label>
              <div className="kd-custom-bx rounded">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={borderRadius}
                  onChange={(e) => setborderRadius(e.target.value)}
                  className="w-full kd-range-input"
                />
                <span className="block mt-1 text-sm text-white">Radius: {borderRadius}px</span>
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

              {/* Filters */}
            </div>
            <div className="w-full">
              <h2 className="my-3 text-2xl text-white "> Image effect</h2>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Brightness</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Contrast</label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="5"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className=" kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Grayscale</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Sepia</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={sepia}
                  onChange={(e) => setSepia(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Blur (px)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">Saturate</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="1"
                  value={saturate}
                  onChange={(e) => setSaturate(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
              <div className="w-full flex items-center mb-4">
                <label className="theme-small-text mb-2 w-8/12">
                  Hue Rotate(°)
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  step="1"
                  value={hueRotate}
                  onChange={(e) => setHueRotate(Number(e.target.value))}
                  className="kd-range-input"
                />
              </div>
            </div>
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

            {/*Fade in */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Fade in");
              }}
            >
              <button>
                <div className="text-sm mt-1">Fade in</div>
              </button>
            </div>
            {/* Zoom in */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Zoom in");
              }}
            >
              <button>
                <div className="text-sm mt-1">Zoom in</div>
              </button>
            </div>

            {/* Zoom out */}
            <div
              className="animation-btn"
              onClick={() => {
                setanimationType("Zoom out");
              }}
            >
              <button>
                <div className="text-sm mt-1">Zoom out</div>
              </button>
            </div>
          </div>

        )}


      </div>
      );
};

      export default ImageEditTool;


