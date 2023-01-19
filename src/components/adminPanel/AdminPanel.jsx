import "./adminPanel.css";
import { useState, useEffect } from "react";
import { format } from "timeago.js";
import { MdTaskAlt } from "react-icons/md";
import Swal from "sweetalert2";
import { BsArrowRightCircle } from "react-icons/bs";
import axios from "axios";

export default function AdminPanel({
  activeWindows,
  setActiveWindows,
  setReviews,
  setCurrentPlace,
  setLoading,
}) {
  const [flaggedReviews, setFlaggedReviews] = useState([]);

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
    console.log(reqReview);

    try {
      const res = await axios.post(
        "http://localhost:8800/api/pins/getReview",
        reqReview
      );

      setCurrentPlace(null);
      setReviews(res.data);
      setActiveWindows((activeWindows) => [...activeWindows, "ReviewViewer"]);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div id="adminPanel">
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
  );
}
