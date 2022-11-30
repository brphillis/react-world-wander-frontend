import { React, useRef } from "react";
import { RiCloseCircleFill } from "react-icons/ri";

import "./mapClickMenu.css";

export default function MapClickMenu({ addReviewForm, setAddReviewForm }) {
  return (
    <div>
      <div className="menuTopBar">
        <RiCloseCircleFill class="xCloseButtonWhite" />
        <p>Add a Pin</p>
      </div>

      <div id="clickMenuContentContainer">
        <button className="btnPrimary" onClick={() => setAddReviewForm(true)}>
          New Review
        </button>
      </div>
    </div>
  );
}
