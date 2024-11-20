import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Branchs = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch branches");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          alert("No data found");
        }
      })
      .catch((err) => {
        console.error("Error fetching branches:", err);
        alert("Failed to fetch branches");
      });
  }, []);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleEdit = (id) => {
    const selectedBranch = data.find((branch) => branch.id === id);
    navigate(`/company/updatebranch`, { state: selectedBranch });
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    const confirm = window.confirm("Do you want to delete this branch?");
    if (confirm) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteBranch/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete branch");
          }
          return res.json();
        })
        .then((resData) => {
          alert(resData.msg || "Branch deleted successfully");
          setData(data.filter((branch) => branch.id !== id));
        })
        .catch((err) => {
          console.error("Error deleting branch:", err);
          alert("Failed to delete branch");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Branches</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/addbranch"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Branch
        </Link>
      </div>

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
                Name {renderSortIcon("name")}
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                onClick={() => sorting("latitude")}
                aria-sort={order === "ASC" ? "ascending" : "descending"}
              >
                Latitude {renderSortIcon("latitude")}
              </th>
              <th
                className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300"
                onClick={() => sorting("longitude")}
                aria-sort={order === "ASC" ? "ascending" : "descending"}
              >
                Longitude {renderSortIcon("longitude")}
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
                  <td className="px-4 py-3 text-gray-800">{d.latitude}</td>
                  <td className="px-4 py-3 text-gray-800">{d.longitude}</td>
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
    </div>
  );
};

export default Branchs;
