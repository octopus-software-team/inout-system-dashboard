import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from 'js-cookie';


const CreateCustomer = () => {
  const [customerData, setCustomerData] = useState({
    name: "",
    email: "",
    phone: "",
    type: 0, // قيمة type ستظل ثابتة 0 (Client)
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');

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
          body: JSON.stringify(customerData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("Customer added successfully");
        toast.success(`Customer ${data.data.name} added successfully!`);
        navigate("/customers/clients");
      } else {
        toast.error(data.msg || "Failed to add customer.");
        setMessage("Failed to add customer");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setMessage("An error occurred");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center mt-40 relative">
      <Toaster position="top-center" reverseOrder={false} />

      <form onSubmit={handleSubmit} className="p-6 rounded w-10/12 max-w-md">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Add Client
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
            placeholder="Customer Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={customerData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-semibold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Customer Email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={customerData.email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-gray-700 font-semibold mb-2"
          >
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            placeholder="Customer Phone"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            value={customerData.phone}
            onChange={handleChange}
          />
        </div>

        <input type="hidden" id="type" name="type" value="0" />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateCustomer;
