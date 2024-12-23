// src/pages/Profile.js
import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

export default function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get("token");

      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getMyProfile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 200) {
        setProfileData(data.data);
      } else {
        setError("Failed to fetch profile data.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className="service max-w-3xl mx-auto mt-20 p-6  bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Profile Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : profileData ? (
        <div className="space-y-4">
          {/* <div className="flex items-center">
            <strong className="w-32">ID:</strong>
            <span>{profileData.id}</span>
          </div> */}
          <div className="flex items-center">
            <strong className="w-32">Name:</strong>
            <span>{profileData.name}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-32">Email:</strong>
            <span>{profileData.email}</span>
          </div>
          <div className="flex items-center">
            <strong className="w-32">Created At:</strong>
            <span>{new Date(profileData.created_at).toLocaleDateString()}</span>
          </div>
          {/* Add more fields if necessary */}
        </div>
      ) : (
        <p>No profile data available.</p>
      )}
    </div>
  );
}
