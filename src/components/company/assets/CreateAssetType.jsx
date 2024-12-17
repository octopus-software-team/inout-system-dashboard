import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";

const CreateAssetType = () => {
  const [assetTypes, setAssetTypes] = useState([]);
  const [newType, setNewType] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token"); 

    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          setAssetTypes(resData.data);
          toast.success("Asset types loaded successfully!");
        } else {
          toast.error("Failed to load asset types.");
        }
      })
      .catch((err) => {
        console.error("Error fetching asset types:", err);
        toast.error("An error occurred while loading data.");
        navigate("/company/assets/assetstype");
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault(); 
    const token = Cookies.get("token"); // Get token

    fetch("https://inout-api.octopusteam.net/api/front/addAssetType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: newType,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add asset type.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          toast.success("Asset type added successfully.");
          setAssetTypes([...assetTypes, resData.data]); // Add new type to list
          setNewType(""); // Clear input field after addition
          navigate("/company/assets/assetstype"); // Navigate to desired page
        } else {
          toast.error("Failed to add asset type.");
        }
      })
      .catch((err) => {
        console.error("Error adding asset type:", err);
        toast.error("An error occurred while adding the asset type.");
      });
  };

  return (
    <div className="container mx-auto mt-10 p-4 flex justify-center">
      <div className="service dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h2 className="text-center font-bold text-2xl mb-5">
          Create Asset Type
        </h2>

        {/* Form to add a new type */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input field for new type */}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newType"
            >
              Asset Type Name
            </label>
            <input
              type="text"
              id="newType"
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="shadow dark:bg-slate-900 dark:text-white appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter new asset type name"
              required
            />
          </div>

          {/* Submit button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      {/* Toaster for notifications */}
      <Toaster
        position="top-right"
        richColors={true}
        closeButton
        customStyles={{
          // Custom styles to increase size
          "--sonner-toast-width": "350px",
          "--sonner-toast-height": "80px",
          "--sonner-toast-font-size": "1.2rem",
        }}
      />
    </div>
  );
};

export default CreateAssetType;
