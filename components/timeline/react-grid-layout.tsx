import React, { useState, useEffect } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useDispatch, useSelector } from "react-redux";
import {
  updateClip, settotalduration,
  //  setActiveid 
} from "../../app/store/clipsSlice";
import { setActiveid } from "../../app/store/editorSetting";
import { FaFont } from "react-icons/fa6";
import { RootState } from "../../app/store/store";
import { FaGripLinesVertical } from "react-icons/fa6";
import { FaVolumeUp } from "react-icons/fa";

interface boxCountProps {
  boxCount?: number;
  unit?: number;
}

const ExampleGrid: React.FC<boxCountProps> = ({ boxCount = 0, unit = 0 }) => {

  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  // const Timelienzoom = useSelector(
  //   (state: RootState) => state.slices.present.Timelienzoom
  // );

  // const activeClip = useSelector(
  //   (state: RootState) => state.slices.present.Activeid
  // );
  const activeClip = useSelector(
    (state: RootState & { editorTool: { Activeid: string } }) => state.editorTool.Activeid
  );



  const dispatch = useDispatch();

  const handleClipUpdate = (
    id: string,
    duration: number,
    start: number,
    zindex: number
  ) => {
    dispatch(updateClip({ id, properties: { start, duration, zindex } }));
  };

  const cols = boxCount;
  const rowHeight = 45;
  const totalWidth = 70 * boxCount;

  // console.log(
  //   "boxCount",
  //   boxCount,
  //   "totalWidth",
  //   totalWidth,
  //   "Timelienzoom",
  //   Timelienzoom
  // );
  // console.log("onegridwith", totalWidth / cols);
  const [layoutConfig, setLayout] = useState<Layout[]>([]);


  // const getClipHeight = (type: string) => {
  //   switch (type) {
  //     case "text":
  //       return 1;
  //     case "image":
  //       return 2;
  //     case "video":
  //       return 2;
  //     case "audio":
  //       return 1;
  //     default:
  //       return 1;
  //   }
  // };

  useEffect(() => {
    const generatedLayout = Allclips.map((clip, index) => ({
      i: clip.id,
      x: (clip.properties.start / unit),
      y: clip.properties.zindex,
      w: clip.properties.duration / unit,
      h: 1,
    }));
    setLayout(generatedLayout);

    const uniqueIntervals: { start: number; end: number }[] = [];

    Allclips.forEach((clip) => {
      const start = clip.properties.start;
      const end = start + clip.properties.duration;
      uniqueIntervals.push({ start, end });
    });

    uniqueIntervals.sort((a, b) => a.start - b.start);

    let totalUniqueDuration = 0;
    let currentEnd = 0;

    uniqueIntervals.forEach((interval, index) => {
      if (interval.start > currentEnd) {
        const gap = interval.start - currentEnd;
        totalUniqueDuration += gap;
      }

      if (interval.start >= currentEnd) {
        totalUniqueDuration += interval.end - interval.start;
        currentEnd = interval.end;
      } else if (interval.end > currentEnd) {
        totalUniqueDuration += interval.end - currentEnd;
        currentEnd = interval.end;
      }
    });
    dispatch(settotalduration(totalUniqueDuration));
    // console.log("Total Duration :", totalUniqueDuration / 30);
  }, [Allclips, dispatch, unit]);

  const onResizeStop: GridLayout.ItemCallback = (layout, oldLayout, item) => {
    setLayout(layout);
    const duration = item.w * unit;
    // console.log(item)
    const start = item.x * unit;
    const zindex = item.y;
    handleClipUpdate(item.i, duration, start, zindex);
  };

  const onDragStop: GridLayout.ItemCallback = (layout) => {
    setLayout(layout);
    layout.forEach((item) => {
      const duration = item.w * unit;
      const start = item.x * unit;
      const zindex = item.y;
      handleClipUpdate(item.i, duration, start, zindex);
    });
  };

  const onResize: GridLayout.ItemCallback = (layout, oldLayout, item) => {
    setLayout(layout);
    const duration = item.w * unit;
    // console.log(item)
    const start = item.x * unit;
    const zindex = item.y;
    handleClipUpdate(item.i, duration, start, zindex);
  };

  const onDragStart: GridLayout.ItemCallback = (layout, oldLayout, item) => {
    // setActiveClip(item.i);
    dispatch(setActiveid(item.i));
    console.log(item.i)
  };


  // all clips
  const renderGridItems = () => {
    return Allclips.map((clip) => {
      const isActive = activeClip === clip.id;
      const activeicon = isActive ? "" : "hidden";

      if (clip.type === "text") {
        return (

          <div
            key={clip.id}
            className={`timeline-clip-style flex items-center rounded-lg overflow-hidden`}
          >

            {/* Left Side */}
            <div className={` ${activeicon} clip-btn btn-left flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

            <div className="flex items-center gap-2 pe-2 w-full overflow-hidden">
              <FaFont style={{minWidth:"fit-content"}} className="icon " />
               <div className="whitespace-nowrap "> {clip.properties.text}</div>
            </div>

            {/* Right Side */}
            <div className={`${activeicon} clip-btn btn-right flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

          </div>
        );
      } else if (clip.type === "image") {
        return (
          <div
          key={clip.id}
          className={`timeline-clip-style flex items-center rounded-lg overflow-hidden`}
          style={{
            backgroundImage: `url(${clip.properties.src})`,
            backgroundRepeat: "repeat-x",
            backgroundSize: `${totalWidth / cols}px 45px`,
          }}
        >
          {/* Left Side */}
          <div className={` ${activeicon} clip-btn btn-left flex items-center justify-center`}>
            <FaGripLinesVertical />
          </div>

          {/* Right Side */}
          <div className={`${activeicon} clip-btn btn-right flex items-center justify-center`}>
            <FaGripLinesVertical />
          </div>

        </div>


        );
      } else if (clip.type === "video") {
        return (
          <div
            key={clip.id}
            className={`timeline-clip-style flex items-center rounded-lg overflow-hidden`}
            style={{
              backgroundImage: `url(${clip.properties.videothumbnail})`,
              backgroundSize: `${totalWidth / cols}px 45px`,
              backgroundRepeat: "repeat-x",
            }}
          >

            {/* Left Side */}
            <div className={` ${activeicon} clip-btn btn-left flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

            {/* Right Side */}
            <div className={`${activeicon} clip-btn btn-right flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

          </div>
        );
      } else if (clip.type === "audio") {
        return (
          <div
            key={clip.id}
            className={`timeline-clip-style flex items-center justify-center rounded-lg overflow-hidden`}
            style={{
              backgroundColor: "#eb34b1",
              backgroundImage: `url(https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/image/audio-temeline_thumbnail.png)`,
              backgroundRepeat: "repeat-x",
              backgroundPosition: "center",
            }}
          >
            {/* Left Side */}
            <div className={` ${activeicon} clip-btn btn-left flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

            <FaVolumeUp className="text-white text-lg" />
            {/* Right Side */}
            <div className={`${activeicon} clip-btn btn-right flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

          </div>

        );
      } else if (clip.type === "emoji") {
        return (
          <div
            key={clip.id}
            className={`timeline-clip-style flex items-center rounded-lg overflow-hidden`}
            style={{
              backgroundImage: `url(${clip.properties.src})`,
              backgroundRepeat: "repeat-x",
              backgroundSize: `${totalWidth / cols}px 45px`,
            }}
          >
            {/* Left Side */}
            <div className={` ${activeicon} clip-btn btn-left flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

            {/* Right Side */}
            <div className={`${activeicon} clip-btn btn-right flex items-center justify-center`}>
              <FaGripLinesVertical />
            </div>

          </div>
        );
      }
      return null;
    });
  };

  return (
    <GridLayout
      className="example-layout"
      layout={layoutConfig}
      cols={cols}
      rowHeight={rowHeight}
      width={totalWidth}
      isResizable={true}
      isDraggable={true}
      resizeHandles={["e", "w"]}
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
      onDragStart={onDragStart}
      onResize={onResize}
      margin={[0, 3]}
      containerPadding={[0, 10]}
    >
      {renderGridItems()}
    </GridLayout>
  );
};

export default ExampleGrid;
