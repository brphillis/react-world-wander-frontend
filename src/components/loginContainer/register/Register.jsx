import "./register.css";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function Register({ setShowRegister }) {
  const {
    register,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({
    criteriaMode: "all",
  });
  const [success, setSuccess] = useState(false);
  const [passMatchError, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordConfirm, setPasswordConfirm] = useState(null);
  const [email, setEmail] = useState(null);

  const handleRegisterSubmit = async () => {
    const newUser = {
      username: username,
      email: email,
      password: password,
    };
    try {
      setLoading(true);
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute("6LfI3FsjAAAAABFbi2tuGXNjMAMfnSw0_SnVia_V", {
            action: "submit",
          })
          .then((token) => {
            submitData(token);
          });
      });
      const submitData = async (token) => {
        const captchaInfo = {
          username: username,
          email: email,
          password: password,
          token: token,
        };
        try {
          setError(false);
          const res = await axios.post(
            "http://localhost:8800/api/verify/send",
            captchaInfo
          );
          console.log(res.data);
          if (res.data.google_response.score > 0.5) {
            if (password === passwordConfirm) {
              setError(false);
              await axios.post(
                "http://localhost:8800/api/users/register",
                newUser
              );
              setSuccess(true);
              Swal.fire({
                title: "Account Created!",
                text: "   ",
                icon: "success",
                padding: "10px",
                confirmButtonColor: "#a06cd5",
                confirmButtonText: "Okay!",
                backdrop: `#23232380`,
              }).then((result) => {
                if (result.isConfirmed) {
                  setShowRegister(false);
                }
              });
            } else {
              console.log("passwords do not match.");
              setError(true);
            }
          } else {
            console.log("You are a bot!");
          }
          setLoading(false);
        } catch (err) {
          setError(true);
          setLoading(false);
        }
      };
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="registerForm">
      <br />
      <div className="logo"></div>
      <form onSubmit={handleSubmit(handleRegisterSubmit)}>
        <div className="val"></div>
        <input
          {...register("usernameErrorInput", {
            required: "username is required.",
            minLength: {
              value: 3,
              message: "username must exceed 3 characters",
            },
            maxLength: {
              value: 15,
              message: "password must not exceed 15 characters",
            },
          })}
          type="text"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          {...register("emailErrorInput", {
            required: "email is required.",
            pattern: {
              value:
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
              message: "email is invalid.",
            },
          })}
          type="email"
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          {...register("passwordErrorInput", {
            required: "password is required.",
            pattern: {
              value:
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
              message:
                "password must be longer than 8 chars, have 1 uppercase and a special character.",
            },
            minLength: {
              value: 3,
              message: "password must exceed 8 characters",
            },
            maxLength: {
              value: 20,
              message: "password must not exceed 20 characters",
            },
          })}
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          {...register("passwordConfirmErrorInput", {
            required: true,
            validate: (val) => {
              if (watch("passwordErrorInput") != val) {
                return "Your passwords do no match";
              }
            },
          })}
          type="password"
          placeholder="confirm password"
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />

        <div
          className="g-recaptcha"
          data-sitekey={process.env.REACT_APP_SITE_KEY}
          data-size="invisible"
        ></div>

        <div className="val">
          <ErrorMessage
            errors={errors}
            name="usernameErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="emailErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="passwordErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />

          <ErrorMessage
            errors={errors}
            name="passwordConfirmErrorInput"
            render={({ messages }) => {
              console.log("messages", messages);
              return messages
                ? Object.entries(messages).map(([type, message]) => (
                    <p key={type}>{message}</p>
                  ))
                : null;
            }}
          />
        </div>
        <button type="submit" className="btnPrimary" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
        <button
          type="button"
          className="btnPrimary"
          onClick={() => setShowRegister(false)}
        >
          Back
        </button>
      </form>
    </div>
  );
}
