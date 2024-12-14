import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateSecRepo = () => {
  const [projectId, setProjectId] = useState(""); // Holds the entered project ID
  const [projectName, setProjectName] = useState(""); // Holds the entered project name
  const [reportType, setReportType] = useState("daily");
  const [reportStock, setReportStock] = useState("");
  const [isInspection, setIsInspection] = useState(1);
  const [report, setReport] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      project_id: projectId, // Required Project ID
      project_name: projectName, // Optional Project Name
      report_type: reportType,
      is_inspection: isInspection,
      report_stock: isInspection ? reportStock : undefined,
      report,
    };

    fetch("https://inout-api.octopusteam.net/api/front/addProjectReport", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          alert("Report added successfully!");
          navigate("/company/projectsecrepo");
        } else {
          alert(`Error: ${data.msg || "Unknown error"}`);
        }
      })
      .catch((error) => {
        console.error("Error submitting report:", error);
        alert("Failed to submit report. Please try again.");
      });
  };

  return (
    <div className="mt-10 flex justify-center items-center">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        {/* Project ID Input */}
        <div className="mb-4">
          <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 dark:text-white">
            Project ID
          </label>
          <input
            id="projectId"
            type="text"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)} // Update the state with entered ID
            placeholder="Enter Project ID"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white"
          />
        </div>

        {/* Project Name Input */}
        <div className="mb-4">
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-white">
            Project Name
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)} // Update the state with entered name
            placeholder="Enter Project Name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white"
          />
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
            className="mt-1 dark:bg-slate-900 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Is Inspection */}
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

        {/* Report Stock and Report Fields */}
        {isInspection === 1 ? (
          <>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white"
                rows="3"
              ></textarea>
            </div>
          </>
        ) : null}
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white"
            rows="4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateSecRepo;
