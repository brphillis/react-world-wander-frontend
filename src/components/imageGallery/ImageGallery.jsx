import React, { useState, useEffect } from "react";
import { MdClose } from "react-icons/md";
import { MdSkipNext } from "react-icons/md";
import { MdSkipPrevious } from "react-icons/md";
import Lottie from "lottie-react";
import axios from "axios";
import loadingCircle from "../../assets/loadingCircle.json";
import "./imageGallery.css";

export default function ImageGallery({
  activeWindows,
  setActiveWindows,
  imageGalleryPics,
  setImageGalleryPics,
  width,
  currentPlace,
}) {
  const [currentPicNumber, setCurrentPicNumber] = useState(0);
  const [imageGalleryCount, setImageGalleryCount] = useState(0);
  const [currentThumbnails, setCurrentThumbnails] = useState({
    first: 0,
    second: 1,
    third: 2,
    fourth: 3,
    fifth: 4,
    sixth: 5,
  });

  const getAllPinImages = async () => {
    if (activeWindows.length === 0) {
      const currentid = { id: currentPlace._id };
      try {
        const res = await axios.post(
          "http://localhost:8800/api/pins/getAllPinImages",
          currentid
        );
        setImageGalleryPics(res.data);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleNextPicture = () => {
    if (currentPicNumber < imageGalleryPics.length - 1) {
      setCurrentPicNumber(currentPicNumber + 1);
      if (width < 767 && imageGalleryCount - 1 > currentThumbnails.fourth) {
        setCurrentThumbnails({
          first: currentThumbnails.first + 1,
          second: currentThumbnails.second + 1,
          third: currentThumbnails.third + 1,
          fourth: currentThumbnails.fourth + 1,
        });
      }
      if (width > 767 && imageGalleryCount - 1 > currentThumbnails.sixth) {
        setCurrentThumbnails({
          first: currentThumbnails.first + 1,
          second: currentThumbnails.second + 1,
          third: currentThumbnails.third + 1,
          fourth: currentThumbnails.fourth + 1,
          fifth: currentThumbnails.fifth + 1,
          sixth: currentThumbnails.sixth + 1,
        });
      }
    }
  };

  const handlePrevPicture = () => {
    if (currentPicNumber > 0) {
      setCurrentPicNumber(currentPicNumber - 1);
      if (currentThumbnails.first > 0) {
        setCurrentThumbnails({
          first: currentThumbnails.first - 1,
          second: currentThumbnails.second - 1,
          third: currentThumbnails.third - 1,
          fourth: currentThumbnails.fourth - 1,
          fifth: currentThumbnails.fifth - 1,
          sixth: currentThumbnails.sixth - 1,
        });
      }
    }
  };

  const goToPicture = (index) => {
    setCurrentPicNumber(index);
  };

  useEffect(() => {
    getAllPinImages();
  }, []);

  useEffect(() => {
    setImageGalleryCount(imageGalleryPics.length);
  }, [imageGalleryPics.length]);

  useEffect(() => {
    if (width < 767 && currentPicNumber > 3) {
      setCurrentPicNumber(0);
      setCurrentThumbnails({
        first: 0,
        second: 1,
        third: 2,
        fourth: 3,
        fifth: 4,
        sixth: 5,
      });
    }
  }, [width]);

  return (
    <div className="imageGalleryContainer">
      <div id="mainImageContainer">
        {imageGalleryPics.length === 0 && (
          <Lottie animationData={loadingCircle} loop={true}></Lottie>
        )}

        {imageGalleryPics.length > 0 && (
          <img id="mainImage" src={imageGalleryPics[currentPicNumber].base64} />
        )}
      </div>

      {imageGalleryPics.length > 0 && (
        <div id="galleryThumbnailContainer">
          <img
            className={
              currentThumbnails.first == currentPicNumber
                ? "galleryThumbnail enlargen"
                : "galleryThumbnail"
            }
            src={imageGalleryPics[currentThumbnails.first].base64}
            onClick={() => goToPicture(currentThumbnails.first)}
          />
          {imageGalleryPics.length > 1 && (
            <img
              className={
                currentThumbnails.second == currentPicNumber
                  ? "galleryThumbnail enlargen"
                  : "galleryThumbnail"
              }
              src={imageGalleryPics[currentThumbnails.second].base64}
              onClick={() => goToPicture(currentThumbnails.second)}
            />
          )}
          {imageGalleryPics.length > 2 && (
            <img
              className={
                currentThumbnails.third == currentPicNumber
                  ? "galleryThumbnail enlargen"
                  : "galleryThumbnail"
              }
              src={imageGalleryPics[currentThumbnails.third].base64}
              onClick={() => goToPicture(currentThumbnails.third)}
            />
          )}
          {imageGalleryPics.length > 3 && (
            <img
              className={
                currentThumbnails.fourth == currentPicNumber
                  ? "galleryThumbnail enlargen"
                  : "galleryThumbnail"
              }
              src={imageGalleryPics[currentThumbnails.fourth].base64}
              onClick={() => goToPicture(currentThumbnails.fourth)}
            />
          )}

          {width > 767 && imageGalleryPics.length > 4 && (
            <React.Fragment>
              <img
                className={
                  currentThumbnails.fifth == currentPicNumber
                    ? "galleryThumbnail enlargen"
                    : "galleryThumbnail"
                }
                src={imageGalleryPics[currentThumbnails.fifth].base64}
                onClick={() => goToPicture(currentThumbnails.fifth)}
              />
              {imageGalleryPics.length > 5 && (
                <img
                  className={
                    currentThumbnails.sixth == currentPicNumber
                      ? "galleryThumbnail enlargen"
                      : "galleryThumbnail"
                  }
                  src={imageGalleryPics[currentThumbnails.sixth].base64}
                  onClick={() => goToPicture(currentThumbnails.sixth)}
                />
              )}
            </React.Fragment>
          )}
        </div>
      )}

      <div id="galleryBtnContainer">
        <MdSkipPrevious id="galleryBtn" onClick={() => handlePrevPicture()} />
        <MdClose
          id="galleryBtn"
          onClick={() => {
            setActiveWindows(activeWindows.filter((e) => e !== "ImageGallery"));
            setImageGalleryPics([]);
          }}
        />
        <MdSkipNext id="galleryBtn" onClick={() => handleNextPicture()} />
      </div>
    </div>
  );
}
