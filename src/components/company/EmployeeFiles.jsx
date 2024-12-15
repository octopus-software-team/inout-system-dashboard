import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';


const EmployeeFiles = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const token = Cookies.get('token'); 

    const fetchData = async () => {
      try {
        const response = await fetch("https://inout-api.octopusteam.net/api/front/getEmployeeFiles", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const result = await response.json();
        if (result.status === 200) {
          setData(result.data);
        } else {
          setError("Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      setData(data.filter((employee) => employee.id !== id));
      alert("Record deleted successfully.");
    }
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
          to="/company/createempfiles"
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
