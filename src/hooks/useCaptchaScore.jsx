import { useEffect, useState } from "react";
import axios from "axios";

export function useCaptchaScore(username, password, email) {
  const [captchaScore, getCaptchaScore] = useState(null);
  const [captchaError, setCaptchaError] = useState(null);
  const [fetchCaptcha, setfetchCaptcha] = useState(false);

  useEffect(() => {
    if (fetchCaptcha) {
      //Get Token
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(process.env.REACT_APP_SITE_KEY, {
            action: "submit",
          })
          .then((token) => {
            submitData(token);
          });
      });

      //Submit token to backend for captcha score
      const submitData = async (token) => {
        const captchaInfo = {
          username: username,
          email: email,
          password: password,
          token: token,
        };
        try {
          //recieve token
          const res = await axios.post(
            `${process.env.REACT_APP_CONNECT}/api/verify/send`,
            captchaInfo
          );
          getCaptchaScore(res.data.google_response.score);
          setfetchCaptcha(false);
        } catch (err) {
          //token error
          setCaptchaError(err);
          console.log(`captcha error: ${captchaError}`);
          setfetchCaptcha(false);
        }
      };
    }
  }, [username, email, password, captchaError, fetchCaptcha]);

  return { captchaScore, getCaptchaScore, fetchCaptcha, setfetchCaptcha };
}
