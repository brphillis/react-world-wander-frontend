import "./reviewViewer.css";
import { RiCloseCircleFill } from "react-icons/ri";
import { motion, useDragControls } from "framer-motion";
import { MdSort } from "react-icons/md";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import loadingCircle from "./loadingCircle.json";
import React from "react";
import ReportReviewForm from "../reportReviewForm/ReportReviewForm";
import NewsFeed from "../newsFeed/NewsFeed";

export default function ReviewViewer({
  addReviewForm,
  reviews,
  setReviews,
  setAddReviewForm,
  setReviewViewer,
  setImageGallery,
  currentPlaceId,
  setImageGalleryPics,
  reviewToEdit,
  setReviewToEdit,
  currentPlace,
  currentUser,
  width,
  profileEditor,
  handleSortFeed,
  sortedBy,
  setSortedBy,
  loading,
  setLoading,
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
}) {
  const dragControls = useDragControls();

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
    <div>
      <motion.div
        className="motionDiv"
        drag
        dragControls={dragControls}
        dragListener={false}
        dragMomentum={false}
        initial={width > 600 ? motionValues.desktop : motionValues.mobile}
      >
        <div
          className="menuTopBar"
          style={{
            visibility:
              reportReviewForm || addReviewForm ? "hidden" : "visible",
          }}
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <MdSort onClick={handleSortFeed} className="sortButton" />
          <div className="sortText">{sortedBy}</div>

          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => {
              setReviewViewer(false);
              setReviews([]);
            }}
          />
          <p>Reviews</p>
        </div>
        <div
          id={width < 600 ? "reviewViewerMobile" : "reviewViewer"}
          style={{
            visibility:
              reportReviewForm || addReviewForm ? "hidden" : "visible",
          }}
        >
          {(loading || reviews.length < 0) && (
            <Lottie
              id="reviewsLoadingCircle"
              animationData={loadingCircle}
              loop={true}
            ></Lottie>
          )}

          <div id="reviewViewerContentContainer">
            <NewsFeed
              addReviewForm={addReviewForm}
              reviews={reviews}
              setReviews={setReviews}
              setAddReviewForm={setAddReviewForm}
              setReviewViewer={setReviewViewer}
              setImageGallery={setImageGallery}
              currentPlaceId={currentPlaceId}
              setImageGalleryPics={setImageGalleryPics}
              reviewToEdit={reviewToEdit}
              setReviewToEdit={setReviewToEdit}
              currentPlace={currentPlace}
              currentUser={currentUser}
              width={width}
              profileEditor={profileEditor}
              loading={loading}
              setLoading={setLoading}
              reportReviewForm={reportReviewForm}
              setReportReviewForm={setReportReviewForm}
              reviewToReport={reviewToReport}
              setReviewToReport={setReviewToReport}
            />
          </div>
        </div>

        {reportReviewForm && (
          <ReportReviewForm
            reportReviewForm={reportReviewForm}
            setReportReviewForm={setReportReviewForm}
            reviewToReport={reviewToReport}
            setReviewToReport={setReviewToReport}
            currentUser={currentUser}
            currentPlace={currentPlace}
          />
        )}
      </motion.div>
    </div>
  );
}
