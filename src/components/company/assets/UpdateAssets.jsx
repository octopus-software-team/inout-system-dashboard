import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateAssets = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [assetTypes, setAssetTypes] = useState([]);
  const [name, setName] = useState(state?.name || "");
  const [assetTypeId, setAssetTypeId] = useState(state?.asset_type_id || "");

  // تحميل أنواع الأصول عند تحميل المكون
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
          setAssetTypes(data.data); // حفظ بيانات أنواع الأصول
        } else {
          console.error("فشل تحميل أنواع الأصول");
        }
      })
      .catch((error) => console.error("خطأ في تحميل أنواع الأصول:", error));
  }, []);

  // إرسال التحديثات إلى الخادم
  const handleSubmit = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    fetch(
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
        }),
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("فشل التعديل");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData); // تحقق من استجابة الخادم
        const successMessage = resData.msg || "تم التعديل بنجاح";
        toast.success(successMessage); // عرض التوست عند النجاح
        navigate("/company/assets/addnewassets"); // التنقل بعد النجاح
      })
      .catch((err) => {
        console.error("خطأ في تحديث الأصل:", err.message);
        toast.error("فشل التعديل. يرجى المحاولة مرة أخرى."); // عرض التوست عند الفشل
      });
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
            {assetTypes.length > 0 ? (
              assetTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Loading asset types...
              </option>
            )}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          Update Asset
        </button>
      </form>

      {/* ToastContainer لعرض التوست */}
      <ToastContainer />
    </div>
  );
};

export default UpdateAssets;
