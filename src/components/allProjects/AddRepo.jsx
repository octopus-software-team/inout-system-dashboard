import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const AddRepo = () => {
  const location = useLocation();
  const { projectId } = location.state || {}; // Passing projectId from previous page
  const [reportType, setReportType] = useState("daily");
  const [reportStock, setReportStock] = useState("");
  const [isInspection, setIsInspection] = useState(1);
  const [report, setReport] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const payload = {
      project_id: projectId,
      report_type: reportType,
      is_inspection: isInspection,
    };

    if (isInspection === 1) {
      payload.report_stock = reportStock;
      payload.report = report;
    }

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
        <input type="hidden" value={projectId} />

        <div className="mb-4">
          <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
            Report Type
          </label>
          <select
            id="reportType"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <label htmlFor="isInspection" className="mr-2 text-sm font-medium text-gray-700">
            Is Inspection:
          </label>
          <input
            id="isInspection"
            type="checkbox"
            checked={isInspection === 1}
            onChange={() => setIsInspection(isInspection === 1 ? 0 : 1)}
            className="toggle-checkbox"
          />
        </div>

        {isInspection === 1 && (
          <>
            <div className="mb-4">
              <label htmlFor="reportStock" className="block text-sm font-medium text-gray-700">
                Report Stock
              </label>
              <textarea
                id="reportStock"
                value={reportStock}
                onChange={(e) => setReportStock(e.target.value)}
                placeholder="Enter report stock"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="report" className="block text-sm font-medium text-gray-700">
                Report
              </label>
              <textarea
                id="report"
                value={report}
                onChange={(e) => setReport(e.target.value)}
                placeholder="Enter report"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
              ></textarea>
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddRepo;
