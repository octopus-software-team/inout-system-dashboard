// src/components/UpdateBranch.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateBranch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    name: "",
    location: "",
  });

  useEffect(() => {
    // استخدام البيانات المرسلة عبر الـ state إذا كانت موجودة
    if (location.state) {
      setFormData({
        name: location.state.name || "",
        location: location.state.location || "",
      });
      setLoading(false);
    } else {
      // إذا لم تكن البيانات موجودة في الـ state، قم بجلبها من الـ API
      const fetchBranchData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            toast.error("Authentication token not found. Please log in.");
            navigate("/login");
            return;
          }

          const response = await fetch(
            `https://inout-api.octopusteam.net/api/front/getBranch/${id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();
          console.log("API Response:", result); // تحقق من الاستجابة

          if (!response.ok) {
            console.error("Error details:", result);
            throw new Error(result.msg || "Failed to fetch branch data");
          }

          setFormData({
            name: result.data.name || "",
            location: result.data.location || "",
          });
        } catch (error) {
          toast.error("Error: " + error.message);
          console.error("Error fetching branch data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBranchData();
    }
  }, [id, location.state, navigate]);

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
      newErrors.name = "Branch name is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    } else {
      const urlPattern = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
          "((([a-zA-Z0-9\\-\\.]+)\\.([a-zA-Z]{2,5}))|" + // domain
          "localhost|" + // or localhost
          "\\d{1,3}(\\.\\d{1,3}){3})" + // or IP
          "(\\:\\d+)?(\\/[-a-zA-Z0-9%_\\+.~#?&//=]*)?$",
        "i"
      );
      if (!urlPattern.test(formData.location)) {
        newErrors.location = "Please enter a valid location URL.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication token not found. Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateBranch/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            location: formData.location.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Error details:", result);
        throw new Error(result.msg || "Failed to update branch");
      }

      toast.success(result.msg || "Branch updated successfully!");

      setTimeout(() => {
        navigate("/company/branchs");
      }, 2000);
    } catch (error) {
      toast.error("Error: " + error.message);
      console.error("Error updating branch:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h2 className="text-center font-bold text-3xl text-black">Update Branch</h2>
        <p className="text-center mt-4">Loading branch data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Update Branch</h2>
      <form
        onSubmit={handleSubmit}
        className="service mt-5 p-5 border border-gray-200 shadow-lg rounded-lg max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Branch Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full dark:bg-slate-900 dark:text-white px-4 py-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Enter location URL or description"
            className={`w-full dark:bg-slate-900 dark:text-white px-4 py-2 border ${
              errors.location ? "border-red-500" : "border-gray-300"
            } rounded-lg`}
            required
          />
          {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default UpdateBranch;
