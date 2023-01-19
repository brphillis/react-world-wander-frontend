import { useState, useEffect } from "react";
import axios from "axios";

export function useChangeContributionPoints() {
  const [changeContributions, setChangeContributions] = useState({});
  const [user, setUser] = useState(null);
  const [userCurrentScore, setUserCurrentScore] = useState(0);

  useEffect(() => {
    const handleGetUserInfo = async () => {
      if (Object.keys(changeContributions).length > 0) {
        try {
          const userData = {
            id: changeContributions.id,
          };
          const res = await axios.put(
            "http://localhost:8800/api/users/updateContributions",
            userData
          );
          setUser(res.data._id);
          setUserCurrentScore(res.data.contributions);

          const newScore = userCurrentScore + changeContributions.count;
          try {
            const changeData = {
              id: user,
              contributions: newScore,
            };
            await axios.put(
              "http://localhost:8800/api/users/updateContributions",
              changeData
            );
          } catch (err) {
            console.log(err);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };

    handleGetUserInfo(changeContributions.id);
  }, [changeContributions, user, userCurrentScore]);

  return { setChangeContributions, changeContributions };
}
