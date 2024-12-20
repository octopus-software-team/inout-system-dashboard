import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const CreateAdmin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    const token = Cookies.get("token");
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const payload = {
      name,
      email,
      password,
    };

    fetch("https://inout-api.octopusteam.net/api/front/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Admin registered successfully!");
          setTimeout(() => navigate("/moderation/moderator"), 2000);
        } else if (data.status === 422) {
          setErrors(data.data);
          toast.error("Please fix the highlighted errors.");
        } else {
          toast.error(data.msg || "Failed to register admin. Please try again.");
        }
      })
      .catch((err) => {
        console.error("Error registering admin:", err);
        toast.error("An error occurred while registering the admin.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto mt-10 p-5">
      <ToastContainer />
      <h2 className="text-center text-2xl font-bold mb-5">Create New Admin</h2>
      <form
        onSubmit={handleSubmit}
        className="service max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-2">{errors.name[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-2">{errors.email[0]}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-2">{errors.password[0]}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {isLoading ? "Creating..." : "Create Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdmin;
