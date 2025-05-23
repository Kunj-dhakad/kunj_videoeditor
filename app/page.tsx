"use client";
import Image from 'next/image';
import { Player, PlayerRef } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Main } from "../remotion/MyComp/Main";
import { CompositionProps, VIDEO_FPS } from "../types/constants";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "./store/store";
import {
  deleteClip,
  //  resetAllclips, 
  setCurrentPlayerFrame, setTimelinezoom,
} from "./store/clipsSlice";
import { MiddleSectionVisibleaction, setActiveid, setsaveDraftId, setSaveDraftname } from "./store/editorSetting";
import { RenderControls } from "../components/render_control/RenderControls";
import Rv from "../components/timeline/react-virtualized";
import { useCurrentPlayerFrame } from "../components/timeline/use-current-player-frame";
import TextToolPanel from "../components/left_side_menu/textToolPanel";
import ImageGrid from "../components/left_side_menu/ImageGrid";
import VideoGrid from "../components/left_side_menu/VideoGrid";
import MenuBarSetting from "../components/left_side_menu/menuBarSetting";
import EmojiCollage from "../components/left_side_menu/emojiCollage";
import Audio from "../components/left_side_menu/audio";
import Upload from "../components/editor/upload/upload";
import Template from "../components/left_side_menu/template";
import VideoEditTool from "../components/editor/tool/video_edit_tool";
import ImageEditTool from "../components/editor/tool/image_edit_tool";
import TextEditTool from "../components/editor/tool/text_edit_tool";
import { themeSetCSSVariables } from "../components/project/themeSetCSSVariables";
import {

  //  BsMusicNoteList,
  BsPencilFill
} from "react-icons/bs";

// import { FullscreenButton } from "../components/editor/playercontroll/FullscreenButton";
// import { LoopButton } from "../components/editor/playercontroll/LoopButton";
// import { MuteButton } from "../components/editor/playercontroll/MuteButton";
import { TimeDisplay } from "../components/editor/playercontroll/TimeDisplay";
// import { VolumeSlider } from "../components/editor/playercontroll/VolumeSlider";
import { PlayPauseButton } from "../components/editor/playercontroll/PlayPauseButton";
import { MdPermMedia } from "react-icons/md";
import UndoRedo from "../components/editor/playercontroll/undoRedp";

import { FaVideo, FaImage, FaAngleLeft } from "react-icons/fa";
// import {
//   PiMagnifyingGlassMinusThin,
//   PiMagnifyingGlassPlusThin,
// } from "react-icons/pi";
import {
  // BiUndo, BiRedo,
  BiSolidCloudUpload,
  BiText
} from "react-icons/bi";
import { BsMusicNoteList } from "react-icons/bs";
import {
  MdInterests,
  MdTune
} from "react-icons/md";
// import { ActionCreators } from "redux-undo";
import EmojiEditTool from "../components/editor/tool/emoji_edit_tool";
import { updateProjectSettings } from "./store/project_settingsSlice ";
import HeygenVideolist from "../components/left_side_menu/heygen_video_list";
import RenderVideolist from "../components/left_side_menu/render_video_list";
import AudioEditTool from "../components/editor/tool/audio_edit_tool";
// import { MdDeleteSweep } from "react-icons/md";
// import useInitializeWatermark from "../components/editor/tool/watermark_setup";
import { useTemplateSet } from "../components/editor/tool/template_set_fun";
import { useVideoAddHelper } from "../components/editor/helper/video_add_helper";
import SaveDraft from "../components/left_side_menu/saveDraft";
import { FaMagnifyingGlassMinus, FaMagnifyingGlassPlus } from "react-icons/fa6";
import { FaCheck, FaTimes } from "react-icons/fa";
import Library from "../components/left_side_menu/library";
import SetupPopup from "../components/editor/tool/setupPopup";


