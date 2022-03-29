import React from "react";
import { useDispatch } from "react-redux";
import {
  delElement,
  cloneElement,
  setElementInEdit,
} from "../../../redux/data/dataSlice";
import IconButton from "../../UiElements/IconButton";

const ElementMenu = ({
  bgColor,
  close,
  elementId,
  periodStart,
  length,
  timeDivider,
}) => {
  const dispatch = useDispatch();
  return (
    <div
      style={{ right: periodStart < 1000 ? -(128 - length / timeDivider) : 0 }}
      className={bgColor + " z-50 break-words rounded-full absolute top-0 "}
    >
      <div className="flex flex-row space-x-2 h-6 px-3 relative z-40">
        <IconButton
          icon="edit"
          title="Edit element"
          onClick={() => {
            dispatch(setElementInEdit({ elementId }));
            close();
          }}
        />
        <IconButton
          icon="delete"
          title="Delete element"
          onClick={() => {
            dispatch(delElement({ elementId }));
            close();
          }}
        />
        <IconButton
          icon="clone"
          title="Clone element"
          onClick={() => {
            dispatch(cloneElement({ elementId }));
            close();
          }}
        />

        <IconButton
          icon="cancel"
          size="sm"
          onClick={close}
          title="Close menu"
          className=" text-green-300"
        />
      </div>
    </div>
  );
};

export default ElementMenu;
