import React, { useState, useEffect } from "react";

const AddNewTask = () => {
  const [taskName, setTaskName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState(""); 
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getEmployees",
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
          setMessage("Failed to load employees.");
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setMessage("Failed to load employees. Please try again.");
      }
    };

    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!taskName || !employeeId || !startDate || !endDate) {
      setMessage("Please fill all fields.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    const taskData = {
      name: taskName,
      employee_id: employeeId,
      status: status,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addTask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        }
      );

      const data = await response.json();

      if (data.status === 200) {
        setMessage("Task added successfully.");
      } else {
        setMessage("Failed to add task.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      setMessage("Failed to add task. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Add New Task</h2>

      {message && <p className="text-center text-lg">{message}</p>}

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-4">
        <div className="mb-4">
          <label htmlFor="taskName" className="block text-lg font-semibold text-gray-700">
            Task Name
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter task name"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="employeeId" className="block text-lg font-semibold text-gray-700">
            Employee
          </label>
          <select
            id="employeeId"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
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
          <label htmlFor="status" className="block text-lg font-semibold text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="startDate" className="block text-lg font-semibold text-gray-700">
            Start Date
          </label>
          <input
            type="datetime-local"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="endDate" className="block text-lg font-semibold text-gray-700">
            End Date
          </label>
          <input
            type="datetime-local"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewTask;
