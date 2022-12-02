import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { motion, useDragControls } from "framer-motion";
import "./addReviewForm.css";
import { RiCloseCircleFill } from "react-icons/ri";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Lottie from "lottie-react";
import logoAnimation from "./uploadAnimation.json";

export default function AddReviewForm({
  setAddReviewForm,
  currentPlace,
  setCurrentPlace,
  setCurrentPlaceId,
  currentUser,
  pinName,
  setPinName,
  title,
  setTitle,
  desc,
  setDesc,
  rating,
  setRating,
  setPins,
  pins,
  setNewPlace,
  newPlace,
  pinType,
  pinColor,
}) {
  const [oneStar, setOneStar] = useState(false);
  const [twoStar, setTwoStar] = useState(false);
  const [threeStar, setThreeStar] = useState(false);
  const [fourStar, setFourStar] = useState(false);
  const [fiveStar, setFiveStar] = useState(false);
  const [starSelection, setStarSelection] = useState(true);
  const [currentStars, setCurrentStars] = useState(0);
  const dragControls = useDragControls();
  const [images, setImages] = useState([]);

  useEffect(() => {
    setRating(currentStars);
    console.log(currentStars);
    console.log(rating);
    console.log(currentUser.username);
  }, [currentStars]);

  const openNewPin = (id) => {
    setCurrentPlaceId(id);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentPlace) {
      const newReview = {
        id: currentPlace._id,
        username: currentUser.username,
        title,
        desc,
        rating: currentStars,
        pictures: [...images],
      };
      console.log(newReview);

      try {
        const res = await axios.put(
          "http://localhost:8800/api/pins/addReview/",
          newReview
        );
        setAddReviewForm(false);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    }

    if (!currentPlace) {
      e.preventDefault();
      const newPin = {
        name: pinName,
        lat: newPlace.long,
        long: newPlace.lat,
        pinType,
        pinColor,
        review: [
          {
            username: currentUser.username,
            title,
            desc,
            rating,
            pictures: [...images],
          },
        ],
      };

      try {
        const res = await axios.post("http://localhost:8800/api/pins", newPin);
        setPins([...pins, res.data]);
        setNewPlace(null);
        setAddReviewForm(false);
        Swal.fire({
          title: "Thankyou for your Review",
          text: "   ",
          icon: "success",
          padding: "10px",
          confirmButtonColor: "#a06cd5",
          confirmButtonText: "Okay!",
          backdrop: `#23232380`,
        }).then((result) => {
          if (result.isConfirmed) {
            openNewPin(res.data._id, res.data.lat, res.data.long);
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fileToDataUri = (image) => {
    return new Promise((res) => {
      const reader = new FileReader();
      const { type, name, size } = image;
      reader.addEventListener("load", () => {
        res({
          base64: reader.result,
          name: name,
          type,
          size: size,
        });
      });
      reader.readAsDataURL(image);
    });
  };

  const uploadImage = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImagesPromises = [];
      for (let i = 0; i < e.target.files.length; i++) {
        newImagesPromises.push(fileToDataUri(e.target.files[i]));
      }
      const newImages = await Promise.all(newImagesPromises);
      setImages([...images, ...newImages]);
    }
    e.target.value = "";
  };

  const handleDisplayImage = (e, i) => {
    Swal.fire({
      imageUrl: e.base64,
      imageAlt: "Custom image",
      showCancelButton: true,
      padding: "10px",
      confirmButtonColor: "#e84338",
      confirmButtonText: "Delete",
      cancelButtonColor: "#a06cd5",
      backdrop: `#23232380`,
    }).then((result) => {
      if (result.isConfirmed) {
        setImages(images.filter((picture) => picture.base64 !== e.base64));
      }
    });
  };

  function highlightStars(e) {
    if (e.path[0].id === "oneStar" && !oneStar && starSelection) {
      setOneStar(true);
    }

    if (e.path[0].id === "twoStar" && !twoStar && starSelection) {
      setOneStar(true);
      setTwoStar(true);
    }

    if (e.path[0].id === "threeStar" && !threeStar && starSelection) {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
    }

    if (e.path[0].id === "fourStar" && !fourStar && starSelection) {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
      setFourStar(true);
    }

    if (e.path[0].id === "fiveStar" && !fiveStar && starSelection) {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
      setFourStar(true);
      setFiveStar(true);
    }
  }

  function omitStars(e) {
    if (e.path[0].id === "oneStar" && starSelection) {
      setOneStar(false);
    }
    if (e.path[0].id === "twoStar" && starSelection) {
      setOneStar(false);
      setTwoStar(false);
    }
    if (e.path[0].id === "threeStar" && starSelection) {
      setOneStar(false);
      setTwoStar(false);
      setThreeStar(false);
    }
    if (e.path[0].id === "fourStar" && starSelection) {
      setOneStar(false);
      setTwoStar(false);
      setThreeStar(false);
      setFourStar(false);
    }
    if (e.path[0].id === "fiveStar" && starSelection) {
      setOneStar(false);
      setTwoStar(false);
      setThreeStar(false);
      setFourStar(false);
      setFiveStar(false);
    }
  }

  function handleStarClick(e) {
    setStarSelection(false);
    console.log(e);

    if (e.target.parentNode.id === "oneStar") {
      setOneStar(true);
      setTwoStar(false);
      setThreeStar(false);
      setFourStar(false);
      setFiveStar(false);
      setCurrentStars(1);
    }

    if (e.target.parentNode.id === "twoStar") {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(false);
      setFourStar(false);
      setFiveStar(false);
      setCurrentStars(2);
    }

    if (e.target.parentNode.id === "threeStar") {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
      setFourStar(false);
      setFiveStar(false);
      setCurrentStars(3);
    }

    if (e.target.parentNode.id === "fourStar") {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
      setFourStar(true);
      setFiveStar(false);
      setCurrentStars(4);
    }

    if (e.target.parentNode.id === "fiveStar") {
      setOneStar(true);
      setTwoStar(true);
      setThreeStar(true);
      setFourStar(true);
      setFiveStar(true);
      setCurrentStars(5);
    }
  }

  return (
    <motion.div
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      initial={{
        position: "absolute",
        left: "40%",
        top: "20%",
        margin: "0",
      }}
    >
      <div className="addReviewFormContainer">
        <form className="addReviewForm" onSubmit={handleSubmit}>
          <div
            className="topBar"
            onPointerDown={(e) => {
              dragControls.start(e);
            }}
          >
            Add A Review
          </div>

          <RiCloseCircleFill
            class="xCloseButtonWhite"
            onClick={() => {
              setAddReviewForm(false);
              setCurrentPlace(null);
            }}
          />

          <label htmlFor="fileUpload">
            <div className="previewImageContainer">
              {images.length === 0 && (
                <div>
                  <Lottie
                    className="imgPreviewAnimation"
                    animationData={logoAnimation}
                    loop={true}
                  ></Lottie>
                </div>
              )}
              <p>Upload up to 4 Images</p>

              {images.length > 0 && (
                <img
                  className="previewImage"
                  alt={`uploadNum`}
                  src={images[0].base64}
                />
              )}
            </div>
          </label>

          <div className="previewThumbnailContainer">
            {images.slice(1).map((e, i) => {
              return (
                <div key={i}>
                  <img
                    className="previewThumbnail"
                    alt={`uploadNum${i}`}
                    src={e.base64}
                    onClick={() => handleDisplayImage(e, i)}
                  />
                </div>
              );
            })}
          </div>
          <input
            id={images.length < 4 && "fileUpload"}
            className="fileUploadInput"
            type="file"
            onChange={uploadImage}
            multiple
          />
          <br />

          {!currentPlace && (
            <input
              className="reviewTitle"
              placeholder="Name of the Location"
              onChange={(e) => setPinName(e.target.value)}
            ></input>
          )}

          <input
            className="reviewTitle"
            placeholder="Review Title"
            onChange={(e) => setTitle(e.target.value)}
          ></input>

          {currentPlace && (
            <h3>What did you think of {`${currentPlace.name}`} ?</h3>
          )}

          <textarea
            placeholder="what did you think..."
            onChange={(e) => setDesc(e.target.value)}
          />
          <br />
          <label>Rating: </label>
          <div className="starContainer">
            {!oneStar ? (
              <motion.div
                id="oneStar"
                className="starSelect"
                onHoverStart={(e) => highlightStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiOutlineStar id="oneStar" className="ratingStar" />
              </motion.div>
            ) : (
              <motion.div
                id="oneStar"
                onHoverEnd={(e) => omitStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiFillStar id="oneStar" className="ratingStarFill" />
              </motion.div>
            )}

            {!twoStar ? (
              <motion.div
                id="twoStar"
                className="starSelect"
                onHoverStart={(e) => highlightStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiOutlineStar id="twoStar" className="ratingStar" />
              </motion.div>
            ) : (
              <motion.div
                id="twoStar"
                onHoverEnd={(e) => omitStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiFillStar id="twoStar" className="ratingStarFill" />
              </motion.div>
            )}

            {!threeStar ? (
              <motion.div
                id="threeStar"
                className="starSelect"
                onHoverStart={(e) => highlightStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiOutlineStar id="threeStar" className="ratingStar" />
              </motion.div>
            ) : (
              <motion.div
                id="threeStar"
                onHoverEnd={(e) => omitStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiFillStar id="threeStar" className="ratingStarFill" />
              </motion.div>
            )}

            {!fourStar ? (
              <motion.div
                id="fourStar"
                className="starSelect"
                onHoverStart={(e) => highlightStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiOutlineStar id="fourStar" className="ratingStar" />
              </motion.div>
            ) : (
              <motion.div
                id="fourStar"
                onHoverEnd={(e) => omitStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiFillStar id="fourStar" className="ratingStarFill" />
              </motion.div>
            )}

            {!fiveStar ? (
              <motion.div
                id="fiveStar"
                className="starSelect"
                onHoverStart={(e) => highlightStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiOutlineStar id="fiveStar" className="ratingStar" />
              </motion.div>
            ) : (
              <motion.div
                id="fiveStar"
                onHoverEnd={(e) => omitStars(e)}
                onClick={(e) => handleStarClick(e)}
              >
                <AiFillStar id="fiveStar" className="ratingStarFill" />
              </motion.div>
            )}
          </div>

          <button type="submit" className="btnPrimary">
            Submit
          </button>
          <button
            type="button"
            className="btnPrimary"
            onClick={() => {
              setAddReviewForm(false);
              setCurrentPlace(null);
            }}
          >
            Close
          </button>
        </form>
      </div>
    </motion.div>
  );
}
