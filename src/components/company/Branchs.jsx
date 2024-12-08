import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import MapPicker from "react-google-map-picker";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Branchs = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [openMap, setOpenMap] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const navigate = useNavigate();

  const DefaultLocation = { lat: 10, lng: 106 }; // الموقع الافتراضي للخريطة
  const DefaultZoom = 10;

  const [location, setLocation] = useState(DefaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  function handleChangeLocation(lat, lng) {
    setLocation({ lat, lng });
    if (selectedBranch) {
      selectedBranch.latitude = lat;
      selectedBranch.longitude = lng;
      setSelectedBranch({ ...selectedBranch });
    }
  }

  // لتغيير الزوم عند التعديل عليه
  function handleChangeZoom(newZoom) {
    setZoom(newZoom);
  }

  // لإغلاق الخريطة
  const handleResetLocation = () => {
    setSelectedBranch(null);
    setOpenMap(false);
  };

  // جلب البيانات من الـ API
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch branches");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          toast.error("No data found");
        }
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
        toast.error("Failed to fetch branches");
      });
  }, []);

  // عملية الحذف مع التوست
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    // عرض توست التأكيد للحذف
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this branch?</p>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => handleConfirmDelete(id, token, confirmToast)}
            className="bg-red-600 text-white py-1 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)} // إغلاق التوست إذا تم اختيار "No"
            className="bg-gray-600 text-white py-1 px-4 rounded-lg"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  const handleConfirmDelete = (id, token, confirmToast) => {
    fetch(`https://inout-api.octopusteam.net/api/front/deleteBranch/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete branch");
        }
        return res.json();
      })
      .then((resData) => {
        toast.success(resData.msg || "Branch deleted successfully");  // عرض التوست عند النجاح
        setData(data.filter((branch) => branch.id !== id));
        toast.dismiss(confirmToast); // إغلاق التوست بعد الحذف
      })
      .catch((err) => {
        console.error("Error deleting branch:", err);
        toast.error("Failed to delete branch");  // عرض التوست عند حدوث خطأ
        toast.dismiss(confirmToast); // إغلاق التوست بعد الخطأ
      });
  };

  const openMapp = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  const handleViewMap = (latitude, longitude, branchData) => {
    setSelectedBranch(branchData);
    setOpenMap(true);
    setLocation({ lat: latitude, lng: longitude });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Branches</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/addbranch"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Branch
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 dark:bg-slate-900 py-3 text-left font-semibold text-lg border-b border-gray-300">
                ID
              </th>
              <th className="px-4 py-3 dark:bg-slate-900 text-left font-semibold text-lg border-b border-gray-300">
                Name
              </th>
              <th className="px-4 py-3 dark:bg-slate-900 text-left font-semibold text-lg border-b border-gray-300">
                Location
              </th>
              <th className="px-4 py-3 dark:bg-slate-900 text-right font-semibold text-lg border-b border-gray-300">
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
                  className={`hover:bg-gray-100 transition dark:bg-slate-900 duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3 dark:text-white dark:bg-slate-900 text-gray-800">
                    {d.id}
                  </td>
                  <td className="px-4 py-3 dark:text-white dark:bg-slate-900 text-gray-800">
                    {d.name}
                  </td>
                  <td className="px-4 py-3 dark:text-white dark:bg-slate-900 text-gray-800">
                    <button
                      onClick={() => openMapp(d.latitude, d.longitude)}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      View on Map
                    </button>
                  </td>
                  <td className="px-4 py-3 dark:bg-slate-900 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/company/updatebranch`, { state: d })
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

      {openMap && selectedBranch && (
        <div className="modal">
          <button
            onClick={handleResetLocation}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Close Map
          </button>
          <MapPicker
            defaultLocation={location}
            zoom={zoom}
            mapTypeId="roadmap"
            style={{ height: "700px" }}
            onChangeLocation={handleChangeLocation}
            onChangeZoom={handleChangeZoom}
            apiKey="AIzaSyD07E1VvpsN_0FvsmKAj4nK9GnLq-9jtj8"
          />
          <div>
            <label>Latitude:</label>
            <input type="text" value={location.lat} disabled />
            <label>Longitude:</label>
            <input type="text" value={location.lng} disabled />
            <label>Zoom:</label>
            <input type="text" value={zoom} disabled />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Branchs;
