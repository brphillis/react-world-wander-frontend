import "./accountPanel.css";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { BsFillGearFill } from "react-icons/bs";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { ImPowerCord } from "react-icons/im";
import { RiCloseCircleFill } from "react-icons/ri";
import { useState, useEffect } from "react";

export default function AccountPanel({
  myStorage,
  setCurrentUser,
  currentUser,
  setSuccess,
  setError,
  pins,
  setCurrentPins,
}) {
  const [displayOptionsPanel, setDisplayOptionsPanel] = useState(false);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [showMyPins, setShowMyPins] = useState(true);
  const [showOthersPins, setShowOthersPins] = useState(true);
  const [myPins] = useState(
    pins.filter((p) => p.username === currentUser.username)
  );
  const [othersPins] = useState(
    pins.filter((p) => p.username !== currentUser.username)
  );

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
  }, [showMyPins, showOthersPins, myPins, othersPins, pins, setCurrentPins]);

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

  const axiosJWT = axios.create();
  //automatically refresh token
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
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      await axiosJWT.delete("http://localhost:8800/api/users/" + id, {
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

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
      <div className="accountPanel">
        <figure>
          <img
            src="https://i.ibb.co/ZKZ66w3/profilepic.png"
            alt="profilepic"
            className="profilePicture"
          />
          <figcaption>{currentUser.username}</figcaption>
        </figure>

        <div className="profileBtnContainer">
          <BsFillPersonLinesFill className="optionBtn"></BsFillPersonLinesFill>

          <BsFillGearFill
            className="optionBtn"
            onClick={() => setDisplayOptionsPanel(true)}
          ></BsFillGearFill>

          <ImPowerCord className="optionBtn" onClick={handleLogout}>
            Log out
          </ImPowerCord>
        </div>
      </div>

      {displayOptionsPanel && (
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
            style={{ backgroundColor: showOthersPins ? "#20b45b" : "#b8b8b8" }}
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
      )}

      {confirmDeleteAccount && (
        <div className="optionsPanel" style={{ padding: "20px" }}>
          <h1>Are you sure you want to delete your account?</h1>
          <button className="btnPrimary" onClick={() => handleDelete(0)}>
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
    </div>
  );
}
