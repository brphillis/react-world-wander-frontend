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
  setViewport,
  Map,
  mapRef,
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
                console.log(p);
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
                      if (i > 0 && i <= 3)
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

                {/* <img
                  className="previewThumbnail"
                  alt={`uploadNum${i}`}
                  src={p.review[0].pictures[0].base64}
                  //  onClick={() => handleDisplayImage(e, i)}
                /> */}

                <h4 className="place">{p.review[0].title}</h4>
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
                    {/* {Array(p.review[0].rating).fill(
                      <FaStar className="star" />
                    )} */}
                  </React.Fragment>
                </div>
                <label>Popular Review</label>
                <p className="desc">{p.review[0].desc}</p>
                <label>Rating</label>
                <div className="username">
                  Created by &nbsp;<b>{p.review[0].username}&nbsp;</b>
                </div>
                <span className="date">{format(p.createdAt, "en_US")}</span>
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
