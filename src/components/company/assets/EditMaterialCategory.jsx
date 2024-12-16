import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import Cookies from 'js-cookie';


const EditMaterialCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [serviceData, setServiceData] = useState({
    id: "",
    name: "",
  });
  const [responseMessage, setResponseMessage] = useState("");

  useEffect(() => {
    if (location.state) {
      setServiceData({
        id: location.state.id || "",
        name: location.state.name || "",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServiceData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateService/${serviceData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: serviceData.name }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setResponseMessage(result.msg);
        toast.success("Service updated successfully!"); 
        setTimeout(() => {
          navigate("/company/assets/materialcategory");
        }, 2000);
      } else {
        setResponseMessage(result.msg || "Failed to update the service.");
      }
    } catch (error) {
      console.error("Error updating service:", error);
      setResponseMessage("An error occurred while updating the service.");
    }
  };

  return (
    <div className="flex dark:bg-slate-800 justify-center items-center h-screen bg-gray-100">
      <div className="service p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Edit Material Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceId" className="block text-sm font-medium text-gray-700">
              material ID
            </label>
            <input
              type="text"
              id="serviceId"
              name="id"
              value={serviceData.id}
              disabled
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
            Edit Material Category
            </label>
            <input
              type="text"
              id="serviceName"
              name="name"
              value={serviceData.name}
              onChange={handleChange}
              required
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
            >
              EditMaterialCategory
            </button>
          </div>
        </form>
        {responseMessage && (
          <p className="mt-4 text-center text-green-600 font-medium">{responseMessage}</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default EditMaterialCategory;
