import { React, useRef } from "react";

import "./newPinForm.css";

export default function NewPinForm({ addReviewForm, setAddReviewForm }) {
  return (
    <button className="btnPrimary" onClick={() => setAddReviewForm(true)}>
      TEST
    </button>
  );
}
