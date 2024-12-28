import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import ImportFile from "../ImportFile"; // Ensure this path is correct
import $ from "jquery";
import "datatables.net";

const AddServices = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const tableRef = useRef(null); // Reference to the table
  const dataTable = useRef(null); // Reference to DataTable instance

  const tableName = "services"; // تحديد اسم الجدول

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found, cannot fetch services.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getServices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          setError("No data found in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Initialize DataTable
  useEffect(() => {
    // Initialize only if data is present
    if (data.length > 0) {
      // If DataTable is already initialized, destroy it before re-initializing
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        dataTable.current.destroy();
      }

      dataTable.current = $(tableRef.current).DataTable({
        // DataTable options can be added here
        responsive: true,
        // Disable default search if you want to use custom search
        searching: false,
        // To specify initial sorting
        order: sortedColumn ? [[getColumnIndex(sortedColumn), order === "ASC" ? 'asc' : 'desc']] : [],
      });
    }

    // Cleanup on unmount
    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
      }
    };
  }, [data]);

  // Integrate custom search with DataTables
  useEffect(() => {
    if (dataTable.current) {
      dataTable.current.search(search).draw();
    }
  }, [search]);

  const getColumnIndex = (col) => {
    switch (col) {
      case "id":
        return 0;
      case "name":
        return 1;
      default:
        return 0;
    }
  };

  const handleExportFile = async () => {
    const formData = new FormData();
    formData.append("table", tableName);

    const token = Cookies.get("token");

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/export",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = `${tableName}.xlsx`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting file:", error);
      toast.error("Failed to export file.");
    }
  };

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] > b[col] ? 1 : -1;
      });
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] < b[col] ? 1 : -1;
      });
      setOrder("ASC");
    }
    setData(sorted);
    setSortedColumn(col);
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleEdit = (id) => {
    const selectedService = data.find((service) => service.id === id);
    navigate(`/company/editservice`, { state: selectedService });
  };

  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this service?</p>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => handleConfirmDelete(id, token, confirmToast)}
            className="bg-red-600 text-white py-1 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
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
    fetch(`https://inout-api.octopusteam.net/api/front/deleteService/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete service.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Service deleted successfully.");
        setData(data.filter((service) => service.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete the service. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Services</h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 sm:w-2/3 shadow-md"
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
      <div className="flex">
      <Link
          to="/company/createservices"
          className="icons bg-blue-800 text-white ml-3  font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Service
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="icons bg-blue-800 ml-3 text-white px-4 py-2 rounded "
        >
          Import
        </button>

        <button
          onClick={handleExportFile}
          className="icons bg-blue-800 px-6 py-3 ml-3  text-white rounded-lg shadow-md "
        >
          Export
        </button>
      </div>
        {open && (
          <div
            className="fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-[350px] h-[350px] bg-white rounded-lg shadow-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center text-xl font-semibold mb-4">
                Import File
              </h2>
              <div className="flex flex-col items-center space-y-4">
                <ImportFile tableName={tableName} />{" "}
                {/* استدعاء مكون الاستيراد هنا */}
              </div>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No services found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table
            ref={tableRef}
            className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md display"
          >
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="th4 px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  # {renderSortIcon("id")}
                </th>
                <th className="th5 px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name {renderSortIcon("name")}
                </th>
                <th className="th6 px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
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
                    className={`hover:bg-gray-100 dark:bg-slate-900 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                      {d.id}
                    </td>
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                      {d.name}
                    </td>
                    <td className="th6 px-4 py-3 dark:bg-slate-900 dark:text-white text-right space-x-2">
                      <button
                        onClick={() => handleEdit(d.id)}
                      className="edit py-2 px-4 rounded-lg "
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
                        className="colors font-semibold py-2 px-4 rounded-lg "
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

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default AddServices;
