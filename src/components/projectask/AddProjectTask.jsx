import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProjectTask = () => {
  const [projects, setProjects] = useState([]); // بيانات المشاريع
  const [selectedProjectId, setSelectedProjectId] = useState(""); // الـ ID اللي هيتختار من الـ Select Box
  const [engineers, setEngineers] = useState([]); // بيانات المهندسين
  const [selectedEngineerId, setSelectedEngineerId] = useState(""); // الـ ID اللي هيتختار من الـ Select Box للمهندسين
  const [task, setTask] = useState(""); // التاسك اللي هيتكتب في الـ Textarea
  const [isLoading, setIsLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ
  const navigate = useNavigate();

  // جلب بيانات المشاريع
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    // جلب بيانات المشاريع
    fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch projects");
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setProjects(resData.data);
        } else {
          setError("No projects found");
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
        setError("Failed to fetch projects");
      });

    // جلب بيانات المهندسين
    fetch("https://inout-api.octopusteam.net/api/front/getEngineers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch engineers");
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setEngineers(resData.data);
        } else {
          setError("No engineers found");
        }
      })
      .catch((error) => {
        console.error("Error fetching engineers:", error);
        setError("Failed to fetch engineers");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // دالة إضافة التاسك
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    if (!selectedProjectId || !selectedEngineerId || !task) {
      toast.error("Please select a project, an engineer, and enter a task.");
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
            project_id: selectedProjectId,
            employee_id: selectedEngineerId, // إضافة الـ employee_id
            task: task,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to add task");

      const responseData = await response.json();
      toast.success(responseData.msg || "Task added successfully");

      // إعادة توجيه المستخدم للصفحة الرئيسية بعد الإضافة
      setTimeout(() => {
        navigate("/projectask/projecttask");
      }, 2000); // الانتظار لمدة ثانيتين قبل التوجيه
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Add Project Task</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
        <div className="mb-4">
          <label htmlFor="project" className="block text-gray-700 font-semibold mb-2">
            Select Project
          </label>
          <select
            id="project"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Choose a project
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="engineer" className="block text-gray-700 font-semibold mb-2">
            Select Engineer
          </label>
          <select
            id="engineer"
            value={selectedEngineerId}
            onChange={(e) => setSelectedEngineerId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>
              Choose an engineer
            </option>
            {engineers.map((engineer) => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="task" className="block text-gray-700 font-semibold mb-2">
            Task
          </label>
          <textarea
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter the task..."
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-800 text-white py-2 px-4 rounded-lg hover:bg-blue-900 transition duration-300"
        >
          Add Task
        </button>
      </form>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : null}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default AddProjectTask;