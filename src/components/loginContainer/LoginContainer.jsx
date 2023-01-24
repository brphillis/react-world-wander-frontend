import "./loginContainer.css";
import Register from "../loginContainer/register/Register";
import Login from "../loginContainer/login/Login";
import { useState } from "react";
import Lottie from "lottie-react";
import logoAnimation from "./logoAnimation.json";
import Swal from "sweetalert2";

export default function LoginContainer({
  success,
  setSuccess,
  error,
  setError,
  currentUser,
  setCurrentUser,
  pins,
  setCurrentPins,
}) {
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleSetGuest = () => {
    setCurrentUser("guest");

    Swal.fire({
      title:
        "<lottie-player style='display:block; margin: 0 auto;' src='https://assets4.lottiefiles.com/packages/lf20_n7eytpy8.json'  background='transparent'  speed='1'  style='width: 300px; height: 300px;'  loop autoplay></lottie-player>",
      html:
        "<h1 style='font-size: 25px; margin-top: -5px; margin-bottom: 10px;'>Welcome Guest</h1>" +
        "<div style='line-height: 1.4;'><p>As a <b>guest</b> you will not be able to <b>Contribute</b> , <b>Network</b> or <b>Interact</b> with posts, but do not worry, You can still <b>Explore.</b></p></div>",
      padding: "10px",
      confirmButtonColor: "#a06cd5",
      confirmButtonText: "Okay",
      backdrop: `#23232380`,
    });
  };

  return (
    <div className="loginContainer">
      {!loading && (
        <div>
          <p className="logoText">WorldWander</p>
          <Lottie animationData={logoAnimation} loop={true} />
        </div>
      )}

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
              onClick={() => handleSetGuest()}
            >
              Guest
            </button>
          </div>
        )}
      </div>

      {showRegister && (
        <Register
          loading={loading}
          setLoading={setLoading}
          success={success}
          setSuccess={setSuccess}
          error={error}
          setError={setError}
          setShowRegister={setShowRegister}
        />
      )}
      {showLogin && (
        <Login
          loading={loading}
          setLoading={setLoading}
          setCurrentUser={setCurrentUser}
          success={success}
          setSuccess={setSuccess}
          error={error}
          setError={setError}
          setShowLogin={setShowLogin}
          pins={pins}
          setCurrentPins={setCurrentPins}
        />
      )}

      <p>Version 1.0 | 01/23</p>
    </div>
  );
}
