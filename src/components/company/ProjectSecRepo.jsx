import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaFilter } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";

const AddSecRepo = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    project_id: "",
    report_type: "",
  });
  const [search, setSearch] = useState(""); // State for search

  const navigate = useNavigate();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.log("No token found, cannot fetch projects.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getProjects",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        setProjects(result.data || []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.error("Token expired");
        setError("No token found. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getProjectReports",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        setData(result.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

    if (filters.project_id) {
      filteredData = filteredData.filter(
        (item) => item.project_id === parseInt(filters.project_id)
      );
    }

    if (filters.report_type) {
      filteredData = filteredData.filter(
        (item) => item.report_type === filters.report_type
      );
    }

    return filteredData;
  };

  // Handle search
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Apply search to filtered data
  const filteredData = applyFilters().filter((item) =>
    search === ""
      ? item
      : item.report_type.toLowerCase().includes(search.toLowerCase()) ||
        (projects.find((p) => p.id === item.project_id)?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase())
  );

  // Handle Edit
  const handleEdit = (id) => {
    const report = data.find((item) => item.id === id);
    navigate(`/company/editsecrepo/${id}`, { state: { report } });
  };

  // Handle Delete
  const handleDelete = (id) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this report?</p>
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
    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteProjectReport/${id}`,
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
          throw new Error("Failed to delete report.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Report deleted successfully.");
        setData(data.filter((report) => report.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((error) => {
        console.error("Error deleting report:", error);
        toast.error("Failed to delete the report. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  // تعريف أعمدة الجدول
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.id}</span>
      ),
    },
    {
      name: "Project Name",
      width: "120px",
      selector: (row) => {
        const project = projects.find((p) => p.id === row.project_id);
        return project ? project.name : "N/A";
      },
      sortable: true,
      cell: (row) => {
        const project = projects.find((p) => p.id === row.project_id);
        return (
          <span className="font-medium text-gray-800">
            {project ? project.name : "N/A"}
          </span>
        );
      },
    },
    {
      name: "Report Type",
      selector: (row) => row.report_type,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.report_type}</span>,
    },
    {
      name: "Report Stock",
      selector: (row) => row.report_stock,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.report_stock}</span>,
    },
    {
      name: "Is Inspection",
      selector: (row) => (row.is_inspection ? "Yes" : "No"),
      sortable: true,
      width: "120px",
      cell: (row) => (
        <span className="text-gray-700">
          {row.is_inspection ? "Yes" : "No"}
        </span>
      ),
    },
    {
      name: "Report",
      selector: (row) => row.report,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.report}</span>,
    },
    {
      name: "Employee",
      selector: (row) => row.employee,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.employee}</span>,
    },
  
    {
      name: "Edited At",
      selector: (row) => row.edit_at,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.edit_at}</span>,
    },
    {
      name: "Admin",
      selector: (row) => row.admin,
      sortable: true,
      width: "120px",
      cell: (row) => <span className="text-gray-700">{row.admin || "N/A"}</span>,
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
      width: "150px",
    },
  ];
  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">
        Project Report
      </h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-blue-800 text-white py-2 px-4 rounded transition duration-200"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <Link
            to="/company/createsecrepo"
            className="icons flex items-center bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            + Create Project Report
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-700 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No reports found.</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData} // البيانات المصفاة
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
            <h3 className="text-xl font-bold mb-4">Filter Reports</h3>
            <div className="space-y-4">
              <label htmlFor="">select project</label>
              <select
                name="project_id"
                value={filters.project_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <label className="mt-3" htmlFor="">
                Select Report Type
              </label>
              <select
                name="report_type"
                value={filters.report_type}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
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

export default AddSecRepo;
