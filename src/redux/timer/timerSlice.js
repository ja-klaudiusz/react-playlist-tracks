import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  timerState: { start: false, pause: false, stop: true },
  time: {
    ms: null,
    s: null,
    m: null,
    h: null,
    d: null,
  },
  counter: 0,
  nowPlaying: {},
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    updateTimer: (state, action) => {
      state.time = action.payload.time;
      state.counter = action.payload.counter;
    },
    setNowPlaying: (state, action) => {
      let newNowPlaying = { ...state.nowPlaying };
      const { id, isPlaying, timeLong } = action.payload;
      if (isPlaying && timeLong) {
        newNowPlaying[id] = timeLong;
      } else {
        delete newNowPlaying[id];
      }

      state.nowPlaying = {
        ...newNowPlaying,
      };
    },
    clearNowPlaying: (state, action) => {
      state.nowPlaying = {};
    },
    setTimerState: (state, action) => {
      const { start, pause, stop } = action.payload;
      state.timerState = { start, pause, stop };
    },
  },
});

export const { updateTimer, setNowPlaying, clearNowPlaying, setTimerState } =
  timerSlice.actions;

export const updateAsync = (timerData) => (dispatch, getState) => {
  const newTime = {
    ...timerData,
    time: {
      ms: null,
      s: null,
      m: null,
      h: null,
      d: null,
    },
  };
  dispatch(updateTimer(timerData.time.ms === 0 ? newTime : timerData));
};

export default timerSlice.reducer;
