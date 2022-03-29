import React, { useEffect, useRef, memo } from "react";
import { useSelector } from "react-redux";
import useOnScreen from "../../../hooks/use-onscreen";

const OnScreenSensor = memo(({ updateScroll }) => {
  const ref = useRef();
  const onScreen = useOnScreen(ref, "-10px");
  useEffect(() => {
    !onScreen && updateScroll(ref.current);
  }, [onScreen]);
  return <span ref={ref}></span>;
});

const Vertical = ({ updateScroll }) => {
  const time = useSelector((state) =>
    Math.round(state.timer.time.ms / state.settings.timeDivider)
  );

  return (
    <div
      className="border-l border-slate-600 absolute top-5 z-10"
      style={{
        left: 238,
        height: "calc(100% - 20px)",
        transform: "translateX(" + time + "px) ",
        transition: "transform",
      }}
    >
      <OnScreenSensor updateScroll={updateScroll} />
    </div>
  );
};

export default Vertical;
