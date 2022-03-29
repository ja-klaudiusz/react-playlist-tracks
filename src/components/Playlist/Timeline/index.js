import React, { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTotalPeriod } from "../../../redux/data/dataSlice";
import { getTracks } from "../../../utils";
import CustomScrollbar from "../../UiElements/CustomScrollbar";
import { TreeContext } from "../../../store/context/TreeContext";
import Vertical from "./Vertical";
import Track from "./Track";
import TrackElements from "./TrackElements";
import Ruller from "./Ruller";

const Timeline = () => {
  const dispatch = useDispatch();
  const tree = useContext(TreeContext);
  const periodMin = tree?.root?.minimumLow || 0;
  const periodMax = tree?.root?.maximumHigh || 0;
  const data = useSelector((state) => state.data.masterData);
  const timeDivider = useSelector((state) => state.settings.timeDivider);
  const timerStop = useSelector((state) => state.timer.timerState.stop);
  const tracks = getTracks(data);
  const trackPoolWidht = 230 + periodMax / timeDivider;
  const scrollEl = useRef();

  useEffect(() => {
    dispatch(updateTotalPeriod([periodMin, periodMax]));
  }, [periodMin, periodMax]);
  console.log("TIMELINE");

  const updateScroll = (data) => {
    if (!data) {
      return;
    }
    const refRect = data.getBoundingClientRect();
    const scrollRect = scrollEl.current.getBoundingClientRect();
    const x = refRect.right - scrollRect.right;
    if (x < 0 && !timerStop) {
      scrollEl.current.scrollBy({
        left: x + 1000,
        behavior: "smooth",
      });
    }
  };

  return (
    <CustomScrollbar
      ref={scrollEl}
      direction="horizontal"
      autoHide={false}
      className="bg-slate-900 w-screen pb-4"
      style={{ height: 200 }}
      contentClassName="min-h-full"
    >
      <div
        className="flex flex-row justify-start pt-5 relative min-h-full"
        style={{ width: trackPoolWidht, minWidth: "calc(100% - 21px)" }}
      >
        <Vertical updateScroll={updateScroll} />
        <div className="tracklist sticky left-0 z-10 mr-2">
          {tracks.map((track, i) => {
            return (
              <Track data={track} key={track.trackId} even={Boolean(i % 2)} />
            );
          })}
        </div>

        <div
          style={{
            width: trackPoolWidht,
            minWidth: "calc(100% - 230px)",
          }}
          className="flex flex-col mr-3"
        >
          <Ruller rullerWidth={periodMax / timeDivider} />
          {tracks.map((track, i) => {
            return (
              <TrackElements
                data={track}
                key={track.trackId}
                even={Boolean(i % 2)}
              />
            );
          })}
        </div>
      </div>
    </CustomScrollbar>
  );
};

export default Timeline;
