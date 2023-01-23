import "./login.css";
import { useState, useRef } from "react";
import axios from "axios";
import Lottie from "lottie-react";
import loadingAnimation from "./loadingPin.json";

export default function Login({
  setShowLogin,
  setSuccess,
  setCurrentUser,
  loading,
  setLoading,
}) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleLoginSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_CONNECT}/api/users/login`,
        user
      );
      setCurrentUser(res.data);
      window.localStorage.setItem("token", JSON.stringify(res.data));
      setError(false);
      setSuccess(true);
      setLoading(false);
      setShowLogin(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="loginForm">
      <div>
        {loading && (
          <div>
            <Lottie animationData={loadingAnimation} loop={true} />
            <b>Logging In...</b>
          </div>
        )}
      </div>

      {!loading && (
        <div>
          <br />
          <form onSubmit={handleLoginSubmit}>
            <input type="text" placeholder="username" ref={usernameRef} />
            <input type="password" placeholder="password" ref={passwordRef} />
            {error && (
              <span className="loginError">Wrong Username or Password</span>
            )}
            <button type="submit" className="btnPrimary">
              Login
            </button>
          </form>
          <button
            type="button"
            className="btnPrimary"
            onClick={() => {
              setShowLogin(false);
            }}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
