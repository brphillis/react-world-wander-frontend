import { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from "timeago.js";
import "./renderPins.css";
import React, { useEffect, useRef } from "react";
import axios from "axios";

export default function RenderPins({
  currentPins,
  currentUser,
  currentPlaceId,
  setCurrentPlaceId,
  setPins,
  viewport,
  mapRef,
  currentPlace,
  setCurrentPlace,
  addReviewForm,
  setAddReviewForm,
}) {
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
    console.log(mapRef);
  }, [setPins]);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div>
      {currentPins.map((p, i) => (
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
              // closeOnMove={true}
              longitude={p.long}
              latitude={p.lat}
              anchor="bottom"
              closeOnClick={false}
              onOpen={() => {
                mapRef.current.easeTo({ lng: p.long, lat: p.lat });
                setCurrentPlace(p);
              }}
              onClose={() => setCurrentPlaceId(null)}
            >
              <div className="selectedPin">
                <div className="pinImageContainer">
                  <img
                    className={"pinImage0"}
                    alt={`uploadNum0`}
                    src={p.review[0].pictures[0].base64}
                    //  onClick={() => handleDisplayImage(e, i)}
                  />

                  <div className="pinImageThumbnails">
                    {p.review[0].pictures.map((e, i) => {
                      if (i > 0 && i <= 2)
                        return (
                          <img
                            className={"pinImage" + [i]}
                            key={p.review[0].pictures[i].name + `${i}`}
                            alt={`uploadNum${i}`}
                            src={e.base64}
                            //  onClick={() => handleDisplayImage(e, i)}
                          />
                        );
                    })}
                  </div>
                </div>

                <h1 className="place">{capitalizeFirstLetter(p.name)}</h1>

                <div className="reviewDesc">
                  <div className="flexRow" style={{ gap: "10px" }}>
                    <h4>Popular Review</h4>

                    <div className="stars">
                      <React.Fragment>
                        {(() => {
                          const arr = [];
                          for (let i = 0; i < p.review[0].rating; i++) {
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
                    </div>
                  </div>
                  <div className="reviewTitle">"{`${p.review[0].title}`}"</div>
                  <div className="reviewText">{p.review[0].desc}</div>
                </div>
                <div className="username">
                  Created by &nbsp;
                  {p.review[0].username}&nbsp;
                  <span className="date">{format(p.createdAt, "en_US")}</span>
                </div>
              </div>
              <br />
              <div className="RvBtnContainer">
                <button
                  className="btnPrimary"
                  onClick={() => {
                    setAddReviewForm(true);
                    setCurrentPlaceId(null);
                  }}
                >
                  Add Review
                </button>
                <button className="btnPrimary">See more</button>
                <button
                  className="btnPrimary"
                  onClick={() => setCurrentPlaceId(null)}
                >
                  Close
                </button>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
