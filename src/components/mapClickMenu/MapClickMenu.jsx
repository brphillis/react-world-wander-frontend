import { React } from "react";
import { RiCloseCircleFill } from "react-icons/ri";

import "./mapClickMenu.css";

export default function MapClickMenu({ addReviewForm, setAddReviewForm }) {
  return (
    <div>
      <div className="menuTopBar">
        <RiCloseCircleFill className="xCloseButtonWhite" />
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
