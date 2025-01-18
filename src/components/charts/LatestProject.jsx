import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";
import projectIcon from "../../assests/logo4.png";

const statusStyles = {
  0: "text-gray-600 bg-gray-100", // Not Started
  2: "text-blue-600 bg-blue-100", // In Progress
  4: "text-green-600 bg-green-100", // Completed
  6: "text-yellow-600 bg-yellow-100", // Pending
  8: "text-orange-600 bg-orange-100", // Under Review
  10: "text-red-600 bg-red-100", // Cancelled
};

const statusLabels = {
  0: "Not Started",
  2: "In Progress",
  4: "Completed",
  6: "Pending",
  8: "Under Review",
  10: "Cancelled",
};

const LatestProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        const projectResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/lastProjects",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const projectData = await projectResponse.json();

        if (projectData.status !== 200) {
          throw new Error(projectData.msg || "Failed to fetch projects");
        }

        const mergedData = projectData.data.map((project, index) => ({
          id: index,
          project: project.name,
          customer: project.customer || "Unknown",
          branch: project.branch || "Unknown",
          details: project.notes || "",
          status: project.status.toString(),
          time: project.created_at || "",
        }));

        setProjects(mergedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "PROJECTS",
      selector: (row) => row.project,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <img src={projectIcon} alt="Project Icon" className="w-6 h-6 mr-2" />
          <span>{row.project}</span>
        </div>
      ),
    },
    {
      name: "CUSTOMER",
      selector: (row) => row.customer,
      sortable: true,
    },
    {
      name: "BRANCH",
      selector: (row) => row.branch,
      sortable: true,
    },
    {
      name: "DETAILS",
      selector: (row) => row.details,
      sortable: true,
    },
    {
      name: "STATUS",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div className="flex items-center">
          <span
            className={`px-2 py-1 rounded-lg text-sm font-semibold ${
              statusStyles[row.status]
            }`}
          >
            {statusLabels[row.status]}
          </span>
          {row.status === "4" && (
            <svg
              className="w-4 h-4 text-green-500 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      ),
    },
    {
      name: "TIME",
      selector: (row) => row.time,
      sortable: true,
    },
  ];

  const filteredData = projects.filter((project) =>
    project.project.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-5 h-screen">
      <h3 className="text-xl font-bold mb-4">Latest Projects</h3>
      <div className="flex justify-between items-center my-4">
        <div className="flex items-center">
          {/* <FaSearch className="ml-2 text-gray-500" /> */}

          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        defaultSortField="TIME"
        defaultSortAsc={false}
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        className="shadow-lg rounded-lg overflow-hidden"
      />
    </div>
  );
};

export default LatestProject;
