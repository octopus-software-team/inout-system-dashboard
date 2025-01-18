import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "antd";
import ImportFile from "../ImportFile"; // تأكد من صحة المسار

const Clients = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState(""); // حالة البحث

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    branch_id: "",
  });

  const tableName = "customers"; // تحديد اسم الجدول

  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

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

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const resData = await response.json();
        if (response.ok) {
          setBranches(resData.data);
        } else {
          console.error("Failed to fetch branches.");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch clients function
  const fetchClients = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found, cannot fetch clients.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCustomers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resData = await response.json();
      setData(resData.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to fetch clients. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Listen for customer addition and refresh data
  useEffect(() => {
    const handleCustomerAdded = () => {
      fetchClients(); // Refresh the client list
    };

    window.addEventListener("customerAdded", handleCustomerAdded);

    return () => {
      window.removeEventListener("customerAdded", handleCustomerAdded);
    };
  }, []);

  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // Handle Edit
  const handleEdit = (id) => {
    const selectedClient = data.find((client) => client.id === id);
    navigate("/customers/updateclients", { state: selectedClient });
  };

  // Handle Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      setIsConfirmOpen(false);
      return;
    }

    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteCustomer/${deleteId}`,
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
          throw new Error("Failed to delete client.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Client deleted successfully.");
        setData((prevData) =>
          prevData.filter((client) => client.id !== deleteId)
        );
        setIsConfirmOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete the client. Please try again.");
        setIsConfirmOpen(false);
      });
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply Filters
  const applyFilters = () => {
    let filteredData = data;

    if (filters.name) {
      filteredData = filteredData.filter((client) =>
        client.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.email) {
      filteredData = filteredData.filter((client) =>
        client.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.phone) {
      filteredData = filteredData.filter((client) =>
        client.phone.includes(filters.phone)
      );
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (client) => client.branch_id === parseInt(filters.branch_id)
      );
    }

    // Apply search filter
    if (search) {
      filteredData = filteredData.filter((client) =>
        client.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredData;
  };

  const filteredData = applyFilters();

  // تعريف أعمدة الجدول
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
      cell: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row.id}
        </span>
      ),
    },
    {
      name: "Name",
      width: "100px",

      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      name: "Email",
      width: "180px",

      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700 dark:text-white">{row.email}</span>
      ),
    },
    {
      name: "Phone",
      width: "170px",

      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700 dark:text-white">{row.phone}</span>
      ),
    },
    {
      name: "Branch",
      width: "100px",

      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700 dark:text-white">
          {getBranchName(row.branch_id)}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row.id)} className="edit1">
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="colors1">
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",
    },
  ];

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl dark:text-white mb-6">
        Clients
      </h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        {/* <FaSearch className="ml-2 text-gray-500" /> */}
        <div className="flex items-center gap-2">
          <Link
            to="/customers/createclients"
            className="flex items-center bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            + Create Client
          </Link>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-blue-800 text-white py-2 px-4 rounded transition duration-200"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>

          <button
            onClick={() => setOpen(true)}
            className="icons bg-blue-800  text-white  rounded-lg "
          >
            Import
          </button>
          <button
            onClick={handleExportFile}
            className="icons bg-blue-800 text-white  rounded-lg "
          >
            Export
          </button>

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
                  <ImportFile tableName={tableName} /> {/* مكون الاستيراد */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-700 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No clients found.</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="#"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          className="shadow-lg rounded-lg overflow-hidden"
        />
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Clients</h3>
            <div className="space-y-4">
              <label htmlFor="">select branch </label>

              <select
                name="branch_id"
                value={filters.branch_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this client?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
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
      />
    </div>
  );
};

export default Clients;
