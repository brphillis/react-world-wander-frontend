import { React, useRef } from "react";

import "./mapClickMenu.css";

export default function MapClickMenu({ addReviewForm, setAddReviewForm }) {
  return (
    <button className="btnPrimary" onClick={() => setAddReviewForm(true)}>
      TEST
    </button>
  );
}
