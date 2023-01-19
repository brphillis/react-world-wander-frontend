import "./popupEdit.css";
import { MdEdit, MdDelete, MdFlag } from "react-icons/md";
import { useRef } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import Swal from "sweetalert2";
import axios from "axios";

export default function PopupEdit({
  setActiveWindows,
  currentReview,
  currentUser,
  setAddReviewForm,
  setReviewToEdit,
  currentPlace,
  setReviewToReport,
}) {
  const popupEditRef = useRef();

  function handlePopupDisplay() {
    if (popupEditRef.current.style.display === "flex") {
      popupEditRef.current.style.display = "none";
    } else if (popupEditRef.current.style.display === "none") {
      popupEditRef.current.style.display = "flex";
    }
  }

  function handleDeleteReview() {
    popupEditRef.current.style.display = "none";
    Swal.fire({
      title: "Delete your Review?",
      text: "   ",
      icon: "error",
      showCancelButton: true,
      padding: "10px",
      confirmButtonColor: "#e84338",
      confirmButtonText: "Delete",
      cancelButtonColor: "#a06cd5",
      backdrop: `#23232380`,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReview();
      }
    });
  }

  const deleteReview = async () => {
    const reviewToDelete = {
      id: currentPlace._id,
      reviewId: currentReview._id,
    };
    try {
      await axios.put(
        "http://localhost:8800/api/pins/deleteReview",
        reviewToDelete
      );
    } catch (err) {
      console.log(err);
    }
  };

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
        {(currentUser.username === currentReview.username ||
          currentUser.role === "admin") && (
          <MdEdit
            onClick={() => {
              setReviewToEdit(currentReview);
              setActiveWindows((activeWindows) => [
                ...activeWindows,
                "AddReviewForm",
              ]);
            }}
          />
        )}
        {(currentUser.username === currentReview.username ||
          currentUser.role === "admin") && (
          <MdDelete onClick={handleDeleteReview} />
        )}

        <MdFlag
          onClick={() => {
            setReviewToReport(currentReview);
            setActiveWindows((activeWindows) => [
              ...activeWindows,
              "ReportReviewForm",
            ]);
          }}
        />
      </div>
    </div>
  );
}
