import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';


const AddMaterials = () => {
  const [data, setData] = useState([]);    
  const [assetTypes, setAssetTypes] = useState([]); 
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    fetch("https://inout-api.octopusteam.net/api/front/getAssets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch assets");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          alert("No data found");
        }
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        alert("Failed to fetch assets");
      });

    // جلب الـ Asset Types (لإظهار الاسم بدلًا من الـ id)
    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch asset types");
        }
        return response.json();
      })
      .then((assetTypesData) => {
        // تحقق من نجاح الاستجابة
        if (assetTypesData && assetTypesData.status === 200) {
          setAssetTypes(assetTypesData.data); // [{id:1, name:'Laptop'}, ...]
        } else {
          toast.error(assetTypesData.msg || "Failed to load asset types");
        }
      })
      .catch((error) => {
        console.error("Error fetching asset types:", error);
        toast.error("Error fetching asset types");
      });
  }, []);

  // 3) دالة مساعدة لإيجاد اسم الـ Asset Type بالاعتماد على الـ ID
  const getAssetTypeNameById = (typeId) => {
    const foundType = assetTypes.find((item) => item.id === typeId);
    return foundType ? foundType.name : "N/A";
  };

  // 4) دالة الحذف مع تأكيد عبر Toast
  const handleDelete = (id) => {
    const token = Cookies.get('token');

    toast(
      <div>
        <p>Are you sure you want to delete this asset?</p>
        <div className="flex space-x-4 justify-center mt-2">
          <button
            onClick={() => handleConfirmDelete(id, token)}
            className="bg-red-500 text-white py-2 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white py-2 px-4 rounded-lg"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        pauseOnHover: false,
      }
    );
  };

  // تنفيذ عملية الحذف بعد التأكيد
  const handleConfirmDelete = (id, token) => {
    fetch(`https://inout-api.octopusteam.net/api/front/deleteAsset/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete asset");
        }
        return res.json();
      })
      .then((resData) => {
        toast.success("Asset deleted successfully!");
        setData((prevData) => prevData.filter((asset) => asset.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting asset:", err.message);
        toast.error("Failed to delete asset. Please try again.");
      });
  };

  // 5) واجهة العرض
  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center font-bold text-2xl text-black">Assets</h2>

      {/* شريط البحث + زر Create Asset */}
      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search assets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/assets/createassets"
          className="text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Asset
        </Link>
      </div>

      {/* جدول العرض */}
      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                #
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                Name
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                Asset Type
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold text-lg border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((d, index) => (
                <tr
                  key={d.id}
                  className={`hover:bg-gray-100 transition duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {d.id}
                  </td>
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {d.name}
                  </td>
                  {/* عرض اسم الـ Asset Type بدلًا من الرقم */}
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {getAssetTypeNameById(d.asset_type_id)}
                  </td>
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/company/assets/updateassets`, { state: d })
                      }
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      <FaTrash className="inline mr-2" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AddMaterials;
