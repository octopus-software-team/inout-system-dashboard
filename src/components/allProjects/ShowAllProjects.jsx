import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaProjectDiagram, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShowAllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping Dictionaries
  const [branches, setBranches] = useState({});
  const [owners, setOwners] = useState({});
  const [customers, setCustomers] = useState({});
  const [engineers, setEngineers] = useState({});

  // Status Mapping
  const STATUS_MAPPING = {
    0: "Pending",
    1: "In Review",
    2: "In Progress",
    3: "Under Testing",
    4: "Needs Changes",
    5: "Review Changes",
    6: "Approved",
    7: "Rejected",
    8: "Completed",
    9: "Archived",
    10: "Cancelled",
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
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

        const fetchedProjects = projectsData.data;

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

        const branchesMap = {};
        branchesData.data.forEach((branch) => {
          branchesMap[branch.id] = branch.name;
        });
        setBranches(branchesMap);

        // Fetch Owners
        const ownersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getOwners",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const ownersData = await ownersResponse.json();

        if (ownersData.status !== 200) {
          throw new Error(ownersData.msg || "Failed to fetch owners.");
        }

        const ownersMap = {};
        ownersData.data.forEach((owner) => {
          ownersMap[owner.id] = owner.name;
        });
        setOwners(ownersMap);

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

        if (customersData.status !== 200) {
          throw new Error(customersData.msg || "Failed to fetch customers.");
        }

        const customersMap = {};
        customersData.data.forEach((customer) => {
          customersMap[customer.id] = customer.name;
        });
        setCustomers(customersMap);

        // Fetch Engineers
        const engineersResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEngineers",
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

        const engineersMap = {};
        engineersData.data.forEach((engineer) => {
          engineersMap[engineer.id] = engineer.full_name;
        });
        setEngineers(engineersMap);

        const mappedProjects = fetchedProjects.map((project) => ({
          ...project,
          branchName: branchesMap[project.branch_id] || "Unknown",
          ownerName: ownersMap[project.project_owner_id] || "Unknown",
          customerName:
            customersMap[project.customer_constructor_id] || "Unknown",
          engineerName:
            engineersMap[project.inspection_engineer_id] || "Unknown",
          statusText: STATUS_MAPPING[project.status] || "Unknown",
        }));

        setProjects(mappedProjects);
      } catch (err) {
        console.error(err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewClick = (projectId) => {
    navigate(`/allprojects/addreport`);
  };

  const handleReportClick = (projectId) => {
    navigate(`/allprojects/addrepo`);
  };

  // Sorting
  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...projects].sort((a, b) =>
        a[col].toString().toLowerCase() > b[col].toString().toLowerCase()
          ? 1
          : -1
      );
      setOrder("DSC");
    } else {
      sorted = [...projects].sort((a, b) =>
        a[col].toString().toLowerCase() < b[col].toString().toLowerCase()
          ? 1
          : -1
      );
      setOrder("ASC");
    }
    setProjects(sorted);
    setSortedColumn(col);
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleDelete = (id) => {
    toast(
      ({ closeToast }) => (
        <div>
          <p>Are You Sure You want to delete this project</p>
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
    const token = localStorage.getItem("token");

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
        toast.success(res.msg || "تم حذف المشروع بنجاح.");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
      } else {
        toast.error(`فشل في حذف المشروع: ${res.msg || "خطأ غير معروف"}`);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("فشل في حذف المشروع. الرجاء المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="container mx-auto mt-5 px-4 w-full">
      <h2 className="text-center font-bold text-xl mb-4">Show All Projects</h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-4 w-full">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 md:w-1/2 shadow-sm text-xs"
          type="text"
          placeholder="Search projects by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <Link
          to="/allprojects/addproject"
          className="mt-2 md:mt-0 bg-slate-500 text-white font-semibold py-1 px-3 rounded hover:bg-slate-700 w-96 md:w-1/6 text-center text-xs"
        >
          +Add Project
        </Link> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-white dark:bg-slate-800 rounded-lg table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs">
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("id")}
                >
                  ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("name")}
                >
                  Name {renderSortIcon("name")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("inspection_date")}
                >
                  Inspection Date {renderSortIcon("inspection_date")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("statusText")}
                >
                  Status {renderSortIcon("statusText")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("branchName")}
                >
                  Branch {renderSortIcon("branchName")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("ownerName")}
                >
                  Owner {renderSortIcon("ownerName")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("customerName")}
                >
                  Customer {renderSortIcon("customerName")}
                </th>
                <th
                  className="px-2 py-1 text-left font-semibold border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("engineerName")}
                >
                  Engineer {renderSortIcon("engineerName")}
                </th>
                <th className="px-2 py-1 text-left font-semibold border-b border-gray-300">
                  Notes
                </th>
                <th className="px-2 py-1 text-left font-semibold border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects
                .filter((project) => {
                  return search.toLowerCase() === ""
                    ? true
                    : project.name.toLowerCase().includes(search.toLowerCase());
                })
                .map((project, index) => (
                  <tr
                    key={project.id}
                    className={`hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-200 text-xs ${
                      index % 2 === 0
                        ? "bg-white dark:bg-slate-800"
                        : "bg-gray-50 dark:bg-slate-700"
                    }`}
                  >
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.id}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                      {project.name}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.inspection_date}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.statusText}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.branchName}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.ownerName}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.customerName}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      {project.engineerName}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white break-words">
                      {project.notes}
                    </td>
                    <td className="px-2 py-1 border-b border-gray-200 dark:border-slate-700 dark:text-white">
                      <div className="flex space-x-1">
                        <Link
                          to={`/allprojects/updateprojects/${project.id}`}
                          className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 flex items-center text-xs"
                        >
                          <FaEdit className="mr-1" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 flex items-center text-xs"
                        >
                          <FaTrash className="mr-1" />
                          Delete
                        </button>
                        <button
                          onClick={() => handleViewClick(project.id)}
                          className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex items-center text-xs"
                        >
                          <FaEye className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => handleReportClick(project.id)}
                          className="bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700 flex items-center text-xs"
                        >
                          <FaProjectDiagram className="mr-1" />
                          Add Report
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ShowAllProjects;
