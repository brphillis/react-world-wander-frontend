import "./login.css";
import { useState, useRef } from "react";
import axios from "axios";

export default function Login({ setShowLogin, setSuccess, setCurrentUser }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      console.log(user);
      const res = await axios.post(
        "http://localhost:8800/api/users/login",
        user
      );
      setCurrentUser(res.data);
      window.localStorage.setItem("user", res.data.username);
      setShowLogin(false);
      setError(false);
      setSuccess(true);
      console.log("success");
    } catch (err) {
      console.log(err);
      setError(true);
    }

    //   console.log(user);
    //   const res = await axios.post(
    //     "http://localhost:8800/api/users/login",
    //     user
    //   );
    //   setCurrentUser(res.data.username);
    //   window.localStorage.setItem("user", res.data.username);
    //   setShowLogin(false);
    //   setError(false);
    //   setSuccess(true);
    //   console.log("success");
    // } catch (err) {
    //   console.log(err);
    //   setError(true);
    // }
  };

  return (
    <div className="loginForm">
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
        onClick={() => setShowLogin(false)}
      >
        Back
      </button>
    </div>
  );
}
