import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface editorSettingData { // Fixed typo
    Activeid: string;
    saveDraftId:string;
    MiddleSectionVisible:boolean;
}

const initialSettingsState: editorSettingData = {
    Activeid: "",
    saveDraftId:"",
    MiddleSectionVisible:true,
};

const editorTool = createSlice({
    name: 'editorTool', 
    initialState: initialSettingsState,
    reducers: {
        setActiveid: (state, action: PayloadAction<string>) => {
            state.Activeid = action.payload;
            // console.log(action.payload)
        },
        setsaveDraftId: (state, action: PayloadAction<string>) => {
            state.saveDraftId = action.payload;
            // console.log(action.payload)
        },

        MiddleSectionVisibleaction: (state, action: PayloadAction<boolean>) => {
            state.MiddleSectionVisible = action.payload;
            // console.log(action.payload)
        },
    },
});

export const { setActiveid,setsaveDraftId ,MiddleSectionVisibleaction} = editorTool.actions;
export default editorTool.reducer;
