import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import Cookies from 'js-cookie';
import { FaSpinner } from "react-icons/fa"; // استيراد أيقونة Spinner

const UpdateTask = () => {
  const [task, setTask] = useState({
    name: "",
    employee_id: "",
    status: 1,
    start_date: "",
    end_date: "",
  });
  const [employees, setEmployees] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // حالة التحميل

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      toast.error("No token found. Please log in.");
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/getTasks`,
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
          const selectedTask = data.data.find(
            (task) => task.id === parseInt(id)
          );
          if (selectedTask) {
            setTask(selectedTask);
          } else {
            toast.error("Task not found");
            navigate("/todo/showalltask"); // إعادة التوجيه إذا لم يتم العثور على المهمة
          }
        } else {
          toast.error("Failed to fetch tasks");
        }
      } catch (error) {
        toast.error("Error fetching task data");
        console.error("Error fetching task data:", error);
      }
    };

    fetchTask();
  }, [id, navigate]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = Cookies.get('token');

      if (!token) {
        toast.error("No token found. Please log in.");
        navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
        return;
      }

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
          toast.error("Failed to fetch employees");
        }
      } catch (error) {
        toast.error("Error fetching employees data");
        console.error("Error fetching employees data:", error);
      }
    };
    fetchEmployees();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // بدء حالة التحميل
    toast.dismiss(); // إخفاء أي توستات معلقة

    const token = Cookies.get('token');
    if (!token) {
      toast.error("No token found. Please log in.");
      setIsLoading(false);
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
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
        `https://inout-api.octopusteam.net/api/front/updateTask/${id}`,
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
        toast.success("Task updated successfully.");
        setTimeout(() => {
          navigate("/todo/showalltask");
        }, 2000);
      } else {
        toast.error(`Error: ${data.msg}`);
      }
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
      console.error("Error updating task:", error);
    } finally {
      setIsLoading(false); // إنهاء حالة التحميل
    }
  };

  return (
    <div className="flex items-center justify-center mt-6 py-6">
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
      />
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-lg w-full">
        <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
          Update Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Task Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee
            </label>
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={task.employee_id}
              onChange={(e) => setTask({ ...task, employee_id: e.target.value })}
              required
              disabled={isLoading}
            >
              <option value="">Select an Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={task.status}
              onChange={(e) => setTask({ ...task, status: e.target.value })}
              required
              disabled={isLoading}
            >
              <option value={1}>Active</option>
              <option value={0}>Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={task.start_date}
              onChange={(e) => setTask({ ...task, start_date: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="datetime-local"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={task.end_date}
              onChange={(e) => setTask({ ...task, end_date: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed flex items-center justify-center" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTask;
