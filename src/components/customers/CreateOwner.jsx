import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";

const CreateOwner = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: 1,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addCustomer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(`Owner ${data.data.name} added successfully!`);
        setTimeout(() => {
          navigate("/customers/owner");
        }, 2000);
      } else if (response.status === 422) {
        const validationErrors = data.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" ");
        });
        setErrors(formattedErrors);
        toast.error("Please fix the highlighted errors.");
      } else {
        toast.error(data.msg || "Failed to add owner.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800 py-10 px-4">
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
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Add Owner
        </h2>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Owner Name"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Owner Email"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Owner Phone"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <input type="hidden" name="type" value={formData.type} />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateOwner;
