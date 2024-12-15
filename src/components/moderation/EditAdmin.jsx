import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const EditAdmin = () => {
  const location = useLocation(); // جلب بيانات المشرف من state
  const navigate = useNavigate();
  const { id, name: initialName, email: initialEmail } = location.state; // البيانات الأولية

  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    const token = localStorage.getItem('token');

    e.preventDefault();
    console.log("handleSubmit triggered!");
    const payload = {
      id,
      name,
      email,
    };
  
    console.log("Payload being sent:", payload);
  
  
    fetch("https://inout-api.octopusteam.net/api/front/updateAdmin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        console.log("Response status:", res.status);
        const rawText = await res.text();
        console.log("Raw response text:", rawText);
        if (!res.ok) {
          throw new Error("Server error: " + rawText);
        }
        return JSON.parse(rawText);
      })
      .then((data) => {
        alert(data.msg || "Admin updated successfully!");
        navigate("/moderation/moderator");
      })
      .catch((err) => {
        console.error("Error updating admin:", err);
        alert(err.message || "Failed to update admin. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  

  return (
    <div className="container mx-auto mt-10 p-5">
      <h2 className="text-center text-2xl font-bold mb-5">Edit Admin</h2>
      <form
        onSubmit={handleSubmit}
        className="service max-w-lg mx-auto shadow-md rounded px-8 pt-6 pb-8"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
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
            className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`${
              isLoading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {isLoading ? "Updating..." : "Update Admin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAdmin;
