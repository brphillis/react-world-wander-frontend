import { React, useRef } from "react";
import { HiOutlineHeart } from "react-icons/hi";
import axios from "axios";

import "./likeButton.css";

export default function LikeButton({
  currentUser,
  currentPlace,
  likesArray,
  currentIndex,
  likesCount,
}) {
  const likeButtonRef = useRef([]);
  const likesCounter = useRef([]);

  const postLike = async (index) => {
    let currentLikeList = null;
    let matchingUsers = null;
    const likeId = {
      id: currentPlace._id,
      index: index,
      currentUser: currentUser.username,
    };

    try {
      let res = await axios.put(
        "http://localhost:8800/api/pins/addLike",
        likeId
      );
      currentLikeList = res.data.review[index].likes;

      matchingUsers = currentLikeList.filter(
        (likes) => likes === currentUser.username
      );

      if (matchingUsers.length < 1) {
        handleAddLike(index);
        return res.data;
      } else {
        res = await axios.put(
          "http://localhost:8800/api/pins/deleteLike",
          likeId
        );
        handleRemoveLike(index);
        return res.data;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAddLike = (i) => {
    likesCounter.current[i].innerHTML =
      parseInt(likesCounter.current[i].innerHTML) + 1;

    likeButtonRef.current[currentIndex].firstChild.style.fill = "#a06cd5";
  };

  const handleRemoveLike = (i) => {
    likesCounter.current[i].innerHTML =
      parseInt(likesCounter.current[i].innerHTML) - 1;

    likeButtonRef.current[currentIndex].firstChild.style.fill = "none";
  };

  return (
    <div
      className="likeButtonContainer"
      ref={(element) => {
        likeButtonRef.current[currentIndex] = element;
      }}
    >
      <HiOutlineHeart
        style={{
          fill: likesArray.includes(currentUser.username) ? "#a06cd5" : "none",
        }}
        className="reviewViewerLikeButton"
        onClick={() => {
          currentUser !== "guest" && postLike(currentIndex);
        }}
      />

      <span
        ref={(element) => {
          likesCounter.current[currentIndex] = element;
        }}
        id="likesLength"
      >
        {likesCount}
      </span>
    </div>
  );
}
