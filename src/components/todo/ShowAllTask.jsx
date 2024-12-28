import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// خرائط (Mappings) لتحويل الأرقام إلى قيم نصية
const typeMap = {
  0: "Urgent",   // عاجل
  1: "High",     // عالي الأهمية
  2: "Low",      // منخفض الأولوية
};

const statusMap = {
  0: "Inactive", // غير فعّال
  1: "Active",   // فعّال
};

const ShowAllTask = () => {
  const [tasks, setTasks] = useState([]);
  const [employeesMap, setEmployeesMap] = useState({});
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  // دالة لجلب قائمة الـ Employees من أجل الحصول على أسمائهم
  const fetchEmployees = async () => {
    try {
      const token = Cookies.get("token");
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
      if (data.status === 200 && Array.isArray(data.data)) {
        // نبني قاموس/Map من ID -> اسم الموظف
        const map = {};
        data.data.forEach((emp) => {
          map[emp.id] = emp.full_name; // أو أي عمود اسم موجود: emp.full_name
        });
        setEmployeesMap(map);
      } else {
        toast.error("Failed to load employees.");
      }
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to load employees.");
    }
  };

  // دالة لجلب المهام
  const fetchTasks = async () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "https://inout-api.octopusteam.net/api/front/getTasks",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const resData = await res.json();
      if (resData && resData.data) {
        setTasks(resData.data);
      } else {
        setError("No data found in the response");
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      toast.error("Failed to fetch tasks. Please try again later.");
      setError("Failed to fetch tasks. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // نقوم بجلب الموظفين والمهام مرة واحدة عند التحميل
  useEffect(() => {
    fetchEmployees();
    fetchTasks();
  }, []);

  // دالة الفرز (Sorting)
  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...tasks].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] > b[col] ? 1 : -1;
      });
      setOrder("DSC");
    } else {
      sorted = [...tasks].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] < b[col] ? 1 : -1;
      });
      setOrder("ASC");
    }
    setTasks(sorted);
    setSortedColumn(col);
  };

  // دالة تظهر أيقونة سهم الفرز
  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleEdit = (id) => {
    navigate(`/todo/updatetask/${id}`);
  };

  // فتح/إغلاق مودال الـتأكيد على الحذف
  const openConfirmModal = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  // تأكيد الحذف
  const confirmDelete = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      closeConfirmModal();
      return;
    }

    fetch(`https://inout-api.octopusteam.net/api/front/deleteTask/${deleteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          setTasks((prevData) => prevData.filter((task) => task.id !== deleteId));
          toast.success(data.msg || "Task deleted successfully.");
        } else {
          toast.error("Failed to delete task.");
        }
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete task. Please try again.");
      })
      .finally(() => {
        closeConfirmModal();
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">
        Show All Tasks
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-700 -mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("id")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  # {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("name")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Task Name {renderSortIcon("name")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("start_date")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Start Date {renderSortIcon("start_date")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("end_date")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  End Date {renderSortIcon("end_date")}
                </th>
                {/** نعرض اسم الموظف بدلاً من الـ ID */}
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                >
                  Employee Name
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("status")}
                >
                  Status {renderSortIcon("status")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("type")}
                >
                  Type {renderSortIcon("type")}
                </th>
                <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tasks
                .filter((task) =>
                  search.toLowerCase() === ""
                    ? task
                    : task.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((d, index) => (
                  <tr
                    key={d.id}
                    className={`hover:bg-gray-100 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 text-gray-800">{d.id}</td>
                    <td className="px-4 py-3 text-gray-800">{d.name}</td>
                    <td className="px-4 py-3 text-gray-800">{d.start_date}</td>
                    <td className="px-4 py-3 text-gray-800">{d.end_date}</td>

                    {/** إذا وجدنا في القاموس اسم الموظف corresponding للـ ID نعـرضه؛ وإلا نعرض الـ ID */}
                    <td className="px-4 py-3 text-gray-800">
                      {employeesMap[d.employee_id]
                        ? employeesMap[d.employee_id]
                        : `Employee ID: ${d.employee_id}`}
                    </td>

                    <td className="px-4 py-3 text-gray-800">
                      {statusMap[d.status]}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {typeMap[d.type]}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(d.id)}
                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => openConfirmModal(d.id)}
                        className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                      >
                        <FaTrash className="inline mr-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this task?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

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
  );
};

export default ShowAllTask;
