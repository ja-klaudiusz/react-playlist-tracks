import { configureStore } from "@reduxjs/toolkit";
import timerReducer from "../redux/timer/timerSlice";
import dataReducer from "../redux/data/dataSlice";
import settingsSlice from "../redux/settings/settingsSlice";
import { debounce } from "debounce";
import { saveState } from "./utils";

export const store = configureStore({
  reducer: {
    timer: timerReducer,
    data: dataReducer,
    settings: settingsSlice,
  },
});

store.subscribe(
  debounce(() => {
    const currentState = store.getState();
    const data = currentState?.data;
    const settings = currentState?.settings;
    data && saveState(data, "data");
    settings && saveState(settings, "settings");
  }, 800)
);
