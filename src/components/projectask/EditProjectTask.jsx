import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProjectTask = () => {
  const { id } = useParams();
  const location = useLocation();
  const [projectName, setProjectName] = useState("");
  const [task, setTask] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // استخدام البيانات الممررة من خلال navigate
  useEffect(() => {
    if (location.state && location.state.task && location.state.projects) {
      const { task: selectedTask, projects: projectList } = location.state;
      setTask(selectedTask.task);
      setProjectName(selectedTask.project_id);
      setProjects(projectList);
      setIsLoading(false);
    } else {
      setError("No task data found. Please go back and try again.");
      setIsLoading(false);
    }
  }, [location.state]);

  // دالة تحديث التاسك
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    if (!projectName || !task) {
      toast.error("Please select a project and enter a task.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateProjectTask/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: projectName,
            task: task,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update task");

      const responseData = await response.json();
      toast.success(responseData.msg || "Task updated successfully");

      setTimeout(() => {
        navigate("/projectask/projecttask");
      }, 2000);
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Edit Project Task</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-8">
        <div className="mb-4">
          <label htmlFor="project" className="block text-gray-700 font-semibold mb-2">
            Select Project
          </label>
          <select
            id="project"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
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
          Update Task
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

export default EditProjectTask;