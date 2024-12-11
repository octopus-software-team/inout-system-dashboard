import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [location, setLocation] = useState("");
  const [branchData, setBranchData] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (branchName.trim() === "" || location.trim() === "") {
      toast.error("يرجى ملء جميع الحقول.");
      return;
    }

    const data = {
      name: branchName.trim(),
      location: location.trim(),
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addBranch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("تفاصيل الخطأ:", result);
        throw new Error(result.msg || "فشل في إضافة الفرع");
      }

      setBranchData(result.data);
      toast.success(result.msg || "تم إضافة الفرع بنجاح!");

      // إعادة التوجيه بعد فترة قصيرة للسماح للمستخدم برؤية التوست
      setTimeout(() => {
        navigate("/company/Branchs");
      }, 2000);
    } catch (error) {
      toast.error("خطأ: " + error.message);
      console.error("خطأ:", error);
    }
  };

  return (
    <div className="service max-w-lg mt-24 mx-auto p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Branch Name 
          </label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter Location"
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Branch
        </button>
      </form>

      {/* عرض تفاصيل الفرع بعد الإضافة */}
      {branchData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">تفاصيل الفرع:</h3>
          <p>
            <strong>ID:</strong> {branchData.id}
          </p>
          <p>
            <strong>Name:</strong> {branchData.name}
          </p>
          <p>
            <strong>Location:</strong>{" "}
            <a
              href={branchData.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Show on map
            </a>
          </p>
        </div>
      )}

      {/* مكون التوست */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true} // لضبط اتجاه النصوص للعربية
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default AddBranch;
