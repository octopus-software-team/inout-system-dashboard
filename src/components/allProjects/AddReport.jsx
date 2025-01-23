import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";

Modal.setAppElement("#root");

const ProjectDetails = () => {
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [engineers, setEngineers] = useState([]);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddReportModalOpen, setIsAddReportModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState([]);
  const [formData, setFormData] = useState({
    project_id: id,
    report_type: "daily",
    report_stock: "",
    is_inspection: 0,
    report: "",
  });

  const [membersIds, setMembers] = useState([]);

  useEffect(() => {
    console.log(projectData);
  }, [projectData]);

  const [taskFormData, setTaskFormData] = useState({
    project_id: id,
    task: "",
    employee_id: "", // إضافة حقل employee_id
  });
  const [selectedMembers, setSelectedMembers] = useState([]);

  // useEffect(() => {
  //   const savedMembers = localStorage.getItem(`selectedMembers_${id}`);

  //   const selectedMembers = projectData.members
  //       .filter((engineer) => membersIds.includes(engineer.value))
  //       .map((engineer) => ({
  //         value: engineer.value,
  //         label: engineer.label,
  //         image: engineer.image,
  //       }));

  //       setSelectedMembers(selectedMembers);
  //   // if (savedMembers) {

  //   //   const memberIds = JSON.parse(savedMembers);

  //   //   const selectedMembers = projectData.members
  //   //     .filter((engineer) => memberIds.includes(engineer.value))
  //   //     .map((engineer) => ({
  //   //       value: engineer.value,
  //   //       label: engineer.label,
  //   //       image: engineer.image,
  //   //     }));
  //   //   setSelectedMembers(selectedMembers);
  //   // }
  // }, [engineers, id]); // أضف id كـ dependency

  useEffect(() => {
    if (projectData && projectData.members) {
      const transformedMembers = projectData.members.map((member) => ({
        value: member.employee.id,
        label: member.employee.full_name,
        image: member.employee.image,
      }));
      setSelectedMembers(transformedMembers);
      setMembers(transformedMembers.map((member) => member.value)); // Store member IDs for local storage
    }
  }, [projectData]);

  const handleMemberSelect = async (selectedOptions) => {
    setSelectedMembers(selectedOptions);
    const token = Cookies.get("token");

    localStorage.setItem(
      `selectedMembers_${id}`,
      JSON.stringify(selectedOptions.map((member) => member.value))
    );

    const formData = new FormData();
    selectedOptions.forEach((engineer, index) => {
      formData.append(`inspection_engineer_id[${index}]`, engineer.value);
    });
    formData.append(`project_id`, id);

    const response = await fetch(
      "https://inout-api.octopusteam.net/api/front/updateProjectMembers",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
  };

  useEffect(() => {
    console.log(selectedMembers);
  }, [selectedMembers]);

  const removeMember = (memberId) => {
    setSelectedMembers((prevMembers) =>
      prevMembers.filter((member) => member.value !== memberId)
    );

    const savedMembers = localStorage.getItem(`selectedMembers_${id}`);
    if (savedMembers) {
      const memberIds = JSON.parse(savedMembers).filter(
        (id) => id !== memberId
      );
      localStorage.setItem(`selectedMembers_${id}`, JSON.stringify(memberIds));
    }
  };

  useEffect(() => {
    const fetchEngineers = async () => {
      const token = Cookies.get("token");

      if (!token) {
        setError("No authentication token found.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEngineers",
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
        if (data.status === 200) {
          const engineers = data.data.map((engineer) => ({
            value: engineer.id,
            label: engineer.full_name,
            image: engineer.image,
          }));
          setEngineers(engineers);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchEngineers();
  }, []);

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

  // Open and Close Modals
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
    setFormData({
      project_id: id,
      report_type: "daily",
      report_stock: "",
      is_inspection: 0,
      report: "",
    });
  };

  const closeAddReportModal = () => {
    setIsAddReportModalOpen(false);
    setFormData({
      project_id: id,
      report_type: "daily",
      report_stock: "",
      is_inspection: 0,
      report: "",
    });
  };

  const openAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
    setTaskFormData({
      project_id: id,
      task: "",
    });
  };

  const closeAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
    setTaskFormData({
      project_id: id,
      task: "",
    });
  };

  // Handle Add Report
  const handleAddReport = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    // إزالة التاج <p> من النص
    const cleanedReport = formData.report.replace(/<p>|<\/p>/g, "");

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addProjectReport",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            report: cleanedReport, // استخدام النص بعد إزالة التاج <p>
          }),
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

  // Handle Add Task
  const handleAddTask = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    if (!taskFormData.project_id || !taskFormData.employee_id) {
      toast.error("Project ID or Employee ID is missing.");
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
          body: JSON.stringify({
            project_id: taskFormData.project_id,
            task: taskFormData.task,
            employee_id: taskFormData.employee_id, // إرسال employee_id
          }),
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
        setTaskFormData({
          project_id: id,
          task: "",
          employee_id: "", // إعادة تعيين employee_id
        });
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

  const generalInspection =
    projectData?.projectDocuments &&
    projectData?.projectDocuments?.find(
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
              <strong className="text-gray-700 dark:text-gray-300">
                Owner:
              </strong>{" "}
              {projectData.project_owner}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">
                Consultive:
              </strong>{" "}
              {projectData.consultive}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">
                Services:
              </strong>{" "}
              {projectData.services}
            </p>
          </div>
          <div className="space-y-4">
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">
                Customer / Contractor:
              </strong>{" "}
              {projectData.customer_constructor}
            </p>
            <p className="text-lg">
              <strong className="text-gray-700 dark:text-gray-300">
                Inspection Engineer:
              </strong>{" "}
              {projectData.inspection_engineer}
            </p>

            <div className="mt-6">
              <span className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Team Members:
              </span>
              <Select
                isMulti
                options={engineers.map((engineer) => ({
                  value: engineer.value,
                  label: engineer.label,
                  image: engineer.image,
                }))}
                value={selectedMembers}
                onChange={handleMemberSelect}
                className="w-full md:w-1/2"
              />
              {/* <div className="flex flex-wrap items-center mt-4 space-x-4">
                {selectedMembers.map((member) => (
                  <div key={member.value} className="relative">
                    <img
                      src={member.image}
                      alt={member.label}
                      className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-sm object-cover cursor-pointer"
                      onClick={() => openModal(member.image)}
                    />
                    <button
                      onClick={() => removeMember(member.value)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div> */}

              <div className="flex flex-wrap items-center mt-4 space-x-4">
                {selectedMembers.map((member) => (
                  <div key={member.value} className="relative">
                    <img
                      src={member.image}
                      alt={member.label}
                      className="w-16 h-16 rounded-full border-2 border-gray-300 dark:border-gray-700 shadow-sm object-cover cursor-pointer"
                      onClick={() => openModal(member.image)}
                    />
                    {/* <button
                      onClick={() => removeMember(member.value)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                    >
                      X
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="mb-10"></hr>
        <div className="mb-8">
          {projectData.general && projectData.general.length > 0 ? (
            <div className="border border-gray-200 p-5 rounded-lg mb-6">
              <h2 className="text-3xl text-center font-semibold text-gray-800 dark:text-white mb-6">
                General Inspection
              </h2>
              {projectData.general.map((general, index) => (
                <div key={index} className="mb-6">
                  <div className="mb-4">
                    <p className="text-lg">
                      <strong className="text-gray-700 text-2xl dark:text-gray-300">
                        Section:
                      </strong>{" "}
                      {general.name}
                    </p>
                    <p className="text-lg">
                      <strong className="text-gray-700 text-2xl dark:text-gray-300">
                        Description:
                      </strong>{" "}
                      {general.description}
                    </p>
                  </div>
                  {general.file && general.file.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {general.file.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Document ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 cursor-pointer"
                          onClick={() => openModal(url)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Not yet done
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl text-center font-semibold text-gray-800 dark:text-white mb-4">
            Logistic Inspection
          </h2>
          {projectData.logistic && projectData.logistic.length > 0 ? (
            projectData.logistic.map((logistic, index) => (
              <div
                key={index}
                className="border border-gray-200 p-5 rounded-lg mb-6"
              >
                <div className="mb-4">
                  <p className="text-lg">
                    <strong className="text-gray-700 text-2xl dark:text-gray-300">
                      Section:
                    </strong>{" "}
                    {logistic.name}
                  </p>
                  <p className="text-lg">
                    <strong className="text-gray-700 text-2xl dark:text-gray-300">
                      Description:
                    </strong>{" "}
                    {logistic.description}
                  </p>
                </div>
                {logistic.file && logistic.file.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {logistic.file.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Document ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={() => openModal(url)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Not yet done
            </p>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-3xl text-center font-semibold text-gray-800 dark:text-white mb-4">
            Safety
          </h2>
          {projectData.safety && projectData.safety.length > 0 ? (
            projectData.safety.map((safety, index) => (
              <div
                key={index}
                className="border border-gray-200 p-5 rounded-lg mb-6"
              >
                <div className="mb-4">
                  <p className="text-lg">
                    <strong className="text-gray-700 text-2xl dark:text-gray-300">
                      Section:
                    </strong>{" "}
                    {safety.name}
                  </p>
                  <p className="text-lg">
                    <strong className="text-gray-700 text-2xl dark:text-gray-300">
                      Description:
                    </strong>{" "}
                    {safety.description}
                  </p>
                </div>
                {safety.file && safety.file.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {safety.file.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Document ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg shadow-sm border border-gray-300 dark:border-gray-700 cursor-pointer"
                        onClick={() => openModal(url)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Not yet done
            </p>
          )}
        </div>

        <hr className="mb-10" />

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
            <div>
              {projectData.reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg mb-4 bg-gray-50 dark:bg-slate-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    {report.admin && ( // عرض الـ Admin فقط إذا كان موجودًا
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Added by: {report.admin}
                      </span>
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Last Edited: {report.edit_at}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: report.report.replace(/<p>|<\/p>/g, ""), // إزالة التاج <p> عند العرض
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Not yet done
            </p>
          )}
        </div>
        <hr className="mb-10" />

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
                      : task.status === 1
                      ? "bg-yellow-100 border-yellow-200 text-yellow-600"
                      : "bg-green-100 border-green-200 text-green-600"
                  }`}
                >
                  <span>{task.task}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Employee: {task.employee_name} {/* عرض اسم الموظف */}
                    </span>
                    <span className="font-semibold">
                      {task.status === 0
                        ? "Pending"
                        : task.status === 1
                        ? "In Progress"
                        : "Completed"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Not yet done
            </p>
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
            {/* Report Type Select Box */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report Type
              </label>
              <select
                value={formData.report_type}
                onChange={(e) =>
                  setFormData({ ...formData, report_type: e.target.value })
                }
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Report Stock Input (Conditional Rendering) */}
            {formData.is_inspection === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Report Stock
                </label>
                <textarea
                  value={formData.report_stock}
                  onChange={(e) =>
                    setFormData({ ...formData, report_stock: e.target.value })
                  }
                  className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
            )}

            {/* Is Inspection Checkbox */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Is Inspection?
              </label>
              <input
                type="checkbox"
                checked={formData.is_inspection === 1}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    is_inspection: e.target.checked ? 1 : 0,
                  })
                }
                className="mt-2"
              />
            </div>

            {/* Report Editor (ReactQuill) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Report
              </label>
              <ReactQuill
                value={formData.report}
                onChange={(value) =>
                  setFormData({ ...formData, report: value })
                }
                className="bg-white dark:bg-slate-800 text-gray-700 dark:text-white"
              />
            </div>

            {/* Buttons */}
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
            <input
              type="hidden"
              value={taskFormData.project_id}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  project_id: e.target.value,
                })
              }
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Employee Name
              </label>
              <Select
                options={engineers.map((engineer) => ({
                  value: engineer.value,
                  label: engineer.label,
                }))}
                value={engineers.find(
                  (engineer) => engineer.value === taskFormData.employee_id
                )}
                onChange={(selectedOption) =>
                  setTaskFormData({
                    ...taskFormData,
                    employee_id: selectedOption.value,
                  })
                }
                className="w-full"
              />
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
