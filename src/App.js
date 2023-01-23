import ReactMapGL, { Popup } from "react-map-gl";
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

import { RiAdminFill } from "react-icons/ri";

import LoginContainer from "./components/loginContainer/LoginContainer";
import PinRenderer from "./components/pinRenderer/PinRenderer";
import AccountPanel from "./components/accountPanel/AccountPanel";
import MapClickMenu from "./components/mapClickMenu/MapClickMenu";
import ImageGallery from "./components/imageGallery/ImageGallery";
import AddReviewForm from "./components/addReviewForm/AddReviewForm";
import ReviewViewer from "./components/reviewViewer/ReviewViewer";
import ProfileEditor from "./components/profileEditor/ProfileEditor";

import useWindowDimensions from "./hooks/useWindowDimensions";
import AdminPanel from "./components/adminPanel/AdminPanel";
import TitleBar from "./components/titleBar/TitleBar";
import ReportReviewForm from "./components/reportReviewForm/ReportReviewForm";

function App() {
  const myStorage = window.localStorage;
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pins, setPins] = useState([]);
  const [currentPins, setCurrentPins] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [currentPlace, setCurrentPlace] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [pinType, setPinType] = useState(null);
  const [pinColor, setPinColor] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState({});
  const [rating, setRating] = useState(0);
  const [nrTaps, setNrTaps] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [addReviewForm, setAddReviewForm] = useState(false);
  const [imageGallery, setImageGallery] = useState(false);
  const [imageGalleryPics, setImageGalleryPics] = useState([]);
  const [sortedBy, setSortedBy] = useState("popular");
  const [activeWindows, setActiveWindows] = useState([]);
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [reportReviewForm, setReportReviewForm] = useState(false);
  const [reviewToReport, setReviewToReport] = useState({});
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 0.8,
  });

  const controlTrue = {
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
  };

  const controlFalse = {
    width: "100vw",
    height: "100vh",
    pointerEvents: "auto",
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    if (token) {
      setCurrentUser(JSON.parse(token));
    }
  }, []);

  //load captcha
  useEffect(() => {
    const loadScriptByURL = (id, url, callback) => {
      const isScriptExist = document.getElementById(id);

      if (!isScriptExist) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.id = id;
        script.onload = function () {
          if (callback) callback();
        };
        document.body.appendChild(script);
      }

      if (isScriptExist && callback) callback();
    };

    // load captcha script by passing URL
    loadScriptByURL(
      "recaptcha-key",
      `https://www.google.com/recaptcha/api.js?render=${process.env.REACT_APP_SITE_KEY}`,
      function () {
        console.log("CAPTCHA LOADED");
      }
    );
  }, []);

  //double click to add pin
  const handleAddClick = (e) => {
    if (
      nrTaps >= 1 &&
      Date.now() - startDate < 500 &&
      currentUser !== "guest" &&
      !currentPlaceId
    ) {
      setStartDate(Date.now());
      setNrTaps(0);
      // double tap
      let longitude = e.lngLat.lng;
      let latitude = e.lngLat.lat;

      setNewPlace({
        long: latitude,
        lat: longitude,
      });
    } else {
      setStartDate(Date.now());
      setNrTaps((prevNr) => prevNr + 1);
      // single tap;
    }
  };

  return (
    <div className="App">
      <ReactMapGL
        style={
          currentUser || currentUser === "guest" ? controlFalse : controlTrue
        }
        className="loginContainer"
        mapStyle="mapbox://styles/phillisb/cla869nb9000115qt5z8yfwyw"
        transitionDuration="500"
        mapboxAccessToken={process.env.REACT_APP_MAPBOX}
        initialViewState={{
          latitude: viewport.lat,
          longitude: viewport.long,
          doubleClickZoom: false,
          projection: "globe",
          center: [1, 1],
          zoom: 2,
          pitch: 90,
        }}
        fog={{
          range: [0.8, 8],
          color: "#7268B6",
          "horizon-blend": 0.1,
          "high-color": "#93BEDF",
          "space-color": "#7268B6",
          "star-intensity": 0.2,
        }}
        onClick={handleAddClick}
      >
        {/* Login Container */}
        {!currentUser && (
          <LoginContainer
            success={success}
            setSuccess={setSuccess}
            error={error}
            setError={setError}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            pins={pins}
            setCurrentPins={setCurrentPins}
          ></LoginContainer>
        )}

        {/* Admin Panel */}

        {activeWindows.includes("AdminPanel") && (
          <TitleBar
            isList={false}
            title={"Admin Panel"}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            setLoading={setLoading}
            sortedBy={sortedBy}
            setSortedBy={setSortedBy}
          >
            <AdminPanel
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              setReviews={setReviews}
              setCurrentPlace={setCurrentPlace}
              setLoading={setLoading}
            />
          </TitleBar>
        )}

        <RiAdminFill
          className="adminButton"
          onClick={() => {
            setActiveWindows((activeWindows) => [
              ...activeWindows,
              "AdminPanel",
            ]);
          }}
        />

        {/* Profile Panel */}
        {currentUser && (
          <AccountPanel
            myStorage={myStorage}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
            setSuccess={setSuccess}
            setError={setError}
            pins={pins}
            setCurrentPins={setCurrentPins}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            setActiveWindows={setActiveWindows}
          ></AccountPanel>
        )}

        {/* Render Pins */}
        <PinRenderer
          currentPins={currentPins}
          setImageGalleryPics={setImageGalleryPics}
          currentPlaceId={currentPlaceId}
          setCurrentPlaceId={setCurrentPlaceId}
          pins={pins}
          setPins={setPins}
          viewport={viewport}
          setCurrentPlace={setCurrentPlace}
          width={width}
          activeWindows={activeWindows}
          setActiveWindows={setActiveWindows}
        ></PinRenderer>

        {/* Add Pin Popup */}
        {newPlace && (
          <Popup
            latitude={newPlace.long}
            longitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            anchor={"bottom"}
            onClose={() => setNewPlace(null)}
          >
            <MapClickMenu
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
            />
          </Popup>
        )}

        {/* Add a Review Form */}
        {activeWindows.includes("AddReviewForm") && (
          <TitleBar
            isList={false}
            title={"Add Review"}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            setLoading={setLoading}
            sortedBy={sortedBy}
            setSortedBy={setSortedBy}
          >
            <AddReviewForm
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              setLoading={setLoading}
              width={width}
              currentPlace={currentPlace}
              setCurrentPlace={setCurrentPlace}
              currentPlaceId={currentPlaceId}
              setCurrentPlaceId={setCurrentPlaceId}
              currentUser={currentUser}
              reviewToEdit={reviewToEdit}
              setReviewToEdit={setReviewToEdit}
              setRating={setRating}
              setPins={setPins}
              pins={pins}
              setNewPlace={setNewPlace}
              setReviews={setReviews}
              newPlace={newPlace}
              pinType={pinType}
              pinColor={pinColor}
              reviews={reviews}
            />
          </TitleBar>
        )}

        {/* View Reviews */}
        {activeWindows.includes("ReviewViewer") &&
          !activeWindows.includes("ProfileEditor") && (
            <TitleBar
              isList={true}
              title={"Reviews"}
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              setLoading={setLoading}
              sortedBy={sortedBy}
              setSortedBy={setSortedBy}
              setCurrentPlace={setCurrentPlace}
            >
              <ReviewViewer
                activeWindows={activeWindows}
                setActiveWindows={setActiveWindows}
                reviews={reviews}
                setReviews={setReviews}
                currentPlaceId={currentPlaceId}
                setCurrentPlaceId={setCurrentPlaceId}
                setImageGalleryPics={setImageGalleryPics}
                setReviewToEdit={setReviewToEdit}
                currentPlace={currentPlace}
                currentUser={currentUser}
                width={width}
                sortedBy={sortedBy}
                loading={loading}
                setLoading={setLoading}
                setReviewToReport={setReviewToReport}
              />
            </TitleBar>
          )}

        {/* Report Review Form */}
        {activeWindows.includes("ReportReviewForm") && (
          <TitleBar
            isList={true}
            title={"Report Review"}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            setLoading={setLoading}
            sortedBy={sortedBy}
            setSortedBy={setSortedBy}
            setCurrentPlace={setCurrentPlace}
          >
            <ReportReviewForm
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              reviewToReport={reviewToReport}
              setReviewToReport={setReviewToReport}
              currentUser={currentUser}
              currentPlace={currentPlace}
            />
          </TitleBar>
        )}

        {/* Image Gallery */}
        {activeWindows.includes("ImageGallery") && (
          <ImageGallery
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            imageGalleryPics={imageGalleryPics}
            setImageGalleryPics={setImageGalleryPics}
            width={width}
            currentPlace={currentPlace}
          />
        )}

        {/* Profile Editor */}
        {activeWindows.includes("ProfileEditor") && (
          <TitleBar
            isList={false}
            title={"Edit Profile"}
            activeWindows={activeWindows}
            setActiveWindows={setActiveWindows}
            setLoading={setLoading}
            sortedBy={sortedBy}
            setSortedBy={setSortedBy}
          >
            <ProfileEditor
              activeWindows={activeWindows}
              setActiveWindows={setActiveWindows}
              setImageGalleryPics={setImageGalleryPics}
              currentPlace={currentPlace}
              currentUser={currentUser}
              currentPlaceId={currentPlaceId}
              setCurrentPlaceId={setCurrentPlaceId}
              reviews={reviews}
              setReviews={setReviews}
              setReviewToEdit={setReviewToEdit}
              profilePicture={profilePicture}
              loading={loading}
              setLoading={setLoading}
              setReviewToReport={setReviewToReport}
              sortedBy={sortedBy}
            />
          </TitleBar>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
