import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, Toaster } from "sonner";
import DataTable from "react-data-table-component";

const AssetsType = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
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
  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  // Filter data based on search text
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Define columns for the table
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "200px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",

    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="edit1 py-1 px-3 rounded-lg"
          >
            <FaEdit className="inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => openConfirmModal(row.id)}
            className="colors1 py-1 px-3 rounded-lg"
          >
            <FaTrash className="inline mr-1" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "400px",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black mb-5">
        Asset Types
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search ..."
          value={searchText}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Link
          to="/company/assets/createassettype"
          className="icons bg-blue-800 font-semibold text-white py-2 px-6 rounded-lg ml-4"
        >
          + Create Asset Type
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No asset types found.</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="id"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          className="shadow-lg rounded-lg overflow-hidden"
        />
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this asset type?</p>
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