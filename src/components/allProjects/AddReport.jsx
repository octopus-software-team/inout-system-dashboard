import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill"; // استيراد React Quill
import "react-quill/dist/quill.snow.css"; // استيراد أنماط React Quill

// تأكد من تعيين العنصر الجذر للمودال
Modal.setAppElement("#root");

const ProjectDetails = () => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [formData, setFormData] = useState({
    project_id: "",
    report_type: "",
    report_stock: "",
    is_inspection: 0,
    report: "",
  });
  const [taskFormData, setTaskFormData] = useState({
    project_id: "",
    task: "",
  });

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

  useEffect(() => {
    const fetchProjects = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
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

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProjectsList(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const openAddReportModal = () => {
    setIsAddReportModalOpen(true);
  };

  const closeAddReportModal = () => {
    setIsAddReportModalOpen(false);
    setFormData({
      project_id: "",
      report_type: "",
      report_stock: "",
      is_inspection: 0,
      report: "",
    });
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setTaskFormData({
      project_id: "",
      task: "",
    });
  };

  const handleAddReport = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addProjectReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Report added successfully!");
        setProjectData((prevData) => ({
          ...prevData,
          reports: [...prevData.reports, data.data],
        }));
        closeAddReportModal();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAddTask = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addProjectTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskFormData),
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      if (data.status === 200) {
        toast.success("Task added successfully!");
        setProjectData((prevData) => ({
          ...prevData,
          tasks: [...prevData.tasks, data.data],
        }));
        closeAddTaskModal();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

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

  const generalInspection = projectData.projectDocuments.find(
    (doc) => doc.section_type === 0 && doc.type === 1
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 py-10 px-4">
      <ToastContainer />
      <div className="mx-auto p-8 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
          {projectData.name}
        </h1>

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
                    className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-sm object-cover cursor-pointer"
                    onClick={() => openModal(member.employee.image)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
            General Inspection
          </h2>
          {generalInspection ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-lg">
                  <strong className="text-gray-700 dark:text-gray-300">Section:</strong> {generalInspection.name}
                </p>
              </div>
              <div>
                <p className="text-lg">
                  <strong className="text-gray-700 dark:text-gray-300">Description:</strong> {generalInspection.description}
                </p>
              </div>
              {generalInspection.file && generalInspection.file.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-2xl font-medium text-gray-800 dark:text-white mb-4">Documents</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {generalInspection.file.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Document ${index + 1}`}
                        className="w-full h-40 object-cover rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={() => openModal(url)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">No data available.</p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-4">
            Logistic Inspection
          </h2>
          {projectData.projectDocuments[1] ? (
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">Title:</strong> {projectData.projectDocuments[1].name}
            </p>
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">No data available.</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Reports
            </h2>
            <button
              onClick={openAddReportModal}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Report
            </button>
          </div>
          {projectData.reports.length > 0 ? (
            projectData.reports.map((report) => (
              <div
                key={report.id}
                className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-slate-800"
              >
                {report.report}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">No data available.</p>
          )}
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
              Tasks
            </h2>
            <button
              onClick={openAddTaskModal}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Task
            </button>
          </div>
          {projectData.tasks.length > 0 ? (
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
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">No data available.</p>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Image Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="flex justify-center items-center h-full">
          <img
            src={selectedImage}
            alt="Selected"
            className="max-w-[50vw] max-h-[90vh] rounded-lg shadow-lg border border-gray-300 dark:border-gray-700"
          />
        </div>
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </Modal>

      <Modal
        isOpen={isAddReportModalOpen}
        onRequestClose={closeAddReportModal}
        contentLabel="Add Report Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-6 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Add New Report
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.project_id}
                onChange={(e) =>
                  setFormData({ ...formData, project_id: e.target.value })
                }
              >
                <option value="">Select Project</option>
                {projectsList.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Type
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.report_type}
                onChange={(e) =>
                  setFormData({ ...formData, report_type: e.target.value })
                }
              >
                <option value="">Select Report Type</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Stock
              </label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.report_stock}
                onChange={(e) =>
                  setFormData({ ...formData, report_stock: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is Inspection
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.is_inspection}
                onChange={(e) =>
                  setFormData({ ...formData, is_inspection: parseInt(e.target.value) })
                }
              >
                <option value={0}>No</option>
                <option value={1}>Yes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report
              </label>
              <ReactQuill
                value={formData.report}
                onChange={(value) => setFormData({ ...formData, report: value })}
                className="bg-white dark:bg-slate-800 text-gray-700 dark:text-white"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeAddReportModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddReport}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Report
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isAddTaskModalOpen}
        onRequestClose={closeAddTaskModal}
        contentLabel="Add Task Modal"
        className="modal"
        overlayClassName="overlay"
      >
        <div className="p-6 w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
            Add New Task
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project
              </label>
              <select
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskFormData.project_id}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, project_id: e.target.value })
                }
              >
                <option value="">Select Project</option>
                {projectsList.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Task
              </label>
              <textarea
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={taskFormData.task}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, task: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeAddTaskModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProjectDetails;