import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from 'js-cookie';

const CreateMaterials = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [type, setType] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // إضافة حالة لتخزين رسالة الخطأ
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const token = Cookies.get('token');
  
    if (!type) {
      toast.error("Type is required!");
      return;
    }
  
    const newMaterial = {
      name,
      stock: parseInt(stock),
      type: parseInt(type),
    };
  
    fetch("https://inout-api.octopusteam.net/api/front/addMaterial", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMaterial),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create material");
        }
        return res.json();
      })
      .then((resData) => {
        toast.success(resData.msg || "Material added successfully!"); 
        setTimeout(() => {
          navigate("/company/assets/addmaterials"); 
        }, 2000);
      })
      .catch((err) => {
        console.error("Error creating material:", err);
        toast.error("Failed to add material. Please try again.");
      });
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">
        Create Material
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
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            onChange={(e) => {
              setType(e.target.value);
              setErrorMessage(""); // إعادة تعيين رسالة الخطأ عند تغيير القيمة
            }}
            className="w-full px-4 dark:bg-slate-900 dark:text-white py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Type</option>{" "}
            {/* إضافة خيار فارغ لاختيار نوع */}
            <option value="0">kg</option>
            <option value="1">piece</option>
            <option value="2">meter</option>
            <option value="3">liter</option>
          </select>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}{" "}
          {/* عرض رسالة الخطأ */}
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Create Material
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMaterials;
