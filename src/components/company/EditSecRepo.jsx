import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditSecRepo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  // State variables
  const [id, setId] = useState(paramId || "");
  const [reportType, setReportType] = useState("");
  const [reportStock, setReportStock] = useState("");
  const [isInspection, setIsInspection] = useState(1);
  const [report, setReport] = useState("");
  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  // 1) Fetch the projects from the API (same as before)
  useEffect(() => {
    const token = Cookies.get("token");
    fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setProjects(data.data); 
        } else {
          toast.error(`Error fetching projects: ${data.msg || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects. Please try again.");
      });
  }, []);

  // 2) Use the data from location.state.report to fill in the fields
  useEffect(() => {
    if (!location.state || !location.state.report) {
      toast.error("No report data found. Please try again.");
      navigate("/company/projectsecrepo");
      return;
    }

    const oldReport = location.state.report;
    // Populate all the fields
    setId(oldReport.id);
    setProjectId(oldReport.project_id);
    setReportType(oldReport.report_type);
    setReportStock(oldReport.report_stock);
    setIsInspection(oldReport.is_inspection ? 1 : 0);  // Convert boolean to 0/1 if needed
    setReport(oldReport.report);
  }, [location, navigate]);

  // 3) Submit the form to update the project report
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    // Prepare the payload
    const formData = new FormData();
    formData.append("id", id);
    formData.append("project_id", projectId);
    formData.append("report_type", reportType);
    formData.append("is_inspection", isInspection);
    // Only append report_stock if isInspection === 1
    formData.append("report_stock", isInspection === 1 ? reportStock : "");
    formData.append("report", report);

    fetch(
      `https://inout-api.octopusteam.net/api/front/updateProjectReport/${paramId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          toast.success("Report updated successfully!");
          setTimeout(() => navigate("/company/projectsecrepo"), 2000);
        } else {
          console.error(`Error: ${data.msg}`);
          toast.error(`Error: ${data.msg || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
        toast.error("Failed to submit report. Please try again.");
      });
  };

  return (
    <div className="mt-10 flex justify-center items-center dark:text-white">
      <ToastContainer />
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        {/* Hidden ID Field */}
        <input
          id="id"
          hidden
          type="hidden"
          value={id}
          readOnly
        />

        {/* Project dropdown */}
        <div className="mb-4">
          <label
            htmlFor="projectId"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Project Name
          </label>
          <select
            id="projectId"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              dark:bg-slate-900 dark:text-white"
          >
            <option value="" disabled>
              Select a project
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Report Type */}
        <div className="mb-4">
          <label
            htmlFor="reportType"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Report Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 dark:bg-slate-900 block w-full px-3 py-2 
              border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Checkbox: Is Inspection */}
        <div className="mb-4 flex items-center">
          <label
            htmlFor="isInspection"
            className="mr-2 text-sm font-medium text-gray-700 dark:text-white"
          >
            Is Inspection:
          </label>
          <input
            id="isInspection"
            type="checkbox"
            checked={isInspection === 1}
            onChange={() => setIsInspection(isInspection === 1 ? 0 : 1)}
            className="!bg-blue-400"
          />
        </div>

        {/* Conditionally Render Report Stock if isInspection === 1 */}
        {isInspection === 1 && (
          <div className="mb-4">
            <label
              htmlFor="reportStock"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Report Stock
            </label>
            <textarea
              id="reportStock"
              value={reportStock}
              onChange={(e) => setReportStock(e.target.value)}
              placeholder="Enter report stock"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 
                rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
                focus:border-blue-500 dark:bg-slate-900 dark:text-white dark:border-gray-600"
              rows="3"
            ></textarea>
          </div>
        )}

        {/* Report */}
        <div className="mb-4">
          <label
            htmlFor="report"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            Report
          </label>
          <textarea
            id="report"
            value={report}
            onChange={(e) => setReport(e.target.value)}
            placeholder="Enter report"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 
              rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 dark:bg-slate-900 dark:text-white dark:border-gray-600"
            rows="4"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold 
            rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
            dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default EditSecRepo;
