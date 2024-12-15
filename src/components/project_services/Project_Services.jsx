import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const Project_Services = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    // تحديث رابط الـ API هنا
    fetch("https://inout-api.octopusteam.net/api/front/getServices", {
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
          setData(resData.data); // تحديث البيانات بناءً على الاستجابة من الـ API
        } else {
          setError("No data found in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching project services:", error);
        setError("Failed to fetch services. Please try again later.");
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
    const selectedService = data.find((service) => service.id === id);
    console.log("Edit service", selectedService);
    // Navigate to edit page
  };

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this service?")) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteProjectService/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete service.");
          }
          return res.json();
        })
        .then((response) => {
          alert(response.msg || "Service deleted successfully.");
          setData(data.filter((service) => service.id !== id));
        })
        .catch((error) => {
          console.error("Error deleting service:", error);
          alert("Failed to delete the service. Please try again.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Project Services</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/project_services/addservice"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Service
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No services found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("id")}
                >
                  ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300"
                  onClick={() => sorting("name")}
                >
                  Name {renderSortIcon("name")}
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold text-lg border-b border-gray-300">
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
                    className={`hover:bg-gray-100 dark:bg-slate-900 dark:text-white transition duration-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="px-4 dark:bg-slate-900 dark:text-white border border-b-2 py-3 text-gray-800">{d.id}</td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white border border-b-2 py-3 text-gray-800">{d.name}</td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white border border-b-2 py-3 text-right space-x-2">
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

export default Project_Services;
