import { useState, useEffect } from "react";
import axios from "axios";

export function useChangeTotalLikes() {
  const changeTotalLikes = async (id, number) => {
    try {
      const userData = {
        id: id,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_CONNECT}/api/users/updateTotalLikes`,
        userData
      );
      const newScore = res.data.totalLikes + number;

      try {
        const changeData = {
          id: res.data._id,
          totalLikes: newScore,
        };
        console.log(newScore);
        await axios.put(
          `${process.env.REACT_APP_CONNECT}/api/users/updateTotalLikes`,
          changeData
        );
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { changeTotalLikes };
}
