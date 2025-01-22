import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProjectTask = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [engineers, setEngineers] = useState([]); // حالة لتخزين بيانات المهندسين
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    // جلب بيانات المهام
    fetch("https://inout-api.octopusteam.net/api/front/getProjectTasks", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setTasks(resData.data);
        } else {
          setError("No tasks found");
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks");
      });

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

  // دالة للحصول على اسم المشروع
  const getProjectName = (projectId) => {
    const project = projects.find((proj) => proj.id === projectId);
    return project ? project.name : "Unknown Project";
  };

  // دالة للحصول على اسم الموظف
  const getEmployeeName = (employeeId) => {
    const employee = engineers.find((eng) => eng.id === employeeId);
    return employee ? employee.full_name : "Unknown Employee";
  };

  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this task?</p>
        <div className="flex space-x-2 justify-end">
          <button
            onClick={() => handleConfirmDelete(id, token, confirmToast)}
            className="bg-red-600 text-white py-1 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            className="bg-gray-600 text-white py-1 px-4 rounded-lg"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  const handleConfirmDelete = (id, token, confirmToast) => {
    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteProjectTask/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete task");
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Task deleted successfully");
        setTasks(tasks.filter((task) => task.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
        toast.error("Failed to delete the task");
        toast.dismiss(confirmToast);
      });
  };

  const handleEdit = (id) => {
    const selectedTask = tasks.find((task) => task.id === id);
    navigate(`/projectask/editprojecttask/${id}`, {
      state: { task: selectedTask, projects, engineers },
    });
  };

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "100px",
    },
    {
      name: "Project Name",
      selector: (row) => getProjectName(row.project_id),
      sortable: true,
      width: "200px",
    },
    {
      name: "Employee Name",
      selector: (row) => row.employee_name, // استخدام employee_name مباشرةً
      sortable: true,
      width: "200px",
    },
    {
      name: "Task",
      selector: (row) => row.task,
      sortable: true,
      width: "300px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row.id)} className="btn1 edit">
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn1 colors">
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "150px",
    },
  ];

  const filteredTasks = tasks.filter((task) =>
    search === ""
      ? task
      : task.task.toLowerCase().includes(search.toLowerCase()) ||
        getProjectName(task.project_id).toLowerCase().includes(search.toLowerCase()) ||
        getEmployeeName(task.employee_id).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">
        Project Tasks
      </h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Link
          to="/projectask/addprojecttask"
          className="icons bg-blue-800 text-white mr-2 font-semibold rounded-lg px-4 py-2"
        >
          <FaPlus className="inline mr-2" />
          Add Project Task
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredTasks}
        pagination
        highlightOnHover
        striped
        responsive
        defaultSortField="id"
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        className="shadow-lg rounded-lg overflow-hidden"
      />

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tasks found.</p>
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

export default ProjectTask;