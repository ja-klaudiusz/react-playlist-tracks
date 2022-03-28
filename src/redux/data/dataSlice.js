import { v4 as uuidv4 } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { loadState } from "../../store/utils";
const initialState = {
  totalPeriod: [0, 5000],
  tracks: {
    "898a326e-1bda-49bf-b47f-6abc62487ead": { name: "Track 1" },
    "7d90939e-dca4-47b3-ba03-8221bf795cf0": { name: "Track 2" },
    "1789d392-57b1-4af5-93fb-bdcf4e2197fd": { name: "Track 3" },
  },
  masterData: {
    "dd1007a7-b442-442b-a15f-a09054bee96e": {
      trackId: "898a326e-1bda-49bf-b47f-6abc62487ead",
      elementName: "Element 1",
      startTime: "0",
      period: [0, 1000],
    },
    "0c1f4164-6058-4078-ad78-88edc9003458": {
      trackId: "7d90939e-dca4-47b3-ba03-8221bf795cf0",
      elementName: "Element 2",
      startTime: "2000",
      period: [2000, 3000],
    },
    "9ebef55c-d24d-4e58-9beb-e4d754bec252": {
      trackId: "1789d392-57b1-4af5-93fb-bdcf4e2197fd",
      elementName: "Element 3",
      startTime: "1500",
      period: [1500, 2500],
    },
    "7eb9710b-170e-45b5-8ca1-0a1c7daf369e": {
      trackId: "7d90939e-dca4-47b3-ba03-8221bf795cf0",
      elementName: "Element 4",
      startTime: "4000",
      period: [4000, 5000],
    },
  },
  elementInEdit: null,
};

export const dataSlice = createSlice({
  name: "data",
  initialState: loadState("data") || initialState,
  reducers: {
    updateData: (state, action) => {
      state.masterData = action.payload;
    },
    updateTotalPeriod: (state, action) => {
      state.totalPeriod = action.payload;
    },
    updateElementPeriod: (state, action) => {
      const newMasterData = { ...state.masterData };
      const { elemPeriodStart, elemPeriodEnd, id, trackId, periodStart } =
        action.payload;

      const length = elemPeriodEnd - elemPeriodStart;

      let newPeriodStart = Math.round(parseInt(periodStart) / 100) * 100;

      let newPeriodEnd = newPeriodStart + length;

      let newElement = {
        ...newMasterData[id],
        period: [newPeriodStart, newPeriodEnd],
      };

      state.masterData = {
        ...newMasterData,
        [id]: newElement,
      };
    },
    updateElementDetails: (state, action) => {
      const newMasterData = { ...state.masterData };
      console.log(action.payload);
      const { elemPeriodStart, elemPeriodEnd, elementId, elementName } =
        action.payload;

      let newElement = {
        ...newMasterData[elementId],
        elementName,
        period: [elemPeriodStart, elemPeriodEnd],
      };

      state.masterData = {
        ...newMasterData,
        [elementId]: newElement,
      };
    },
    newElement: (state, action) => {
      const id = uuidv4();
      const element = action.payload;

      const period = [element.elemPeriodStart, element.elemPeriodEnd];
      state.masterData = {
        ...state.masterData,
        [id]: { ...element, period },
      };
    },
    setElementInEdit: (state, action) => {
      const { elementId } = action.payload;
      state.elementInEdit = elementId;
    },
    delElement: (state, action) => {
      const { elementId } = action.payload;
      let newMasterData = { ...state.masterData };
      delete newMasterData[elementId];
      state.masterData = {
        ...newMasterData,
      };
    },
    cloneElement: (state, action) => {
      const id = uuidv4();
      const { elementId } = action.payload;
      const masterElement = state.masterData[elementId];
      const length = masterElement.period[1] - masterElement.period[0];

      let newPeriodStart = masterElement.period[1] + 100;

      let newPeriodEnd = newPeriodStart + length;

      let newElement = {
        ...masterElement,
        elementName: masterElement.elementName + " copy",
        period: [newPeriodStart, newPeriodEnd],
      };

      state.masterData = {
        ...state.masterData,
        [id]: newElement,
      };
    },
    updateTrack: (state, action) => {
      const { id, track } = action.payload;
      let newTrack = {
        ...state.tracks[id],
        ...track,
      };

      state.tracks = {
        ...state.tracks,
        [id]: newTrack,
      };
    },

    newTrack: (state, action) => {
      const { id, track } = action.payload;
      state.tracks = {
        ...state.tracks,
        [id]: { ...track },
      };
    },
  },
});

export const {
  updateData,
  updateElementPeriod,
  updateTotalPeriod,
  updateElementDetails,
  updateTrack,
  newTrack,
  newElement,
  delElement,
  cloneElement,
  setElementInEdit,
} = dataSlice.actions;

export default dataSlice.reducer;
