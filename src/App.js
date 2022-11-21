import ReactMapGL, { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import "./app.css";
import { format } from "timeago.js";
import axios from "axios";
import LoginContainer from "./components/loginContainer/LoginContainer";
import AccountPanel from "./components/accountPanel/AccountPanel";
import NewPinForm from "./components/newPinForm/NewPinForm";

function App() {
  const myStorage = window.localStorage;

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [pins, setPins] = useState([]);
  const [currentPins, setCurrentPins] = useState([]);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"));
  const [currentPlaceId, setCurrentPlaceId] = useState(" ");
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [pinType, setPinType] = useState(null);
  const [pinColor, setPinColor] = useState(null);
  const [rating, setRating] = useState(0);
  const [nrTaps, setNrTaps] = useState(0);
  const [startDate, setStartDate] = useState(Date.now());
  const [viewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 1,
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
    const getPins = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/pins");
        setPins(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getPins();
  }, []);

  //click to view pin
  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

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
      console.log(e);
    } else {
      setStartDate(Date.now());
      setNrTaps((prevNr) => prevNr + 1);
      // single tap;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      title,
      desc,
      rating,
      pinType,
      pinColor,
      lat: newPlace.long,
      long: newPlace.lat,
    };

    try {
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
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
          latitude: 42.6,
          longitude: 71.7,
          doubleClickZoom: false,
          projection: "globe",
          center: [30, 50],
          zoom: 2.4,
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
        {currentPins.map((p) => (
          <React.Fragment key={p.long}>
            <Marker
              longitude={p.long}
              latitude={p.lat}
              offsetLeft={-viewport.zoom * 3.5}
              offsetTop={-viewport.zoom * 7}
            >
              <FaMapMarkerAlt
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                style={{
                  fontSize: viewport.zoom * 25,
                  color: p.pinColor,
                  cursor: "pointer",
                }}
              />
            </Marker>

            {/* Selected Pin Popup */}
            {p._id === currentPlaceId && (
              <Popup
                longitude={p.long}
                latitude={p.lat}
                anchor="bottom"
                closeOnClick={false}
                onClose={() => setCurrentPlaceId(null)}
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    <React.Fragment>
                      {(() => {
                        const arr = [];
                        for (let i = 0; i < p.rating; i++) {
                          arr.push(
                            <FaStar
                              className="star"
                              key={Math.floor(parseInt(p._id) + i)}
                            />
                          );
                        }
                        return arr;
                      })()}
                    </React.Fragment>

                    {/* {Array(p.rating).fill(<FaStar className="star" />)} */}
                  </div>

                  <label>Information</label>
                  <span className="username">
                    created By <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt, "en_US")}</span>
                </div>
              </Popup>
            )}
          </React.Fragment>
        ))}

        {/* Add Pin Popup */}
        {newPlace && (
          <Popup
            latitude={newPlace.long}
            longitude={newPlace.lat}
            closeButton={true}
            closeOnClick={false}
            onClose={() => setNewPlace(null)}
          >
            <NewPinForm
              setTitle={setTitle}
              setDesc={setDesc}
              setRating={setRating}
              newPlace={newPlace}
              setNewPlace={setNewPlace}
              handleSubmit={handleSubmit}
              pinType={pinType}
              setPinType={setPinType}
              pinColor={pinColor}
              setPinColor={setPinColor}
            />
          </Popup>
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;
