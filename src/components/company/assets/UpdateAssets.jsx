import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateAssets = () => {
  const { state } = useLocation(); // Get data passed via navigate
  const navigate = useNavigate();

  // Initialize state with current asset data
  const [name, setName] = useState(state?.name || "");
  const [assetTypeId, setAssetTypeId] = useState(state?.asset_type_id || "");

  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    fetch(`https://inout-api.octopusteam.net/api/front/updateAsset/${state.id}`, {
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
          throw new Error("Failed to update asset");
        }
        return res.json();
      })
      .then((resData) => {
        alert(resData.msg || "Asset updated successfully");
        navigate("/company/assets/addmaterials"); // Redirect back to the assets list
      })
      .catch((err) => {
        console.error("Error updating asset:", err.message);
        alert("Failed to update asset. Please try again.");
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-center font-bold text-2xl mb-5">Update Asset</h2>
      <form
        onSubmit={handleSubmit}
        className="service max-w-md mx-auto  p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">
            Asset Name
          </label>
          <input
            type="text"
            id="name"
            className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateAssets;
