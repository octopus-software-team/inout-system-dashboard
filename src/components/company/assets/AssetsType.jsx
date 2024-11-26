import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AddServices = () => {
  const [data, setData] = useState([]); // بيانات الأصول
  const [search, setSearch] = useState(""); // البحث
  const [error, setError] = useState(null); // الخطأ
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token"); // جلب التوكن من localStorage

    if (!token) {
      console.log("No token found, cannot fetch asset types.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    // طلب البيانات من API
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
        if (resData && resData.status === 200) {
          setData(resData.data); // حفظ البيانات في الحالة
        } else {
          setError("No data found in the response.");
        }
      })
      .catch((err) => {
        console.error("Error fetching asset types:", err);
        setError("Failed to fetch data. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false); // إنهاء حالة التحميل
      });
  }, []);

  const handleEdit = (id) => {
    const selectedService = data.find((service) => service.id === id);
    navigate(`/company/assets/updateassettype`, { state: selectedService });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token"); // جلب التوكن من localStorage

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this asset type?")) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteAssetType/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete asset type.");
          }
          return res.json();
        })
        .then((resData) => {
          if (resData.status === 200) {
            setData(data.filter((item) => item.id !== id)); // تحديث البيانات المحلية
            alert(resData.msg || "Asset type deleted successfully.");
          } else {
            alert("Failed to delete asset type.");
          }
        })
        .catch((err) => {
          console.error("Error deleting asset type:", err);
          alert("Error deleting asset type. Please try again.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black mb-5">
        Asset Types
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search asset types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/assets/createassettype"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Asset Type
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No asset types found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  ID
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((i) => {
                  return search.toLowerCase() === ""
                    ? i
                    : i.name.toLowerCase().includes(search.toLowerCase());
                })
                .map((d, index) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-gray-100 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-800">{d.id}</td>
                    <td className="px-4 py-3 text-gray-800">{d.name}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(d.id)}
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
      )}
    </div>
  );
};

export default AddServices;
