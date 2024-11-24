import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAssets = () => {
  const [name, setName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMzEyMDkzLCJleHAiOjE3NjM4NDgwOTMsIm5iZiI6MTczMjMxMjA5MywianRpIjoiMVdmRWZka3hybmN4V2wycSIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.8kk0U67fvEKT-MKytjKsFlshFOQsj4pE5YpmhiEVszY"

    fetch("https://inout-api.octopusteam.net/api/front/addAsset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        asset_type_id: assetTypeId,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add asset");
        }
        return res.json();
      })
      .then((resData) => {
        alert(resData.msg || "Asset added successfully");
        navigate("/company/assets/addmaterials"); // Redirect to the assets list page
      })
      .catch((err) => {
        console.error("Error adding asset:", err.message);
        alert("Failed to add asset. Please try again.");
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-center font-bold text-2xl mb-5">Create New Asset</h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
            Asset Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter asset name"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="assetTypeId"
          >
            Asset Type ID
          </label>
          <input
            type="number"
            id="assetTypeId"
            className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={assetTypeId}
            onChange={(e) => setAssetTypeId(e.target.value)}
            placeholder="Enter asset type ID"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          Save
        </button>
      </form>
    </div>
  );
};

export default CreateAssets;
