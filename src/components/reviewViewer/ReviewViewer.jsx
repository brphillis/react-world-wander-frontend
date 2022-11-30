import "./reviewViewer.css";
import { RiCloseCircleFill } from "react-icons/ri";
import { HiOutlineHeart } from "react-icons/hi";
import { motion, useDragControls } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import Lottie from "lottie-react";
import loadingCircle from "./loadingCircle.json";
import axios from "axios";
import React from "react";

export default function ReviewViewer({
  setReviewViewer,
  setImageGallery,
  setImageGalleryPics,
  currentPlace,
  currentUser,
}) {
  const [reviews, setReviews] = useState([]);
  const dragControls = useDragControls();
  const likesCounter = useRef([]);

  const getAllReviews = async () => {
    const currentid = { id: currentPlace._id };
    try {
      const res = await axios.post(
        "http://localhost:8800/api/pins/getAllReviews",
        currentid
      );
      setReviews(res.data);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const postLike = async (index) => {
    let currentLikeList = null;
    let matchingUsers = null;
    const likeId = {
      id: currentPlace._id,
      index: index,
      currentUser: currentUser.username,
    };
    try {
      const res = await axios.put(
        "http://localhost:8800/api/pins/addLike",
        likeId
      );
      currentLikeList = res.data.review[index].likes;

      matchingUsers = currentLikeList.filter(
        (likes) => likes == currentUser.username
      );

      if (matchingUsers.length !== 0) {
        console.log("liked");
        handleAddLike(index);
        return res.data;
      } else {
        return console.log("already liked");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllReviews();
  }, []);

  const handleAddLike = (i) => {
    likesCounter.current[i].innerHTML =
      parseInt(likesCounter.current[i].innerHTML) + 1;
  };

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
                <div className="reviewViewerContent" key={e.likes.length + 2}>
                  <div className="reviewViewerTitle">
                    <span>"{e.title}"&nbsp;</span>

                    <div>
                      by {e.username}
                      <HiOutlineHeart
                        className="reviewViewerLikeButton"
                        onClick={() => {
                          postLike(i);
                        }}
                      />
                      <span
                        ref={(element) => {
                          likesCounter.current[i] = element;
                        }}
                        id="likesLength"
                      >
                        {e.likes.length}
                      </span>
                    </div>
                  </div>

                  <div className="reviewViewerDesc">{e.desc}</div>

                  <div className="reviewImagesContainer">
                    {e.pictures.map((elem, index) => {
                      return (
                        <img
                          key={index + 1}
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

                  <hr />
                </div>
              );
            })}
        </div>
      </div>
    </motion.div>
  );
}
