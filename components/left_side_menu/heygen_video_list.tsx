import { useEffect, useState } from "react";
import Image from 'next/image';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import { addClip, updateClip, VideoClip } from "../../app/store/clipsSlice";


const HeygenVideolist: React.FC = () => {
  const dispatch = useDispatch();

  const projectSettings = useSelector((state: RootState) => state.settings);
  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );
  const bg_height = useSelector(
    (state: RootState) => state.slices.present.videoheight
  );
  const bg_width = useSelector(
    (state: RootState) => state.slices.present.videowidth
  );
  const [videoData, setVideoData] = useState<{ urls: string; thumbnail: string; width: number; height: number; duration: number; }[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [reLoadinglist, setreLoadinglist] = useState(false);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {

      if (event.data.action === 'FileUploadedSuccessfully') {
        console.log("FileUploadedSuccessfully done");
        setreLoadinglist(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };

  }, []);



  useEffect(() => {
    const fetchdata = async () => {
      try {

        const formdata = new FormData();
        formdata.append("access_token", projectSettings.access_token);
        formdata.append("video_status", "heygen");

        const response = await fetch(`${projectSettings.api_url}/kdmvideoeditor/get-user-video`, {
          method: "POST",
          body: formdata,
        });
        const data = await response.json();

        setVideoData(data);
        console.log(data)
      } catch {
        console.error("erroe data not fetched")
      } finally {
        setIsLoading(false);
      }
    }
    fetchdata()
  }, [projectSettings.access_token, projectSettings.api_url, reLoadinglist])


  function add_video_clip(url: string, thumbnail_url: string, width: number, height: number, duration: number) {

    Allclips.forEach((clip) => {
      dispatch(
        updateClip({
          ...clip,
          properties: {
            ...clip.properties,
            zindex: clip.properties.zindex + 1,
          },
        })
      );
    });
    const newClip: VideoClip = {
      id: `video-${Date.now()}`,
      type: "video",
      properties: {
        src: url,
        start: 0,
        duration: Math.floor(Number(duration) * 30),
        top: bg_height / 2 - height / 4,
        left: bg_width / 2 - width / 4,
        height: height / 2,
        width: width / 2,
        volume: 0.5,
        rotation: 0,
        zindex: 1,
        TrimStart: 1,
        TrimEnd: Math.floor(Number(duration) * 30),//add daynemic duration 
        videothumbnail: thumbnail_url,
        borderRadius: "0",
        transform: "",
        isDragging: false,
      },
    };
    dispatch(addClip(newClip));

  }

  return (
    <div className="mx-auto h-[80vh] overflow-y-scroll p-2">
      <h2 className="text-lg font-bold mb-2 text-sky-700"> Avtar video list </h2>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader">Loading...</div>
        </div>
      ) : videoData && videoData.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {videoData.map((video, index) => (
            <div key={index} className="mb-4">
              <Image
                src={video.thumbnail}
                width={300}
                height={300}
                quality={50}
                alt={`Video thumbnail for video ${index + 1}`}
                onClick={() =>
                  add_video_clip(video.urls, video.thumbnail, video.width, video.height, video.duration)
                }
                className="w-full h-auto cursor-pointer"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No videos found</p>
        </div>
      )}
    </div>
  )
}
export default HeygenVideolist;

