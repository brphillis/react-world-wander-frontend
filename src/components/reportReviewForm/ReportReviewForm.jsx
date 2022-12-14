import "./reportReviewForm.css";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";
import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function ReportReviewForm({
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
  width,
  currentUser,
}) {
  const reportSelectionRef = useRef();
  const reportDescRef = useRef();

  const handleSubmit = async () => {
    const review = {
      reportedBy: currentUser.username,
      reason: reportSelectionRef.current.value,
      desc: reportDescRef.current.value,
      reviewCreator: reviewToReport.username,
      id: reviewToReport._id,
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
          setReportReviewForm(false);
        }
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const dragControls = useDragControls();
  const motionValues = {
    desktop: {
      position: "absolute",
      left: "50%",
      top: "5%",
      margin: "0",
    },
    mobile: {
      position: "absolute",
      left: "0",
      right: "0",
      marginLeft: "auto",
      marginRight: "auto",
      width: width,
    },
  };

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={width > 600 ? motionValues.desktop : motionValues.mobile}
    >
      <div id="reportReview">
        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setReportReviewForm(false)}
          />
          <p>Report Review</p>
        </div>

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
            <option value="Inappropriate Language">
              Inappropriate Language
            </option>
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
            by pressing submit you are agreeing that this report is for
            legitamate reasons and accept that action may be taken against your
            account if found to be illegitimate.
          </div>

          <div className="reportReviewBtnContainer">
            <button
              className="btnPrimary"
              onClick={() => {
                setReportReviewForm(false);
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
    </motion.div>
  );
}
