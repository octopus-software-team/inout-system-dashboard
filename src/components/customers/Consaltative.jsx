import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Consaltative = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Fetch data with token from the new API
  useEffect(() => {
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    axios
      .get("https://inout-api.octopusteam.net/api/front/getProjectConsultives", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        if (res.data && res.data.data) {
          setData(res.data.data);
        } else {
          alert("No data found in the response.");
        }
      })
      .catch((err) => console.error("Error fetching consultative data:", err));
  }, []);

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
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

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    const confirm = window.confirm("Do you like to delete?");
    if (confirm) {
      axios
        .delete(`https://inout-api.octopusteam.net/api/front/deleteProjectConsultive/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          alert("Record deleted successfully.");
          setData(data.filter((item) => item.id !== id));
        })
        .catch((err) => console.error("Error deleting consultative:", err));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Consultatives</h2>

      <div className="flex justify-end my-3">
        <input
          className="mr-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Search"
        />
        <Link
          to="/create"
          className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => sorting("id")}>ID {renderSortIcon("id")}</th>
            <th onClick={() => sorting("name")}>
              Name {renderSortIcon("name")}
            </th>
            <th onClick={() => sorting("phoneNumber")}>
              Phone Number {renderSortIcon("phoneNumber")}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((item) =>
              search.toLowerCase() === ""
                ? item
                : item.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.phoneNumber}</td>
                <td>
                  <Link
                    to={`/update/${item.id}`}
                    className="bg-green-800 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 inline-flex items-center"
                  >
                    <FaEdit className="mr-2 text-white w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(item.id)}
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

export default Consaltative;
