import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
import { addClip, updateClip, updateVideoSettings, VideoClip } from "../../../app/store/clipsSlice";

export const useVideoAddHelper = () => {

    const Allclips = useSelector(
        (state: RootState) => state.slices.present.Allclips
    );

    const dispatch = useDispatch();

    function add_video_clip(url: string, thumbnail_url: string, width: number, height: number, duration: number, bg_height: number, bg_width: number) {
       console.log("datattttt",bg_width,bg_width,url,thumbnail_url,width,height)
        dispatch(updateVideoSettings({
            videowidth: Number(bg_width),
            videoheight: Number(bg_height),
            videobg: "#fff"
        }));


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
                top: Number(bg_height) / 2 - Number(height) / 4,
                left: Number(bg_width) / 2 - Number(width) / 4,
                height: Number(height) / 2,
                width: Number(width) / 2,
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
    return add_video_clip;
};
