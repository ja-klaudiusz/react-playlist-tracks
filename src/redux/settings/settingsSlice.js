import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../../store/utils";
const initialState = {
  timeDivider: 10,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: loadState("settings") || initialState,
  reducers: {},
});

export default settingsSlice.reducer;
