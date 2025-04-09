import React, { useEffect, useRef } from "react";
import { State } from "../../helpers/use-rendering";
import { Button } from "./Button";
import { Spacing } from "./Spacing";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import { z } from "zod";
import { CompositionProps } from "../../types/constants";

const Megabytes: React.FC<{
  sizeInBytes: number;
}> = ({ sizeInBytes }) => {
  const megabytes = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  }).format(sizeInBytes);
  return <span className="opacity-60">{megabytes}</span>;
};


interface RenderControlsProps {

  inputProps: z.infer<typeof CompositionProps>;
}



export const DownloadButton: React.FC<{
  inputProps: RenderControlsProps;
  state: State;
  undo: () => void;

}> = ({ state, undo, inputProps }) => {
  if (state.status === "rendering") {
    return <Button disabled>Download video</Button>;
  }

  if (state.status !== "done") {
    throw new Error("Download button should not be rendered when not done");
  }

  const payloadString = JSON.stringify(inputProps.inputProps, null, 2);
  const output = {
    inputProps: {
      payload: payloadString
    }
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const projectSettings = useSelector((state: RootState) => state.settings);
  const saveDraftId = useSelector(
    (state: RootState) => state.editorTool.saveDraftId
  );
  // console.log("ddddd", saveDraftId)

  const saveDraftname = useSelector(
    (state: RootState) => state.editorTool.SaveDraftname
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sendMessageToParent = async (final_video: string) => {
    try {
      const formdata = new FormData();
      formdata.append("access_token", projectSettings.access_token);
      formdata.append("urls", final_video);
      formdata.append("id", saveDraftId);
      formdata.append("name", saveDraftname);
      formdata.append("project_id", projectSettings.project_id);
      formdata.append("json", JSON.stringify(output));
      const response = await fetch(`${projectSettings.api_url}/kdmvideoeditor/render-video-server`, {
        method: "POST",
        body: formdata,
      });
      const data = await response.json();

      console.log(data)
    } catch {
      console.error("erroe data not fetched")
    }
  }




  // This ref will track if we've already sent the message for the current done state.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hasSentMessageRef = useRef(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    // When the status becomes "done" and we haven't sent the message yet...
    if (state.status === "done" && !hasSentMessageRef.current) {
      sendMessageToParent(state.url);
      hasSentMessageRef.current = true;
    }
    // Reset the flag when state changes away from "done".
    else if (state.status !== "done") {
      hasSentMessageRef.current = false;
    }
  }, [state.status, state.url, sendMessageToParent]);

  return (
    <div className="flex">
      <Button secondary onClick={undo}>
        <UndoIcon></UndoIcon>
      </Button>
      <Spacing></Spacing>
      <a href={state.url}>
        <Button>
          Download video
          <Spacing></Spacing>
          <Megabytes sizeInBytes={state.size}></Megabytes>
        </Button>
      </a>
    </div>
  );
};

const UndoIcon: React.FC = () => {
  return (
    <svg height="1em" viewBox="0 0 512 512">
      <path
        fill="var(--foreground)"
        d="M48.5 224H40c-13.3 0-24-10.7-24-24V72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8H48.5z"
      />
    </svg>
  );
};
