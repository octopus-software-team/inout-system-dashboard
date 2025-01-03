import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const ProjectDetails = () => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchProjectData = async () => {
      const token = Cookies.get("token");

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
        setProjectData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    } else {
      setError("Invalid project ID.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950">
        <div className="text-xl text-gray-700 dark:text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950">
        <div className="text-red-500 text-xl">{`Error: ${error}`}</div>
      </div>
    );
  }

  if (!projectData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-950">
        <div className="text-gray-700 dark:text-white text-xl">
          No project data available.
        </div>
      </div>
    );
  }

  // البحث عن قسم General Inspection بناءً على النوع أو أي معيار آخر
  const generalInspection = projectData.projectDocuments.find(
    (doc) => doc.section_type === 0 && doc.type === 1
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
        {/* عنوان المشروع - تم تعديله ليكون في المركز */}
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
          {projectData.name}
        </h1>

        {/* معلومات المشروع */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Owner:</strong> {projectData.project_owner}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Consultive:</strong> {projectData.consultive}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Services:</strong> {projectData.services}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Customer / Contractor:</strong> {projectData.customer_constructor}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Inspection Engineer:</strong> {projectData.inspection_engineer}
            </p>

            {/* قسم Team Members المعدل */}
            <div className="mt-6">
              <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Team Members:
              </span>
              <select className="w-full md:w-1/2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                {projectData.members.map((member) => (
                  <option key={member.id} value={member.employee.id}>
                    {member.employee.full_name}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap items-center mt-4 space-x-4">
                {projectData.members.map((member) => (
                  <img
                    key={member.id}
                    src={member.employee.image}
                    alt={member.employee.full_name}
                    className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-sm object-cover"
                  />
                ))}
              </div>
            </div>
            {/* نهاية قسم Team Members المعدل */}
          </div>
        </div>

        {/* قسم General Inspection المعدل */}
        {generalInspection && (
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
              General Inspection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg">
                  <strong className="text-gray-700 dark:text-gray-300">Title:</strong> {generalInspection.name}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong className="text-gray-700 dark:text-gray-300">Description:</strong> {generalInspection.description}
                </p>
              </div>
            </div>
            {/* عرض الملفات المرتبطة */}
            {generalInspection.file && generalInspection.file.length > 0 && (
              <div className="mt-6">
                <h3 className="text-2xl font-medium text-gray-800 dark:text-white mb-4">Documents</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {generalInspection.file.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Document ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg shadow-sm border border-gray-300 dark:border-gray-700"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {/* نهاية قسم General Inspection المعدل */}

        {/* باقي الأقسام */}
        {/* Logistic Inspection */}
        {projectData.projectDocuments[1] && (
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
              Logistic Inspection
            </h2>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Title:</strong> {projectData.projectDocuments[1].name}
            </p>
          </div>
        )}

        {/* Reports */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            Reports
          </h2>
          {projectData.reports.map((report) => (
            <div
              key={report.id}
              className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-slate-800"
            >
              {report.report}
            </div>
          ))}
        </div>

        {/* Tasks */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            Tasks
          </h2>
          <ul className="space-y-4">
            {projectData.tasks.map((task) => (
              <li
                key={task.id}
                className={`p-4 border rounded-lg shadow-sm flex items-center justify-between ${
                  task.status === 0
                    ? "bg-red-100 border-red-200 text-red-600"
                    : "bg-green-100 border-green-200 text-green-600"
                }`}
              >
                <span>{task.task}</span>
                <span className="font-semibold">
                  {task.status === 0 ? "Pending" : "Completed"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
