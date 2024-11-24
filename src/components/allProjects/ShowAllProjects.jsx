import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ShowAllProjects = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMjk0NjU0LCJleHAiOjE3NjM4MzA2NTQsIm5iZiI6MTczMjI5NDY1NCwianRpIjoiMUlNQnhLRjBJcWJrUHlERiIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.QkBDV1DsGpt0P3vgH9rYGR8C03YthiRz0WqoYEL6xjY";

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
    fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          setData(res.data); // تعيين البيانات القادمة من API
        } else {
          console.error("Error: Data not found");
        }
      })
      .catch((err) => console.error(err));
  }, [token]);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Show All Projects</h2>

      <div className="flex justify-end my-3">
        <input
          className="mr-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search"
        />
        <Link
          to="/allprojects/createproject"
          className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => sorting("id")}>ID {renderSortIcon("id")}</th>
            <th onClick={() => sorting("name")}>Name {renderSortIcon("name")}</th>
            <th onClick={() => sorting("inspection_date")}>
              Inspection Date {renderSortIcon("inspection_date")}
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
                <td>{d.inspection_date}</td>
                <td>
                  <button
                    onClick={() => navigate(`/allprojects/updateprojects/${d.id}`)}

                    className="bg-green-800 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 inline-flex items-center"
                  >
                    <FaEdit className="mr-2 text-white w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 ml-2 inline-flex items-center"
                  >
                    <FaTrash className="mr-2 text-white w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={handleViewClick}
                    className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 inline-flex items-center"
                  >
                    <FaEye className="mr-2 text-white w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    const confirm = window.confirm("Are you sure you want to delete this project?");
    if (confirm) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteProject/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token, // التوكن المطلوب للمصادقة
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
            setData((prevData) => prevData.filter((project) => project.id !== id)); // تحديث الجدول
          } else {
            alert(`Failed to delete project: ${res.msg}`);
          }
        })
        .catch((err) => console.error("Error deleting project:", err));
    }
  }
  
};

export default ShowAllProjects;
