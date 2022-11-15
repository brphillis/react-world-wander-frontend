import "./register.css";
import { useState, useRef } from "react";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const errorMessage = useRef();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      //submit register and check passwords match
      if (passwordRef.current.value === confirmPasswordRef.current.value) {
        console.log("submitting");
        setError(false);
        await axios.post("http://localhost:8800/api/users/register", newUser);
        setSuccess(true);
      } else {
        console.log("error");
        errorMessage.current.innerHTML = "Passwords do not match.";
        setError(true);
      }
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerForm">
      <br />
      <div className="logo"></div>
      <form onSubmit={handleRegisterSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <input
          type="password"
          placeholder="confirm password"
          ref={confirmPasswordRef}
        />
        {success && (
          <span className="registerSuccess">
            Successfull. You can login now!
          </span>
        )}{" "}
        {error && (
          <span className="registerError" ref={errorMessage}>
            error
          </span>
        )}
        <button type="submit" className="btnPrimary">
          Register
        </button>
      </form>
      <button
        type="button"
        className="btnPrimary"
        onClick={() => setShowRegister(false)}
      >
        Back
      </button>
    </div>
  );
}
