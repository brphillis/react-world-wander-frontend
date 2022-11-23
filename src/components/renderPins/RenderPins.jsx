import { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from "timeago.js";
import "./renderPins.css";
import React, { useEffect } from "react";
import axios from "axios";

export default function RenderPins({
  currentPins,
  currentUser,
  viewport,
  currentPlaceId,
  setCurrentPlaceId,
  setPins,
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
  }, [setPins]);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
    console.log(currentUser);
  };

  return (
    <div>
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
    </div>
  );
}
