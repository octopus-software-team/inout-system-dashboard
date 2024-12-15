import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // التأكد من وجود هذا الاستيراد
import Cookies from 'js-cookie';

const CreateAssets = () => {
  const [name, setName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const fetchAssetTypes = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getAssetTypes",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok && data.status === 200) {
          setAssetTypes(data.data);
        } else {
          toast.error(data.msg || "Failed to load asset types");
        }
      } catch (error) {
        console.error("Error fetching asset types:", error);
        toast.error("Error fetching asset types");
      }
    };

    fetchAssetTypes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetTypeId || assetTypeId === "id") {
      toast.error("Please select a valid asset type");
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addAsset",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            asset_type_id: assetTypeId,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || "Asset added successfully!");
        setName("");
        setAssetTypeId("");
        setTimeout(() => navigate("/company/assets/addnewassets"), 2000);
      } else {
        toast.error(result.msg || "Failed to add asset.");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset. Please try again.");
    }
  };

  return (
    <div className="flex dark:bg-slate-950 justify-center items-center mt-20 bg-gray-100">
      <ToastContainer theme="light" />
      <div className="service dark:bg-slate-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Asset</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Asset Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="assetTypeId"
              className="block text-sm font-medium text-gray-700"
            >
              Asset Type
            </label>
            <select
              id="assetTypeId"
              value={assetTypeId}
              onChange={(e) => setAssetTypeId(e.target.value)}
              required
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Add Asset
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssets;
