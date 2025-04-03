import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { addClip, ImageClip, updateClip } from '../../../app/store/clipsSlice';
import { RootState } from "../../../app/store/store";


const ImageList: React.FC = ({  }) => {
  const dispatch = useDispatch();
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [reLoadinglist, setreLoadinglist] = useState(false);

  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
  const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);

  const projectSettings = useSelector((state: RootState) => state.settings);
 
  const bg_height = useSelector(
    (state: RootState) => state.slices.present.videoheight
  );
  const bg_width = useSelector(
    (state: RootState) => state.slices.present.videowidth
  );
  const playercurrentframe = useSelector(
    (state: RootState) => state.slices.present.playertotalframe
  );


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {

      if (event.data.action === 'FileUploadedSuccessfully') {
        console.log("FileUploadedSuccessfully done");
        // setreLoadinglist(true);
        setreLoadinglist(prev => !prev);
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
        const response = await fetch(`${projectSettings.api_url}/kdmvideoeditor/get-user-images`, {
          method: "POST",
          body: formdata,
        });
        const data = await response.json();

        setImages(data);
        console.log(data)
      } catch {
        console.error("erroe data not fetched")
      } finally {
        setLoading(false);
      }
    }
    fetchdata()
  }, [projectSettings.access_token, projectSettings.api_url,reLoadinglist])



  const createclpis = (url: string) => {

    Allclips.forEach((clip) => {
      dispatch(updateClip({ ...clip, properties: { ...clip.properties, zindex: clip.properties.zindex + 1 } }));
    });

    if (imageSize) {
      const newClip: ImageClip = {
        id: `image-${Date.now()}`,
        type: 'image',
        properties: {
          src: url,
          animationType: "normal",
          width: imageSize.width,
          height: imageSize.height,
          opacity: 1,
          start: playercurrentframe,
          duration: 120,
          maxWidth: 200,
          maxHeight: 200,
          objectFit: "",
          top: bg_height / 2 - imageSize.height/2,
          left: bg_width / 2 -imageSize.width/2,
          zindex: 1,
          contrast: 100,
          hueRotate: 0,
          saturate: 1,
          blur: 0,
          grayscale: 0,
          sepia: 0,
          borderRadius:"0",
          transform:"",
          brightness: 100,
          rotation: 0,
          
          isDragging: false,
        },
      };
      dispatch(addClip(newClip));
    }
  };


  const handleImageLoad = (event: any) => {
    setImageSize({ width: event.naturalWidth, height: event.naturalHeight });
  };

  return (

 <div className="p-2">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader  text-slate-50">Loading...</div>
        </div>
      ) : images && images.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="image-box-wrapper">
               <Image
                src={image.url}
                width={200}
                height={200}
                alt={`Image ${index}`}
                className="w-full h-auto cursor-pointer"
                onClick={() => createclpis(image.url)}
                onLoadingComplete={handleImageLoad}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">No images found</p>
        </div>
      )}
    </div>
  );
};

export default ImageList;
