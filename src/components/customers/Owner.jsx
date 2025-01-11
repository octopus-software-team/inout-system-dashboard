import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";

const Owner = () => {
  const [data, setData] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    phone: "",
    branch_id: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let filteredData = data;

    if (filters.name) {
      filteredData = filteredData.filter((owner) =>
        owner.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.email) {
      filteredData = filteredData.filter((owner) =>
        owner.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }

    if (filters.phone) {
      filteredData = filteredData.filter((owner) =>
        owner.phone.includes(filters.phone)
      );
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (owner) => owner.branch_id === parseInt(filters.branch_id)
      );
    }

    return filteredData;
  };

  const filteredData = applyFilters();

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

  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      console.log("No token found, cannot fetch data.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
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
      .then((result) => {
        if (result.status === 200) {
          const owners = result.data.filter((item) => item.type === 1);
          setData(owners);
        } else {
          setError(result.msg || "Failed to fetch data.");
          toast.error(result.msg || "Failed to fetch data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching owners:", err);
        setError("Failed to fetch owners. Please try again later.");
        toast.error("Failed to fetch owners. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const confirmDelete = () => {
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
          throw new Error("Failed to delete owner.");
        }
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          toast.success(result.msg || "Owner deleted successfully.");
          setData((prevData) =>
            prevData.filter((item) => item.id !== deleteId)
          );
        } else {
          toast.error(result.msg || "Failed to delete owner.");
        }
      })
      .catch((err) => {
        console.error("Error deleting owner:", err);
        toast.error("An error occurred while deleting the owner.");
      })
      .finally(() => setIsConfirmOpen(false));
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
      cell: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row.id}
        </span>
      ),
    },
    {
      name: "Name",
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
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row.email}
        </span>
      ),
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800 dark:text-white">
          {row.phone}
        </span>
      ),
    },
    {
      name: "Branch",
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
          <Link to={`/customers/editowner/${row.id}`} className="btn1 edit1">
            <FaEdit className="mr-2" />
            Edit
          </Link>
          <button
            onClick={() => {
              setDeleteId(row.id);
              setIsConfirmOpen(true);
            }}
            className="btn1 colors1"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Owners</h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <input
          type="text"
          placeholder="Search owners..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <div>
          <Link
            to="/customers/createowner"
            className="icons bg-blue-800 text-white  mr-2 font-semibold rounded-lg "
          >
            + Create Owner
          </Link>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="icons bg-blue-800 text-white font-semibold rounded-lg"
          >
            <FaFilter className="inline-block mr-2" />
            Filter
          </button>
        </div>
      </div>

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

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No owners found.</p>
      ) : null}

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Owners</h3>
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

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this owner?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                No
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

export default Owner;