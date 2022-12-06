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

export default function ReviewViewer({
  setReviewViewer,
  setImageGallery,
  setImageGalleryPics,
  currentPlace,
  currentUser,
}) {
  const [reviews, setReviews] = useState([]);
  const profilePicturesRef = useRef([]);
  const dragControls = useDragControls();

  const [sortReviews, setSortReviews] = useState({
    reviewsByLikes: reviews.sort(function (a, b) {
      return b.likes.length - a.likes.length;
    }),

    reviewsByRecent: reviews.reverse(),
  });

  const getProfilePicture = async (user) => {
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
    const getAllReviews = async () => {
      const currentid = { id: currentPlace._id };
      try {
        const res = await axios.post(
          "http://localhost:8800/api/pins/getAllReviews",
          currentid
        );

        var reviewsByLikes = res.data.sort(function (a, b) {
          return b.likes.length - a.likes.length;
        });

        setReviews(reviewsByLikes);
        res.data.forEach((e, i) => {
          getProfilePicture(e.username).then(
            (data) =>
              (profilePicturesRef.current[i].src = data[0].profilePicture)
          );
        });

        return res.data;
      } catch (err) {
        console.log(err);
      }
    };
    getAllReviews();
  }, [currentPlace._id]);

  function handleSetImageGalleryPics(e) {
    e.forEach((elem, i) => {
      setImageGalleryPics((imageGalleryPics) => [...imageGalleryPics, elem]);
    });
  }

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{
        position: "absolute",
        left: "35%",
        top: "1%",
        margin: "0",
      }}
    >
      <div id="reviewViewer">
        {reviews.length === 0 && (
          <Lottie
            id="reviewsLoadingCircle"
            animationData={loadingCircle}
            loop={true}
          ></Lottie>
        )}

        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <MdSort className="sortButton" />
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setReviewViewer(false)}
          />
          <p>Reviews</p>
        </div>

        <div id="reviewViewerContentContainer">
          {reviews.length > 0 &&
            reviews.map((e, i) => {
              return (
                <div className="reviewViewerContent" key={e.desc.length + 9}>
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

                  <div className="rvTimeAgo">
                    {format(e.createdAt, "en_US")}
                  </div>

                  <div className="rvDivider"></div>
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
