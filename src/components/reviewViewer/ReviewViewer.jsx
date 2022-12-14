import "./reviewViewer.css";
import { RiCloseCircleFill } from "react-icons/ri";
import { motion, useDragControls } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { MdSort } from "react-icons/md";
import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import loadingCircle from "./loadingCircle.json";
import axios from "axios";
import React from "react";
import { format } from "timeago.js";
import LikeButton from "../likeButton/LikeButton";
import PopupEdit from "../popupEdit/PopupEdit";
import ReportReviewForm from "../reportReviewForm/ReportReviewForm";
import AddReviewForm from "../addReviewForm/AddReviewForm";

export default function ReviewViewer({
  addReviewForm,
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
}) {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const profilePicturesRef = useRef([]);
  const dragControls = useDragControls();
  const [sortedBy, setSortedBy] = useState("popular");
  const [reportReviewForm, setReportReviewForm] = useState(false);
  const [reviewToReport, setReviewToReport] = useState({});

  const [firstFetched, setFirstFetched] = useState(0);
  const [lastFetched, setlastFetched] = useState(10);

  function handleSortReviews() {
    setLoading(true);
    if (sortedBy === "popular") {
      setSortedBy("recent");
    }

    if (sortedBy === "recent") {
      setSortedBy("oldest");
    }

    if (sortedBy === "oldest") {
      setSortedBy("popular");
    }
  }

  const getProfilePictures = async (user) => {
    try {
      const currentid = { username: user };
      const res = await axios.post(
        "http://localhost:8800/api/users/getProfilePicture",
        currentid
      );

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getLimitedReviews = async () => {
      const currentid = {
        id: currentPlaceId,
        startIndex: firstFetched,
        endIndex: lastFetched,
      };
      try {
        const res = await axios.post(
          "http://localhost:8800/api/pins/getLimitedReviews",
          currentid
        );

        if (sortedBy === "recent") {
          setReviews(res.data.reverse());
        }

        if (sortedBy === "oldest") {
          setReviews(res.data);
        }

        if (sortedBy === "popular") {
          setReviews(
            res.data.sort(function (a, b) {
              if (a.likes.length < b.likes.length) return 1;
              if (a.likes.length > b.likes.length) return -1;
              return 0;
            })
          );
        }

        res.data.forEach((e, i) => {
          getProfilePictures(e.username).then(
            (data) =>
              (profilePicturesRef.current[i].src = data[0].profilePicture)
          );
        });
        setLoading(false);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
    getLimitedReviews();
  }, [currentPlaceId, sortedBy, firstFetched, lastFetched]);

  function handleSeeMore() {
    setLoading(true);
    setFirstFetched(firstFetched + 10);
    setlastFetched(lastFetched + 10);
  }

  function handleSetImageGalleryPics(e) {
    e.forEach((elem, i) => {
      setImageGalleryPics((imageGalleryPics) => [...imageGalleryPics, elem]);
    });
  }

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
          <MdSort onClick={handleSortReviews} className="sortButton" />
          <div className="sortText">{sortedBy}</div>

          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setReviewViewer(false)}
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
          {loading && (
            <Lottie
              id="reviewsLoadingCircle"
              animationData={loadingCircle}
              loop={true}
            ></Lottie>
          )}

          <div id="reviewViewerContentContainer">
            {reviews.length > 0 &&
              reviews.map((e, i) => {
                return (
                  <div
                    className="reviewViewerContent"
                    style={{ display: loading ? "none" : "flex" }}
                    key={Math.floor(Math.random() * 99999)}
                  >
                    <div className="reviewViewerTitleContainer">
                      <div className="reviewViewerTitle">"{e.title}"&nbsp;</div>

                      <img
                        className="reviewViewerProfilePicture"
                        alt={`${e.title + i}`}
                        ref={(element) => {
                          profilePicturesRef.current[i] = element;
                        }}
                        src="https://st3.depositphotos.com/6672868/13701/v/600/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"
                      />

                      <div className="reviewViewerTitleContent">
                        by {e.username}
                      </div>
                    </div>

                    <div className="reviewStarsContainer">
                      <React.Fragment>
                        {(() => {
                          const arr = [];
                          for (let i = 0; i < e.rating; i++) {
                            arr.push(
                              <FaStar
                                className="reviewStars"
                                key={Math.floor(parseInt(e._id) + i)}
                              />
                            );
                          }
                          return arr;
                        })()}
                      </React.Fragment>
                    </div>

                    <div className="reviewViewerDesc">{e.desc}</div>

                    <div className="reviewImagesContainer">
                      {e.pictures.map((elem, index) => {
                        if (index < 3) {
                          return (
                            <img
                              key={index + 12}
                              alt={`${e.size + e.name}`}
                              className="reviewImage"
                              src={elem.base64}
                              onClick={() => {
                                handleSetImageGalleryPics(e.pictures);
                                setImageGallery(true);
                              }}
                            />
                          );
                        } else return null;
                      })}
                    </div>

                    <LikeButton
                      className="likeButtonContainer"
                      likesArray={e.likes}
                      likesCount={e.likes.length}
                      currentIndex={i}
                      currentUser={currentUser}
                      currentPlace={currentPlace}
                    />

                    <PopupEdit
                      currentReview={e}
                      setAddReviewForm={setAddReviewForm}
                      reviewToEdit={reviewToEdit}
                      setReviewToEdit={setReviewToEdit}
                      currentPlace={currentPlace}
                      currentUser={currentUser}
                      reportReviewForm={reportReviewForm}
                      setReportReviewForm={setReportReviewForm}
                      reviewToReport={reviewToReport}
                      setReviewToReport={setReviewToReport}
                    />

                    <div className="rvTimeAgo">
                      {format(e.createdAt, "en_US")}
                    </div>

                    <div className="rvDivider"></div>
                  </div>
                );
              })}

            {!loading && (
              <button className="btnPrimary" onClick={handleSeeMore}>
                See More
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {reportReviewForm && (
        <ReportReviewForm
          reportReviewForm={reportReviewForm}
          setReportReviewForm={setReportReviewForm}
          reviewToReport={reviewToReport}
          setReviewToReport={setReviewToReport}
          currentUser={currentUser}
        />
      )}
    </div>
  );
}
