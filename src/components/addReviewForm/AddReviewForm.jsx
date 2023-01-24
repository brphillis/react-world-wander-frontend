import "./addReviewForm.css";
import { BsFillTrashFill } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import Swal from "sweetalert2";
import axios from "axios";
import Lottie from "lottie-react";
import logoAnimation from "../../assets/uploadAnimation.json";
import { useChangeContributions } from "../../hooks/useChangeContributions";
import Compress from "react-image-file-resizer";

export default function AddReviewForm({
  activeWindows,
  setActiveWindows,
  setLoading,
  width,
  currentPlace,
  setCurrentPlace,
  currentUser,
  reviewToEdit,
  setReviewToEdit,
  setRating,
  setPins,
  pins,
  setNewPlace,
  setReviews,
  newPlace,
  pinType,
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });
  const currentStarValueRef = useRef(1);
  const oneStarRef = useRef();
  const twoStarRef = useRef();
  const threeStarRef = useRef();
  const fourStarRef = useRef();
  const fiveStarRef = useRef();
  const [currentStars, setCurrentStars] = useState(1);
  const [images, setImages] = useState([]);
  const reviewTitleRef = useRef(null);
  const reviewDescRef = useRef(null);
  const locationNameRef = useRef(null);
  const { changeContributions } = useChangeContributions();

  const nameValidation = register("placeNameErrorInput", {
    required:
      !currentPlace && Object.keys(reviewToEdit).length === 0
        ? "place name is required."
        : false,
    minLength: {
      value: 3,
      message: "place name must exceed 3 characters",
    },
    maxLength: {
      value: 15,
      message: "place name must not exceed 15 characters",
    },
  });

  const titleValidation = register("reviewTitleErrorInput", {
    required: "review title is required.",
    minLength: {
      value: 3,
      message: "review title must exceed 3 characters",
    },
    maxLength: {
      value: 25,
      message: "review title must not exceed 25 characters",
    },
  });

  const descValidation = register("reviewDescErrorInput", {
    required: "review desc is required.",
    minLength: {
      value: 3,
      message: "review must exceed 30 characters",
    },
    maxLength: {
      value: 1000,
      message: "review must not exceed 1000 characters",
    },
  });

  useEffect(() => {
    if (Object.keys(reviewToEdit).length > 0) {
      reviewTitleRef.current.value = reviewToEdit.title;
      reviewDescRef.current.value = reviewToEdit.desc;
      setCurrentStars(reviewToEdit.rating);
      setImages([...reviewToEdit.pictures]);
    }
  }, [reviewToEdit]);

  useEffect(() => {
    setRating(currentStars);
  }, [currentStars, setRating]);

  const handlePost = async () => {
    changeContributions(currentUser._id, 1);

    if (currentPlace && Object.keys(reviewToEdit).length === 0) {
      const newReview = {
        id: currentPlace._id,
        username: currentUser.username,
        creatorId: currentUser._id,
        title: reviewTitleRef.current.value,
        desc: reviewDescRef.current.value,
        rating: currentStarValueRef.current.value,
        pictures: [...images],
        pinId: currentPlace._id,
      };
      console.log(currentPlace);

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_CONNECT}/api/pins/addReview`,
          newReview
        );
        handleClose();
        Swal.fire({
          title: "Thankyou for your Review",
          text: " ",
          icon: "success",
          padding: "10px",
          confirmButtonColor: "#a06cd5",
          confirmButtonText: "Okay!",
          backdrop: `#23232380`,
        }).then((result) => {
          if (result.isConfirmed) {
            handleOpenReview();
          }
        });

        return res.data;
      } catch (err) {
        console.log(err);
      }
    } else if (!currentPlace && Object.keys(reviewToEdit).length === 0) {
      const newPin = {
        name: locationNameRef.current.value,
        lat: newPlace.long,
        long: newPlace.lat,
        pinType,
        review: [
          {
            username: currentUser.username,
            creatorId: currentUser._id,
            title: reviewTitleRef.current.value,
            desc: reviewDescRef.current.value,
            rating: currentStarValueRef.current.value,
            pictures: [...images],
          },
        ],
      };

      try {
        const res = await axios.post(
          `${process.env.REACT_APP_CONNECT}/api/pins`,
          newPin
        );
        setPins([...pins, res.data]);
        setNewPlace(null);
        handleClose();
        Swal.fire({
          title: "Thankyou for your Review",
          text: "your pin has been added",
          icon: "success",
          padding: "10px",
          confirmButtonColor: "#a06cd5",
          confirmButtonText: "Okay!",
          backdrop: `#23232380`,
        }).then((result) => {
          if (result.isConfirmed) {
            handleOpenReview();
          }
        });
      } catch (err) {
        console.log(err);
      }
    } else if (Object.keys(reviewToEdit).length > 0) {
      const updatedReview = {
        id: reviewToEdit.pinId,
        reviewId: reviewToEdit._id,
        title: reviewTitleRef.current.value,
        desc: reviewDescRef.current.value,
        rating: currentStarValueRef.current.value,
        pictures: [...images],
      };

      try {
        const res = await axios.put(
          `${process.env.REACT_APP_CONNECT}/api/pins/updateReview`,
          updatedReview
        );
        setPins([...pins]);
        setNewPlace(null);
        handleClose();
        Swal.fire({
          title: "Your Review has been Updated!",
          text: "   ",
          icon: "success",
          padding: "10px",
          confirmButtonColor: "#a06cd5",
          confirmButtonText: "Okay!",
          backdrop: `#23232380`,
        }).then((result) => {
          if (result.isConfirmed) {
            handleOpenReview();
            setReviewToEdit({});
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const onFileResize = (e) => {
    let compressedImages = [];

    Object.values(e.target.files).forEach((j, i) => {
      const file = e.target.files[i];
      Compress.imageFileResizer(
        file,
        480,
        480,
        "JPEG",
        70,
        0,
        (uri) => {
          compressedImages.push(uri);
          setImages([...images, ...compressedImages]);
        },
        "base64"
      );
    });
  };

  const handleDisplayImage = (e, i) => {
    Swal.fire({
      imageUrl: e,
      imageAlt: "Custom image",
      showCancelButton: true,
      padding: "10px",
      confirmButtonColor: "#e84338",
      confirmButtonText: "Delete",
      cancelButtonColor: "#a06cd5",
      backdrop: `#23232380`,
    }).then((result) => {
      if (result.isConfirmed) {
        setImages(images.filter((picture) => picture !== e));
      }
    });
  };

  const handleOpenReview = async () => {
    setCurrentPlace(null);
    setLoading(true);
    setActiveWindows((activeWindows) => [...activeWindows, "Reviews"]);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CONNECT}/api/pins/getUserReviews`,
        {
          username: currentUser.username,
        }
      );
      if (Object.keys(reviewToEdit).length > 0) {
        var editedReview = [];
        editedReview = res.data.filter((e, i) => {
          return e._id === reviewToEdit._id;
        });

        setReviews(editedReview);
        setLoading(false);
      } else {
        var latestReview = [];
        latestReview.push(res.data[res.data.length - 1]);
        setReviews(latestReview);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  function handleStarClick(number) {
    if (number === 1) {
      currentStarValueRef.current.value = 1;
    }
    if (number >= 1) {
      oneStarRef.current.innerHTML = "★";
    }
    if (number < 1) {
      oneStarRef.current.innerHTML = "☆";
    }
    if (number === 2) {
      currentStarValueRef.current.value = 2;
    }
    if (number >= 2) {
      twoStarRef.current.innerHTML = "★";
    }
    if (number < 2) {
      twoStarRef.current.innerHTML = "☆";
    }
    if (number === 3) {
      currentStarValueRef.current.value = 3;
    }
    if (number >= 3) {
      threeStarRef.current.innerHTML = "★";
    }
    if (number < 3) {
      threeStarRef.current.innerHTML = "☆";
    }
    if (number === 4) {
      currentStarValueRef.current.value = 4;
    }
    if (number >= 4) {
      fourStarRef.current.innerHTML = "★";
    }
    if (number < 4) {
      fourStarRef.current.innerHTML = "☆";
    }
    if (number === 5) {
      currentStarValueRef.current.value = 5;
    }
    if (number >= 5) {
      fiveStarRef.current.innerHTML = "★";
    }
    if (number < 5) {
      fiveStarRef.current.innerHTML = "☆";
    }
  }

  const handleClose = () => {
    setActiveWindows(activeWindows.filter((e) => e !== "Add Review"));
  };

  return (
    <div
      className={
        width > 900 ? "addReviewFormContainer" : "addReviewFormContainerMobile"
      }
    >
      <form className="addReviewForm" onSubmit={handleSubmit(handlePost)}>
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
              <div>
                <img
                  className="previewImage"
                  alt={`uploadNum`}
                  src={images[0]}
                />
              </div>
            )}
          </div>
        </label>

        {images.length > 0 && (
          <BsFillTrashFill
            className="mainImageTrashIcon"
            onClick={() => handleDisplayImage(images[0])}
          />
        )}

        <div className="previewThumbnailContainer">
          {images.slice(1).map((e, i) => {
            return (
              <div key={i}>
                <img
                  className="previewThumbnail"
                  alt={`uploadNum${i}`}
                  src={e}
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
          onChange={onFileResize}
          multiple
        />
        <br />

        {!currentPlace && Object.keys(reviewToEdit).length === 0 && (
          <input
            {...nameValidation}
            className="reviewTitle"
            placeholder="Name of the Location"
            ref={(e) => {
              nameValidation.ref(e);
              locationNameRef.current = e;
            }}
          />
        )}

        <input
          {...titleValidation}
          className="reviewTitle"
          placeholder="Review Title"
          ref={(e) => {
            titleValidation.ref(e);
            reviewTitleRef.current = e;
          }}
        ></input>

        {currentPlace && (
          <h3>What did you think of {`${currentPlace.name}`} ?</h3>
        )}

        <textarea
          {...descValidation}
          placeholder="what did you think..."
          ref={(e) => {
            descValidation.ref(e);
            reviewDescRef.current = e;
          }}
        />
        <br />
        <label id="ratingLabel">Rating</label>
        <input
          style={{ visibility: "hidden" }}
          ref={(e) => {
            currentStarValueRef.current = e;
          }}
        />
        <div
          {...register("starErrorInput", {
            required: false,
            validate: () => {
              if (currentStars < 1) {
                return "dont forget to leave a rating";
              }
            },
          })}
          className="starContainer"
        >
          <div id="oneStar" ref={oneStarRef} onClick={() => handleStarClick(1)}>
            ☆
          </div>
          <div id="twoStar" ref={twoStarRef} onClick={() => handleStarClick(2)}>
            ☆
          </div>
          <div
            id="threeStar"
            ref={threeStarRef}
            onClick={() => handleStarClick(3)}
          >
            ☆
          </div>
          <div
            id="fourStar"
            ref={fourStarRef}
            onClick={() => handleStarClick(4)}
          >
            ☆
          </div>
          <div
            id="fiveStar"
            ref={fiveStarRef}
            onClick={() => handleStarClick(5)}
          >
            ☆
          </div>
        </div>

        <div className="val">
          <ErrorMessage
            errors={errors}
            name="placeNameErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="reviewTitleErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="reviewDescErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="starErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />
        </div>

        <button type="submit" className="btnPrimary">
          Submit
        </button>
        <button
          type="button"
          className="btnPrimary"
          onClick={() => {
            setReviewToEdit({});
            handleClose();
            setCurrentPlace(null);
          }}
        >
          Close
        </button>
      </form>
    </div>
  );
}
