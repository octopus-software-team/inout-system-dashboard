import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

const UpdateAssets = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [assetTypes, setAssetTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState(state?.name || "");
  const [assetTypeId, setAssetTypeId] = useState(state?.asset_type_id || "");
  const [branchId, setBranchId] = useState(state?.branch_id || "");
  const [count, setCount] = useState(state?.count || "");

  useEffect(() => {
    const token = Cookies.get('token');

    // Fetch asset types
    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setAssetTypes(data.data);
        } else {
          toast.error("Failed to load asset types");
        }
      })
      .catch((error) => toast.error("Error fetching asset types"));

    // Fetch branches
    fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setBranches(data.data);
        } else {
          toast.error("Failed to load branches");
        }
      })
      .catch((error) => toast.error("Error fetching branches"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateAsset/${state.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            asset_type_id: assetTypeId,
            branch_id: branchId,
            count: Number(count),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || "Asset updated successfully!");
        setTimeout(() => {
          navigate("/company/assets/addnewassets");
        }, 2000);
      } else {
        toast.error(result.msg || "Failed to update the asset.");
      }
    } catch (error) {
      console.error("Error updating asset:", error);
      toast.error("An error occurred while updating the asset.");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-center font-bold text-2xl mb-5">Update Asset</h2>
      <form
        onSubmit={handleSubmit}
        className="service max-w-md mx-auto p-6 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="name"
          >
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
            Asset Type
          </label>
          <select
            id="assetTypeId"
            className="border dark:bg-slate-900 dark:text-white border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={assetTypeId}
            onChange={(e) => setAssetTypeId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select an asset type
            </option>
            {assetTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="branchId"
          >
            Branch
          </label>
          <select
            id="branchId"
            className="border dark:bg-slate-900 dark:text-white border-gray-300 rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a branch
            </option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="count"
          >
            Count
          </label>
          <input
            type="number"
            id="count"
            className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            placeholder="Enter asset count"
            required
            min="1"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          Update Asset
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default UpdateAssets;
