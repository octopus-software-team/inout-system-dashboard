import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Cookies from 'js-cookie';


const EditSecRepo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: paramId } = useParams();

  const [id, setId] = useState(paramId || "");
  const [reportType, setReportType] = useState("");
  const [reportStock, setReportStock] = useState("");
  const [isInspection, setIsInspection] = useState(1);
  const [report, setReport] = useState("");

  // Fetch existing report data
  useEffect(() => {
    const fetchReport = async () => {
      const token = Cookies.get('token');
      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/getProjectReports`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (data.status === 200) {
          setReportType(data.data.report_type || "daily");
          setReportStock(data.data.report_stock || "");
          setIsInspection(data.data.is_inspection || 0);
          setReport(data.data.report || "");
        } else {
          alert("Failed to fetch report data");
        }
      } catch (error) {
        console.error("Error fetching report:", error);
        alert("An error occurred while fetching the report");
      }
    };

    if (id) {
      fetchReport();
    } else {
      alert("No ID provided");
      navigate("/company/projectsecrepo");
    }
  }, [id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = Cookies.get('token');

    const payload = {
        id,
        project_id: 1, 
        report_type: reportType,
        is_inspection: isInspection,
        report_stock: isInspection === 1 ? reportStock : null,
        report,
    };
    

    fetch(`https://inout-api.octopusteam.net/api/front/updateProjectReport`, {
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
            alert("Report updated successfully!");
            navigate("/company/projectsecrepo");
        } else {
            console.error(`Error: ${data.msg}`);
            alert(`Error: ${data.msg || "Unknown error"}`);
        }
    })
    
  };

  return (
    <div className="mt-10 flex justify-center items-center dark:text-white">
      <form className="w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="id"
            className="block text-sm font-medium text-gray-700 dark:text-white"
          >
            ID
          </label>
          <input
            id="id"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="Enter ID"
            required
            className="mt-1 dark:bg-slate-900 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-gray-600"
            readOnly
            
          />
        </div>

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
            className="mt-1 dark:bg-slate-900 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:text-white dark:border-gray-600"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white dark:border-gray-600"
                rows="3"
              ></textarea>
            </div>
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white dark:border-gray-600"
                rows="4"
              ></textarea>
            </div>
          </>
        ) : (
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-900 dark:text-white dark:border-gray-600"
              rows="4"
            ></textarea>
          </div>
        )}

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

export default EditSecRepo;
