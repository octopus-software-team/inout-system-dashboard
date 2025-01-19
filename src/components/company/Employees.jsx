import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import ImportFile from "../ImportFile";
import ExportFile from "../ExportFile";
import DataTable from "react-data-table-component";
import { Input } from "antd";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employeeSpecials, setEmployeeSpecials] = useState([]);
  const [search, setSearch] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    branch_id: "",
    employee_special_id: "",
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const tableName = "employees";

  // Fetch employees
  const fetchEmployees = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getEmployees",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employees.");
      }
      const data = await response.json();
      if (data.status === 200) {
        setEmployees(data.data);
      } else {
        console.error("Error fetching employees:", data.msg);
        toast.error(data.msg || "Failed to fetch employees.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching employees.");
    }
  };

  // Fetch branches
  const fetchBranches = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getBranches",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch branches.");
      }
      const data = await response.json();
      if (data.status === 200) {
        setBranches(data.data);
      } else {
        console.error("Error fetching branches:", data.msg);
        toast.error(data.msg || "Failed to fetch branches.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching branches.");
    }
  };

  // Fetch employee specials
  const fetchEmployeeSpecials = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getEmployeesSpecials",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch employee specials.");
      }
      const data = await response.json();
      if (data.status === 200) {
        setEmployeeSpecials(data.data);
      } else {
        console.error("Error fetching employee specials:", data.msg);
        toast.error(data.msg || "Failed to fetch employee specials.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while fetching employee specials.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchBranches();
    fetchEmployeeSpecials();
  }, []);

  // Handle delete confirmation
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
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
      `https://inout-api.octopusteam.net/api/front/deleteEmployee/${deleteId}`,
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
          setEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp.id !== deleteId)
          );
          toast.success(data.msg || "Employee deleted successfully.");
        } else {
          toast.error(data.msg || "Failed to delete employee.");
        }
      })
      .catch((error) => {
        console.error("Error deleting employee:", error);
        toast.error("Failed to delete the employee. Please try again.");
      })
      .finally(() => {
        closeConfirmModal();
      });
  };

  // Get branch name by ID
  const getBranchName = (id) => {
    const branch = branches.find((b) => b.id === id);
    return branch ? branch.name : "N/A";
  };

  // Get employee special name by ID
  const getEmployeeSpecialName = (id) => {
    const special = employeeSpecials.find((s) => s.id === id);
    return special ? special.name : "N/A";
  };

  // Get gender text
  const getGender = (gender) => {
    return gender === 0 ? "Male" : "Female";
  };

  // Get employee type text
  const getType = (type) => {
    if (type === 0) {
      return "Engineer";
    } else if (type === 1) {
      return "Employee";
    } else if (type === 2) {
      return "Worker";
    } else {
      return "Other";
    }
  };

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
    let filteredData = employees;

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (emp) => emp.branch_id === parseInt(filters.branch_id)
      );
    }

    if (filters.employee_special_id) {
      filteredData = filteredData.filter(
        (emp) =>
          emp.employee_special_id === parseInt(filters.employee_special_id)
      );
    }

    return filteredData;
  };

  // Filter data based on search and filters
  const filteredData = applyFilters().filter((emp) =>
    search === ""
      ? emp
      : emp.full_name.toLowerCase().includes(search.toLowerCase())
  );

  // Handle export file
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

  // Table columns
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "80px",
    },
    {
      name: "Image",
      width: "100px",
      cell: (row) => (
        <img
          src={row.image}
          alt={row.full_name}
          className="w-12 h-12 object-cover rounded"
        />
      ),
    },
    {
      name: "Name",
      selector: (row) => row.full_name,
      sortable: true,
      width: "80px",
    },
    {
      name: "Branch",
      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
      width: "90px",
    },
    {
      name: "Specialization",
      selector: (row) => getEmployeeSpecialName(row.employee_special_id),
      sortable: true,
      width: "90px",
    },
    {
      name: "Date of Birth",
      selector: (row) => row.date_of_birth,
      sortable: true,
      width: "100px",
    },
    {
      name: "Type",
      selector: (row) => getType(row.type),
      sortable: true,
      width: "90px",
    },
    {
      name: "Grade",
      selector: (row) => row.grade || "N/A", // عرض الـ grade أو "N/A" إذا كان null
      sortable: true,
      width: "70px",
    },
    {
      name: "Nationality",
      selector: (row) => row.nationality || "N/A", // عرض الـ nationality أو "N/A" إذا كان null
      sortable: true,
      width: "100px",
    },
    {
      name: "Code",
      selector: (row) => row.code || "N/A", // عرض الـ code أو "N/A" إذا كان null
      sortable: true,
      width: "100px",
    },
    {
      name: "QR Code",
      width: "100px", // زيادة العرض لاستيعاب النص
      cell: (row) => (
        <div className="flex flex-col items-center">
          {row.qrcode ? (
            <div
              className="svg1"
              dangerouslySetInnerHTML={{ __html: row.qrcode }}
            />
          ) : (
            "No QR Code"
          )}
          {row.serial_number && (
            <p className="mt-2 text-sm text-gray-600">
               {row.serial_number}
            </p>
          )}
        </div>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex">
          <Link to={`/company/view/${row.id}`} className="eye1 mr-2">
            <FaEye />
            View
          </Link>
          <Link to={`/company/editemp/${row.id}`} className="edit1 mr-2">
            <FaEdit />
            Edit
          </Link>
          <button
            onClick={() => openConfirmModal(row.id)}
            className="colors1 mr-2"
          >
            <FaTrash />
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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="container p-5 mx-auto mt-5 px-4 w-full">
      <h2 className="text-center font-bold text-3xl mb-4">Employees</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        {/* <FaSearch className="ml-2 text-gray-500" /> */}

        <div className="flex space-x-2 w-full md:w-auto">
          <Link
            to="/company/engineers"
            className="icons bg-blue-800 text-white font-semibold  rounded-lg transition duration-300 flex items-center"
          >
            + Add Employee
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="icons bg-blue-800 text-white  rounded-lg transition duration-300 flex items-center"
          >
            Import
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="icons bg-blue-800 text-white  rounded-lg transition duration-300 flex items-center"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <button
            onClick={handleExportFile}
            className="icons bg-blue-800 text-white  rounded-lg flex items-center"
          >
            Export
          </button>
        </div>

        {open && (
          <div
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-[350px] h-[350px] bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center text-xl font-semibold mb-4">
                Import File
              </h2>
              <div className="flex flex-col items-center space-y-4">
                <ImportFile tableName="employees" />
                <ExportFile tableName="employees" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      /> */}

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
        className="rounded-lg overflow-hidden"
      />

      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Filter Employees</h3>
            <div className="space-y-4">
              <label htmlFor="">select branch</label>

              <select
                name="branch_id"
                value={filters.branch_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <label htmlFor="">select employee special </label>

              <select
                name="employee_special_id"
                value={filters.employee_special_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {employeeSpecials.map((special) => (
                  <option key={special.id} value={special.id}>
                    {special.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-300 mr-2 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
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
            <p className="mb-6">
              Are you sure you want to delete this employee?
            </p>
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

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default Employees;
