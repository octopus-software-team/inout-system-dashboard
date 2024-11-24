import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateMaterials = () => {
  const [name, setName] = useState("");
  const [stock, setStock] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMzEyMDkzLCJleHAiOjE3NjM4NDgwOTMsIm5iZiI6MTczMjMxMjA5MywianRpIjoiMVdmRWZka3hybmN4V2wycSIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.8kk0U67fvEKT-MKytjKsFlshFOQsj4pE5YpmhiEVszY"
    const newMaterial = {
      name,
      stock: parseInt(stock), 
      type: parseInt(type), 
    };

    fetch("https://inout-api.octopusteam.net/api/front/addMaterial", {
      method: "POST",
      headers: {
        Authorization: token,
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
        alert(resData.msg || "Material added successfully");
        navigate("/company/assets/addmaterials"); // Redirect to materials page after success
      })
      .catch((err) => {
        console.error("Error creating material:", err);
        alert("Failed to add material. Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Create Material</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
            Material Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter material name"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="stock">
            Stock
          </label>
          <input
            type="number"
            id="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter stock quantity"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="type">
            Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select type</option>
            <option value="0">Type A</option>
            <option value="1">Type B</option>
          </select>
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
