import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';

const AddNewAssets = () => {
  const [data, setData] = useState([]);    
  const [assetTypes, setAssetTypes] = useState([]); 
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    // جلب الأصول
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

    // جلب أنواع الأصول
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
        if (assetTypesData && assetTypesData.status === 200) {
          setAssetTypes(assetTypesData.data); // [{id:1, name:'Laptop'}, ...]
        } else {
          alert(assetTypesData.msg || "Failed to load asset types");
        }
      })
      .catch((error) => {
        console.error("Error fetching asset types:", error);
        alert("Error fetching asset types");
      });
  }, []);

  const getAssetTypeNameById = (typeId) => {
    const foundType = assetTypes.find((item) => item.id === typeId);
    return foundType ? foundType.name : "N/A";
  };

  const openModal = (id) => {
    setAssetToDelete(id);
    setIsModalOpen(true);
  };

  // إغلاق المودال
  const closeModal = () => {
    setAssetToDelete(null);
    setIsModalOpen(false);
  };

  // تأكيد الحذف
  const confirmDelete = () => {
    if (assetToDelete) {
      const token = Cookies.get('token');
      fetch(`https://inout-api.octopusteam.net/api/front/deleteAsset/${assetToDelete}`, {
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
          alert("تم حذف الأصل بنجاح!");
          setData((prevData) => prevData.filter((asset) => asset.id !== assetToDelete));
          closeModal();
        })
        .catch((err) => {
          console.error("Error deleting asset:", err.message);
          alert("فشل في حذف الأصل. حاول مرة أخرى.");
          closeModal();
        });
    }
  };

  // واجهة العرض
  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Assets</h2>

      {/* شريط البحث + زر إنشاء أصل */}
      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder=" Search Assets .."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/assets/createassets"
          className="text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Assets
        </Link>
      </div>

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
                Assets Type 
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold text-lg border-b border-gray-300">
                Action
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
                      onClick={() => openModal(d.id)}
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

      {/* نافذة المودال للتأكيد على الحذف */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>هل أنت متأكد أنك تريد حذف هذا الأصل؟</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                نعم
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                لا
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewAssets;
