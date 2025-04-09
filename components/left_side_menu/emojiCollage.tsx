
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { addClip, EmojiClip, updateClip } from '../../app/store/clipsSlice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../app/store/store";
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { MiddleSectionVisibleaction, settoolbarview } from '../../app/store/editorSetting';
import { FaAngleLeft } from "react-icons/fa6";

interface Element {
  id: number;
  name: string;
  category: string;
  svg_url: string;
  tags: string;
}

const EmojiCollage: React.FC = () => {


  const [elements, setElements] = useState<Element[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchElements = async () => {
      try {
        const res = await fetch("/api/getElements");
        const data = await res.json();
        setElements(data.data);
      } catch (error) {
        console.error("Error fetching elements:", error);
      }
    };

    fetchElements();
  }, []);

  // Group elements by category
  const categories = elements.reduce((acc, el) => {
    if (!acc[el.category]) {
      acc[el.category] = [];
    }
    acc[el.category].push(el);
    return acc;
  }, {} as { [key: string]: Element[] });

  // 🔍 Filtered Elements Based on Search
  const filteredCategories = Object.entries(categories).reduce((acc, [category, items]) => {
    const filteredItems = items.filter((el) =>
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.tags.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredItems.length > 0) {
      acc[category] = filteredItems;
    }

    return acc;
  }, {} as { [key: string]: Element[] });




  const playercurrentframe = useSelector(
    (state: RootState) => state.slices.present.playertotalframe
  );

  const Allclips = useSelector((state: RootState) => state.slices.present.Allclips);
  const bg_height = useSelector(
    (state: RootState) => state.slices.present.videoheight
  );
  const bg_width = useSelector(
    (state: RootState) => state.slices.present.videowidth
  );

  const sanitizeSvgContent = (svgText: string): string => {
    // Sanitize basic SVG issues
    let sanitizedText = svgText
      .replace(/\\+"/g, '"')
      .replace(/\s+/g, ' ')
      .replace(/^\"/, '')
      .replace(/\"$/, '')
      .replace(/\\r\\n/g, '')

      .replace(/\r\n/g, '')

      .replace(/\n/g, '')
      .trim();


    console.log("sanitizedText", sanitizedText)
    return sanitizedText;
  };
  const fetchSvg = async (svgUrl: string) => {
    try {

      const proxyUrl = '/api/emoji';

      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: svgUrl }),
      });

      let svgText = await response.text();
      svgText = sanitizeSvgContent(svgText);
      createclpis(svgText, svgUrl)

    } catch (error) {
      console.error("Failed to load SVG:", error);
    }
  };


  const createclpis = (svgtext: string, url: string) => {

    Allclips.forEach((clip) => {
      dispatch(updateClip({ ...clip, properties: { ...clip.properties, zindex: clip.properties.zindex + 1 } }));
    });

    const newClip: EmojiClip = {
      id: `emoji-${Date.now()}`,
      type: 'emoji',
      properties: {
        animationType: "normal",
        src: url,
        svgtext: svgtext,
        width: 200,
        height: 200,
        start: playercurrentframe,
        duration: 120,
        top: bg_height / 2 - 125,
        left: bg_width / 2 - 100,
        zindex: 1,
        opacity: 1,
        fill: 'none',
        stroke: 'black',
        strokeWidth: 1,
        filter: 'none',
        cursor: 'pointer',
        color: "#000000",
        transform: "",
        transition: 'transform 0.3s',
        isDragging: false,
        rotation: 0,
      },
    };

    dispatch(addClip(newClip));

  };


  // const [loading, setLoading] = useState(true);

  const toolbarhide = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(MiddleSectionVisibleaction(false));

  }

  const toolbarviewset = (view: string) => {
    dispatch(settoolbarview(view));
  }
  return (
    <div className="kd-editor-panel">

      <div className="kd-editor-head flex items-center justify-between text-white mb-4">

        <div className='flex items-center'>
          {expandedCategory ? (
            <button
              onClick={() => setExpandedCategory(null)} className="toggle-icon"
            >
              <FaAngleLeft />
            </button>
          ) : (


            <button
              onClick={() => toolbarviewset("Library")} className="toggle-icon"
            >
              <FaAngleLeft />
            </button>
          )}

          <p className="ms-2 left-text">Elements</p>
        </div>

        <button onClick={toolbarhide} className="toggle-icon">
          <FaArrowLeft />
        </button>

      </div>

      {/* Search Input */}
      {!expandedCategory && (
        <div className="search-bar right-icon mb-4">
          <div className="search-icon">
            <FaSearch />
          </div>

          <input
            type="text"
            placeholder="Search elements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full kd-form-input search"
          />

        </div>
      )}



      {/* Render categories */}
      {Object.entries(filteredCategories).map(([category, items]) => (
        <div key={category} className={expandedCategory && expandedCategory !== category ? "hidden" : "mb-8"}>

          <h2 className="text-white title-text text-xl mb-2">{category}</h2>

          <div className="grid grid-cols-3 gap-4">
            {items.slice(0, expandedCategory === category ? items.length : 5).map((el) => (
              <div key={el.id}

                onClick={() => el.category === "shapes" ? fetchSvg(el.svg_url) : createclpis("", el.svg_url)}

                className="flex items-center justify-center kd-icon-bx ">
                <Image
                  className="object-svg p-2 cursor-pointer"
                  draggable="false"
                  src={el.svg_url}
                  width={200}
                  height={200}
                  alt={`Object ${el.name}`}
                />
              </div>
            ))}
            {items.length > 5 && !expandedCategory && (
              <button
                onClick={() => setExpandedCategory(category)}
                className="flex items-center text-white justify-center kd-white-color rounded kd-icon-bx"
              >
                See All
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
};

export default EmojiCollage;