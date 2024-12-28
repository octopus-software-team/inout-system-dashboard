import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net"; // DataTables JS

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
  const [servicesMap, setServicesMap] = useState({});
  const [consultivesMap, setConsultivesMap] = useState({});

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

  const tableRef = useRef(null);
  const dataTable = useRef(null);

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
          "https://inout-api.octopusteam.net/api/front/getCustomers",
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

        // Fetch Services
        const servicesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getServices",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const serviceData = await servicesResponse.json();

        if (serviceData.status !== 200) {
          throw new Error(serviceData.msg || "Failed to fetch services.");
        }

        // Convert Services to Map
        const tempServicesMap = {};
        serviceData.data.forEach((service) => {
          tempServicesMap[service.id] = service.name;
        });
        setServicesMap(tempServicesMap);

        // Fetch Consultives (Customers of type 2)
        const consultivesMapTemp = {};
        customersData.data
          .filter((customer) => customer.type === 2)
          .forEach((consultive) => {
            consultivesMapTemp[consultive.id] = consultive.name;
          });
        setConsultivesMap(consultivesMapTemp);

        // Map Projects with Additional Fields
        const mappedProjects = fetchedProjects.map((project) => ({
          ...project,
          branchName: branchesMap[project.branch_id] || "Unknown",
          ownerName: ownersMap[project.project_owner_id] || "Unknown",
          customerName:
            customersMap[project.customer_constructor_id] || "Unknown",
          engineerName:
            engineersMap[project.inspection_engineer_id] || "Unknown",
          services: project.services
            ? project.services
                .map((s) => tempServicesMap[s.service_id] || "Unknown")
                .join(", ")
            : "None",
          consultives: project.consultive
            ? project.consultive
                .map((c) => consultivesMapTemp[c.consultive_id] || "Unknown")
                .join(", ")
            : "None",
          statusText: STATUS_MAPPING[project.status] || "Unknown",
          notes: project.notes || "N/A",
          inspectionTime: project.inspection_time || "N/A",
        }));

        setProjects(mappedProjects);
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

  // Initialize DataTable
  useEffect(() => {
    if (!isLoading && projects.length > 0) {
      // Initialize DataTable
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
          ordering: true,
          language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
              first: "First",
              last: "Last",
              next: "Next",
              previous: "Previous",
            },
          },
          // Prevent ordering on the Actions column
          columnDefs: [
            { orderable: false, targets: -1 },
          ],
        });
      } else {
        // If DataTable already initialized, just update the data
        dataTable.current.clear();
        dataTable.current.rows.add(projects);
        dataTable.current.draw();
      }
    }

    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
        dataTable.current = null;
      }
    };
  }, [projects, isLoading]);

  const handleViewClick = (projectId) => {
    navigate(`/allprojects/addreport/${projectId}`);
  };

  const handleReportClick = (projectId) => {
    navigate(`/allprojects/addrepo/${projectId}`);
  };

  // Sorting - This can be handled by DataTables, so you might consider removing this logic to avoid conflicts
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
        toast.success(res.msg || "تم حذف المشروع بنجاح.");
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.id !== id)
        );
        // Remove the deleted row from DataTable
        if (dataTable.current) {
          dataTable.current
            .row(`#project-${id}`)
            .remove()
            .draw();
        }
      } else {
        toast.error(`فشل في حذف المشروع: ${res.msg || "خطأ غير معروف"}`);
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("فشل في حذف المشروع. الرجاء المحاولة مرة أخرى.");
    }
  };

  const tableName = "projects"; // تحديد اسم الجدول

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
      toast.error("فشل في تصدير الملف. الرجاء المحاولة مرة أخرى.");
    }
  };

  return (
    <div className="container mx-auto mt-5 px-4 w-full">
      <h2 className="text-center font-bold text-gray-900 dark:text-white text-xl mb-4">
        Show All Projects
      </h2>

      <div className="flex flex-col md:flex-row justify-end items-center mb-4">
        
        {/* <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg p-3 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-xs md:w-1/2 w-96 lg:!w-[600px]"
          type="text"
          placeholder="Search projects by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        /> */}
        <button
          onClick={handleExportFile}
          className="icons bg-blue-500 text-white transition duration-300 ease-in-out transform px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Export
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
      ) : (
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table
                  ref={tableRef}
                  id="projectsTable"
                  className="min-w-full divide-y divide-gray-200"
                >
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs">
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("id")}
                      >
                        # {renderSortIcon("id")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("name")}
                      >
                        Name {renderSortIcon("name")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("inspection_date")}
                      >
                        Inspection Date {renderSortIcon("inspection_date")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("statusText")}
                      >
                        Status {renderSortIcon("statusText")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("branchName")}
                      >
                        Branch {renderSortIcon("branchName")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("ownerName")}
                      >
                        Owner {renderSortIcon("ownerName")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("customerName")}
                      >
                        Customer {renderSortIcon("customerName")}
                      </th>
                      <th
                        className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("engineerName")}
                      >
                        Engineer {renderSortIcon("engineerName")}
                      </th>
                      {/* New Columns */}
                      <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                        Notes
                      </th>
                      <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                        Inspection Time
                      </th>
                      {/* Existing Columns */}
                      <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                        Services
                      </th>
                      <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                        Consultives
                      </th>
                      <th className="pe-16 text-center dark:bg-slate-900 dark:text-white py-3 font-semibold text-lg border-b border-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects
                      .filter((project) => {
                        return search.toLowerCase() === ""
                          ? true
                          : project.name
                              .toLowerCase()
                              .includes(search.toLowerCase());
                      })
                      .map((project, index) => (
                        <tr
                          key={project.id}
                          id={`project-${project.id}`}
                          className={`hover:bg-gray-100 dark:hover:bg-slate-700 transition duration-200 text-xs ${
                            index % 2 === 0
                              ? "bg-white dark:bg-slate-800"
                              : "bg-gray-50 dark:bg-slate-700"
                          }`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 break-words">
                            {project.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.inspection_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.statusText}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.branchName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.ownerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.customerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.engineerName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.notes}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.inspectionTime}
                          </td>
                          {/* Existing Columns */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.services}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {project.consultives}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            <div className="flex space-x-1">
                              <Link
                                to={`/allprojects/updateprojects/${project.id}`}
                                className="edit flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(project.id)}
                                className="colors flex items-center text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                              <button
                                onClick={() => handleViewClick(project.id)}
                                className="eye flex items-center text-green-600 hover:text-green-800"
                              >
                                <FaEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
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

export default ShowAllProjects;
