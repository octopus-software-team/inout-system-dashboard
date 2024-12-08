import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateBranch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const branchData = location.state || {
    id: "",
    name: "",
    latitude: "",
    longitude: "",
  };

  const [formData, setFormData] = useState({
    name: branchData.name,
    latitude: branchData.latitude,
    longitude: branchData.longitude,
  });

  const [errors, setErrors] = useState({
    name: "",
    latitude: "",
    longitude: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (isNaN(formData.latitude) || formData.latitude === "") {
      newErrors.latitude = "Invalid latitude.";
    }

    if (isNaN(formData.longitude) || formData.longitude === "") {
      newErrors.longitude = "Invalid longitude.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    console.log("Request Body:", {
      name: formData.name.trim(),
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
    });

    fetch(`https://inout-api.octopusteam.net/api/front/updateBranch/${branchData.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((err) => {
            console.error("API Error Response:", err);
            throw new Error(err.msg || "Failed to update branch");
          });
        }
        return res.json();
      })
      .then((resData) => {
        alert(resData.msg || "Branch updated successfully.");
        navigate("/company/branchs"); 
      })
      .catch((err) => {
        console.error("Error updating branch:", err);
        alert(err.message || "Failed to update branch. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Update Branch</h2>
      <form
        onSubmit={handleSubmit}
        className="service mt-5 p-5 border border-gray-200 shadow-lg rounded-lg max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full dark:bg-slate-900 dark:text-white px-4 py-2 border border-gray-300 rounded-lg"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="latitude">
            Latitude
          </label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleInputChange}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg"
            required
          />
          {errors.latitude && <p className="text-red-500 text-sm">{errors.latitude}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="longitude">
            Longitude
          </label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleInputChange}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg"
            required
          />
          {errors.longitude && <p className="text-red-500 text-sm">{errors.longitude}</p>}
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Update Branch
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBranch;
