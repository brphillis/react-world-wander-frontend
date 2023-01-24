import React from "react";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdSort } from "react-icons/md";

import "./titleBar.css";

export default function TitleBar({
  children,
  title,
  activeWindows,
  setActiveWindows,
  isList,
  setLoading,
  sortedBy,
  setSortedBy,
}) {
  const handleCloseWindow = () => {
    setActiveWindows(activeWindows.filter((e) => e !== title));
  };

  const dragControls = useDragControls();

  function handleSort() {
    setLoading(true);
    if (sortedBy === "popular") {
      setSortedBy("recent");
    }

    if (sortedBy === "recent") {
      setSortedBy("oldest");
    }

    if (sortedBy === "oldest") {
      setSortedBy("popular");
    }
  }

  return (
    <motion.div
      className="motionWindow"
      initial={{ top: 0 }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
    >
      {children}
      <div
        className="menuTopBar"
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
      >
        {isList && (
          <>
            <MdSort
              onClick={() => {
                handleSort();
              }}
              className="sortButton"
            />
            <div className="sortText">{sortedBy}</div>
          </>
        )}

        <RiCloseCircleFill
          className="xCloseButtonWhite"
          onClick={() => {
            handleCloseWindow();
          }}
        />
        <p>{title}</p>
      </div>
    </motion.div>
  );
}
