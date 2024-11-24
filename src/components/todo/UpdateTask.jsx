import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateTask = () => {
  const [task, setTask] = useState({
    name: "",
    employee_id: "",
    status: 1,
    start_date: "",
    end_date: "",
  });
  const [message, setMessage] = useState("");
  const { taskId } = useParams();  // الحصول على معرّف المهمة من الـ URL
  const navigate = useNavigate();

  // جلب بيانات المهمة الحالية عند تحميل الصفحة
  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`https://inout-api.octopusteam.net/api/front/getTask`);
        const data = await response.json();
        if (data.status === 200) {
          setTask(data.data);
        } else {
          setMessage("Task not found");
        }
      } catch (error) {
        setMessage("Error fetching task data");
      }
    };
    fetchTask();
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please log in.");
      return;
    }

    const taskData = {
      name: task.name,
      employee_id: task.employee_id,
      status: task.status,
      start_date: task.start_date,
      end_date: task.end_date,
    };

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/updateTask/${taskId}`,
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
        setMessage("Task updated successfully.");
        // بعد التحديث بنجاح، يمكن إعادة توجيه المستخدم إلى صفحة أخرى أو صفحة المهمة
        navigate("/tasks/showAll"); 
      } else {
        setMessage(`Error: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      setMessage("Failed to update task. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Update Task</h2>
      {message && <p className="text-center text-lg">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Task Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md"
            value={task.name}
            onChange={(e) => setTask({ ...task, name: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Employee ID</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md"
            value={task.employee_id}
            onChange={(e) => setTask({ ...task, employee_id: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Status</label>
          <select
            className="w-full px-4 py-2 border rounded-md"
            value={task.status}
            onChange={(e) => setTask({ ...task, status: e.target.value })}
          >
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border rounded-md"
            value={task.start_date}
            onChange={(e) => setTask({ ...task, start_date: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg font-semibold text-gray-700">End Date</label>
          <input
            type="datetime-local"
            className="w-full px-4 py-2 border rounded-md"
            value={task.end_date}
            onChange={(e) => setTask({ ...task, end_date: e.target.value })}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            Update Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTask;
