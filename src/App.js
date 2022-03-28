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
        <div className="App flex flex-col justify-end h-screen">
          <ControlsConsole />

          <Timeline />
        </div>
      </TreeContext.Provider>
    </Provider>
  );
}
