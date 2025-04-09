import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ProjecSettingtData {
  action: string;
  id: string;
  project_name:string;
  access_token: string;
  project_id: string;
  api_url: string;
}

const initialSettingsState: ProjecSettingtData = {
  action: "sendProjectInfo",
  id: "1",
  access_token: "bzoNSJpnCnEVTo6f2fpuZDkvYVEzdkR0T2pVWGFhSVl0UU9VTS9wSSt3aWhKMVVOOXVONmVKbHpTZFE9",
  project_id: "project_aiappsempire",
  project_name:"AI Tube star",
  api_url: "https://www.aitubestar.com/",
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    updateProjectSettings: (state, action: PayloadAction<ProjecSettingtData>) => {
      const { action: actionType, id, access_token, project_id,project_name, api_url } = action.payload;
      state.id = id;
      state.action = actionType;
      state.project_id = project_id;
      state.project_name = project_name;
      state.api_url = api_url;
      state.access_token = access_token;
    },
  },
});

export const { updateProjectSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
