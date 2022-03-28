import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Draggable from "react-draggable";
import { updateElementPeriod } from "../../redux/data/dataSlice";
import { setNowPlaying } from "../../redux/timer/timerSlice";
import { useRequestAnimationFrame } from "request-animation-frame-hook";
import ElementMenu from "./ElementMenu";
import EditElement from "./EditElement";

const ElementDetails = ({ id, playingTime, draggClass, children }) => {
  const dispatch = useDispatch();
  const [isPlaying, setSetIsPlaying] = useState(false);
  const timerPause = useSelector((state) => state.timer.timerState.pause);
  const timerStop = useSelector((state) => state.timer.timerState.stop);

  const autoStopCb = () => {
    dispatch(setNowPlaying({ id, isPlaying: false }));
    setSetIsPlaying(false);
  };

  const [start, pause, setStart, setStop] = useRequestAnimationFrame(
    (data) => {},
    { stopRules: [playingTime || 0, false], autoStopCb }
  );

  useEffect(() => {
    if (!start && !pause && playingTime && !timerPause && !isPlaying) {
      setSetIsPlaying(true);
      setStart();
    } else if (
      !start &&
      pause &&
      playingTime &&
      !timerPause &&
      !timerStop &&
      isPlaying
    ) {
      setStart();
    }
  }, [start, pause, playingTime, timerPause, timerStop, isPlaying]);

  useEffect(() => {
    if (start && !pause && timerPause && playingTime) {
      console.log("pauza", id);
      setStart();
    }
  }, [start, pause, timerPause, playingTime]);

  useEffect(() => {
    if (playingTime && timerStop) {
      console.log(id, "stop");
      setStop();
      setSetIsPlaying(false);
      dispatch(setNowPlaying({ id, isPlaying: false }));
    }
  }, [timerStop, playingTime]);

  return <div className={draggClass}>{children}</div>;
};

const Element = React.memo(
  ({ id, periodStart, periodEnd, trackId, elementName }) => {
    const [showMenu, setShowMenu] = useState(false);
    const inEdit = useSelector((state) => state.data.elementInEdit === id);
    const playingTime = useSelector((state) => state.timer.nowPlaying[id]);
    const dispatch = useDispatch();
    const timeDivider = useSelector((state) => state.settings.timeDivider);
    const [isDraggable, setIsDraggable] = useState(false);
    const nodeRef = useRef(null);

    const onControlledDrag = (e, position) => {
      const { lastX } = position;

      setIsDraggable(false);
      dispatch(
        updateElementPeriod({
          id,
          elemPeriodStart: periodStart,
          elemPeriodEnd: periodEnd,
          trackId,
          periodStart: lastX * timeDivider,
        })
      );
    };
    const onStart = (e, ui) => {
      setIsDraggable(true);
    };

    return (
      <>
        <Draggable
          axis="x"
          bounds="parent"
          handle=".handle"
          position={{ x: periodStart / timeDivider, y: 0 }}
          grid={[10, 0]}
          onStart={onStart}
          onStop={onControlledDrag}
          nodeRef={nodeRef}
        >
          <div
            title={"Right click to edit " + elementName}
            onContextMenu={(e) => {
              e.preventDefault(0);
              setShowMenu(!showMenu);
            }}
            ref={nodeRef}
            key={id}
            className="absolute"
            style={{
              width: (periodEnd - periodStart) / timeDivider,
            }}
          >
            <ElementDetails
              id={id}
              playingTime={playingTime}
              draggClass={
                (isDraggable
                  ? "cursor-grabbing bg-lime-600 text-lime-100"
                  : (!playingTime
                      ? inEdit
                        ? "bg-green-700 text-green-100"
                        : " bg-pink-700 text-pink-100"
                      : " bg-teal-500 text-teal-100") + " cursor-grab") +
                " text-xs h-6 top-0 rounded-full shadow-md shadow-slate-900 opacity-80 flex flex-col justify-center handle"
              }
            >
              {elementName}
            </ElementDetails>
            {showMenu ? (
              <ElementMenu
                timeDivider={timeDivider}
                periodStart={periodStart}
                length={periodEnd - periodStart}
                elementId={id}
                bgColor="bg-teal-900"
                close={() => {
                  setShowMenu(!showMenu);
                }}
              />
            ) : null}
          </div>
        </Draggable>
        {inEdit ? <EditElement elementId={id} /> : null}
      </>
    );
  }
);

export default Element;
