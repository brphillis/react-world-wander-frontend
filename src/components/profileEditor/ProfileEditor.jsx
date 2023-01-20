import "./profileEditor.css";
import { COUNTRIES } from "./countries.js";
import Lottie from "lottie-react";
import { WithContext as ReactTags } from "react-tag-input";
import { BsTrophyFill, BsFillHeartFill } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { useState, useRef, useEffect, useCallback } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import axios from "axios";
import React from "react";
import loadingCircle from "../../assets/loadingCircle.json";
import NewsFeed from "../newsFeed/NewsFeed";

export default function ProfileEditor({
  activeWindows,
  setActiveWindows,
  setImageGallery,
  setImageGalleryPics,
  currentPlace,
  currentUser,
  setAddReviewForm,
  currentPlaceId,
  reviews,
  setReviews,
  reviewToEdit,
  setReviewToEdit,
  profilePicture,
  loading,
  setLoading,
  reportReviewForm,
  setReportReviewForm,
  reviewToReport,
  setReviewToReport,
  sortedBy,
}) {
  const [currentProfile, setCurrentProfile] = useState(undefined);
  const [edtingAboutMe, setEditingAboutMe] = useState(false);
  const [editingVisited, setEditingVisited] = useState(false);
  const [editingToVisit, setEditingToVisit] = useState(false);
  const [visitedTags, setVisitedTags] = useState([]);
  const [toVisitTags, setToVisitTags] = useState([]);
  const aboutMeRef = useRef("");
  const suggestions = COUNTRIES.map((country) => {
    return {
      id: country,
      text: country,
    };
  });

  const KeyCodes = {
    comma: 188,
    enter: 13,
  };

  const delimiters = [KeyCodes.comma, KeyCodes.enter];

  const handleDeleteVisited = (i) => {
    setVisitedTags(visitedTags.filter((tag, index) => index !== i));
  };

  const handleAdditionVisited = (tag) => {
    setVisitedTags([...visitedTags, tag]);
  };

  const handleDeleteToVisit = (i) => {
    setToVisitTags(toVisitTags.filter((tag, index) => index !== i));
  };

  const handleAdditionToVisit = (tag) => {
    setToVisitTags([...toVisitTags, tag]);
  };

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });

  const aboutMeValidation = register("aboutMeErrorInput", {
    required: "About Me is Required.",
    minLength: {
      value: 3,
      message: "About Me must exceed 25 characters",
    },
    maxLength: {
      value: 800,
      message: "review title must not exceed 800 characters",
    },
  });

  //cleanup on unmount
  useEffect(() => {
    return () => {
      setLoading(true);
      setReviews(null);
    };
  }, [setLoading, setReviews]);

  useEffect(() => {
    if (activeWindows.includes("ReviewViewer")) {
      setActiveWindows(activeWindows.filter((e) => e !== "ReviewViewer"));
    }
  }, [activeWindows, setActiveWindows]);

  const handleGetReviews = useCallback(
    async (profileUserName) => {
      try {
        const user = {
          username: profileUserName,
        };
        const res = await axios.post(
          "http://localhost:8800/api/pins/getUserReviews",
          user
        );
        setReviews(res.data);
      } catch (err) {
        console.log(err);
      }
    },
    [setReviews]
  );

  const getProfile = useCallback(async () => {
    try {
      const currentid = { username: currentUser.username };
      const res = await axios.post(
        "http://localhost:8800/api/users/getProfile",
        currentid
      );
      if (res.data.length > 0) {
        if (loading) {
          handleGetReviews(res.data[0].username);
        }
        setCurrentProfile(res.data[0]);
        setLoading(false);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }, [currentUser.username, handleGetReviews, loading, setLoading]);

  //initialize
  useEffect(() => {
    if (!currentProfile) {
      getProfile();
    }
  }, [getProfile, currentProfile]);

  useEffect(() => {
    if (currentProfile && editingVisited) {
      const handleChangeVisitedTags = async () => {
        try {
          const newTagsInfo = {
            id: currentProfile._id,
            visited: visitedTags,
          };
          await axios.put(
            "http://localhost:8800/api/users/updateVisited",
            newTagsInfo
          );
          getProfile(currentUser.username);
          return;
        } catch (err) {
          console.log(err);
        }
      };
      handleChangeVisitedTags();
    }
  }, [
    visitedTags,
    currentProfile,
    currentUser.username,
    editingVisited,
    getProfile,
  ]);

  useEffect(() => {
    if (currentProfile && editingToVisit) {
      const handleChangeToVisitTags = async () => {
        try {
          const newTagsInfo = {
            id: currentProfile._id,
            toVisit: toVisitTags,
          };
          await axios.put(
            "http://localhost:8800/api/users/updateToVisit",
            newTagsInfo
          );
          getProfile(currentUser.username);

          return;
        } catch (err) {
          console.log(err);
        }
      };
      handleChangeToVisitTags();
    }
  }, [
    toVisitTags,
    currentProfile,
    currentUser.username,
    editingVisited,
    getProfile,
    editingToVisit,
  ]);

  const changeAboutMe = async () => {
    try {
      const aboutMeInfo = {
        id: currentProfile._id,
        aboutMe: aboutMeRef.current.value,
      };
      await axios.put(
        "http://localhost:8800/api/users/updateAboutMe",
        aboutMeInfo
      );
      getProfile(currentUser.username);
      setEditingAboutMe(false);
      return;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (edtingAboutMe) {
      aboutMeRef.current.value = currentProfile.aboutMe;
    }
  }, [currentProfile, edtingAboutMe]);

  return (
    <div id="profileEditor">
      {!currentProfile ||
        (!reviews && (
          <Lottie
            id="reviewsLoadingCircle"
            animationData={loadingCircle}
            loop={true}
          ></Lottie>
        ))}
      <div className="profileEditorContent">
        {currentProfile && reviews && (
          <>
            <figure>
              <img
                src={profilePicture}
                alt="profilepic"
                className="ProfileEditorProfilePicture"
              />

              <figcaption>{currentProfile.username}</figcaption>

              <div id="contributionsCount">
                <BsTrophyFill />
                {currentProfile.contributions}
                <p>Contributions</p>
              </div>

              <div id="likesCount">
                <BsFillHeartFill />
                {currentProfile.totalLikes}
                <p>Total Likes</p>
              </div>
            </figure>

            <div className="profileEditorAboutMe">
              <h3>
                About Me
                {currentUser.username && currentProfile.username && (
                  <MdOutlineEdit
                    onClick={() => {
                      setEditingAboutMe(!edtingAboutMe);
                    }}
                    className="profileEditorEditButton"
                  />
                )}
              </h3>

              {!edtingAboutMe && <p>{currentProfile.aboutMe}</p>}

              {edtingAboutMe && (
                <form onSubmit={handleSubmit(changeAboutMe)}>
                  <textarea
                    {...aboutMeValidation}
                    placeholder="About Me"
                    ref={(e) => {
                      aboutMeValidation.ref(e);
                      aboutMeRef.current = e;
                    }}
                  ></textarea>

                  <ErrorMessage
                    errors={errors}
                    name="aboutMeErrorInput"
                    render={({ messages }) => {
                      console.log("messages", messages);
                      return messages
                        ? Object.entries(messages).map(([type, message]) => (
                            <p key={type}>{message}</p>
                          ))
                        : null;
                    }}
                  />
                  <div className="flexRow">
                    <button className="btnPrimary" type="submit">
                      Submit
                    </button>
                    <button
                      onClick={() => {
                        setEditingAboutMe(!edtingAboutMe);
                      }}
                      className="btnPrimary"
                      type="button"
                    >
                      Close
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="profileEditorVisited">
              <h3>
                I Have Visited
                {currentUser.username && currentProfile.username && (
                  <MdOutlineEdit
                    onClick={() => {
                      setEditingVisited(!editingVisited);
                      !editingVisited && setVisitedTags(currentProfile.visited);
                    }}
                    className="profileEditorEditButton"
                  />
                )}
              </h3>
              {!editingVisited && (
                <div className="visitedList">
                  {currentProfile.visited.sort().map((e, i) => {
                    return <p key={i}>{e.text}</p>;
                  })}
                </div>
              )}

              {editingVisited && (
                <ReactTags
                  tags={visitedTags}
                  suggestions={suggestions}
                  delimiters={delimiters}
                  handleDelete={handleDeleteVisited}
                  allowDragDrop={false}
                  handleAddition={handleAdditionVisited}
                  inputFieldPosition="bottom"
                  autocomplete
                />
              )}
            </div>

            <div className="profileEditorToVisit">
              <h3>
                I Want to Visit
                {currentUser.username && currentProfile.username && (
                  <MdOutlineEdit
                    onClick={() => {
                      setEditingToVisit(!editingToVisit);
                      !editingToVisit && setToVisitTags(currentProfile.toVisit);
                    }}
                    className="profileEditorEditButton"
                  />
                )}
              </h3>
              {!editingToVisit && (
                <div className="toVisitList">
                  {currentProfile.toVisit.sort().map((e, i) => {
                    return <p key={i}>{e.text}</p>;
                  })}
                </div>
              )}

              {editingToVisit && (
                <ReactTags
                  tags={toVisitTags}
                  suggestions={suggestions}
                  delimiters={delimiters}
                  handleDelete={handleDeleteToVisit}
                  allowDragDrop={false}
                  handleAddition={handleAdditionToVisit}
                  inputFieldPosition="bottom"
                  autocomplete
                />
              )}
            </div>

            <br />

            <div className="profileEditorToVisit">
              <h3>Recent Activity</h3>
              <br />
            </div>
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
            ></NewsFeed>
          </>
        )}
      </div>
    </div>
  );
}
