import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';


const Create = () => {
  const [serviceName, setServiceName] = useState(""); // This will handle the name input
  const [serviceId, setServiceId] = useState(""); // This will handle the ID input
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');

    if (!token) {
      console.log("No token found, cannot log out.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addService",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: serviceName, id: serviceId }), // Send both id and name
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Service added successfully");
        navigate("/company/services");
      } else {
        setMessage("Failed to add service");
      }
    } catch (error) {
      setMessage("An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-40 relative">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="p-6 rounded w-10/12">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Add Services
        </h2>

        <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-gray-700 font-semibold mb-2"
          >
            Id
          </label>
          <input
            type="text"
            id="id"
            placeholder="Service ID"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)} // Handle changes for ID separately
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Service Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)} // Handle changes for Name separately
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Create;
