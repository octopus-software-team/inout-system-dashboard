import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Clients = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

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

  useEffect(() => {
    axios
      .get("http://localhost:3030/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Clients</h2>

      <div className="flex justify-end my-3">
        <input
          className="mr-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search"
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
            .filter((i) => {
              return search.toLowerCase() === ""
                ? i
                : i.name.toLowerCase().includes(search);
            })
            .map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.phoneNumber}</td>
                <td>
                  <Link
                    to={`/update/${d.id}`}
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

  function handleDelete(id) {
    const confirm = window.confirm("Do you like to delete");
    if (confirm) {
      axios.delete("http://localhost:3030/users/" + id).then((res) => {
        alert("record deleted");
        navigate("/company/services");
      });
    }
  }
};

export default Clients;
