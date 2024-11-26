import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateAssets = () => {
  const [name, setName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [assetTypes, setAssetTypes] = useState([]); // To store the asset types
  const navigate = useNavigate();

  // Fetch asset types with token
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get the token from localStorage

    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token in the Authorization header
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAssetTypes(data.data); // Store fetched asset types
        } else {
          alert("Failed to load asset types");
        }
      })
      .catch((error) => {
        console.error("Error fetching asset types:", error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Get the token from localStorage

    fetch("https://inout-api.octopusteam.net/api/front/addAsset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the token in the Authorization header
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
        navigate("/company/assets/addnewassets"); // Redirect to the assets list page
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
            Asset Type
          </label>
          <select
            id="assetTypeId"
            className="border border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={assetTypeId}
            onChange={(e) => setAssetTypeId(e.target.value)}
            required
          >
            <option value="id" disabled>
              Select an asset type
            </option>
            {assetTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
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
