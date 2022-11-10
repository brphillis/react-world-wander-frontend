import "./register.css";
import { useState, useRef } from "react";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      console.log("submitting");
      await axios.post("http://localhost:8800/api/users/register", newUser);
      setError(false);
      setSuccess(true);
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
        {success && (
          <span className="registerSuccess">
            Successfull. You can login now!
          </span>
        )}{" "}
        {error && (
          <span className="registerError">Error. You can login now!</span>
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
