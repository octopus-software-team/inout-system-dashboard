import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import toast, { Toaster } from "react-hot-toast";

const EditOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: 1,
  });
  const [errors, setErrors] = useState({});
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getOwners", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result.status === 200) {
          const owner = result.data.find((owner) => owner.id === parseInt(id));
          if (owner) {
            setFormData({
              name: owner.name || "",
              email: owner.email || "",
              phone: owner.phone || "",
              type: owner.type || 1,
            });
          } else {
            toast.error("Owner not found!");
            navigate("/customers/owner");
          }
        } else {
          toast.error("Failed to fetch owners: " + result.msg);
        }
      } catch (err) {
        toast.error("Error fetching owner details.");
        console.error("Error fetching owner details:", err);
      }
    };

    if (token) {
      fetchOwner();
    } else {
      toast.error("No token found. Please log in.");
      navigate("/login");
    }
  }, [id, token, navigate]);

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
    setErrors({});

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("All fields are required.");
      return;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      const response = await fetch(`https://inout-api.octopusteam.net/api/front/updateCustomer/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok && result.status === 200) {
        toast.success("Owner updated successfully!");
        setTimeout(() => {
          navigate("/customers/owner");
        }, 2000);
      } else if (response.status === 422) {
        setErrors(result.data || {});
        toast.error("Please fix the highlighted errors.");
      } else {
        toast.error(`Failed to update owner: ${result.msg}`);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      console.error("Error updating owner:", err);
    }
  };

  return (
    <div className="flex items-center justify-center mt-14 bg-gray-100 dark:bg-slate-800 py-10 px-4">
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
          Edit Owner
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
            <p className="text-red-500 text-sm mt-1">{errors.name.join(" ")}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.email.join(" ")}</p>
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
            <p className="text-red-500 text-sm mt-1">{errors.phone.join(" ")}</p>
          )}
        </div>

        <input type="hidden" name="type" value={formData.type} />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition duration-300"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default EditOwner;
