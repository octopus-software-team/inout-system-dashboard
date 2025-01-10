import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const CreateSpecialise = () => {
  const [name, setName] = useState(""); // Specialization Name
  const [type, setType] = useState(0); // Specialization Type
  const [message, setMessage] = useState(""); // Success or Error Message
  const [isError, setIsError] = useState(false); // Message Type
  const [isLoading, setIsLoading] = useState(false); // Loading State
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = Cookies.get('token'); // Retrieve stored token

    if (!token) {
      setIsError(true);
      setMessage("No token found. Please log in.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch("https://inout-api.octopusteam.net/api/front/addEmployeesSpecials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in header
        },
        body: JSON.stringify({ name, type }),
      });

      const resData = await response.json();

      if (response.ok && resData.status === 200) {
        setIsError(false);
        setMessage("Specialization added successfully.");
        setName("");
        setType(0);
        setTimeout(() => {
          navigate("/company/employeespecialise"); // Navigate back to specializations page after addition
        }, 1500);
      } else {
        setIsError(true);
        setMessage(resData.message || "Failed to add specialization.");
      }
    } catch (error) {
      console.error("Error creating specialization:", error);
      setIsError(true);
      setMessage("Error creating specialization. Please try again.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 max-w-lg">
      <h2 className="text-center font-bold text-2xl mb-6">Create New Specialization</h2>

      <form
        onSubmit={handleSubmit}
        className="service shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        {/* Specialization Name */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Specialization Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter specialization name"
            required
          />
        </div>

        {/* Specialization Type */}
        <div className="mb-6">
          <label
            htmlFor="type"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(parseInt(e.target.value))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value={0}>engineer</option>
            <option value={1}>employee</option>
          </select>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>

      {/* Success or Error Message */}
      {message && (
        <div
          className={`mt-4 text-center font-semibold ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default CreateSpecialise;