const Home: NextPage = () => {
  const dispatch = useDispatch();

  const Activeid = useSelector(
    (state: RootState) => state.editorTool.Activeid
  );
  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  const DURATION_IN_FRAMES = useSelector(
    (state: RootState) => state.slices.present.totalduration
  );
  const VIDEO_HEIGHT = useSelector(
    (state: RootState) => state.slices.present.videoheight
  );
  const VIDEO_WIDTH = useSelector(
    (state: RootState) => state.slices.present.videowidth
  );
  const VIDEO_BG = useSelector(
    (state: RootState) => state.slices.present.videobg
  );

  const Watermark = useSelector(
    (state: RootState) => state.slices.present.Watermark
  );


  // console.log("home console",Allclips)
  // const [loop, setLoop] = useState(false);
  const [timelinezoomLevel, setZoomLevel] = useState(120);
  const [view, setView] = useState<
    | ""
    | "menu"
    | "text"
    | "texteditor"
    | "image"
    | "image_edit_tool"
    | "video"
    | "video_edit_tool"
    | "emoji"
    | "emoji_edit_tool"
    | "audio"
    | "audio_edit_tool"
    | "upload"
    | "template"
    | "render_video_list"
    | "heygen_video_list"
    | "SaveDraft"
    | "Library"

  >("upload");

  useEffect(() => {
    if (!Activeid) {
      setView('upload');
    } else if (
      Activeid.startsWith("subheading-") ||
      Activeid.startsWith("heading-") ||
      Activeid.startsWith("text-") ||
      Activeid.startsWith("Typewriter-") ||
      Activeid.startsWith("Fade In-")
    ) {
      setView("texteditor");
    } else if (Activeid.startsWith("image-")) {
      setView("image_edit_tool");
    } else if (Activeid.startsWith("video-")) {
      setView("video_edit_tool");
    } else if (Activeid.startsWith("emoji-")) {
      setView("emoji_edit_tool");
    } else if (Activeid.startsWith("audio-")) {
      setView("audio_edit_tool");
    }
  }, [Activeid]);


  const toolbarview = useSelector(
    (state: RootState) => state.editorTool.toolbarview
  );

  useEffect(() => {
    setView(toolbarview);
  }, [toolbarview])



  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // if (event.origin !== 'http://127.0.0.1:5501') return;  

      if (event.data.action === 'updateState') {
        setView(event.data.state);
        // console.log(event.data.state);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, []);



  useEffect(() => {
    window.parent.postMessage({ action: 'iframeReady' }, '*');
  }, []);


  useEffect(() => {
    const Initialdata = (event: MessageEvent) => {
      console.log(event.data)
      if (event.data.action === 'sendProjectInfo') {
        themeSetCSSVariables(event.data)
        dispatch(updateProjectSettings(event.data));
        dispatch(setSaveDraftname(event.data.project_name));
        dispatch(setsaveDraftId(event.data.id));
      }
    };

    window.addEventListener('message', Initialdata);

    return () => {
      window.removeEventListener('message', Initialdata);
    };
  }, [dispatch]);


  // extarnal open template in editor
  const Set_template = useTemplateSet();
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // console.log("temlateOpenInEditor",event.data);

      if (event.data.action === 'temlateOpenInEditor') {
        console.log("temlateOpenInEditor", event.data);
        Set_template(event.data.template_url)
        dispatch(setSaveDraftname(event.data.project_name));
        dispatch(setsaveDraftId(event.data.id));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, [Set_template]);


  // video add function
  const add_video_clip = useVideoAddHelper();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'videoOpenInEditor') {
        console.log("videoOpenInEditor", event.data);
        dispatch(setSaveDraftname(event.data.project_name));
        dispatch(setsaveDraftId(event.data.id));
        add_video_clip(event.data.url, event.data.thumbnail_url, event.data.width,
          event.data.height, event.data.duration, event.data.playerHeight, event.data.playerWidth)
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, [add_video_clip]);



  // const [playpause, setplaypause] = useState<true | false>(false);
  const playerRef = useRef<PlayerRef>(null);
  const inputProps: z.infer<typeof CompositionProps> = useMemo(
    () => ({
      durationInFrames: DURATION_IN_FRAMES,
      videoWidth: VIDEO_WIDTH,
      videoHeight: VIDEO_HEIGHT,
      videobg: VIDEO_BG,
      Allclips,
      Watermark,
    }),
    [DURATION_IN_FRAMES, Allclips, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_BG, Watermark]
  );



  // player time
  const totalSeconds = useCurrentPlayerFrame(playerRef);

  useEffect(() => {
    if (totalSeconds !== undefined) {
      dispatch(setCurrentPlayerFrame(totalSeconds));
    }
  }, [totalSeconds, dispatch]); //new add


  // zoom timeline start
  // console.log(zoomLevel)
  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 5, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 5, 30));
  };

  const handleSliderChange = (e: any) => {
    setZoomLevel(e.target.value);
  };

  useEffect(() => {
    dispatch(setTimelinezoom(timelinezoomLevel));
  }, [timelinezoomLevel, dispatch]);



  // const allclear = () => {
  //   dispatch(resetAllclips());
  // };
  // player height value

  // const [playerHeight, setPlayerHeight] = useState('');

  // const updatePlayerHeight = () => {
  //   const screenWidth = window.innerWidth;

  //   if (screenWidth >= 1680) {
  //     setPlayerHeight("65vh");
  //   } else if (screenWidth >= 1580) {
  //     setPlayerHeight("60vh");
  //   } else if (screenWidth >= 1480) {
  //     setPlayerHeight("55vh");
  //   } else {
  //     setPlayerHeight("50vh");
  //   }
  // };

  // useEffect(() => {
  //   updatePlayerHeight(); // Initial height setting
  //   window.addEventListener("resize", updatePlayerHeight); // Adjust height on resize

  //   return () => {
  //     window.removeEventListener("resize", updatePlayerHeight);
  //   };
  // }, []);


  // editor hide function
  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      dispatch(setActiveid(''));
    },
    [, dispatch]
  );


  const templatedwnld = () => {
    const payloadString = JSON.stringify(inputProps, null, 2);
    const output = {
      inputProps: {
        payload: payloadString
      }
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(output, null, 2)
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'template.json';
    link.click();
  };

  // useInitializeWatermark();



  // comand button keyword in player 

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log(`Key pressed: ${event.key}`);

      if (event.key === 'Delete') {
        dispatch(deleteClip(Activeid));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [Activeid, dispatch]);



  const projectSettings = useSelector((state: RootState) => state.settings);
  const payloadString = JSON.stringify(inputProps, null, 2);
  const output = {
    inputProps: {
      payload: payloadString
    }
  };


  const saveDraftId = useSelector(
    (state: RootState) => state.editorTool.saveDraftId
  );
  // console.log("ddddd", saveDraftId)

  const saveDraftname = useSelector(
    (state: RootState) => state.editorTool.SaveDraftname
  );

  const saveClip = async () => {
    try {
      const formdata = new FormData();
      formdata.append("access_token", projectSettings.access_token);
      formdata.append("id", saveDraftId);
      formdata.append("name", saveDraftname);
      // console.log("project_name", saveDraftname)
      formdata.append("json", JSON.stringify(output));
      const response = await fetch(`${projectSettings.api_url}/kdmvideoeditor/save-draft-template`, {
        method: "POST",
        body: formdata,
      });
      const data = await response.json();
      console.log(data)
      // setView("SaveDraft");

    } catch {
      console.error("erroe data not fetched")
    }
  }

  const [isOpen, setexportOpenpopup] = useState(false);
  // const [setupPopup, setSetupPopup] = useState(false);

  const isMiddleSectionVisible = useSelector(
    (state: RootState) => state.editorTool.MiddleSectionVisible
  );

  useEffect(() => {
    dispatch(MiddleSectionVisibleaction(true));
  }, [view])

  // useEffect(() => {
  //   if (!isMiddleSectionVisible) {
  //     setView("");
  //   } else {
  //     dispatch(MiddleSectionVisibleaction(true));
  //   }
  // }, [isMiddleSectionVisible, view]);

  const [mainContentHeight, setMainContentHeight] = useState(60);

  console.log(mainContentHeight)

  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: any) => {
    if (isDragging) {
      const newHeight = (e.clientY / window.innerHeight) * 100;
      if (newHeight >= 20 && newHeight <= 80) {
        setMainContentHeight(newHeight);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };


  // draft name edit
  const [isEditing, setIsEditing] = useState(false);
  const [draftName, setDraftName] = useState(saveDraftname);

  const handleSave = () => {
    dispatch(setSaveDraftname(draftName));
    setIsEditing(false);
  };

  return (
    <>

      <div className="main-wrapper flex" onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}>


        {/* side nav  */}
        <div className="sidebar-menu">
          <div className="sidebar-head flex items-center gap-2">
            <div className="back-btn text-white">
              <FaAngleLeft />
            </div>
            <div className="sidebar-logo">
              <Image
                src={"https://www.aivideocreatorfx.in/app/assets/images/Ai-Employee-Favicon.png"}
                width={200}
                height={200}
                alt={"logo"}
              />
            </div>
          </div>

          <div className="sidebar-items-list">
            <div className="sidebar-items">
              <button
                onClick={() => setView("upload")}
                className="items-link"
              >
                <MdTune className="" style={{ color: "white" }} />
                <span className="item-text">upload</span>
              </button>
            </div>

            <div className="sidebar-items">
              <button
                onClick={() => setView("heygen_video_list")}
                className="items-link"
              >
                <MdPermMedia className="text-white" />
                <span className="item-text">Avatar</span>
              </button>
            </div>


            <div className="sidebar-items">
              <button
                onClick={() => setView("text")}
                className="items-link"
              >
                <BiText className="" style={{ color: "white" }} />
                <span className="item-text">Setup</span>
              </button>
            </div>

            <div className="sidebar-items">
              <button
                onClick={() => setView("template")}
                className="items-link"
              >
                <BiText className="" style={{ color: "white" }} />
                <span className="item-text">template</span>
              </button>
            </div>


            <div className="sidebar-items">
              <button
                onClick={() => setView("Library")}
                className="items-link"
              >
                <BiText className="" style={{ color: "white" }} />
                <span className="item-text">Library</span>
              </button>
            </div>




          </div>
        </div>


        {/* main pgae start  */}
        <div className="frame-wrapper">

          {/* header start */}
          <div className="theme-header">
            <SetupPopup />



            <div className="mid-content flex items-center text-white gap-2">
              {isEditing ? (
                <>
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="kd-form-input kd-form-input-style-2"
                    autoFocus
                  />
                  <FaCheck
                    onClick={handleSave}
                    className="text-white cursor-pointer"
                    title="Save"
                  />
                </>
              ) : (
                <>
                  <span className="cursor-pointer">{saveDraftname || "Untitled Video"}</span>
                  <BsPencilFill
                    onClick={() => {
                      setDraftName(saveDraftname);
                      setIsEditing(true);
                    }} className="text-white cursor-pointer"
                    title="Edit"
                  />
                </>
              )}
            </div>







            {/* <div className="mid-content flex items-center text-white gap-2">
              <span>{saveDraftname}</span>
              < BsPencilFill className="text-white" />
            </div> */}

            {/* <button
              onClick={() => setIsMiddleSectionVisible(!isMiddleSectionVisible)}
              className="kd-primary-btn"
            >
              hide show
            </button> */}




            <div className="right-content flex items-center gap-3">
              <UndoRedo />

              <button onClick={() => saveClip()}
                className="kd-primary-btn"
              >
                Save
              </button>
              {[
                "fDYSgxzymwn1zvECjA6R9TFsN3A2ZUFkS28vQXFwM0JibmM4cFY5dE96YjNZMlFUMVlmQjNQQUJYb2c9",
                "bzoNSJpnCnEVTo6f2fpuZDkvYVEzdkR0T2pVWGFhSVl0UU9VTS9wSSt3aWhKMVVOOXVONmVKbHpTZFE9",
              ].includes(projectSettings.access_token) && (
                  <button
                    onClick={() => templatedwnld()}
                    className="kd-primary-btn"
                  >
                    Template
                  </button>
                )}

              {/* <button
                onClick={() => templatedwnld()}
                className="kd-primary-btn"
              >
                Template
              </button> */}

              <button onClick={() => setexportOpenpopup(true)}
                className="kd-primary-btn"
              >
                Export
              </button>



              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"></div>
                  {/* Popup Box */}
                  <div
                    className="fixed bg-white p-6 rounded-lg shadow-lg w-96 z-50 kd-export-modal"
                    style={{
                      top: "70px",
                      right: "10px",
                    }}
                  >

                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setexportOpenpopup(false)}
                    >
                      <FaTimes size={18} />
                    </button>

                    {/* Popup Content */}
                    <h2 className="text-xl font-semibold mb-4 kd-white-color">Export Options</h2>

                    <div> <RenderControls inputProps={inputProps}></RenderControls> </div>
                  </div>
                </>
              )}

            </div>

          </div>

          {/* video editor body start  */}
          {/* side panel start */}
          <div className="inner-wrapper grid grid-cols-12 gap-2">

            <div className={`${isMiddleSectionVisible === true ? "col-span-3 sidebar" : "hidden"} `}>
              {view === "menu" && <MenuBarSetting />}
              {view === "template" && <Template />}
              {view === "text" && <TextToolPanel />}
              {view === "texteditor" && <TextEditTool />}
              {view === "upload" && (<Upload />)}
              {view === "image" && <ImageGrid />}
              {view === "image_edit_tool" && <ImageEditTool />}
              {view === "video" && <VideoGrid />}
              {view === "video_edit_tool" && <VideoEditTool />}
              {view === "emoji" && (<EmojiCollage />)}
              {view === "emoji_edit_tool" && (<EmojiEditTool />)}
              {view === "heygen_video_list" && (<HeygenVideolist />)}
              {view === "render_video_list" && (<RenderVideolist />)}
              {view === "audio" && (<Audio />)}
              {view === "audio_edit_tool" && (<AudioEditTool />)}
              {view === "Library" && (<Library />)}
              {view === "SaveDraft" && (<SaveDraft />)}
            </div>

            {/* editor view (canwas ,button bar ,timeline) start */}
            {/* Player Section */}
            <div className={`${isMiddleSectionVisible === true ? "col-span-9 editor-view" : "col-span-12 editor-view"}`} >

              <div onPointerDown={onPointerDown} style={{ overflow: 'hidden', zIndex: 1, height: `calc(100% - ${100 - mainContentHeight}%)`, }} className="relative flex items-center justify-center customPlayer" >

                <div className="m-5">
                  <Player
                    ref={playerRef}
                    component={Main}
                    inputProps={inputProps}
                    durationInFrames={Math.max(1, DURATION_IN_FRAMES)}
                    fps={VIDEO_FPS}
                    compositionHeight={VIDEO_HEIGHT}
                    compositionWidth={VIDEO_WIDTH}
                    // style={{
                    //   minHeight: playerHeight,
                    //   maxHeight: playerHeight,
                    // }}
                    style={{
                      height: `${mainContentHeight - 10}vh`,
                    }}
                    // controls
                    autoPlay={false}
                    overflowVisible
                  // loop
                  />
                </div>
              </div>

              {/* strech bar  */}
              <div className="kd-strech-bar" onMouseDown={handleMouseDown}></div>

              {/* Timeline Section */}
              <div style={{ height: `calc(100% - ${mainContentHeight}%)` }} >
                <div className="select-none rounded-lg" style={{ height: "100%" }}>

                  <div className="video-controls">
                    {/* PLAY BUTTON  */}
                    <div className="play-pause-wrapper">

                      <div className="inline-flex">
                        <PlayPauseButton playerRef={playerRef} />
                      </div>

                      <div>
                        <TimeDisplay
                          durationInFrames={DURATION_IN_FRAMES}
                          fps={30}
                          playerRef={playerRef}
                        />
                      </div>

                    </div>

                    {/* zoom timline start */}
                    <div className="timestamp-wrapper flex items-center gap-2">

                      <button className="timestap-control-btn" onClick={handleZoomOut}>
                        <FaMagnifyingGlassMinus />
                      </button>


                      <input
                        type="range"
                        min="30"
                        max="150"
                        value={timelinezoomLevel}
                        onChange={handleSliderChange}
                        className="w-28 h-2 bg-[--kd-white-color] rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[--kd-background] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-sm"
                      />


                      <button className="timestap-control-btn" onClick={handleZoomIn}>
                        <FaMagnifyingGlassPlus />
                      </button>

                      {/* <FullscreenButton playerRef={playerRef} /> */}
                      {/* <MuteButton playerRef={playerRef} />
                  <VolumeSlider playerRef={playerRef} />
                  <LoopButton loop={loop} setLoop={setLoop} /> */}
                    </div>

                    {/* zoom timline end */}
                  </div>
                  {/* timing bar */}

                  <div className="timeline-container">
                    <Rv playerRef={playerRef} />
                  </div>

                </div>
                {/* timeline end */}
              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
