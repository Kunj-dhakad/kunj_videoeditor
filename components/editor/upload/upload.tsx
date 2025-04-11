import { useEffect, useState, } from "react";
// import { FaArrowLeft } from "react-icons/fa";
import Videolist from "./videolist";
import Imagelist from "./imagelist";
import AudioList from "./audiolist";
import { MiddleSectionVisibleaction } from "../../../app/store/editorSetting";
import { useDispatch } from "react-redux";

const Upload: React.FC = () => {
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState<"videos" | "images" | "audio">("videos");


  const sendMessageModelOpen = () => {
    window.parent.postMessage({ action: 'sendMessageModelOpen' }, '*');
  }

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("event", event)
      if (event.data.action === 'FileUploadedSuccessfully') {
        console.log("FileUploadedSuccessfully done");
        if (event.data.upload_file_type === "videos") {
          setActiveTab("videos")

        }
        if (event.data.upload_file_type === "image") {
          setActiveTab("images")

        }
        if (event.data.upload_file_type === "audio") {
          setActiveTab("audio")
        }

      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, []);

  const toolbarhide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(MiddleSectionVisibleaction(false));
  }

  return (
    // <div className="kd-editor-panel">



    //   <div className="kd-editor-head flex items-center justify-between text-white mb-4">
    //     <p className="left-text">My Assets</p>

    //     {/* <a onClick={toolbarhide}  className="toggle-icon" type="button">
    //       <FaArrowLeft />
    //     </a> */}
    //     <button onClick={toolbarhide} className="toggle-icon">
    //       <FaArrowLeft />
    //     </button>


    //   </div>

    //   <div className="upload-wrapper">
    //     <div onClick={sendMessageModelOpen} className="custom-file-upload">
    //       <div className="left-content">
    //         <div className="image-box">
    //           <img id="previewImage" src="https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/image/faFileUpload.png" alt="image" />
    //         </div>
    //       </div>
    //       <div className="right-content">
    //         <h5 className="title">Upload Asset</h5>
    //         <p>Videos, Images, GIFs & Audios</p>
    //       </div>
    //     </div>
    //   </div>
    //   {/* Tabs for Video and Image List */}
    //   <div className="kd-tab-wrapper">
    //     <div className="kd-tab-list">
    //       <button
    //         onClick={() => setActiveTab("videos")}
    //         className={`kd-tab-btn ${activeTab === "videos" ? "active" : ""}`}
    //       >
    //         Videos
    //       </button>
    //       <button
    //         onClick={() => setActiveTab("images")}
    //         className={`kd-tab-btn ${activeTab === "images" ? "active" : ""}`}
    //       >
    //         Images
    //       </button>
    //       <button
    //         onClick={() => setActiveTab("audio")}
    //         className={`kd-tab-btn ${activeTab === "audio" ? "active" : ""}`}
    //       >
    //         Audio
    //       </button>
    //     </div>

    //     <div>
    //       {activeTab === "videos" && (
    //         <div className="text-neutral-950">
    //           <Videolist />
    //         </div>
    //       )}

    //       {activeTab === "images" && (
    //         <div className="text-neutral-950">
    //           <Imagelist />
    //         </div>
    //       )}

    //       {activeTab === "audio" && (
    //         <div className="text-neutral-950">
    //           < AudioList />
    //         </div>
    //       )}


    //     </div>
    //   </div>
    // </div>



    <div className="kd-upload-panel">
      {/* Header */}
      <div className="kd-editor-head flex items-center justify-between text-white mb-4">
        <p className="left-text">My Assets</p>

        {/* <a onClick={toolbarhide}  className="toggle-icon" type="button">
          <FaArrowLeft />
       </a> */}
        <button onClick={toolbarhide} className="toggle-icon">
          <img src="https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/image/collapse.svg" alt="Collapse Icon" />
        </button>

      </div>



      <div className="upload-wrapper">
        <div onClick={sendMessageModelOpen} className="custom-file-upload">
          <div className="left-content">
            <div className="image-box">
              <img id="previewImage" src="https://kdmeditor.s3.us-east-1.amazonaws.com/kd_videoeditor/files/image/faFileUpload.png" alt="image" />
            </div>
          </div>
          <div className="right-content">
            <h5 className="title">Upload Asset</h5>
            {/* <p>Videos, Images, GIFs & Audios</p> */}
            <p>Videos, Images & Audios</p>

          </div>
        </div>
      </div>
      {/* Tabs */}


      <div className="kd-tab-wrapper">
        <div className="kd-tab-list">
          <button
            onClick={() => setActiveTab("videos")}
            className={`kd-tab-btn ${activeTab === "videos" ? "active" : ""}`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`kd-tab-btn ${activeTab === "images" ? "active" : ""}`}
          >
            Images
          </button>
          <button
            onClick={() => setActiveTab("audio")}
            className={`kd-tab-btn ${activeTab === "audio" ? "active" : ""}`}
          >
            Audio
          </button>
        </div>
      </div>


      {/* Scrollable Content */}
      <div className="kd-upload-content">
        {activeTab === "videos" && <Videolist />}
        {activeTab === "images" && <Imagelist />}
        {activeTab === "audio" && <AudioList />}
      </div>
    </div>

  );
};

export default Upload;

