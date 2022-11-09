import "./login.css";
import { useState, useRef } from "react";
import Lottie from "lottie-react";
import RegisterAnimation from "./registerAnimation.json";
import axios from "axios";
import { RiCloseCircleFill } from "react-icons/ri";

export default function Register({ setShowLogin, myStorage, setCurrentUser }) {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        "http://localhost:8800/api/users/login",
        user
      );
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      setError(false);
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logoContainer">
        <p className="logoText">WorldWander</p>
        <Lottie animationData={RegisterAnimation} loop={true} />
      </div>
      <br />
      <div className="logo"></div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button>Login</button>
        {error && (
          <span className="loginError">Wrong Username or Password</span>
        )}
      </form>
      <RiCloseCircleFill
        className="loginCancel"
        onClick={() => setShowLogin(false)}
      />
    </div>
  );
}
