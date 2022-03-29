import React, { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Draggable from "react-draggable";
import { updateElementPeriod } from "../../redux/data/dataSlice";
import ElementMenu from "./ElementMenu";
import EditElement from "./EditElement";
import ElementController from "../Controller/ElementController";

const Element = React.memo(
  ({ id, periodStart, periodEnd, trackId, elementName }) => {
    const [showMenu, setShowMenu] = useState(false);
    const inEdit = useSelector((state) => state.data.elementInEdit === id);
    const duration = useSelector((state) => state.timer.nowPlaying[id]);
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
        <ElementController elementId={id} duration={duration} />
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
            <div
              className={
                (isDraggable
                  ? "cursor-grabbing bg-lime-600 text-lime-100"
                  : (!duration
                      ? inEdit
                        ? "bg-green-700 text-green-100"
                        : " bg-pink-700 text-pink-100"
                      : " bg-teal-500 text-teal-100") + " cursor-grab") +
                " text-xs h-6 top-0 rounded-full shadow-md shadow-slate-900 opacity-80 flex flex-col justify-center handle"
              }
            >
              {elementName}
            </div>
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
