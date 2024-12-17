import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";

const UpdateAssetType = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [assetType, setAssetType] = useState({ id: "", name: "" });

  useEffect(() => {
    if (location.state) {
      setAssetType(location.state);
    }
  }, [location.state]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    fetch(
      `https://inout-api.octopusteam.net/api/front/updateAssetType/${assetType.id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: assetType.name }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update asset type.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          toast.success("Asset type updated successfully.");
          setTimeout(() => {
            navigate("/company/assets/assetstype");
          }, 1500);
        } else {
          toast.error("Failed to update asset type.");
        }
      })
      .catch((err) => {
        console.error("Error updating asset type:", err);
        toast.error("Error updating asset type.");
      });
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h2 className="text-center font-bold text-2xl mb-5">Update Asset Type</h2>

      <form
        onSubmit={handleUpdate}
        className="service shadow-md rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            Asset Type Name
          </label>
          <input
            type="text"
            id="name"
            value={assetType.name}
            onChange={(e) =>
              setAssetType({ ...assetType, name: e.target.value })
            }
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter asset type name"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update
          </button>
        </div>
      </form>
      <Toaster
        position="top-right"
        richColors={true}
        closeButton
        customStyles={{
          "--sonner-toast-width": "350px",
          "--sonner-toast-height": "80px",
          "--sonner-toast-font-size": "1.2rem",
        }}
      />
    </div>
  );
};

export default UpdateAssetType;
