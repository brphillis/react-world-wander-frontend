import { Marker, Popup } from "react-map-gl";
import { FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { format } from "timeago.js";
import "./pinRenderer.css";
import React, { useEffect } from "react";
import axios from "axios";

export default function PinRenderer({
  currentPins,
  setImageGalleryPics,
  currentPlaceId,
  setCurrentPlaceId,
  setPins,
  viewport,
  pins,
  setCurrentPlace,
  width,
  setActiveWindows,
  activeWindows,
}) {
  const getPins = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_CONNECT}/api/pins`);

      setPins(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (activeWindows.length === 0) {
      getPins();
    }
    console.log(pins);
  }, [activeWindows]);

  useEffect(() => {
    console.log(pins);
  }, [pins]);

  const handleMarkerClick = (id) => {
    setCurrentPlaceId(id);
  };

  const handleShowForm = () => {
    setActiveWindows((activeWindows) => [...activeWindows, "AddReviewForm"]);
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return <div></div>;
}
