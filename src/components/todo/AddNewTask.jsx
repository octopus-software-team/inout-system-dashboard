import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const AddNewTask = () => {
  const [taskName, setTaskName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [type, setType] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = Cookies.get("token");

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployees",
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
          setEmployees(data.data);
        } else {
          toast.error("Failed to load employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Failed to load employees. Please try again.");
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !employeeId || !startDate || !endDate) {
      toast.error("Please fill all fields.");
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const taskData = {
      name: taskName,
      employee_id: employeeId,
      status: status,
      start_date: startDate,
      end_date: endDate,
      type: type,
    };

    try {
      const response = await fetch("https://inout-api.octopusteam.net/api/front/addTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success("Task added successfully.");
        setTimeout(() => {
          navigate("/todo/showalltask");
        }, 2000);
      } else {
        toast.error(data.msg || "Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-800 flex items-center justify-center py-10 px-4">
      <div className="service w-full max-w-2xl dark:bg-slate-900 rounded-lg shadow-lg p-8">
        <h2 className="text-center text-3xl font-bold text-gray-800 dark:text-white mb-6">
          Add New Task
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="taskName" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Task Name
            </label>
            <input
              type="text"
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="employeeId" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Employee
            </label>
            <select
              id="employeeId"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="type" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={0}>Urgent</option>
              <option value={1}>High</option>
              <option value={2}>Low</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="startDate" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Start Date
            </label>
            <input
              type="datetime-local"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="endDate" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              End Date
            </label>
            <input
              type="datetime-local"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Add Task
            </button>
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </div>
  );
};

export default AddNewTask;
