import { React } from "react";
import { RiCloseCircleFill } from "react-icons/ri";

import "./mapClickMenu.css";

export default function MapClickMenu({ activeWindows, setActiveWindows }) {
  return (
    <div>
      <div className="menuTopBar" style={{ zIndex: "0", top: "-1px" }}>
        <RiCloseCircleFill className="xCloseButtonWhite" />
        <p>Add a Pin</p>
      </div>

      <div id="clickMenuContentContainer">
        <button
          className="btnPrimary"
          onClick={() =>
            setActiveWindows((activeWindows) => [
              ...activeWindows,
              "AddReviewForm",
            ])
          }
        >
          New Review
        </button>
      </div>
    </div>
  );
}
