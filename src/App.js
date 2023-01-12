import Map, { Popup } from "react-map-gl";
import React, { useState, useEffect, useRef } from "react";
import "./app.css";

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
  const [pinName, setPinName] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [pinType, setPinType] = useState(null);
  const [pinColor, setPinColor] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewToEdit, setReviewToEdit] = useState({});
  const [rating, setRating] = useState(0);
  const [nrTaps, setNrTaps] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [addReviewForm, setAddReviewForm] = useState(false);
  const [profileEditor, setProfileEditor] = useState(false);
  const [adminPanel, setAdminPanel] = useState(false);
  const [reviewViewer, setReviewViewer] = useState(false);
  const [imageGallery, setImageGallery] = useState(false);
  const [imageGalleryPics, setImageGalleryPics] = useState([]);
  const { height, width } = useWindowDimensions();
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 0.8,
  });
  const mapRef = useRef();

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
        console.log("captcha 3 loaded");
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
      <Map
        ref={mapRef}
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
        {adminPanel && (
          <AdminPanel
            setAdminPanel={setAdminPanel}
            reviewViewer={reviewViewer}
            setReviewViewer={setReviewViewer}
            setReviews={setReviews}
            setCurrentPlace={setCurrentPlace}
          />
        )}
        <RiAdminFill
          className="adminButton"
          onClick={() => {
            setAdminPanel(true);
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
            setProfileEditor={setProfileEditor}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
          ></AccountPanel>
        )}

        {/* Render Pins */}
        <PinRenderer
          currentPins={currentPins}
          currentPlaceId={currentPlaceId}
          setCurrentPlaceId={setCurrentPlaceId}
          setPins={setPins}
          viewport={viewport}
          mapRef={mapRef}
          setCurrentPlace={setCurrentPlace}
          setAddReviewForm={setAddReviewForm}
          setImageGallery={setImageGallery}
          setReviewViewer={setReviewViewer}
          reviewViewer={reviewViewer}
          width={width}
          height={height}
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
              addReviewForm={addReviewForm}
              setAddReviewForm={setAddReviewForm}
            />
          </Popup>
        )}

        {/* Add a Review Form */}
        {addReviewForm && (
          <AddReviewForm
            setAddReviewForm={setAddReviewForm}
            currentPlace={currentPlace}
            setCurrentPlace={setCurrentPlace}
            currentPlaceId={currentPlaceId}
            setCurrentPlaceId={setCurrentPlaceId}
            currentUser={currentUser}
            pinName={pinName}
            setPinName={setPinName}
            title={title}
            setTitle={setTitle}
            desc={desc}
            setDesc={setDesc}
            rating={rating}
            reviewToEdit={reviewToEdit}
            setReviewToEdit={setReviewToEdit}
            setRating={setRating}
            setPins={setPins}
            pins={pins}
            setNewPlace={setNewPlace}
            setReviews={setReviews}
            setReviewViewer={setReviewViewer}
            newPlace={newPlace}
            pinType={pinType}
            pinColor={pinColor}
            height={height}
            width={width}
          ></AddReviewForm>
        )}

        {/* View Reviews */}
        {reviewViewer && (
          <ReviewViewer
            reviewViewer={reviewViewer}
            setReviewViewer={setReviewViewer}
            setImageGallery={setImageGallery}
            setImageGalleryPics={setImageGalleryPics}
            imageGalleryPics={imageGalleryPics}
            currentPlace={currentPlace}
            currentUser={currentUser}
            height={height}
            width={width}
            addReviewForm={addReviewForm}
            setAddReviewForm={setAddReviewForm}
            setCurrentPlace={setCurrentPlace}
            currentPlaceId={currentPlaceId}
            setCurrentPlaceId={setCurrentPlaceId}
            setPinName={setPinName}
            pinName={pinName}
            title={title}
            setTitle={setTitle}
            desc={desc}
            reviews={reviews}
            setReviews={setReviews}
            reviewToEdit={reviewToEdit}
            setReviewToEdit={setReviewToEdit}
            setDesc={setDesc}
            rating={rating}
            setRating={setRating}
            setPins={setPins}
            pins={pins}
            setNewPlace={setNewPlace}
            newPlace={newPlace}
            pinType={pinType}
            pinColor={pinColor}
          ></ReviewViewer>
        )}

        {/* Image Gallery */}
        {imageGallery && (
          <ImageGallery
            imageGallery={imageGallery}
            setImageGallery={setImageGallery}
            imageGalleryPics={imageGalleryPics}
            setImageGalleryPics={setImageGalleryPics}
            reviewViewer={reviewViewer}
            setReviewViewer={setReviewViewer}
            currentPlace={currentPlace}
            useWindowDimensions={useWindowDimensions}
            height={height}
            width={width}
          />
        )}

        {/* Profile Editor */}
        {profileEditor && (
          <ProfileEditor
            width={width}
            profileEditor={profileEditor}
            setProfileEditor={setProfileEditor}
            profilePicture={profilePicture}
            currentUser={currentUser}
          />
        )}
      </Map>
    </div>
  );
}

export default App;
