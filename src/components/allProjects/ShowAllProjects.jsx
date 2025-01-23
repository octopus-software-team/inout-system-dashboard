import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { Input } from "antd";

const ShowAllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [engineers, setEngineers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    inspection_engineer_id: "",
    customer_constructor_id: "",
    project_owner_id: "",
    branch_id: "",
  });

  const [services, setServices] = useState([]); // إضافة services إلى الحالة
  const [consultives, setConsultives] = useState([]); // إضافة consultives إلى الحالة

  const navigate = useNavigate();

  const statusStyles = {
    0: "text-yellow-600 bg-yellow-100", // Not Started
    2: "text-blue-600 bg-blue-100", // In Progress
    4: "text-green-600 bg-green-100", // Completed
    6: "text-yellow-600 bg-yellow-100", // Pending
    8: "text-purple-600 bg-purple-100", // Under Review
    10: "text-red-600 bg-red-100", // Cancelled
  };

  // Status Mapping
  const STATUS_MAPPING = {
    0: "Not Started",
    2: "In Progress",
    4: "Completed",
    6: "Pending",
    8: "Under Review",
    10: "Cancelled",
  };

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setError("You are not authenticated. Please log in.");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch Projects
        const projectsResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getProjects",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const projectsData = await projectsResponse.json();

        if (projectsData.status !== 200) {
          throw new Error(projectsData.msg || "Failed to fetch projects.");
        }

        // Fetch Branches
        const branchesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const branchesData = await branchesResponse.json();

        if (branchesData.status !== 200) {
          throw new Error(branchesData.msg || "Failed to fetch branches.");
        }

        // Fetch Engineers (type === 0)
        const engineersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployees",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const engineersData = await engineersResponse.json();

        if (engineersData.status !== 200) {
          throw new Error(engineersData.msg || "Failed to fetch engineers.");
        }

        // Fetch Customers (type === 0)
        const customersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const customersData = await customersResponse.json();

        if (customersData.status !== 200) {
          throw new Error(customersData.msg || "Failed to fetch customers.");
        }

        // Fetch Owners (type === 1)
        const ownersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const ownersData = await ownersResponse.json();

        if (ownersData.status !== 200) {
          throw new Error(ownersData.msg || "Failed to fetch owners.");
        }

        // Set Data
        setProjects(projectsData.data);
        setBranches(branchesData.data);
        setEngineers(engineersData.data.filter((emp) => emp.type === 0));
        setCustomers(customersData.data.filter((cust) => cust.type === 0));
        setOwners(ownersData.data.filter((owner) => owner.type === 1));
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
        toast.error(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      try {
        // Fetch Services
        const servicesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getServices",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const servicesData = await servicesResponse.json();
        if (servicesData.status === 200) {
          setServices(servicesData.data);
        }
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      try {
        // Fetch Customers
        const customersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCustomers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const customersData = await customersResponse.json();
        if (customersData.status === 200) {
          setCustomers(customersData.data.filter((cust) => cust.type === 0)); // العملاء العاديون (type === 0)
          setConsultives(customersData.data.filter((cust) => cust.type === 2)); // الاستشاريون (type === 2)
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
      }
    };

    fetchData();
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
    let filteredData = projects;

    if (filters.status) {
      filteredData = filteredData.filter(
        (project) => project.status === parseInt(filters.status)
      );
    }

    if (filters.inspection_engineer_id) {
      filteredData = filteredData.filter(
        (project) =>
          project.inspection_engineer_id ===
          parseInt(filters.inspection_engineer_id)
      );
    }

    if (filters.customer_constructor_id) {
      filteredData = filteredData.filter(
        (project) =>
          project.customer_constructor_id ===
          parseInt(filters.customer_constructor_id)
      );
    }

    if (filters.project_owner_id) {
      filteredData = filteredData.filter(
        (project) =>
          project.project_owner_id === parseInt(filters.project_owner_id)
      );
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (project) => project.branch_id === parseInt(filters.branch_id)
      );
    }

    return filteredData;
  };

  // Apply Search
  const filteredData = applyFilters().filter((project) =>
    search === ""
      ? project
      : project.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    console.log(filteredData);
  }, [filteredData]);

  // Columns for DataTable
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
      width: "100px",
    },
    // {
    //   name: "Inspection Date",
    //   selector: (row) => row.inspection_date,
    //   sortable: true,
    //   width: "90px",
    // },
    {
      name: "Status",
      selector: (row) => STATUS_MAPPING[row.status] || "Unknown",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <span
          className={`px-2 py-1 rounded-lg text-sm font-semibold ${
            statusStyles[row.status]
          }`}
        >
          {STATUS_MAPPING[row.status]}
        </span>
      ),
    },
    {
      name: "Branch",
      width: "150px",

      selector: (row) => {
        const branch =
          branches && branches?.find((b) => b.id === row.branch_id);
        return branch ? branch.name : "Unknown";
      },
      sortable: true,
    },
    {
      name: "Owner",
      width: "150px",

      selector: (row) => {
        const owner =
          owners && owners?.find((o) => o.id === row.project_owner_id);
        return owner ? owner.name : "Unknown";
      },
      sortable: true,
    },
    {
      name: "Customer",
      width: "150px",

      selector: (row) => {
        const customer =
          customers &&
          customers?.find((c) => c.id == row.customer_constructor_id);
        return customer ? customer.name : "Unknown";
      },
      sortable: true,
    },

    // {
    //   name: "Engineer",
    //   width: "90px",

    //   selector: (row) => {
    //     const engineer = engineers.find(
    //       (e) => e.id === row.inspection_engineer_id
    //     );
    //     return engineer ? engineer.full_name : "Unknown";
    //   },
    //   sortable: true,
    // },
    // {
    //   name: "Notes",
    //   width: "90px",

    //   selector: (row) => row.notes || "N/A",
    //   sortable: true,
    // },
    // {
    //   name: "Inspection Time",
    //   width: "90px",

    //   selector: (row) => row.inspection_time || "N/A",
    //   sortable: true,
    // },
    // {
    //   name: "Services",
    //   width: "90px",

    //   selector: (row) =>
    //     row.services
    //       ? row.services
    //           .map((s) => {
    //             const service = services.find(
    //               (service) => service.id === s.service_id
    //             );
    //             return service ? service.name : "Unknown";
    //           })
    //           .join(", ")
    //       : "None",
    //   sortable: true,
    // },
    // {
    //   name: "Consultives",
    //   width: "90px",

    //   selector: (row) =>
    //     row.consultive
    //       ? row.consultive
    //           .map((c) => {
    //             const consultive = consultives.find(
    //               (consultive) => consultive.id === c.consultive_id
    //             );
    //             return consultive ? consultive.name : "Unknown";
    //           })
    //           .join(", ")
    //       : "None",
    //   sortable: true,
    // },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/allprojects/updateprojects/${row.id}`)}
            className="edit1"
          >
            <FaEdit className="" />
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="colors1">
            <FaTrash className="" />
            Delete
          </button>
          <button
            onClick={() => navigate(`/allprojects/addreport/${row.id}`)}
            className="eye1"
          >
            <FaEye className="" />
            View
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "500px",
    },
  ];

  // Handle Search
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  // Handle Delete
  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are you sure you want to delete this project?</p>
          <div className="flex space-x-2 mt-2">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => {
                performDelete(id);
                closeToast();
              }}
            >
              YES
            </button>
            <button
              className="bg-gray-500 text-white px-3 py-1 rounded"
              onClick={() => {
                closeToast();
              }}
            >
              NO
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const performDelete = async (id) => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/deleteProject/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await response.json();

      if (res.status === 200) {
        toast.success(res.msg || "Project deleted successfully.");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } else {
        toast.error(`Failed to delete project: ${res.msg || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <ToastContainer />

      <h2 className="text-center font-bold text-3xl text-black">
        Show All Projects
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
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
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
            <h3 className="text-xl font-bold mb-4">Filter Projects</h3>
            <div className="space-y-4">
              {/* فلتر الحالة (Status) */}
              <label htmlFor="">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {Object.entries(STATUS_MAPPING).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>

              {/* فلتر الفروع (Branches) */}
              <label htmlFor="">Branch</label>
              <select
                name="branch_id"
                value={filters.branch_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </div>
  );
};

export default ShowAllProjects;
