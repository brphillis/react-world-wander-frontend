import { useState, useEffect } from "react";
import axios from "axios";

export function useChangeContributions() {
  const changeContributions = async (id, number) => {
    try {
      const userData = {
        id: id,
      };
      const res = await axios.put(
        `${process.env.REACT_APP_CONNECT}/api/users/updateContributions`,
        userData
      );
      const newScore = res.data.contributions + number;

      try {
        const changeData = {
          id: res.data._id,
          contributions: newScore,
        };
        console.log(newScore);
        await axios.put(
          `${process.env.REACT_APP_CONNECT}/api/users/updateContributions`,
          changeData
        );
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { changeContributions };
}
