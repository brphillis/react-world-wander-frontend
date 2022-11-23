import "./loginContainer.css";
import Register from "../loginContainer/register/Register";
import Login from "../loginContainer/login/Login";
import { useState } from "react";
import Lottie from "lottie-react";
import logoAnimation from "./logoAnimation.json";

export default function LoginContainer({
  success,
  setSuccess,
  error,
  setError,
  setCurrentUser,
  myStorage,
  currentUser,
  pins,
  setCurrentPins,
}) {
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="LoginContainer">
      <div>
        <p className="logoText">WorldWander</p>
        <Lottie animationData={logoAnimation} loop={true} />
      </div>

      <div className="loginBtnContainer">
        {!currentUser && !showLogin && !showRegister && (
          <div className="loginRegisterContainer">
            <button
              type="button"
              className="btnPrimary"
              onClick={() => setShowLogin(true)}
            >
              Login
            </button>
            <button
              type="button"
              className="btnPrimary"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
            <button
              type="button"
              className="btnPrimary"
              onClick={() => setCurrentUser("guest")}
            >
              Guest
            </button>
          </div>
        )}
      </div>

      {showRegister && (
        <Register
          success={success}
          setSuccess={setSuccess}
          error={error}
          setError={setError}
          setShowRegister={setShowRegister}
        />
      )}
      {showLogin && (
        <Login
          setCurrentUser={setCurrentUser}
          success={success}
          setSuccess={setSuccess}
          error={error}
          setError={setError}
          setShowLogin={setShowLogin}
          myStorage={myStorage}
          pins={pins}
          setCurrentPins={setCurrentPins}
        />
      )}
    </div>
  );
}
