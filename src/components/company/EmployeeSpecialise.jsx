import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EmployeesSpecials = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State للتحكم في فتح وإغلاق الـ Modal
  const [filters, setFilters] = useState({
    employeeName: "", // فلتر الاسم
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getEmployeesSpecials", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        return response.json();
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data);
        } else {
          setError("Failed to load employees specials.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error loading data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters to data
  const applyFilters = () => {
    let filteredData = data;

    // Filter by employee name
    if (filters.employeeName) {
      filteredData = filteredData.filter(
        (item) => item.name === filters.employeeName
      );
    }

    return filteredData;
  };

  // Filter data based on search and filters
  const filteredData = applyFilters().filter((item) =>
    search === ""
      ? item
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (id) => {
    const selectedEmployee = data.find((employee) => employee.id === id);
    navigate(`/company/updatespecialise`, { state: selectedEmployee });
  };

  const handleDelete = async (id) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this employee?</p>
        <div className="flex justify-end mt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={() => {
              toast.dismiss();
              deleteEmployee(id);
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const deleteEmployee = async (id) => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/deleteEmployeesSpecials/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (response.ok && result.status === 200) {
        setData(data.filter((item) => item.id !== id));
        toast.success("Employee deleted successfully!");
      } else {
        setError(result.msg || "Failed to delete employee.");
      }
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError("Error deleting employee. Please try again.");
    }
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "200px",
    },
    {
      name: "Type",
      selector: (row) => (row.type === 0 ? "Engineer" : "Employee"),
      sortable: true,
      width: "200px",
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

  return (
    <div className="container mx-auto mt-5 p-4">
      <ToastContainer />

      <h2 className="text-center font-bold text-2xl mb-5">
        Employees Specials
      </h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />

        <div className="flex items-center gap-4">
          <Link
            to="/company/createSpecialise"
            className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            + Create Employee
          </Link>

          {/* زر Filter */}
          <button
            onClick={() => setIsFilterOpen(true)}
            className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300 flex items-center gap-2"
          >
            <FaFilter />
            Filter
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Filter Employees</h3>
            <div className="space-y-4">
              <label htmlFor="employeeName">Select Employee</label>
              <select
                name="employeeName"
                value={filters.employeeName}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Employees</option>
                {data.map((employee) => (
                  <option key={employee.id} value={employee.name}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-300 mr-3 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 mr-3 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No data found.</p>
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
    </div>
  );
};

export default EmployeesSpecials;