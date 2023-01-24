import "./reviewViewer.css";
import Lottie from "lottie-react";
import loadingCircle from "../../assets/loadingCircle.json";
import React from "react";
import NewsFeed from "../newsFeed/NewsFeed";

export default function ReviewViewer({
  activeWindows,
  setActiveWindows,
  reviews,
  setReviews,
  setImageGallery,
  currentPlaceId,
  setCurrentPlaceId,
  setImageGalleryPics,
  setReviewToEdit,
  currentPlace,
  currentUser,
  width,
  sortedBy,
  loading,
  setLoading,
  setReviewToReport,
  pins,
  setPins,
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
          activeWindows={activeWindows}
          setActiveWindows={setActiveWindows}
          reviews={reviews}
          setReviews={setReviews}
          setImageGallery={setImageGallery}
          currentPlaceId={currentPlaceId}
          setCurrentPlaceId={setCurrentPlaceId}
          setImageGalleryPics={setImageGalleryPics}
          setReviewToEdit={setReviewToEdit}
          currentPlace={currentPlace}
          currentUser={currentUser}
          loading={loading}
          setLoading={setLoading}
          setReviewToReport={setReviewToReport}
          sortedBy={sortedBy}
          pins={pins}
          setPins={setPins}
        />
      </div>
    </div>
  );
}
