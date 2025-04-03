import { useDispatch } from "react-redux";
import {
    addClip,
} from "../../../app/store/clipsSlice";
import { Allclips } from "../../../app/store/clipsSlice";

export const useTextTemplateSet = () => {
    const dispatch = useDispatch();

    const Set_text_template = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Failed to fetch");
            }
            const jsonData = await response.json();
            const payload = JSON.parse(jsonData.inputProps.payload);

            payload.Allclips.forEach((clip: Allclips) => {
                console.log(clip)
                dispatch(
                    addClip({
                        ...clip,
                        id: `text-${Date.now()}-${Math.random()}`, 
                    })
                );
            });

        } catch (err) {

        }
    }
    return Set_text_template; 
};
