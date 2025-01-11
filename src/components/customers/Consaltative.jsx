import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";

const Consultative = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    phone: "",
    branch_id: "",
  });
  const navigate = useNavigate();

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

  // Fetch consultative data
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setData(res.data);
        } else {
          alert("No data found in the response.");
        }
      })
      .catch((err) => console.error("Error fetching consultative data:", err));
  }, []);

  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch";
  };

  // Handle delete
  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // Using Toast for confirmation
    const confirmToast = toast(
      <div>
        <p>Do you like to delete?</p>
        <div className="flex space-x-2 justify-end mt-2">
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

  // Confirm delete
  const handleConfirmDelete = (id, token, confirmToast) => {
    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteProjectConsultive/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        toast.success("Record deleted successfully.");
        setData((prevData) => prevData.filter((item) => item.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((err) => {
        console.error("Error deleting consultative:", err);
        toast.error("Failed to delete the record.");
        toast.dismiss(confirmToast);
      });
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters
  const applyFilters = () => {
    let filteredData = data;

    if (filters.name) {
      filteredData = filteredData.filter((consultive) =>
        consultive.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.phone) {
      filteredData = filteredData.filter((consultive) =>
        consultive.phone.includes(filters.phone)
      );
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (consultive) => consultive.branch_id === parseInt(filters.branch_id)
      );
    }

    return filteredData;
  };

  // Filter data based on search and filters
  const filteredData = applyFilters().filter((consultive) =>
    search === ""
      ? consultive
      : consultive.name.toLowerCase().includes(search.toLowerCase())
  );

  // Define columns for the table
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <Link
            to={`/customers/editconsultive/${row.id}`}
            className="edit1 py-1 px-3 rounded-lg"
          >
            <FaEdit className="inline mr-1" />
            Edit
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
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
      width: "150px",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-gray-800">
        Consultatives
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <div>
          <Link
            to="/customers/createconsultive"
            className="icons text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg mr-2"
          >
            + Create Consultive
          </Link>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="icons text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg"
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
        defaultSortField="id"
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        className="shadow-lg rounded-lg overflow-hidden"
      />

      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Consultives</h3>
            <div className="space-y-4">
            <label htmlFor="">select branch </label>

            
              <select
                name="branch_id"
                value={filters.branch_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
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

export default Consultative;