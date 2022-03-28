import React from "react";
import IntervalTree from "./utils/intervalTree";
import ControlsConsole from "./components/ControlConsole";
import { store } from "./store/store";
import { Provider } from "react-redux";
import "./styles.css";
import Timeline from "./components/Timeline";
import { TreeContext } from "./store/context/TreeContext";
import { useSelector } from "react-redux";

const Tree = ({ tree }) => {
  const data = useSelector((state) => state.data.masterData);
  tree.clear();
  for (let elementId of Object.keys(data)) {
    const element = data[elementId];
    tree.insert(element.period[0], element.period[1], elementId);
  }
  return null;
};

export default function App() {
  const tree = new IntervalTree();
  return (
    <Provider store={store}>
      <Tree tree={tree} />
      <TreeContext.Provider value={tree}>
        <div className="App flex flex-col justify-end h-screen relative">
          <div className="absolute top-3 right-4">
            <a
              href="https://github.com/ja-klaudiusz/react-playlist-tracks"
              target="_blank"
            >
              <svg
                viewBox="0 0 16 16"
                class="w-8 h-8"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
          </div>
          <div className="flex flex-col h-full items-center justify-center">
            <h1 className=" text-5xl font-bold opacity-50 font-sans drop-shadow-lg shadow-black w-1/3">
              React Playlist Tracks Demo
            </h1>
            <p className="text-sm opacity-60 pt-4 w-1/3">
              React playlist builder with the ability of add, edit and delete
              tracks as well as track elements. <br />
              It also gives the ability synchronous playback of each tracks
              elements.
            </p>
          </div>
          <ControlsConsole />
          <Timeline />
        </div>
      </TreeContext.Provider>
    </Provider>
  );
}
