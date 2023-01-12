import "./profileEditor.css";
import { motion, useDragControls } from "framer-motion";
import { RiCloseCircleFill } from "react-icons/ri";
import { BsTrophyFill, BsFillHeartFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import axios from "axios";

export default function ProfileEditor({
  profileEditor,
  setProfileEditor,
  width,
  profilePicture,
  currentUser,
}) {
  const [currentProfile, setCurrentProfile] = useState(undefined);

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
    getProfile(currentUser.username);
    console.log(currentUser.contributions);
  }, []);

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
                <h3>About Me</h3>
                <p>{currentProfile.aboutMe}</p>
              </div>

              <div className="profileEditorVisited">
                <h3>I Have Visited</h3>
                <div className="visitedList">
                  {currentProfile.visited.sort().map((e, i) => {
                    return <p>{e}</p>;
                  })}
                </div>
              </div>

              <div className="profileEditorToVisit">
                <h3>I Want to Visit</h3>
                <div className="toVisitList">
                  {currentProfile.toVisit.sort().map((e, i) => {
                    return <p>{e}</p>;
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
