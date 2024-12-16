import Cookies from "js-cookie";
import { useState, useEffect } from "react";

export const useFetch = async (endPoint) => {
  const [data, setData] = useState();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.error("token expired ");
        setError("No token found. Please log in.");
      }

      const BASE_URL = "https://inout-api.octopusteam.net/api/front";

      const response = await fetch(`${BASE_URL}/${endPoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      const apiData = result.data;
      setData(apiData);
    };
    fetchData();
  }, []);

  return {
    data,
    error,
  };
};
