import React, { useState, useEffect } from "react";
import {
  useDispatch,
  useSelector
} from "react-redux";
import { RootState } from "../../../app/store/store";
import { updateClip } from "../../../app/store/clipsSlice";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";

const VideoEditTool: React.FC = () => {
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
  const [volume, setVolume] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, settop] = useState(0);
  // const [trimStart, setTrimStart] = useState(0);
  // const [trimEnd, setTrimEnd] = useState(10);
  const [transform, settransform] = useState("");
  const [borderRadius, setborderRadius] = useState("");


  useEffect(() => {
    const activeClip = Allclips.find(clip => clip.id === Activeid);
    // console.log(activeClip?.properties);
    if (activeClip?.type === "video") {
      setWidth(activeClip.properties.width)
      setHeight(activeClip.properties.height)
      setLeft(activeClip.properties.left);
      settop(activeClip.properties.top);
      // setTrimStart(activeClip.properties.TrimStart)
      // setTrimEnd(activeClip.properties.TrimEnd)
      settransform(activeClip.properties.transform);
      setborderRadius(activeClip.properties.borderRadius);
      setVolume(activeClip.properties.volume)
    }
  }, [Activeid, Allclips]);

  const update_value = (updateproperties: Partial<any>) => {
    dispatch(updateClip({
      id: Activeid, properties: {
        width,
        height,
        left,
        top,
        volume,
        borderRadius,
        transform,
        rotation,
        ...updateproperties
      }
    }))

  }
  // useEffect(() => {
  //   dispatch(updateClip({ id: Activeid, properties: {TrimStart:trimStart,TrimEnd:trimEnd} }));
  // }, [dispatch,trimEnd, trimStart]);


  const toggleFlip = (axis: string) => {
    settransform((prev) => {
      const newTransform = prev === `scale${axis}(-1)` ? "scale(1,1)" : `scale${axis}(-1)`;

      // ✅ setTimeout ensures update_value runs after state update
      setTimeout(() => {
        update_value({ transform: newTransform });
      }, 0);

      return newTransform;
    });
  };


  return (
    <div className="kd-editor-panel">
      {/* Control Panel */}
      <div className="mt-1">
        <h2 className="text-xl font-semibold mb-4 text-white">Video Edit Properties</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Width & Height */}
          <div>
            <label className="theme-small-text mb-2">Width</label>
            <input
              type="number"
              value={width}
              onChange={(e) => {
                setWidth(Number(e.target.value))
                update_value({ width: Number(e.target.value) })
              }}
              className="kd-form-input"
            />
          </div>
          <div>
            <label className="theme-small-text mb-2">Height</label>
            <input
              type="number"
              value={height}
              onChange={(e) => {
                setHeight(Number(e.target.value))
                update_value({ height: Number(e.target.value) })
              }}
              className="kd-form-input"
            />
          </div>

          {/* Volume */}
          <div>
            <label className="theme-small-text mb-2">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => {
                setVolume(Number(e.target.value));
                update_value({ volume: Number(e.target.value) });
              }}
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
              onChange={(e) => {
                setRotation(Number(e.target.value));
                update_value({ rotation: Number(e.target.value) });
              }} className="w-full kd-range-input"
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
                  onChange={(e) => {
                    setborderRadius(e.target.value);
                    update_value({ borderRadius: e.target.value });
                  }}
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
              value={left}
              onChange={(e) => {
                setLeft(Number(e.target.value));
                update_value({ left: Number(e.target.value) });
              }}
              className="kd-form-input"
            />
          </div>
          <div>
            <label className="theme-small-text mb-2">Position Y (px)</label>
            <input
              type="number"
              value={top}
              onChange={(e) => {
                settop(Number(e.target.value));
                update_value({ top: Number(e.target.value) });
              }}
              className="kd-form-input"
            />
          </div>

          {/* Trimming */}
          {/* <div>
            <label className="block font-medium mb-2">Trim Start (s)</label>
            <input
              type="number"
              value={trimStart}
              onChange={(e) => setTrimStart(Number(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Trim End (s)</label>
            <input
              type="number"
              value={trimEnd}
              onChange={(e) => setTrimEnd(Number(e.target.value))}
              className="w-full border rounded p-1"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default VideoEditTool;
