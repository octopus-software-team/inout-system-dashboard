import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch the projects from the API
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

  // Use the data from location.state.report to fill in the fields
  useEffect(() => {
    if (!location.state || !location.state.report) {
      toast.error("No report data found. Please try again.");
      navigate("/company/projectsecrepo");
      return;
    }

    const oldReport = location.state.report;
    setId(oldReport.id);
    setProjectId(oldReport.project_id);
    setReportType(oldReport.report_type);
    setReportStock(oldReport.report_stock);
    setIsInspection(oldReport.is_inspection ? 1 : 0);
    setReport(oldReport.report);
  }, [location, navigate]);

  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    if (!projectId) newErrors.projectId = "Project is required.";
    if (!reportType) newErrors.reportType = "Report type is required.";
    if (!report) newErrors.report = "Report is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("id", id);
    formData.append("project_id", projectId);
    formData.append("report_type", reportType);
    formData.append("is_inspection", isInspection);
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
        setIsLoading(false);
        if (data.status === 200) {
          toast.success("Report updated successfully!");
          setTimeout(() => navigate("/company/projectsecrepo"), 2000);
        } else {
          toast.error(`Error: ${data.msg || "Unknown error"}`);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error submitting report:", error);
        toast.error("Failed to submit report. Please try again.");
      });
  };

  // Reset form fields
  const resetForm = () => {
    setId("");
    setProjectId("");
    setReportType("");
    setReportStock("");
    setIsInspection(1);
    setReport("");
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Edit Security Report
        </h2>
        <form onSubmit={handleSubmit}>
          <input id="id" type="hidden" value={id} readOnly />

          {/* Project dropdown */}
          <div className="mb-6">
            <label
              htmlFor="projectId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Project Name
            </label>
            <select
              id="projectId"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
            {errors.projectId && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.projectId}
              </p>
            )}
          </div>

          {/* Report Type */}
          <div className="mb-6">
            <label
              htmlFor="reportType"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="" disabled>
                Select report type
              </option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            {errors.reportType && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.reportType}
              </p>
            )}
          </div>

          {/* Checkbox: Is Inspection */}
          <div className="mb-6 flex items-center">
            <label
              htmlFor="isInspection"
              className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Is Inspection:
            </label>
            <input
              id="isInspection"
              type="checkbox"
              checked={isInspection === 1}
              onChange={() => setIsInspection(isInspection === 1 ? 0 : 1)}
              className="w-5 h-5 text-blue-500 rounded focus:ring-blue-500 
                dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Conditionally Render Report Stock if isInspection === 1 */}
          {isInspection === 1 && (
            <div className="mb-6">
              <label
                htmlFor="reportStock"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Report Stock
              </label>
              <textarea
                id="reportStock"
                value={reportStock}
                onChange={(e) => setReportStock(e.target.value)}
                placeholder="Enter report stock"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                  dark:bg-gray-700 dark:text-white dark:border-gray-600"
                rows="3"
              ></textarea>
            </div>
          )}

          {/* Report */}
          <div className="mb-6">
            <label
              htmlFor="report"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Report
            </label>
            <textarea
              id="report"
              value={report}
              onChange={(e) => setReport(e.target.value)}
              placeholder="Enter report"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows="4"
            ></textarea>
            {errors.report && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                {errors.report}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg 
                hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 
                dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSecRepo;