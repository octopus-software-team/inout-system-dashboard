import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // استيراد المكتبة
import "react-toastify/dist/ReactToastify.css"; // استيراد الأنماط الخاصة بالتوست
import Cookies from 'js-cookie';


const UpdateMaterials = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const material = location.state; // المادة التي تم تمريرها

  const [name, setName] = useState(material?.name || "");
  const [stock, setStock] = useState(material?.stock || "");
  const [type, setType] = useState(material?.type || "");

  const handleSubmit = (e) => {
    const token = Cookies.get('token');
    console.log("Token:", token);

    e.preventDefault();

    const updatedMaterial = {
      name,
      stock: parseInt(stock),
      type: parseInt(type),
    };

    console.log("Updated Material:", updatedMaterial);

    fetch(
      `https://inout-api.octopusteam.net/api/front/updateMaterial/${material.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMaterial),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update material");
        }
        return res.json();
      })
      .then((resData) => {
        console.log("Response Data:", resData);
        toast.success(resData.msg || "Material updated successfully");
        navigate("/company/assets/addmaterials");
      })
      .catch((err) => {
        console.error("Error updating material:", err);
        toast.error("Failed to update material. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">
        Update Material
      </h2>

      <form
        onSubmit={handleSubmit}
        className="service max-w-lg mx-auto p-8 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="name"
          >
            Material Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full dark:bg-slate-900 dark:text-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="stock"
          >
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full dark:bg-slate-900 dark:text-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="type"
          >
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full dark:bg-slate-900 dark:text-white px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            <option value="0">Type A</option>
            <option value="1">Type B</option>
            <option value="2">Type C</option>
          </select>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Update Material
          </button>
        </div>
      </form>

      {/* إضافة ToastContainer هنا لتفعيل التوست */}
      <ToastContainer />
    </div>
  );
};

export default UpdateMaterials;
