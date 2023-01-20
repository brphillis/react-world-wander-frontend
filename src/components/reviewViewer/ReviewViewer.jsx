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
    <div id={width < 600 ? "reviewViewerMobile" : "reviewViewer"}>
      {(loading || !reviews) && (
        <Lottie
          id="reviewsLoadingCircle"
          animationData={loadingCircle}
          loop={true}
        ></Lottie>
      )}

      <div id="reviewViewerContentContainer">
        <NewsFeed
          setActiveWindows={setActiveWindows}
          reviews={reviews}
          setReviews={setReviews}
          setAddReviewForm={setAddReviewForm}
          setImageGallery={setImageGallery}
          currentPlaceId={currentPlaceId}
          setImageGalleryPics={setImageGalleryPics}
          setReviewToEdit={setReviewToEdit}
          currentPlace={currentPlace}
          currentUser={currentUser}
          loading={loading}
          setLoading={setLoading}
          setReviewToReport={setReviewToReport}
          sortedBy={sortedBy}
        />
      </div>
    </div>
  );
}
