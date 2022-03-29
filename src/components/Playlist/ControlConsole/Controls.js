import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setTimerState } from "../../../redux/timer/timerSlice";

import NewElement from "../Timeline/NewElement";
import IconButton from "../../UiElements/IconButton";
import Timer from "./Timer";

const Controls = ({ start, pause, setStart, setStop, tree }) => {
  const [modalType, setModalType] = useState(null);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row justify-between bg-slate-900 text-slate-200 px-2 border-b border-b-slate-700 h-7">
      <div className="flex flex-row items-center w-24 justify-between">
        {start ? (
          <IconButton
            size="md"
            icon="pause"
            title="Pause"
            onClick={() => {
              setStart();
              dispatch(
                setTimerState({ start: false, pause: true, stop: false })
              );
            }}
          />
        ) : (
          <IconButton
            size="md"
            icon="play"
            title="Play"
            onClick={() => {
              setStart();
              dispatch(
                setTimerState({ start: true, pause: false, stop: false })
              );
            }}
          />
        )}

        <IconButton
          size="md"
          icon="stop"
          title="Stop"
          onClick={() => {
            setStop();
            dispatch(setTimerState({ start: false, pause: false, stop: true }));
          }}
          disabled={!pause && !start}
        />

        <IconButton
          size="md"
          icon="add"
          title="Add new track"
          onClick={() => {
            setModalType("new_element");
          }}
          disabled={pause || start}
        />
      </div>
      <Timer tree={tree} />
      {modalType === "new_element" ? (
        <NewElement
          onClose={() => {
            setModalType(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default Controls;
