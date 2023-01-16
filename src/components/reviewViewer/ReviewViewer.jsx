import "./reviewViewer.css";
import { useEffect } from "react";
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
  setImageGallery,
  currentPlaceId,
  setImageGalleryPics,
  reviewToEdit,
  setReviewToEdit,
  currentPlace,
  setCurrentPlace,
  currentUser,
  width,
  sortedBy,
  profileEditor,
  loading,
  setLoading,
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
}) {
  //cleanup on unmount
  useEffect(() => {
    return () => {
      setLoading(true);
      setReviews(null);
    };
  }, []);
  return (
    <div>
      <div
        id={width < 600 ? "reviewViewerMobile" : "reviewViewer"}
        style={{
          visibility: reportReviewForm || addReviewForm ? "hidden" : "visible",
        }}
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
    </div>
  );
}
