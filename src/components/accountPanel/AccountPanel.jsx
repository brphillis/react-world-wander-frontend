import "./accountPanel.css";
import { useRef } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BsFillGearFill } from "react-icons/bs";
import {
  BsFillPersonLinesFill,
  BsPersonPlusFill,
  BsArrowRightCircleFill,
} from "react-icons/bs";
import { ImPowerCord } from "react-icons/im";
import { RiCloseCircleFill } from "react-icons/ri";
import { RiUpload2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import logoAnimation from "./uploadAnimation.json";
import Swal from "sweetalert2";

export default function AccountPanel({
  myStorage,
  setCurrentUser,
  currentUser,
  setSuccess,
  setError,
  pins,
  setCurrentPins,
  profilePicture,
  setProfilePicture,
  setActiveWindows,
}) {
  const [profilePictureUpload, setProfilePictureUpload] = useState(false);
  const [image, setImage] = useState("");
  const [displayOptionsPanel, setDisplayOptionsPanel] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [showMyPins, setShowMyPins] = useState(true);
  const [showOthersPins, setShowOthersPins] = useState(true);
  const accountPanelRef = useRef();
  const arrowBtnRef = useRef();
  const [myPins, setMyPins] = useState(
    pins.filter((p) => p.username === currentUser.username)
  );
  const [othersPins, setOthersPins] = useState(
    pins.filter((p) => p.username !== currentUser.username)
  );

  const handleExpandTray = () => {
    if (accountPanelRef.current.style.width === "130px") {
      accountPanelRef.current.style.width = "250px";
      arrowBtnRef.current.style.transform = "rotate(180deg)";
    } else {
      accountPanelRef.current.style.width = "130px";
      arrowBtnRef.current.style.transform = "rotate(0deg)";
    }
  };

  useEffect(() => {
    setMyPins(pins.filter((p) => p.username === currentUser.username));
    setOthersPins(pins.filter((p) => p.username !== currentUser.username));
  }, [currentUser.username, pins, displayOptionsPanel]);

  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:8800/api/users/refresh/", {
        token: currentUser.refreshToken,
      });
      setCurrentUser({
        ...currentUser,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  //automatically refresh token
  const axiosJWT = axios.create();
  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(currentUser.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogout = () => {
    Swal.fire({
      title: "Just checking...",
      text: "Are you sure you want to Log out?",
      icon: "warning",
      padding: "10px",
      confirmButtonColor: "#d33",
      confirmButtonText: "Log out",
      showCancelButton: true,
      cancelButtonColor: "#a06cd5",
      backdrop: `#23232380`,
    }).then((result) => {
      if (result.isConfirmed) {
        myStorage.removeItem("user");
        setCurrentUser(null);
      }
    });
  };

  const handleDeleteAccount = async (id) => {
    setSuccess(false);
    setError(false);

    const userData = { id: id };

    try {
      await axiosJWT.post(
        "http://localhost:8800/api/users/deleteUser",
        userData,
        {
          headers: {
            authorization: "Bearer " + currentUser.accessToken,
          },
        }
      );

      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  //Profile Picture Upload and Set
  const convert2base64 = async (e) => {
    const file = await e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result.toString());
    };
    reader.readAsDataURL(file);
  };

  const handleChangeProfilePicture = async (e) => {
    e.preventDefault();
    const newPicture = {
      id: currentUser._id,
      profilePicture: image,
    };

    try {
      const res = await axios.put(
        "http://localhost:8800/api/users/updateProfilePicture/",
        newPicture
      );
      setCurrentUser({
        ...currentUser,
        profilePicture: image,
      });

      if (setProfilePictureUpload) {
        setProfilePictureUpload(false);
      }

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    window.localStorage.setItem("token", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    setProfilePicture(currentUser.profilePicture);
  }, [setProfilePicture, currentUser.profilePicture]);

  const handleProfilePictureUpload = function () {
    setProfilePictureUpload(true);
  };

  //Handles currently selected pins
  useEffect(() => {
    if (showMyPins && showOthersPins) {
      setCurrentPins(pins);
    }
    if (!showMyPins && !showOthersPins) {
      setCurrentPins([]);
    }
    if (showMyPins && !showOthersPins) {
      setCurrentPins(myPins);
    }
    if (!showMyPins && showOthersPins) {
      setCurrentPins(othersPins);
    }
  }, [
    showMyPins,
    showOthersPins,
    myPins,
    othersPins,
    pins,
    setCurrentPins,
    displayOptionsPanel,
  ]);

  const handleShowMyPins = function () {
    if (showMyPins) {
      setShowMyPins(false);
    } else {
      setShowMyPins(true);
    }
  };

  const handleShowOthersPins = function () {
    if (showOthersPins) {
      setShowOthersPins(false);
    } else {
      setShowOthersPins(true);
    }
  };

  return (
    <div className="accountPanelContainer">
      <div className="accountPanel" ref={accountPanelRef}>
        <figure onClick={currentUser !== "guest" && handleProfilePictureUpload}>
          <RiUpload2Fill className="uploadPlaceholder" />
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="profilepic"
              className="profilePicture"
            />
          ) : (
            <div className="profilePicture">
              <BsPersonPlusFill className="placeholderProfilePicture" />
            </div>
          )}

          <figcaption>{currentUser.username}</figcaption>
        </figure>

        <div className="profileBtnContainer">
          <BsFillPersonLinesFill
            className="optionBtn"
            onClick={() =>
              setActiveWindows((activeWindows) => [
                ...activeWindows,
                "ProfileEditor",
              ])
            }
          ></BsFillPersonLinesFill>

          <BsFillGearFill
            className="optionBtn"
            onClick={() => setDisplayOptionsPanel(true)}
          ></BsFillGearFill>

          <ImPowerCord className="optionBtn" onClick={handleLogout}>
            Log out
          </ImPowerCord>

          <div className="rotateBtn" ref={arrowBtnRef}>
            <BsArrowRightCircleFill
              className="optionBtn"
              onClick={() => {
                handleExpandTray();
              }}
            />
          </div>
        </div>
      </div>

      {displayOptionsPanel && (
        <motion.div drag>
          <div className="optionsPanel">
            <RiCloseCircleFill
              onClick={() => setDisplayOptionsPanel(false)}
              className="xCloseButton"
            />
            <h2>Options Panel</h2>
            <hr />

            <button
              type="button"
              className="btnPrimary"
              style={{ backgroundColor: showMyPins ? "#20b45b" : "#b8b8b8" }}
              onClick={() => {
                handleShowMyPins();
              }}
            >
              My Pins
            </button>

            <button
              className="btnPrimary"
              style={{
                backgroundColor: showOthersPins ? "#20b45b" : "#b8b8b8",
              }}
              onClick={() => {
                handleShowOthersPins();
              }}
            >
              Others Pins
            </button>
            <hr />
            <button
              className="btnPrimary"
              onClick={() => setConfirmDeleteAccount(true)}
            >
              Delete Account
            </button>

            <hr />
            <button
              className="btnPrimary"
              onClick={() => setDisplayOptionsPanel(false)}
            >
              Close
            </button>
          </div>
        </motion.div>
      )}

      {confirmDeleteAccount && (
        <div className="optionsPanel" style={{ padding: "20px" }}>
          <h1>Are you sure you want to delete your account?</h1>
          <button
            className="btnPrimary"
            onClick={() => handleDeleteAccount(currentUser._id)}
          >
            Yes
          </button>
          <button
            className="btnPrimary"
            onClick={() => setConfirmDeleteAccount(false)}
          >
            No
          </button>
        </div>
      )}

      {profilePictureUpload && (
        <div className="profilePictureUpload">
          <RiCloseCircleFill
            onClick={() => setProfilePictureUpload(false)}
            className="xCloseButton"
          />
          <h1>Upload a profile picture</h1>
          <form onSubmit={handleChangeProfilePicture}>
            <label className="fileUploadLabel" htmlFor="fileUpload">
              <div className="previewPicture">
                {!image && (
                  <Lottie
                    className="profilePictureUploadPlaceHolder"
                    animationData={logoAnimation}
                    loop={true}
                  ></Lottie>
                )}
                {image && <img alt="uploadPlaceholder" src={image} />}
              </div>
            </label>

            <input
              id="fileUpload"
              className="fileUploadInput"
              type="file"
              onChange={(e) => convert2base64(e)}
            />
            <button className="btnPrimary" type="submit">
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
