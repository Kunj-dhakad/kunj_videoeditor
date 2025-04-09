import {
  useDispatch,
  useSelector,
} from "react-redux";
import {
  updateVideoSettings,
  settotalduration,
  addClip,
  resetAllclips,
} from "../../app/store/clipsSlice";
import { Allclips } from "../../app/store/clipsSlice";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { MiddleSectionVisibleaction } from "../../app/store/editorSetting";
import { RootState } from "../../app/store/store";

const Template: React.FC = () => {
  const dispatch = useDispatch();
  const projectSettings = useSelector((state: RootState) => state.settings);


  const Set_template = async (url: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      const jsonData = await response.json();
      // console.log("response", jsonData.inputProps);
      const payload = JSON.parse(jsonData.inputProps.payload);

      // console.log("videoWidth", payload.videoWidth);
      dispatch(resetAllclips());


      dispatch(
        updateVideoSettings({
          videowidth: payload.videoWidth,
          videoheight: payload.videoHeight,
          videobg: payload.videobg,
        })
      );
      dispatch(settotalduration(payload.durationInFrames));

      payload.Allclips.forEach((clip: Allclips) => {
        dispatch(addClip(clip));
      });

    } catch (err) {

    }
  }


  const [templateData, settemplateData] = useState<{ id: string; thumbnail_url: string; json_url: string }[] | undefined>(undefined);
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const fetchdata = async () => {
      setloading(true)
      try {

        const formdata = new FormData();
        formdata.append("access_token", projectSettings.access_token);
        const response = await fetch(`${projectSettings.api_url}/kdmvideoeditor/get-default-template`, {
          method: "POST",
          body: formdata,
        });
        const data = await response.json();

        settemplateData(data);
        // console.log(data)
        setloading(false)

      } catch {
        console.error("erroe data not fetched")
      } finally {
        // settemplateData(data);
      }``
    }
    fetchdata()
  }, [])

  const toolbarhide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(MiddleSectionVisibleaction(false));
  }
  return (
    <div className="kd-editor-panel">
      <div className="kd-editor-head flex items-center justify-between text-white mb-4">
        <p className="left-text">Template</p>
        {/* <a href="javascript:void(0);" className="toggle-icon">
               <FaArrowLeft />
             </a> */}
        <button onClick={toolbarhide} className="toggle-icon">
          <FaArrowLeft />
        </button>
      </div>


      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader text-slate-50">Loading...</div>
        </div>
      ) : templateData && templateData.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mt-4 ">
          {templateData.map((template, index) => (
            <div key={index} className=" image-box-wrapper">
              <Image
                src={template.thumbnail_url}
                width={300}
                height={300}
                quality={50}
                alt={`Video thumbnail for video ${index + 1}`}
                onClick={() => { Set_template(template.json_url) }}
                className="w-full h-auto cursor-pointer"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No template found</p>
        </div>
      )}

    </div>
  );
};

export default Template;
