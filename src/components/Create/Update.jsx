import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';


const Update = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const service = location.state; // Get the service data from state

  const [serviceName, setServiceName] = useState(service?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!service) {
      setError("No service data available");
    }
  }, [service]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = Cookies.get('token');

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    setIsLoading(true);

    fetch(`https://inout-api.octopusteam.net/api/front/updateService/${service.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Corrected template literal
      },
      body: JSON.stringify({ name: serviceName }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update service");
        }
        return response.json();
      })
        
      .then((data) => {
        if (data && data.msg === "updated successfully") {
          toast.success("Service updated successfully!");
          navigate("/company/services"); 
        } else {
          toast.error("Failed to update the service");
        }
      })
      .catch((error) => {
        console.error("Error updating service:", error);
        toast.error("Error updating the service. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (error) {
    return (
      <div className="container mt-20 flex items-center justify-center relative">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-20 flex items-center justify-center relative">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="p-6 rounded w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          Update Service
        </h2>

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
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            placeholder="Service Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>


        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </form>
    </div>
  );
};

export default Update;
