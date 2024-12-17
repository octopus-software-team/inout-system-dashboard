import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import ImportFile from "../ImportFile";
import ExportFile from "../ExportFile";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [employeeSpecials, setEmployeeSpecials] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...employees].sort((a, b) =>
        a[col].toString().toLowerCase() > b[col].toString().toLowerCase()
          ? 1
          : -1
      );
      setOrder("DSC");
    } else {
      sorted = [...employees].sort((a, b) =>
        a[col].toString().toLowerCase() < b[col].toString().toLowerCase()
          ? 1
          : -1
      );
      setOrder("ASC");
    }
    setEmployees(sorted);
    setSortedColumn(col);
  };

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

    fetch(`https://inout-api.octopusteam.net/api/front/deleteEmployee/${deleteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setEmployees((prevEmployees) => prevEmployees.filter((emp) => emp.id !== deleteId));
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

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const getBranchName = (id) => {
    const branch = branches.find((b) => b.id === id);
    return branch ? branch.name : "N/A";
  };

  const getEmployeeSpecialName = (id) => {
    const special = employeeSpecials.find((s) => s.id === id);
    return special ? special.name : "N/A";
  };

  const getGender = (gender) => {
    return gender === 0 ? "Male" : "Female";
  };

  const getType = (type) => {
    if (type == 0) {
      return "Engineer";
    } else if (type == 1) {
      return "Employee";
    } else if (type == 2) {
      return "Worker";
    } else {
      return "Other";
    }
  };
  


  return (
    <div className="container p-5 mx-auto mt-5 px-4 w-full">
      <h2 className="text-center font-bold text-3xl mb-4">Employees</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full space-y-4 md:space-y-0">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 h-10 md:w-1/2 shadow-sm text-xs"
          type="text"
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Button Container */}
        <div className="flex space-x-2 w-full md:w-auto">
          <Link
            to="/company/engineers"
            className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-full md:w-52 text-center text-xs"
          >
            + Add Employee
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-full md:w-52 text-center text-xs"
          >
            Import
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

      <div className="w-full overflow-y-auto">
        <table className="w-full bg-white dark:bg-slate-800 rounded-lg table-auto">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs">
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("id")}
                aria-sort={sortedColumn === "id" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                # {renderSortIcon("id")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("full_name")}
                aria-sort={sortedColumn === "full_name" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Full Name {renderSortIcon("full_name")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("email")}
                aria-sort={sortedColumn === "email" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Email {renderSortIcon("email")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("phone")}
                aria-sort={sortedColumn === "phone" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Phone {renderSortIcon("phone")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("branch_id")}
                aria-sort={sortedColumn === "branch_id" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Branch {renderSortIcon("branch_id")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("employee_special_id")}
                aria-sort={sortedColumn === "employee_special_id" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Specialization {renderSortIcon("employee_special_id")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("date_of_birth")}
                aria-sort={sortedColumn === "date_of_birth" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Date of Birth {renderSortIcon("date_of_birth")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("gender")}
                aria-sort={sortedColumn === "gender" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Gender {renderSortIcon("gender")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("image")}
                aria-sort={sortedColumn === "image" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Image {renderSortIcon("image")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("experience")}
                aria-sort={sortedColumn === "experience" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Experience {renderSortIcon("experience")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("contract_start_date")}
                aria-sort={sortedColumn === "contract_start_date" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Contract Start {renderSortIcon("contract_start_date")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("contract_duration")}
                aria-sort={sortedColumn === "contract_duration" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Contract Duration {renderSortIcon("contract_duration")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("contract_end_date")}
                aria-sort={sortedColumn === "contract_end_date" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Contract End {renderSortIcon("contract_end_date")}
              </th>
              <th
                className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                onClick={() => sorting("type")}
                aria-sort={sortedColumn === "type" ? (order === "ASC" ? "ascending" : "descending") : "none"}
              >
                Type {renderSortIcon("type")}
              </th>
              <th className="px-2 py-1 text-left font-semibold border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter((employee) => {
                return search.toLowerCase() === ""
                  ? employee
                  : employee.full_name
                      .toLowerCase()
                      .includes(search.toLowerCase());
              })
              .map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-200 text-xs"
                >
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.id}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                    {d.full_name}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                    {d.email}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.phone}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {getBranchName(d.branch_id)}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                    {getEmployeeSpecialName(d.employee_special_id)}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.date_of_birth}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {getGender(d.gender)}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    <img
                      src={d.image}
                      alt={d.full_name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                    {d.experience}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.contract_start_date}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.contract_duration} months
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {d.contract_end_date}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    {getType(d.type)}
                  </td>
                  <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                    <div className="flex space-x-1">
                      <Link
                        to={`/company/view/${d.id}`}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-opacity-85 flex items-center"
                      >
                        <FaEye className="mr-1" />
                        View
                      </Link>
                      <Link
                        to={`/company/editemp/${d.id}`}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center"
                      >
                        <FaEdit className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => openConfirmModal(d.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this employee?</p>
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

      {/* Toast Notifications */}
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
