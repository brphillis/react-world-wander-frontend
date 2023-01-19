import "./reviewViewer.css";
import { useEffect } from "react";
import Lottie from "lottie-react";
import loadingCircle from "../../assets/loadingCircle.json";
import React from "react";
import NewsFeed from "../newsFeed/NewsFeed";

export default function ReviewViewer({
  activeWindows,
  setActiveWindows,
  reviews,
  setReviews,
  setAddReviewForm,
  setImageGallery,
  currentPlaceId,
  setImageGalleryPics,
  reviewToEdit,
  setReviewToEdit,
  currentPlace,
  currentUser,
  width,
  sortedBy,
  loading,
  setLoading,
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
}) {
  return (
    <div
      id={width < 600 ? "reviewViewerMobile" : "reviewViewer"}
      // style={{
      //   visibility: reportReviewForm || addReviewForm ? "hidden" : "visible",
      // }}
    >
      {(loading || !reviews) && (
        <Lottie
          id="reviewsLoadingCircle"
          animationData={loadingCircle}
          loop={true}
        ></Lottie>
      )}

      <div id="reviewViewerContentContainer">
        <NewsFeed
          reviews={reviews}
          setReviews={setReviews}
          activeWindows={activeWindows}
          setActiveWindows={setActiveWindows}
          setAddReviewForm={setAddReviewForm}
          setImageGallery={setImageGallery}
          currentPlaceId={currentPlaceId}
          setImageGalleryPics={setImageGalleryPics}
          reviewToEdit={reviewToEdit}
          setReviewToEdit={setReviewToEdit}
          currentPlace={currentPlace}
          currentUser={currentUser}
          loading={loading}
          setLoading={setLoading}
          reportReviewForm={reportReviewForm}
          setReportReviewForm={setReportReviewForm}
          reviewToReport={reviewToReport}
          setReviewToReport={setReviewToReport}
          sortedBy={sortedBy}
        />
      </div>
    </div>
  );
}
