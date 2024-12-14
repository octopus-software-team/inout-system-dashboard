import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";

const ShowAllTask = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("No token found, cannot fetch tasks.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch(`https://inout-api.octopusteam.net/api/front/getTasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          setError("No data found in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
        setError("Failed to fetch tasks. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] > b[col] ? 1 : -1;
      });
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] < b[col] ? 1 : -1;
      });
      setOrder("ASC");
    }
    setData(sorted);
    setSortedColumn(col);
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleEdit = (id) => {
    navigate(`/todo/updatetask/${id}`);
  };
  
  const handleDelete = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this task?")) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteTask/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            alert("Task deleted successfully.");
            setData(data.filter((task) => task.id !== id));
          } else {
            alert("Failed to delete task.");
          }
        })
        .catch((error) => {
          console.error("Error deleting task:", error);
          alert("Failed to delete task. Please try again.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Show All Tasks</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <Link
          to="/todo/addnewtask"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Task
        </Link> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No tasks found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("id")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("name")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Task Name {renderSortIcon("name")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("start_date")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Start Date {renderSortIcon("start_date")}
                </th>
                <th
                  className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("end_date")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  End Date {renderSortIcon("end_date")}
                </th>
                <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((i) => {
                  return search.toLowerCase() === ""
                    ? i
                    : i.name.toLowerCase().includes(search.toLowerCase());
                })
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
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(d.id)}
                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(d.id)}
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
    </div>
  );
};

export default ShowAllTask;
