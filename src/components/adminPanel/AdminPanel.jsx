import "./adminPanel.css";
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import { MdTaskAlt } from "react-icons/md";
import Swal from "sweetalert2";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";

export default function AdminPanel({
  setAdminPanel,
  width,
  reviewViewer,
  setReviewViewer,
  setReviews,
  setCurrentPlace,
}) {
  const [flaggedReviews, setFlaggedReviews] = useState([]);
  const dragControls = useDragControls();

  const completeTask = (id) => {
    Swal.fire({
      icon: "warning",
      html:
        "<b>Complete Report:</b>" +
        "<p style='margin-top: 5px;'>Confirm the report has been resolved<p>",
      showCancelButton: true,
      confirmButtonText: "Finalize",
    }).then((result) => {
      if (result.isConfirmed) {
        const task = { id: id };
        try {
          axios.put(
            "http://localhost:8800/api/flaggedreviews/deleteFlaggedReview",
            task
          );
        } catch (err) {
          console.log(err);
        }
      }
    });
  };

  useEffect(() => {
    const getFlaggedReviews = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/flaggedreviews");
        setFlaggedReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFlaggedReviews();
  }, [completeTask]);

  const handleOpenReview = async (pinId, reviewId) => {
    const reqReview = {
      id: pinId,
      reviewid: reviewId,
    };

    try {
      const res = await axios.post(
        "http://localhost:8800/api/pins/getReview",
        reqReview
      );

      setCurrentPlace(null);
      setReviews(res.data);
      setReviewViewer(true);
    } catch (err) {
      console.log(err);
    }
  };

  const motionValues = {
    desktop: {
      position: "absolute",
      left: "35%",
      top: "1%",
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
      <div id="adminPanel">
        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setAdminPanel(false)}
          />
          <p>Admin Panel</p>
        </div>

        <div className="adminPanelContent">
          <div id="flaggedReviewsContainer">
            <p>Flagged Reviews</p>

            <table>
              <tbody>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Reason</th>
                  <th>Description</th>
                  <th>Created by</th>
                  <th>Reported by</th>
                  <th>Go</th>
                  <th>Del</th>
                </tr>
                {flaggedReviews.map((e, i) => {
                  return (
                    <tr key={e._id}>
                      <td>{format(e.createdAt, "en_US")}</td>
                      <td>{e.title}</td>
                      <td>{e.reason}</td>
                      <td>{e.desc}</td>
                      <td>{e.reviewCreator}</td>
                      <td>{e.reportedBy}</td>
                      <td>
                        <BsArrowRightCircle
                          onClick={() => handleOpenReview(e.pinId, e.reviewId)}
                          className="apInfoIcon"
                        />
                      </td>
                      <td>
                        <MdTaskAlt
                          className="apTrashIcon"
                          onClick={() => {
                            completeTask(e._id);
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
