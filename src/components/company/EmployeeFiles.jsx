import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const EmployeeFiles = () => {
  const [data, setData] = useState([
    { id: 1, full_name: "John Doe", email: "john@example.com", phone: "123-456-7890" },
    { id: 2, full_name: "Jane Smith", email: "jane@example.com", phone: "987-654-3210" },
    { id: 3, full_name: "Sam Johnson", email: "sam@example.com", phone: "555-123-4567" },
    { id: 4, full_name: "Lisa White", email: "lisa@example.com", phone: "321-654-9870" },
  ]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");

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

  const handleDelete = (id) => {
    const confirm = window.confirm("Do you like to delete?");
    if (confirm) {
      setData(data.filter((employee) => employee.id !== id)); // إزالة الموظف من البيانات
      alert("Record deleted successfully.");
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
      <h2 className="text-center font-bold text-2xl">Employees Files</h2>

      <div className="flex justify-end my-3">
        <input
          className="mr-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search by name"
        />
        <Link
          to="/company/engineers"
          className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      <table className="table-auto w-full border border-gray-200 bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th
              onClick={() => sorting("id")}
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
            >
              ID {renderSortIcon("id")}
            </th>
            <th
              onClick={() => sorting("full_name")}
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
            >
              Full Name {renderSortIcon("full_name")}
            </th>
            <th
              onClick={() => sorting("email")}
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
            >
              Email {renderSortIcon("email")}
            </th>
            <th
              onClick={() => sorting("phone")}
              className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
            >
              Phone {renderSortIcon("phone")}
            </th>
            <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((i) => {
              return search.toLowerCase() === ""
                ? i
                : i.full_name.toLowerCase().includes(search.toLowerCase());
            })
            .map((d) => (
              <tr key={d.id} className="hover:bg-gray-100">
                <td className="px-4 py-3">{d.id}</td>
                <td className="px-4 py-3">{d.full_name}</td>
                <td className="px-4 py-3">{d.email}</td>
                <td className="px-4 py-3">{d.phone}</td>
                <td className="px-4 py-3 flex justify-end space-x-2">
                  <Link
                    to={`/update/${d.id}`}
                    className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
                  >
                    <FaTrash className="mr-2" />
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

export default EmployeeFiles;
