import "./popupEdit.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

export default function ProfileEditor({ currentIndex }) {
  const popupEditRef = useRef();

  function handlePopupDisplay() {
    if (popupEditRef.current.style.display === "flex") {
      popupEditRef.current.style.display = "none";
    } else if (popupEditRef.current.style.display === "none") {
      popupEditRef.current.style.display = "flex";
    }
  }

  return (
    <div className="popupEdit">
      <HiOutlineDotsVertical
        className="popupDots"
        onClick={() => {
          handlePopupDisplay();
        }}
        style={{ color: "#a06cd5", cursor: "pointer" }}
      />
      <div
        ref={popupEditRef}
        style={{ display: "none" }}
        className="popupEditMenu"
      >
        <MdEdit />
        <MdDelete />
      </div>
    </div>
  );
}
