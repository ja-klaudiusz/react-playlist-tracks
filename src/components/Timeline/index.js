import React, { useContext, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTotalPeriod } from "../../redux/data/dataSlice";
import { getTracks } from "../../utils";
import CustomScrollbar from "../CustomScrollbar";
import { TreeContext } from "../../store/context/TreeContext";
import Element from "./Element";
import Vertical from "./Vertical";

const Track = ({ data, even }) => {
  const { elements, trackId } = data;
  const track = useSelector((state) => state.data.tracks[trackId]);
  return (
    <div
      className={
        (even ? "bg-slate-600 text-slate-300" : "bg-slate-700 text-slate-400") +
        " h-8 px-2 w-full text-left text-sm flex flex-col justify-center"
      }
    >
      <div>{track?.name}</div>
    </div>
  );
};

const TrackElements = ({ data, even }) => {
  const { elements, trackId } = data;

  return (
    <div
      className={
        (even ? "bg-slate-800" : "bg-slate-900") +
        " flex flex-row justify-start items-center py-1 border-b border-slate-800 relative"
      }
    >
      <div className="w-full h-6 flex flex-row justify-start ">
        {elements.map((element) => {
          return (
            <Element
              key={element.id}
              id={element.id}
              periodStart={element.period[0]}
              periodEnd={element.period[1]}
              trackId={element.trackId}
              elementName={element.elementName}
            />
          );
        })}
      </div>
    </div>
  );
};

const Ruller = ({ rullerWidth }) => {
  const rulerLenght = rullerWidth / 100;
  const ruller = Array.from({ length: rulerLenght }, (v, k) => k);

  return (
    <div
      className="h-5 bg-slate-900 -mt-5 z-20 min-w-full sticky top-0 flex flex-row justify-start ruller"
      style={{ width: rullerWidth }}
    >
      {ruller.map((line, i) => {
        return (
          <div className="ruller-period" key={i}>
            <span className="text-slate-300 bg-slate-900">{line}</span>
            {ruller.length - 1 === i ? (
              <span className="text-slate-300 bg-slate-900 last-ruller-period">
                {Math.floor(rulerLenght)}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

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
