import { React, useRef } from "react";
import { RiUpload2Fill } from "react-icons/ri";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "./newPinForm.css";
import axios from "axios";

export default function NewPinForm({
  currentUser,
  title,
  setTitle,
  desc,
  setDesc,
  rating,
  setRating,
  setPinType,
  pinColor,
  pinType,
  setPinColor,
  newPlace,
  setNewPlace,
  setPins,
  pins,
}) {
  const [images, setImages] = useState([]);
  const pinFormSelector = useRef(" ");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
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
    console.log(newPin);

    try {
      const res = await axios.post("http://localhost:8800/api/pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const pinFormHandler = (e) => {
    pinFormSelector.current = e;
  };

  useEffect(() => {
    console.log(images);
  }, [images]);

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

  return (
    <form className="newPinForm" onSubmit={handleSubmit}>
      <label className="newPinFormLabel">title</label>
      <input
        placeholder="add title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Review or Todo?</label>
      <select
        ref={pinFormSelector}
        onChange={(e) => {
          setPinType(e.target.value);
          pinFormHandler(e.target.value);
        }}
      >
        <option></option>
        <option value="Review">Review</option>
        <option value="To Do">To Do</option>
      </select>

      {pinFormSelector.current === "Review" && (
        <>
          <label>Review</label>
          <textarea
            placeholder="what did you think..."
            onChange={(e) => setDesc(e.target.value)}
          />

          <label>Rating</label>
          <select onChange={(e) => setRating(e.target.value)}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <label
            style={{ borderBottom: "none" }}
            className="reviewUploadImageLabel"
            htmlFor="fileUpload"
          >
            <div className="previewImageContainer">
              <RiUpload2Fill className="previewPlaceholder" />
              <p>Upload up to 4 images</p>
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
        </>
      )}

      {pinFormSelector.current === "To Do" && (
        <>
          <label>Add to an existing trip?</label>
          <select>
            <option value="1">Placeholder</option>
          </select>
        </>
      )}

      <label>Pin Color</label>
      <select onChange={(e) => setPinColor(e.target.value)}>
        <option></option>
        <option value="blue">blue</option>
        <option value="green">green</option>
        <option value="yellow">yellow</option>
        <option value="orange">orange</option>
        <option value="skyblue">skyblue</option>
      </select>

      <button className="submitButton" type="submit">
        Add Pin
      </button>
    </form>
  );
}
