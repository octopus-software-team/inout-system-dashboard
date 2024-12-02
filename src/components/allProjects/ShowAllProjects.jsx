import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ShowAllProjects = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleViewClick = () => {
    navigate("/allprojects/addreport");
  };

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() > b[col].toString().toLowerCase() ? 1 : -1
      );
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) =>
        a[col].toString().toLowerCase() < b[col].toString().toLowerCase() ? 1 : -1
      );
      setOrder("ASC");
    }
    setData(sorted);
    setSortedColumn(col);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          setData(res.data); 
        } else {
          console.error("Error: Data not found");
          setError("No data found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch projects. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleDelete = (id) => {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    
    if (confirm) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("You are not authenticated. Please log in.");
        return;
      }
  
      fetch(`https://inout-api.octopusteam.net/api/front/deleteProject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((res) => {
          if (res.status === 200) {
            alert("Project deleted successfully!");
            setData((prevData) => prevData.filter((project) => project.id !== id));
          } else {
            alert(`Failed to delete project: ${res.msg || 'Unknown error'}`);
          }
        })
        .catch((err) => {
          console.error("Error deleting project:", err);
          alert("Failed to delete project. Please try again.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Show All Projects</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <Link
          to="/allprojects/createproject"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Project
        </Link> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No projects found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 dark:bg-slate-900 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  ID {renderSortIcon("id")}
                </th>
                <th className="px-4 dark:bg-slate-900 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name {renderSortIcon("name")}
                </th>
                <th className="px-4 dark:bg-slate-900 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Inspection Date {renderSortIcon("inspection_date")}
                </th>
                <th className="px-4 dark:bg-slate-900 py-3 text-right font-semibold text-lg border-b border-gray-300">
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
                    className={`hover:bg-gray-100 dark:bg-slate-900 transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">{d.id}</td>
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">{d.name}</td>
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-gray-800">{d.inspection_date}</td>
                    <td className="px-4 py-3 dark:bg-slate-900 dark:text-white text-right space-x-2">
                      <button
                        onClick={() => navigate(`/allprojects/updateprojects/${d.id}`)}
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
                      <button
                        onClick={handleViewClick}
                        className="bg-blue-400 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                      >
                        <FaEye className="inline mr-2" />
                        View
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

export default ShowAllProjects;
