import "./profileEditor.css";
import { COUNTRIES } from "./countries.js";
import { WithContext as ReactTags } from "react-tag-input";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";
import { BsTrophyFill, BsFillHeartFill } from "react-icons/bs";
import { MdOutlineEdit } from "react-icons/md";
import { TiTick } from "react-icons/ti";
import { useState, useRef, useEffect } from "react";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import axios from "axios";
import React from "react";

export default function ProfileEditor({
  profileEditor,
  setProfileEditor,
  width,
  profilePicture,
  currentUser,
}) {
  const [currentProfile, setCurrentProfile] = useState(undefined);
  const [edtingAboutMe, setEditingAboutMe] = useState(false);
  const [editingVisited, setEditingVisited] = useState(false);
  const [tags, setTags] = useState([]);
  const tagRef = useRef([]);
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

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
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

  const getProfile = async (user) => {
    try {
      const currentid = { username: user };
      const res = await axios.post(
        "http://localhost:8800/api/users/getProfile",
        currentid
      );
      setCurrentProfile(res.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (currentProfile) {
      const handleChangeTags = async () => {
        try {
          const newTagsInfo = {
            id: currentProfile._id,
            visited: tags,
          };
          const res = await axios.put(
            "http://localhost:8800/api/users/updateVisited",
            newTagsInfo
          );
          getProfile(currentUser.username);

          return;
        } catch (err) {
          console.log(err);
        }
      };
      handleChangeTags();
    }
  }, [tags]);

  const changeAboutMe = async () => {
    try {
      const aboutMeInfo = {
        id: currentProfile._id,
        aboutMe: aboutMeRef.current.value,
      };
      const res = await axios.put(
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
    getProfile(currentUser.username);
  }, []);

  useEffect(() => {
    if (edtingAboutMe) {
      aboutMeRef.current.value = currentProfile.aboutMe;
    }
  }, [currentProfile, edtingAboutMe]);

  const dragControls = useDragControls();
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
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={width > 600 ? motionValues.desktop : motionValues.mobile}
    >
      <div id="profileEditor">
        <div
          className="menuTopBar"
          onPointerDown={(e) => {
            dragControls.start(e);
          }}
        >
          <RiCloseCircleFill
            className="xCloseButtonWhite"
            onClick={() => setProfileEditor(false)}
          />
          <p>Edit Profile</p>
        </div>

        <div className="profileEditorContent">
          {currentProfile && (
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
                        !editingVisited && setTags(currentProfile.visited);
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
                    tags={tags}
                    suggestions={suggestions}
                    delimiters={delimiters}
                    handleDelete={handleDelete}
                    allowDragDrop={false}
                    handleAddition={handleAddition}
                    inputFieldPosition="bottom"
                    autocomplete
                  />
                )}
              </div>

              <div className="profileEditorToVisit">
                <h3>I Want to Visit</h3>
                <div className="toVisitList">
                  {currentProfile.toVisit.sort().map((e, i) => {
                    return <p key={i}>{e}</p>;
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
