import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateClients = () => {
  const location = useLocation(); // لجلب البيانات من الـ state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (location.state) {
      setFormData({
        id: location.state.id || "",
        name: location.state.name || "",
        email: location.state.email || "",
        phone: location.state.phone || "",
      });
    }
  }, [location.state]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
  
    fetch(`https://inout-api.octopusteam.net/api/front/updateCustomer/${formData.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update client.");
        }
        return res.json();
      })
      .then((response) => {
        alert(response.msg || "Client updated successfully.");
        navigate("/customers/clients"); // الرجوع إلى صفحة العملاء بعد التحديث
      })
      .catch((error) => {
        console.error("Error updating client:", error);
        alert("Failed to update the client. Please try again.");
      });
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Update Client</h2>
      <form
        onSubmit={handleSubmit}
        className="service  mt-5 p-5 border border-gray-200 shadow-lg rounded-lg max-w-md mx-auto "
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="id">
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleInputChange}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Update Client
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateClients;
