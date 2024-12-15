import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const EditOwner = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: 1,
  });

  const token = Cookies.get('token');

  useEffect(() => {
    fetch("https://inout-api.octopusteam.net/api/front/getOwners", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
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
            alert("Owner not found!");
          }
        } else {
          alert("Failed to fetch owners: " + result.msg);
        }
      })
      .catch((err) => console.error("Error fetching owner details:", err));
  }, [id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    fetch(`https://inout-api.octopusteam.net/api/front/updateCustomer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          alert("Owner updated successfully!");
          navigate("/customers/owner");
        } else {
          alert("Failed to update owner: " + result.msg);
        }
      })
      .catch((err) => console.error("Error updating owner:", err));
  };

  return (
    <div className="service container mx-auto mt-10 p-6 max-w-lg shadow-lg rounded-lg">
      <h2 className="text-center text-3xl font-bold text-blue-600 mb-6">
        Edit Owner
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter owner's name"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter owner's email"
            required
          />
        </div>

        <div>
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="phone"
          >
            Phone
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            id="phone"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter owner's phone number"
            required
          />
        </div>

        <input type="hidden" name="type" value={formData.type} />

        <div className="text-center">
          <button
            className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            type="submit"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditOwner;
