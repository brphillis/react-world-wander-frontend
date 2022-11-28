import Map, { Popup } from "react-map-gl";
import React, { useState, useEffect, useRef } from "react";
import "./app.css";
import axios from "axios";
import LoginContainer from "./components/loginContainer/LoginContainer";
import RenderPins from "./components/renderPins/RenderPins";
import AccountPanel from "./components/accountPanel/AccountPanel";
import NewPinForm from "./components/newPinForm/NewPinForm";
import ImageGallery from "./components/imageGallery/ImageGallery";
import AddReviewForm from "./components/addReviewForm/AddReviewForm";

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
    setAddReviewForm(true);
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

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
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
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
            success={success}
            setSuccess={setSuccess}
            error={error}
            setError={setError}
            handleLogout={handleLogout}
            pins={pins}
            currentPins={currentPins}
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
            success={success}
            setError={setError}
            error={error}
            pins={pins}
            setPins={setPins}
            currentPins={currentPins}
            setCurrentPins={setCurrentPins}
          ></AccountPanel>
        )}

        {/* Render Pins */}
        <RenderPins
          currentPins={currentPins}
          currentUser={currentUser}
          viewport={viewport}
          setViewport={setViewport}
          currentPlaceId={currentPlaceId}
          currentPlace={currentPlace}
          setCurrentPlace={setCurrentPlace}
          setCurrentPlaceId={setCurrentPlaceId}
          addReviewForm={addReviewForm}
          setAddReviewForm={setAddReviewForm}
          pins={pins}
          setPins={setPins}
          Map={Map}
          mapRef={mapRef}
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
            <NewPinForm
              addReviewForm={addReviewForm}
              setAddReviewForm={setAddReviewForm}
            />
          </Popup>
        )}

        {/* Image Gallery */}
        <ImageGallery></ImageGallery>

        {addReviewForm && (
          <AddReviewForm
            addReviewForm={addReviewForm}
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
            setRating={setRating}
            setPins={setPins}
            pins={pins}
            setNewPlace={setNewPlace}
            newPlace={newPlace}
            pinType={pinType}
            pinColor={pinColor}
          ></AddReviewForm>
        )}
      </Map>
    </div>
  );
}

export default App;
