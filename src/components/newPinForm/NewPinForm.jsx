import { React, useState, useRef } from "react";
import "./newPinForm.css";

export default function NewPinForm({
  setTitle,
  setDesc,
  setRating,
  handleSubmit,
  setPinType,
  pinType,
  pinColor,
  setPinColor,
  setNewPlace,
}) {
  const pinFormSelector = useRef(" ");

  const pinFormHandler = (e) => {
    pinFormSelector.current = e;
    console.log(pinColor);
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
