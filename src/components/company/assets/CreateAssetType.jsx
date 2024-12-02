import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAssetType = () => {
  const [assetTypes, setAssetTypes] = useState([]); // بيانات الأنواع
  const [newType, setNewType] = useState(""); // نوع جديد يُضاف
  const [message, setMessage] = useState(""); // رسالة نجاح أو خطأ

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // جلب التوكن

    // طلب البيانات من API لجلب الأنواع
    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // التوكن في الهيدر
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
          setAssetTypes(resData.data); // تخزين البيانات
        } else {
          setMessage("Failed to load asset types.");
        }
      })
      .catch((err) => {
        console.error("Error fetching asset types:", err);
        setMessage("Error loading data.");
        navigate("/company/assets/assetstype");
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault(); // منع التحديث الافتراضي للنموذج
    const token = localStorage.getItem("token"); // جلب التوكن

    // إرسال نوع جديد إلى API
    fetch("https://inout-api.octopusteam.net/api/front/addAssetType", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // التوكن في الهيدر
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
          setMessage("Asset type added successfully.");
          setAssetTypes([...assetTypes, resData.data]); // إضافة النوع الجديد إلى القائمة
          setNewType(""); // مسح الحقل بعد الإضافة
          navigate("/company/assets/assetstype"); // التنقل إلى الصفحة المطلوبة
        } else {
          setMessage("Failed to add asset type.");
        }
      })
      .catch((err) => {
        console.error("Error adding asset type:", err);
        setMessage("Error adding asset type.");
      });
  };

  return (
    <div className="container mx-auto mt-10 p-4 flex justify-center">
      <div className="service dark:bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-xs">
        <h2 className="text-center font-bold text-2xl mb-5">Create Asset Type</h2>

        {/* الفورم لإضافة نوع جديد */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {/* حقل إدخال النوع الجديد */}
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

          {/* زر الإضافة */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>

        {/* رسالة نجاح أو خطأ */}
        {message && (
          <p className="mt-4 text-center text-green-600 font-semibold">{message}</p>
        )}

        {/* قائمة الأنواع الموجودة */}
      </div>
    </div>
  );
};

export default CreateAssetType;
