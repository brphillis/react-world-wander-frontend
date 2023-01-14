import { useEffect, useState, useRef } from "react";
import React from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { format } from "timeago.js";
import LikeButton from "../likeButton/LikeButton";
import PopupEdit from "../popupEdit/PopupEdit";

import "./newsFeed.css";

export default function NewsFeed({
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
  loading,
  setLoading,
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
  handleSortFeed,
  sortedBy,
}) {
  const [firstFetched, setFirstFetched] = useState(0);
  const [lastFetched, setlastFetched] = useState(10);
  const profilePicturesRef = useRef([]);

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

  const getProfilePictures = async (user) => {
    try {
      const currentid = { username: user };
      const res = await axios.post(
        "http://localhost:8800/api/users/getProfile",
        currentid
      );

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentPlace) {
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

          setReviews(res.data);

          res.data.forEach((e, i) => {
            getProfilePictures(e.username).then(
              (data) =>
                (profilePicturesRef.current[i].src = data[0].profilePicture)
            );
          });

          if (loading) {
            setLoading(false);
          }
          return res.data;
        } catch (err) {
          console.log(err);
        }
      };
      getLimitedReviews();
    } else {
      reviews.forEach((e, i) => {
        getProfilePictures(e.username).then(
          (data) => (profilePicturesRef.current[i].src = data[0].profilePicture)
        );
      });
    }
  }, [currentPlaceId, sortedBy, firstFetched, lastFetched]);

  return (
    <div>
      {reviews &&
        reviews.map((e, i) => {
          return (
            <div
              className="reviewViewerContent"
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

                <div className="reviewViewerTitleContent">by {e.username}</div>
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
                currentPlaceId={currentPlaceId}
                currentUser={currentUser}
                reportReviewForm={reportReviewForm}
                setReportReviewForm={setReportReviewForm}
                reviewToReport={reviewToReport}
                setReviewToReport={setReviewToReport}
              />

              <div className="rvTimeAgo">{format(e.createdAt, "en_US")}</div>

              <div className="rvDivider"></div>
            </div>
          );
        })}

      {!loading && reviews.length > 5 && (
        <button className="btnPrimary" onClick={handleSeeMore}>
          See More
        </button>
      )}
    </div>
  );
}
