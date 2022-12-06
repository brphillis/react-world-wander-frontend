import Map, { Popup } from "react-map-gl";
import React, { useState, useEffect, useRef } from "react";
import "./app.css";

import LoginContainer from "./components/loginContainer/LoginContainer";
import RenderPins from "./components/renderPins/RenderPins";
import AccountPanel from "./components/accountPanel/AccountPanel";
import MapClickMenu from "./components/mapClickMenu/MapClickMenu";
import ImageGallery from "./components/imageGallery/ImageGallery";
import AddReviewForm from "./components/addReviewForm/AddReviewForm";
import ReviewViewer from "./components/reviewViewer/ReviewViewer";

import useWindowDimensions from "./hooks/useWindowDimensions";
import { AiFillCodeSandboxCircle } from "react-icons/ai";

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
  const [rating, setRating] = useState(0);
  const [nrTaps, setNrTaps] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [addReviewForm, setAddReviewForm] = useState(false);
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

  const handleLoaded = (_) => {
    window.grecaptcha.ready((_) => {
      window.grecaptcha
        .execute("6LfI3FsjAAAAABFbi2tuGXNjMAMfnSw0_SnVia_V", {
          action: "homepage",
        })
        .then((token) => {
          // ...
        });
    });
  };

  useEffect(() => {
    // Add reCaptcha
    const script = document.createElement("script");
    script.src =
      "https://www.google.com/recaptcha/api.js?render=6LfI3FsjAAAAABFbi2tuGXNjMAMfnSw0_SnVia_V";
    script.addEventListener("load", handleLoaded);
    document.body.appendChild(script);
  }, []);

  //double click to add pin
  const handleAddClick = (e) => {
    if (
      nrTaps >= 1 &&
      Date.now() - startDate < 500 &&
      currentUser !== "guest"
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
          ></AccountPanel>
        )}

        {/* Render Pins */}
        <RenderPins
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
        ></RenderPins>

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
            setCurrentPlaceId={setCurrentPlaceId}
            currentUser={currentUser}
            pinName={pinName}
            setPinName={setPinName}
            title={title}
            setTitle={setTitle}
            desc={desc}
            setDesc={setDesc}
            rating={rating}
            setRating={setRating}
            setPins={setPins}
            pins={pins}
            setNewPlace={setNewPlace}
            newPlace={newPlace}
            pinType={pinType}
            pinColor={pinColor}
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
      </Map>
    </div>
  );
}

export default App;
