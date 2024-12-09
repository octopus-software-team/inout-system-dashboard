import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

const CreateAssets = () => {
  const [name, setName] = useState("");
  const [assetTypeId, setAssetTypeId] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
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
          toast.error("Failed to load asset types"); // توست في حالة فشل تحميل الأنواع
        }
      })
      .catch((error) => {
        console.error("Error fetching asset types:", error);
        toast.error("Error fetching asset types"); // توست في حالة وجود مشكلة في الاتصال
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!assetTypeId || assetTypeId === "id") {
      setErrors({ asset_type_id: ["Please select a valid asset type"] });
      return;
    }

    const token = localStorage.getItem("token");

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
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 422) {
          setErrors(resData.data);
          toast.error("Validation errors occurred. Please check the form."); // توست عند وجود أخطاء تحقق
        } else {
          toast.success(resData.msg || "Asset added successfully!"); // توست عند نجاح إضافة الأسيتم
          navigate("/company/assets/addnewassets");
        }
      })
      .catch((err) => {
        console.error("Error adding asset:", err.message);
        toast.error("Failed to add asset. Please try again."); // توست في حالة الفشل
      });
  };

  return (
    <div className="container mx-auto mt-10">
      <h2 className="text-center font-bold text-2xl mb-5">Create New Asset</h2>
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
            <option value="id" disabled>
              Select an asset type
            </option>
            {assetTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.asset_type_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.asset_type_id[0]}
            </p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          Save
        </button>
      </form>
      <ToastContainer /> 
    </div>
  );
};

export default CreateAssets;
