import React from "react";
import { useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";
import { MdSort } from "react-icons/md";

import "./titleBar.css";

export default function TitleBar({
  componentToPassDown,
  title,
  activeWindows,
  setActiveWindows,
  isList,
  setLoading,
  sortedBy,
  setSortedBy,
}) {
  const Child = ({ componentToPassDown }) => {
    return <>{componentToPassDown}</>;
  };

  const handleCloseWindow = () => {
    setActiveWindows(
      activeWindows.filter((e) => e !== componentToPassDown.type.name)
    );
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
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
    >
      <Child componentToPassDown={componentToPassDown} />
      <div
        className="menuTopBar"
        onPointerDown={(e) => {
          dragControls.start(e);
        }}
      >
        {isList && (
          <>
            <MdSort onClick={handleSort} className="sortButton" />
            <div className="sortText">{sortedBy}</div>
          </>
        )}

        <RiCloseCircleFill
          className="xCloseButtonWhite"
          onClick={handleCloseWindow}
        />
        <p>{title}</p>
      </div>
    </motion.div>
  );
}
