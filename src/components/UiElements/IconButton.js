import React from "react";
import {
  MdModeEdit,
  MdOutlineCancel,
  MdContentCopy,
  MdDeleteOutline,
  MdPauseCircleFilled,
  MdPlayCircleFilled,
  MdStopCircle,
  MdLibraryAdd,
} from "react-icons/md";

const IconButton = ({
  title,
  onClick,
  disabled = false,
  icon = "none",
  size = "sm",
  color = "text-white",
  hoverColor = "hover:text-teal-400",
  className = "",
}) => {
  const sizes = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
    xl: "w-8 h-8",
  };
  const colors = color + " " + hoverColor;
  const iconClass = "opacity-70 hover:opacity-90 " + sizes[size] + " " + colors;
  const iconDisabled = "text-white opacity-20 hover:opacity-20 " + sizes[size];
  const classes = (disabled ? iconDisabled : iconClass) + " " + className;

  const icons = {
    edit: <MdModeEdit className={classes} />,
    cancel: <MdOutlineCancel className={classes} />,
    clone: <MdContentCopy className={classes} />,
    delete: <MdDeleteOutline className={classes} />,
    play: <MdPlayCircleFilled className={classes} />,
    pause: <MdPauseCircleFilled className={classes} />,
    stop: <MdStopCircle className={classes} />,
    add: <MdLibraryAdd className={classes} />,
    none: null,
  };

  return (
    <button
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="text-"
    >
      {icons[icon]}
    </button>
  );
};

export default IconButton;
