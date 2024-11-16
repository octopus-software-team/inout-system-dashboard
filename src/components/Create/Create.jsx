import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Create = () => {
  const [serviceName, setServiceName] = useState("");
  const [message, setMessage] = useState("");
  const [serviceId, setServiceId] = useState(null);
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

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
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ name: serviceName }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Service added successfully");
        setServiceId(data.data.id);
        navigate("/company/services")
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
          Add Branch
        </h2>

        {/* <div className="mb-4">
          <label htmlFor="id" className="block text-gray-700 font-semibold mb-2">
            Id
          </label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Your id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={(e) => setInputData({ ...inputData, id: e.target.value })}
          />
        </div> */}

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
            placeholder="Your Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            
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
