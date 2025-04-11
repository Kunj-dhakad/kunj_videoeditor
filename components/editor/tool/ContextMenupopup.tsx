import React, { useEffect } from "react";
import {
  updateClip,
  deleteClip,
  Allclips,
  addClip,
  // setActiveid,
  // setActiveid,
} from "../../../app/store/clipsSlice";

// import { setActiveid } from "../../../app/store/editorSetting";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../app/store/store";
// import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoDuplicateOutline } from "react-icons/io5";

type ContextMenuProps = {
  Allclip: Allclips;
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ Allclip }) => {
  const Allclips = useSelector(
    (state: RootState) => state.slices.present.Allclips
  );


  const dispatch = useDispatch();

  // const onEdit = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   dispatch(setActiveid(Allclip.id))
  // };

  const onDuplicate = () => {

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

    const prefix = Allclip.id.split('-')[0];
    const newId = `${prefix}-${Date.now()}`;
    const duplicatedClip = {
      ...Allclip,
      id: newId,
    };


    dispatch(addClip(duplicatedClip));
  };


  const onDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(deleteClip(Allclip.id));
  };


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        dispatch(deleteClip(Allclip.id));

      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch, Allclip.id]);



  return (
    <div className="option-toolbar">
      {/* <button
        className="px-6 py-3 text-2xl text-gray-700 hover:bg-gray-200 focus:outline-none flex items-center space-x-3"
        onClick={onEdit}
      >
        <FaEdit className="text-5xl text-blue-500" />
      </button> */}

      <button
        className="toolbar-box"
        onClick={onDuplicate}
      >
        <IoDuplicateOutline  className="tool-icon" />
        {/* <span className="text-5xl">Duplicate</span> */}
      </button>
      <button
        className="toolbar-box"
        onClick={onDelete}
      >
        <MdDelete className="tool-icon" />
        {/* <span className="text-5xl">Delete</span> */}
      </button>
    </div>
  );
};
