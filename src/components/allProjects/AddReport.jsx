import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';

const AddReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const token = Cookies.get('token');

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/projectDetails/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Fetched Data:", data);

        // تحديث حالة التقارير
        setReports(Array.isArray(data.data.reports) ? data.data.reports : []);

        // تحديث حالة المهام
        setTasks(Array.isArray(data.data.tasks) ? data.data.tasks : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReports();
    } else {
      setError("Invalid project ID.");
      setLoading(false);
    }
  }, [id]);

  return (
    <div className="min-h-screen dark:bg-slate-950 bg-gray-100 flex items-center justify-center py-10">
      <div className="service rounded-lg shadow-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        <h1 className="text-center font-bold text-3xl mb-5 text-gray-700">
          Hospital x Project
        </h1>
        <div className="flex justify-between mb-5 text-sm text-gray-700">
          <div>
            <p>
              <strong>Owner:</strong> co3@co3.com
            </p>
            <p>
              <strong>Consultive:</strong> co3@co3.com
            </p>
            <p>
              <strong>Services:</strong> sss, sss
            </p>
          </div>
          <div className="text-right">
            <p>
              <strong>Customer / Contractor:</strong> co3@co3.com
            </p>
            <p>
              <strong>Inspection Engineer:</strong> a@a.com
            </p>
            <p>
              <strong>Team Members:</strong> [Dropdown with names]
            </p>
          </div>
        </div>
        <div className="border-t border-b py-4">
          <h2 className="font-bold text-xl mb-2">General Inspection</h2>

          <h3 className="font-semibold text-lg ">Title</h3>
          <p className="service border border-gray-300 dark:text-white rounded-lg p-3 w-full">
            test name11111
          </p>

          <h3 className="font-semibold text-lg mt-3">Description</h3>
          <p className="service border border-gray-300 rounded-lg p-3 w-full dark:bg-slate-900 dark:text-white">
            test description111111
          </p>

          <h3 className="font-semibold text-lg mt-3">Image</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
            {[
              "https://inout-api.octopusteam.net/storage/project_documents/6171734149431.webp",
              "https://inout-api.octopusteam.net/storage/project_documents/2441734149431.webp",
              "https://inout-api.octopusteam.net/storage/project_documents/24781734149431.webp",
              "https://inout-api.octopusteam.net/storage/project_documents/31991734149431.webp",
              "https://inout-api.octopusteam.net/storage/project_documents/74371734149431.webp",
            ].map((fileUrl, index) => (
              <img
                key={index}
                src={fileUrl}
                alt={`Document Image ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-sm border border-gray-300"
              />
            ))}
          </div>
        </div>
        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Logistic Inspection</h2>
          <h3 className="font-semibold text-lg ">Title</h3>
          <p className="service border border-gray-300 rounded-lg p-3 w-full dark:bg-slate-900 dark:text-white">
            test name11111
          </p>
        </div>
        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Safety Inspection</h2>
          <p className="service border border-gray-300 rounded-lg p-3 w-full dark:bg-slate-900 dark:text-white">
            test description111111
          </p>
        </div>
        {/* قسم التقارير */}
        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Reports</h2>

          {loading && <p className="text-gray-500">Loading reports...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}
          {!loading && !error && reports.length === 0 && (
            <p className="text-gray-500">No reports available.</p>
          )}
          {!loading && !error && reports.length > 0 && (
            <div className="space-y-4">
              {reports.map((report) => (
                <p
                  key={report.id}
                  className="service border border-gray-300 dark:text-white rounded-lg p-3 w-full"
                >
                  {report.report || "No report available"}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Tasks</h2>

          {loading && <p className="text-gray-500">Loading tasks...</p>}
          {error && <p className="text-red-500">Error: {error}</p>}

          {/* التحقق إذا لم تكن هناك مهام */}
          {!loading && !error && tasks.length === 0 && (
            <p className="text-gray-500">No tasks available.</p>
          )}

          {/* عرض المهام إذا كانت موجودة */}
          {!loading && !error && tasks.length > 0 && (
            <ul className="space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center justify-between p-3 border border-gray-300 rounded-lg shadow-sm dark:bg-slate-900 dark:text-white"
                >
                  <span>{task.task}</span>
                  <span
                    className={`px-3 py-1 text-sm rounded ${
                      task.status === 0
                        ? "bg-red-200 text-red-600"
                        : "bg-green-200 text-green-600"
                    }`}
                  >
                    {task.status === 0 ? "Pending" : "Completed"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddReport;

















{
  /* <div className="border-t py-4">
<h2 className="font-bold text-xl mb-2">Logistic Inspection</h2>
<h3 className="font-semibold text-lg ">
  Title<strong></strong>
</h3>
<textarea
  className="service border border-gray-300 rounded-lg p-3 w-full h-32 dark:bg-slate-900 dark:text-white"
  defaultValue="test name11111"
></textarea>
</div>

<div className="border-t py-4">
<h2 className="font-bold text-xl mb-2">Safety Inspection</h2>
<textarea
  className="service border border-gray-300 rounded-lg p-3 w-full h-32 dark:bg-slate-900 dark:text-white"
  defaultValue="test description111111"
></textarea>
</div>


<div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Tasks</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Finalize the construction site layout</li>
            <li>Conduct the initial safety briefing</li>
            <li>Schedule the next inspection date</li>
            <li>Update the project risk assessment document</li>
          </ul>
        </div> */
}
