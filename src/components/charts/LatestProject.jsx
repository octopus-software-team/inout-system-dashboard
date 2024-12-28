import React, { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net";

import projectIcon from '../../assests/logo4.png';

const statusStyles = {
  "0": "text-gray-600 bg-gray-100", // Not Started
  "2": "text-blue-600 bg-blue-100", // In Progress
  "4": "text-green-600 bg-green-100", // Completed
  "6": "text-yellow-600 bg-yellow-100", // Pending
  "8": "text-orange-600 bg-orange-100", // Under Review
  "10": "text-red-600 bg-red-100", // Cancelled
};

const statusLabels = {
  "0": "Not Started",
  "2": "In Progress",
  "4": "Completed",
  "6": "Pending",
  "8": "Under Review",
  "10": "Cancelled",
};

const LatestProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const tableRef = useRef(null);
  const dataTableRef = useRef(null);

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

        // تحقق من وجود البيانات
        if (projectData.status !== 200) {
          throw new Error(projectData.msg || "Failed to fetch projects");
        }

        // تحويل البيانات حسب الريسبونس المقدم
        const mergedData = projectData.data.map((project, index) => ({
          id: index, // استخدام الفهرس كمعرف فريد
          project: project.name,
          customer: project.customer || "Unknown",
          branch: project.branch || "Unknown", // إضافة حقل البرانش
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

  useEffect(() => {
    if (!loading && tableRef.current) {
      // تهيئة DataTable
      dataTableRef.current = $(tableRef.current).DataTable({
        order: [[4, "desc"]], // ترتيب حسب TIME تنازليًا
        pageLength: 10, // عدد الصفوف في الصفحة
        lengthMenu: [5, 10, 25, 50, 100], // خيارات عدد الصفوف
        // يمكنك إضافة خيارات أخرى حسب الحاجة
      });
    }

    // تنظيف DataTable عند تفكيك المكون
    return () => {
      if (dataTableRef.current) {
        dataTableRef.current.destroy();
      }
    };
  }, [loading, projects]);

  if (loading) {
    return <div className="text-center py-5">Loading data...</div>;
  }

  return (
    <div className="t1 p-5 h-screen">
      <h3 className="text-xl font-bold mb-4">Latest Projects</h3>
      <div className="overflow-x-auto h-full">
        <table
          ref={tableRef}
          className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md display"
        >
          <thead className="bg-gray-100">
            <tr>
              <th>PROJECTS</th>
              <th>CUSTOMER</th>
              <th>BRANCH</th> {/* إضافة رأس عمود البرانش */}
              <th>DETAILS</th>
              <th>STATUS</th>
              <th>TIME</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 font-medium flex items-center">
                  {/* تعديل حجم الصورة وإضافة مسافة */}
                  <img
                    src={row.project_image || projectIcon} // استخدام صورة المشروع إذا كانت متاحة
                    alt="Project Icon"
                    className="w-10 h-6 mr-2" // عرض وارتفاع 1.5rem (24px) ومسافة 0.5rem بين الصورة والنص
                  />
                  {row.project}
                </td>
                <td className="px-4 py-3">{row.customer}</td>
                <td className="px-4 py-3">{row.branch}</td> {/* عرض البرانش */}
                <td className="px-4 py-3 text-gray-600">{row.details}</td>
                <td className="px-4 py-3 flex items-center">
                  <span
                    className={`px-2 py-1 rounded-lg text-sm font-semibold ${statusStyles[row.status]}`}
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
                </td>
                <td className="px-4 py-3 text-gray-500">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LatestProject;
