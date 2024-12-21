import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { FaSpinner } from "react-icons/fa"; // Importing Spinner icon for loading state

const UpdateMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const material = location.state; // The material passed via navigation

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    stock: "",
    type: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Loading state

  useEffect(() => {
    if (material) {
      setFormData({
        id: material.id || "",
        name: material.name || "",
        stock: material.stock || "",
        type: material.type || "",
      });
    }
  }, [material]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear the error for the field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    console.log("Token:", token);

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const { id, name, stock, type } = formData;

    if (!name || !stock || !type) {
      toast.error("All fields are required.");
      return;
    }

    const updatedMaterial = {
      name,
      stock: parseInt(stock),
      type: parseInt(type),
    };

    console.log("Updated Material:", updatedMaterial);

    setIsLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateMaterial/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedMaterial),
        }
      );

      const resData = await response.json();

      if (response.ok) {
        toast.success(resData.msg || "Material updated successfully!");
        setTimeout(() => {
          navigate("/company/assets/addmaterials");
        }, 2000);
      } else if (response.status === 422) {
        // Handle validation errors
        const validationErrors = resData.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" ");
        });
        setErrors(formattedErrors);
        toast.error("Please fix the errors in the form.");
      } else {
        toast.error(resData.msg || "Failed to update material.");
      }
    } catch (error) {
      toast.error("Failed to update material. Please try again.");
      console.error("Error updating material:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100 dark:bg-slate-800 py-10 px-4">
      {/* Toaster for react-hot-toast */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            width: "350px",
            height: "80px",
            fontSize: "1.2rem",
          },
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8"
      >
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Update Material
        </h2>

        {/* Material Name Field */}
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Material Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.name
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Enter material name"
            required
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Stock Field */}
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.stock
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            placeholder="Enter stock quantity"
            required
          />
          {errors.stock && (
            <p className="text-red-500 text-sm mt-1">{errors.stock}</p>
          )}
        </div>

        {/* Type Field */}
        <div className="mb-4">
          <label
            htmlFor="type"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Type
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.type
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            }`}
            required
          >
            <option value="">Select type</option>
            <option value="0">kg</option>
            <option value="1">piece</option>
            <option value="2">meter</option>
            <option value="3">liter</option>
          </select>
          {errors.type && (
            <p className="text-red-500 text-sm mt-1">{errors.type}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ${
            isLoading
              ? "opacity-50 cursor-not-allowed flex items-center justify-center"
              : ""
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Material"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateMaterials;
