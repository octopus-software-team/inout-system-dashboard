import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaProjectDiagram, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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

        // Map Projects with Mapped Data
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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (confirmDelete) {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }

      fetch(`https://inout-api.octopusteam.net/api/front/deleteProject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((res) => {
          if (res.status === 200) {
            alert("Project deleted successfully!");
            setProjects((prevProjects) =>
              prevProjects.filter((project) => project.id !== id)
            );
          } else {
            alert(`Failed to delete project: ${res.msg || "Unknown error"}`);
          }
        })
        .catch((err) => {
          console.error("Error deleting project:", err);
          alert("Failed to delete project. Please try again.");
        });
    }
  };

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-50 p-8 flex flex-col items-center">
      <h2 className="text-center font-bold text-3xl mb-8 text-gray-800">
        Show All Projects
      </h2>

      <div className="w-full flex justify-center mb-6">
        <input
          className="border dark:bg-slate-950  border-gray-300  rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-1/2 shadow-sm"
          type="text"
          placeholder="Search projects by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
        <div className="w-full max-w-7xl mx-auto bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full border border-gray-200 bg-white rounded-lg text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("id")}
                >
                  ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("name")}
                >
                  Name {renderSortIcon("name")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("inspection_date")}
                >
                  Inspection Date {renderSortIcon("inspection_date")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("statusText")}
                >
                  Status {renderSortIcon("statusText")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("branchName")}
                >
                  Branch {renderSortIcon("branchName")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("ownerName")}
                >
                  Owner {renderSortIcon("ownerName")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("customerName")}
                >
                  Customer {renderSortIcon("customerName")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 cursor-pointer whitespace-nowrap"
                  onClick={() => sorting("engineerName")}
                >
                  Engineer {renderSortIcon("engineerName")}
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold border-b border-gray-200 whitespace-nowrap">
                  Notes
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold border-b border-gray-200 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects
                .filter((project) => {
                  return search.toLowerCase() === ""
                    ? true
                    : project.name.toLowerCase().includes(search.toLowerCase());
                })
                .map((project, index) => (
                  <tr
                    key={project.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition duration-200`}
                  >
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.id}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.name}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.inspection_date}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.statusText}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.branchName}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.ownerName}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.customerName}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.engineerName}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      {project.notes}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 overflow-x-auto flex-nowrap max-w-sm">
                        <button
                          onClick={() =>
                            navigate(
                              `/allprojects/updateprojects/${project.id}`
                            )
                          }
                          className="bg-green-600 text-white font-semibold py-2 px-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <FaEdit />
                            <span>Edit</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="bg-red-600 text-white font-semibold py-2 px-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                        >
                          <div className="flex items-center gap-1">
                            <FaTrash />
                            <span>Delete</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleViewClick(project.id)}
                          className="bg-blue-500 text-white font-semibold py-2 px-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
                        >
                          <div className="flex items-center gap-1">
                            <FaEye />
                            <span>View</span>
                          </div>
                        </button>
                        <button
                          onClick={() => handleReportClick(project.id)}
                          className="bg-gray-600 text-white font-semibold py-2 px-1 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                        >
                          <div className="flex items-center gap-1">
                            <FaProjectDiagram />
                            <span>Add Report</span>
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ShowAllProjects;
