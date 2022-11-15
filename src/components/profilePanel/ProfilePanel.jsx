import "./profilePanel.css";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default function ProfilePanel({
  myStorage,
  setCurrentUser,
  currentUser,
  setSuccess,
  success,
  setError,
  error,
}) {
  const refreshToken = async () => {
    try {
      const res = await axios.post("http://localhost:8800/api/users/refresh/", {
        token: currentUser.refreshToken,
      });
      setCurrentUser({
        ...currentUser,
        accessToken: res.data.accessToken,
        refreshToken: res.data.refreshToken,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const axiosJWT = axios.create();

  //automatically refresh token
  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(currentUser.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const data = await refreshToken();
        config.headers["authorization"] = "Bearer " + data.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null);
  };

  const handleDelete = async (id) => {
    setSuccess(false);
    setError(false);
    try {
      await axiosJWT.delete("http://localhost:8800/api/users/" + id, {
        headers: { authorization: "Bearer " + currentUser.accessToken },
      });
      setSuccess(true);
    } catch (err) {
      setError(true);
    }
  };

  return (
    <div className="profilePanel">
      <button className="btnPrimary" onClick={handleLogout}>
        Log out
      </button>

      <button className="btnPrimary" onClick={() => handleDelete(0)}>
        Delete
      </button>
    </div>
  );
}
