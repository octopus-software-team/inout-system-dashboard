import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net";

const AddSecRepo = () => {
  const [data, setData] = useState([]);
  const [projects, setProjects] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const dataTable = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.error("token expired ");
        setError("No token found. Please log in.");
      }

      const BASE_URL = "https://inout-api.octopusteam.net/api/front";

      const response = await fetch(`${BASE_URL}/getProjectReports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      const apiData = result.data;
      setData(apiData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      const token = Cookies.get("token");

      if (!token) {
        console.log("No token found, cannot fetch projects.");
        return;
      }

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
      const data = result.data;
      console.log(data);
      setProjects(data);
    };

    fetchProject();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
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
        });
      } else {
        dataTable.current.clear();
        dataTable.current.rows.add(data);
        dataTable.current.draw();
      }
    }

    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
        dataTable.current = null;
      }
    };
  }, [data]);

  const handleEdit = (id) => {
    const report = data.find((item) => item.id === id); // العثور على التقرير
    navigate(`/company/editsecrepo/${id}`, { state: { report } }); // تمرير البيانات
  };

  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this service?</p>
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
          throw new Error("Failed to delete service.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Service deleted successfully.");
        setData(data.filter((service) => service.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete the service. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  useEffect(() => {
    console.log(data);
    console.log(projects);
  }, []);

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">
        Project Report
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 shadow-md"
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/createsecrepo"
          className="icons bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Project Report
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No services found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table ref={tableRef} className="display table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                 #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Project Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Report Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Report Stock
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Is Inspection
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Report
                </th>
                <th className="py-3 font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((i) =>
                  search
                    ? i.name?.toLowerCase().includes(search.toLowerCase())
                    : true
                )
                .map((d, index) => {
                  const project = projects.find(
                    (project) => project.id === d.project_id
                  );

                  return (
                    <tr
                      key={d.id}
                      className={`hover:bg-gray-100 dark:bg-slate-900 transition duration-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {d.id}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {project ? project.name : "N/A"}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {d.report_type}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {d.report_stock}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {d.is_inspection ? "Yes" : "No"}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">
                        {d.report}
                      </td>
                      <td className="px-4 py-3 dark:bg-slate-900 dark:text-white  space-x-2">
                        <button
                          onClick={() => handleEdit(d.id)}
                          className="edit rounded-lg "
                        >
                          <FaEdit className="inline mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="colors rounded-lg "
                        >
                          <FaTrash className="inline mr-2" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AddSecRepo;