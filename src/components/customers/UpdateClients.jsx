import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";
import { FaSpinner } from "react-icons/fa"; // استيراد أيقونة Spinner

const UpdateClients = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    branch_id: "", // إضافة البرانش
  });
  const [branches, setBranches] = useState([]); // حالة لتخزين البرانشات
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل

  useEffect(() => {
    if (location.state) {
      setFormData({
        id: location.state.id || "",
        name: location.state.name || "",
        email: location.state.email || "",
        phone: location.state.phone || "",
        branch_id: location.state.branch_id || "", // تعيين البرانش
      });
    }
  }, [location.state]);

  useEffect(() => {
    const fetchBranches = async () => {
      const token = Cookies.get("token");

      if (!token) {
        toast.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setBranches(data.data || []);
        } else {
          toast.error("Failed to fetch branches.");
        }
      } catch (error) {
        toast.error("Error fetching branches. Please try again later.");
        console.error(error);
      }
    };

    fetchBranches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    setIsLoading(true); // بدء حالة التحميل

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateCustomer/${formData.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            branch_id: formData.branch_id, // إرسال البرانش
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || "Client updated successfully.");
        setTimeout(() => {
          navigate("/customers/clients");
        }, 2000);
      } else if (response.status === 422) {
        const validationErrors = data.data;
        const formattedErrors = {};
        Object.keys(validationErrors).forEach((field) => {
          formattedErrors[field] = validationErrors[field].join(" ");
        });
        setErrors(formattedErrors);
      } else {
        toast.error(data.msg || "Failed to update the client.");
      }
    } catch (error) {
      toast.error("Failed to update the client. Please try again.");
      console.error("Error updating client:", error);
    } finally {
      setIsLoading(false); // إنهاء حالة التحميل
    }
  };

  return (
    <div className="flex items-center justify-center mt-20 bg-gray-100 dark:bg-slate-800 py-10 px-4">
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
          Update Client
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
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
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
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
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
            value={formData.phone}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="branch_id"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Branch
          </label>
          <select
            id="branch_id"
            name="branch_id"
            value={formData.branch_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.branch_id ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
          >
            <option value="">Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch_id && (
            <p className="text-red-500 text-sm mt-1">{errors.branch_id}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 transition duration-300 ${
            isLoading ? "opacity-50 cursor-not-allowed flex items-center justify-center" : ""
          }`}
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Updating...
            </>
          ) : (
            "Update Client"
          )}
        </button>
      </form>
    </div>
  );
};

export default UpdateClients;
