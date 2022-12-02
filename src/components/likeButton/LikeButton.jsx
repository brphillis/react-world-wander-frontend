import { React, useState, useEffect, useRef } from "react";
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
  const [hasLiked, setHasLiked] = useState(false);
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
      const res = await axios.put(
        "http://localhost:8800/api/pins/addLike",
        likeId
      );
      currentLikeList = res.data.review[index].likes;

      matchingUsers = currentLikeList.filter(
        (likes) => likes == currentUser.username
      );

      if (matchingUsers.length < 1) {
        handleAddLike(index);
        return res.data;
      } else {
        return;
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

  useEffect(() => {
    if (likesArray.includes(currentUser.username)) {
      setHasLiked(true);
      likeButtonRef.current[currentIndex].firstChild.style.fill = "#a06cd5";
    }
    if (!likesArray.includes(currentUser.username)) {
      setHasLiked(false);
    }
  }, [setHasLiked, hasLiked, currentUser.username, likesArray, postLike]);

  return (
    <div
      className="likeButtonContainer"
      ref={(element) => {
        likeButtonRef.current[currentIndex] = element;
      }}
    >
      <HiOutlineHeart
        className="reviewViewerLikeButton"
        onClick={() => {
          postLike(currentIndex);
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
