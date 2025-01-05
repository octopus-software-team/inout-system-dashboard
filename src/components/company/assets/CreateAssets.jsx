import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

const CreateAssets = () => {
  const [name, setName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [count, setCount] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // حالة النافذة المنبثقة
  const [newAssetTypeName, setNewAssetTypeName] = useState(""); // اسم نوع الأصل الجديد
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

    const fetchBranches = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
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
          setBranches(data.data);
        } else {
          toast.error(data.msg || "Failed to load branches");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Error fetching branches");
      }
    };

    fetchAssetTypes();
    fetchBranches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!assetTypeId || assetTypeId === "id") {
      toast.error("Please select a valid asset type");
      return;
    }

    if (!branchId || branchId === "id") {
      toast.error("Please select a valid branch");
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
            branch_id: branchId,
            count: Number(count),
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || "Asset added successfully!");
        setName("");
        setAssetTypeId("");
        setBranchId("");
        setCount("");
        setTimeout(() => navigate("/company/assets/addnewassets"), 2000);
      } else {
        toast.error(result.msg || "Failed to add asset.");
      }
    } catch (error) {
      console.error("Error adding asset:", error);
      toast.error("Failed to add asset. Please try again.");
    }
  };

  const handleAddNewAssetType = async () => {
    if (!newAssetTypeName) {
      toast.error("Please enter a valid asset type name");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addAssetType",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newAssetTypeName }),
        }
      );

      const result = await response.json();
      if (response.ok && result.status === 200) {
        setAssetTypes((prev) => [...prev, { id: result.data.id, name: newAssetTypeName }]);
        toast.success("Asset type added successfully");
        setIsModalOpen(false);
        setNewAssetTypeName("");
      } else {
        toast.error(result.msg || "Failed to add asset type");
      }
    } catch (error) {
      console.error("Error adding asset type:", error);
      toast.error("Failed to add asset type. Please try again.");
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
          <div className="flex justify-between items-center">
            <label
              htmlFor="assetTypeId"
              className="block text-sm font-medium text-gray-700"
            >
              Asset Type
            </label>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="text-blue-600 text-sm"
            >
              + Add 
            </button>
          </div>
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
          <div>
            <label
              htmlFor="branchId"
              className="block text-sm font-medium text-gray-700"
            >
              Branch
            </label>
            <select
              id="branchId"
              value={branchId}
              onChange={(e) => setBranchId(e.target.value)}
              required
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="id" disabled>
                Select a branch
              </option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700"
            >
              Count
            </label>
            <input
              type="number"
              id="count"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              required
              min="1"
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Add Asset
          </button>
        </form>
      </div>

      {/* Modal for adding new Asset Type */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Add New Asset Type</h2>
            <input
              type="text"
              value={newAssetTypeName}
              onChange={(e) => setNewAssetTypeName(e.target.value)}
              placeholder="Asset Type Name"
              className="mb-4 w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewAssetType}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateAssets;
