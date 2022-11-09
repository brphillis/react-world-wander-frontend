import "./register.css";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import RegisterAnimation from "./registerAnimation.json";
import axios from "axios";
import { RiCloseCircleFill } from "react-icons/ri";

export default function Register({ setShowRegister }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axios.post("http://localhost:8800/api/users/register", newUser);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerContainer">
      <div className="logoContainer">
        <p className="logoText">WorldWander</p>
        <Lottie animationData={RegisterAnimation} loop={true} />
      </div>
      <br />
      <div className="logo"></div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button>Register</button>
        {success && (
          <span className="registerSuccess">
            Successfull. You can login now!
          </span>
        )}{" "}
        {error && (
          <span className="registerError">Error. You can login now!</span>
        )}
      </form>
      <RiCloseCircleFill
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
}
