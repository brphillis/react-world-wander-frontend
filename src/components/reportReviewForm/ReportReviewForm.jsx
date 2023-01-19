import "./reportReviewForm.css";
import { useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function ReportReviewForm({
  activeWindows,
  setActiveWindows,
  reviewToReport,
  setReviewToReport,
  currentUser,
  currentPlace,
}) {
  const reportSelectionRef = useRef();
  const reportDescRef = useRef();

  const handleClose = () => {
    setActiveWindows(activeWindows.filter((e) => e !== "ReportReviewForm"));
  };

  const handleSubmit = async () => {
    const review = {
      reportedBy: currentUser.username,
      reason: reportSelectionRef.current.value,
      desc: reportDescRef.current.value,
      reviewCreator: reviewToReport.username,
      pinId: currentPlace._id,
      reviewId: reviewToReport._id,
      title: reviewToReport.title,
    };

    try {
      let res = await axios.post(
        "http://localhost:8800/api/flaggedreviews",
        review
      );

      Swal.fire({
        title: "Report Submitted",
        text: "   ",
        icon: "success",
        padding: "10px",
        confirmButtonColor: "#a06cd5",
        confirmButtonText: "Okay!",
        backdrop: `#23232380`,
      }).then((result) => {
        if (result.isConfirmed) {
          handleClose();
        }
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="reportReviewForm">
      <div className="reportReviewContent">
        <div className="reportReviewHeader">
          You are reporting <span>"{reviewToReport.title}"</span> by{" "}
          <b>{reviewToReport.username}</b>
        </div>
        <p> for the reason of ...</p>

        <select
          name="reportSelection"
          id="reportSelection"
          ref={reportSelectionRef}
        >
          <option value="Inappropriate Language">Inappropriate Language</option>
          <option value="Inappropriate Images">Inappropriate Images</option>
          <option value="Misleading Content">Misleading Content</option>
          <option value="Duplicate Or Spam Content">
            Duplicate Or Spam Content
          </option>
          <option value="Security Risk">Security Risk</option>
        </select>

        <p> tell us more ...</p>
        <textarea ref={reportDescRef}></textarea>
        <br />
        <div className="disclaimerText">
          by pressing submit you are agreeing that this report is for legitamate
          reasons and accept that action may be taken against your account if
          found to be illegitimate.
        </div>

        <div className="reportReviewBtnContainer">
          <button
            className="btnPrimary"
            onClick={() => {
              handleClose();
              setReviewToReport({});
            }}
          >
            Close
          </button>
          <button className="btnPrimary" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
