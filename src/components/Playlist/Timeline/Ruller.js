import React from "react";

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

export default Ruller;
