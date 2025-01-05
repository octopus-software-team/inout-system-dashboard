import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import $ from "jquery";
import "datatables.net";
import { Modal, Input, Button } from "antd"; // Added Modal, Input, and Button from Ant Design

const AssetsType = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  const [searchText, setSearchText] = useState(""); // State for Search Text

  const navigate = useNavigate();

  // Fetch Asset Types
  const fetchAssetTypes = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getAssetTypes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const resData = await response.json();

      if (resData && resData.status === 200) {
        setData(resData.data);
      } else {
        setError("No data found in the response.");
      }
    } catch (err) {
      console.error("Error fetching asset types:", err);
      toast.error("Failed to fetch data. Please try again later.");
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssetTypes();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
          language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
              first: "First",
              last: "Last",
              next: "Next",
              previous: "Previous",
            },
          },
        });
      } else {
        dataTable.current.clear();
        dataTable.current.rows.add(data);
        dataTable.current.draw();
      }
    }

    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
        dataTable.current = null;
      }
    };
  }, [data]);

  const handleEdit = (id) => {
    const selectedService = data.find((service) => service.id === id);
    navigate(`/company/assets/updateassettype`, { state: selectedService });
  };

  const openConfirmModal = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  const confirmDelete = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      closeConfirmModal();
      return;
    }

    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteAssetType/${deleteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete asset type.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          setData(data.filter((item) => item.id !== deleteId));
          toast.success(resData.msg || "Asset type deleted successfully.");
        } else {
          toast.error("Failed to delete asset type.");
        }
      })
      .catch((err) => {
        console.error("Error deleting asset type:", err);
        toast.error("Error deleting asset type. Please try again.");
      })
      .finally(() => {
        closeConfirmModal();
      });
  };

  // Handle Search
  const handleSearch = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("table", "tasks");
    formData.append("column", "name");
    formData.append("value", searchText.trim());
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/searchInAnyTable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data.");
      }

      const resData = await response.json();
      console.log(resData); // طباعة البيانات المسترجعة

      if (resData && resData.status === 200) {
        setData(resData.data); // Update the data with the search results
        // setIsFilterModalOpen(false); // إغلاق الـ Modal بعد البحث
      } else {
        setError("No data found in the response.");
      }
    } catch (err) {
      console.error("Error searching tasks:", err);
      toast.error("Failed to search data. Please try again later.");
      setError("Failed to search data. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black mb-5">
        Asset Types
      </h2>

      <div className="flex justify-end items-center my-4">
        <Link
          to="/company/assets/createassettype"
          className="icons bg-blue-800 font-semibold text-white py-2 px-6 rounded-lg"
        >
          + Create Asset Type
        </Link>

        {/* Filter Button */}
      </div>

      {/* Filter Modal */}

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table
            ref={tableRef}
            className="display table-auto w-full border border-gray-200 bg-white rounded-lg"
          >
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="w-30 px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  #
                </th>
                <th className="w-30 px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3  font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, index) => (
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
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3  space-x-2">
                    <button
                      onClick={() => handleEdit(d.id)}
                      className="edit rounded-lg"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => openConfirmModal(d.id)}
                      className="colors  rounded-lg "
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

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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

export default AssetsType;
