import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";

const ShowAllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    employee_id: "",
    status: "",
  });

  const navigate = useNavigate();

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const token = Cookies.get("token");
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getEmployees",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.status === 200 && Array.isArray(data.data)) {
        setEmployees(data.data);
      } else {
        toast.error("Failed to load employees.");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to load employees.");
    }
  };

  // Fetch Tasks
  const fetchTasks = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://inout-api.octopusteam.net/api/front/getTasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resData = await res.json();
      if (resData && resData.data) {
        setTasks(resData.data);
      } else {
        setError("No data found in the response");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to fetch tasks. Please try again later.");
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Employees and Tasks on component mount
  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

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
    let filteredData = tasks;

    if (filters.employee_id) {
      filteredData = filteredData.filter(
        (task) => task.employee_id === parseInt(filters.employee_id)
      );
    }

    if (filters.status) {
      filteredData = filteredData.filter(
        (task) => task.status === parseInt(filters.status)
      );
    }

    return filteredData;
  };

  // Apply Search
  const filteredData = applyFilters().filter((task) =>
    search === ""
      ? task
      : task.name.toLowerCase().includes(search.toLowerCase())
  );

  // Columns for DataTable
  const columns = [
    {
      name: "#",
      className: "tdt",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Task Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Start Date",
      selector: (row) => row.start_date,
      sortable: true,
    },
    {
      name: "End Date",
      selector: (row) => row.end_date,
      sortable: true,
    },
    {
      name: "Employee Name",
      selector: (row) => {
        const employee = employees.find((emp) => emp.id === row.employee_id);
        return employee ? employee.full_name : "N/A";
      },
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => {
        switch (row.status) {
          case 0:
            return "Urgent";
          case 1:
            return "High";
          case 2:
            return "Low";
          default:
            return "N/A";
        }
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/todo/updatetask/${row.id}`)}
            className="edit1"
          >
            <FaEdit className="" />
            Edit
          </button>
          <button onClick={() => openConfirmModal(row.id)} className="colors1">
            <FaTrash className="" />
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

  // Handle Search
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Confirm Delete Modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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
      `https://inout-api.octopusteam.net/api/front/deleteTask/${deleteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setTasks((prevData) =>
            prevData.filter((task) => task.id !== deleteId)
          );
          toast.success(data.msg || "Task deleted successfully.");
        } else {
          toast.error("Failed to delete task.");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task. Please try again.");
      })
      .finally(() => {
        closeConfirmModal();
      });
  };

  return (
    <div className="container mt-5">
      <ToastContainer />

      <h2 className="text-center font-bold text-3xl text-black">
        Show All Tasks
      </h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search ..."
            value={search}
            onChange={handleSearch}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          {/* <FaSearch className="ml-2 text-gray-500" /> */}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-blue-800 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-700 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tasks found.</p>
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

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Tasks</h3>
            <div className="space-y-4">
              <label htmlFor="">select employe </label>

              <select
                name="employee_id"
                value={filters.employee_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.full_name}
                  </option>
                ))}
              </select>
              <label htmlFor="">select status </label>

              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                <option value="0">Urgent</option>
                <option value="1">High</option>
                <option value="2">Low</option>
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllTask;
