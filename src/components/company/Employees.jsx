import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Employees = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

    fetch("https://inout-api.octopusteam.net/api/front/getEmployees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch employees.");
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === 200) {
          setData(data.data); // تعيين البيانات من الحقل "data"
        } else {
          console.error("Error fetching employees:", data.msg);
        }
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDelete = (id) => {
    const confirm = window.confirm("Do you like to delete?");
    if (confirm) {
      const token = localStorage.getItem('token');
      fetch(`https://inout-api.octopusteam.net/api/front/deleteEmployee/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete record.");
          }
          return response.json();
        })
        .then(() => {
          alert("Record deleted successfully.");
          setData(data.filter((employee) => employee.id !== id)); // تحديث البيانات بعد الحذف
        })
        .catch((error) => console.error("Error deleting record:", error));
    }
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Employees</h2>

      {/* Search Input */}
      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/engineers"
          className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      {/* Employees Table */}
      <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
            <th
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
              onClick={() => sorting("id")}
            >
              ID {renderSortIcon("id")}
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
              onClick={() => sorting("full_name")}
            >
              Full Name {renderSortIcon("full_name")}
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
              onClick={() => sorting("email")}
            >
              Email {renderSortIcon("email")}
            </th>
            <th
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
              onClick={() => sorting("phone")}
            >
              Phone {renderSortIcon("phone")}
            </th>
            <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((employee) => {
              return search.toLowerCase() === ""
                ? employee
                : employee.full_name.toLowerCase().includes(search.toLowerCase());
            })
            .map((d) => (
              <tr
                key={d.id}
                className="hover:bg-gray-100 dark:hover:bg-slate-500 dark:bg-slate-900 transition duration-200"
              >
                <td className="px-4 py-3 dark:text-white">{d.id}</td>
                <td className="px-4 py-3 dark:text-white">{d.full_name}</td>
                <td className="px-4 py-3 dark:text-white">{d.email}</td>
                <td className="px-4 py-3 dark:text-white">{d.phone}</td>
                <td className="px-4 py-3 dark:text-white">
                  <Link
                    to={`/company/editemp/${d.id}`}
                    className="bg-green-800 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 inline-flex items-center"
                  >
                    <FaEdit className="mr-2 text-white w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 ml-2 inline-flex items-center"
                  >
                    <FaTrash className="mr-2 text-white w-4 h-4" />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employees;
