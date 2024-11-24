import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Employees = () => {
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
    fetch("https://inout-api.octopusteam.net/api/front/getEmployees", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMTc3NDA2LCJleHAiOjE3NjM3MTM0MDYsIm5iZiI6MTczMjE3NzQwNiwianRpIjoiR0FMMk5vcVA5TmR6RHpaWCIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.WNmITXIkVJFmUZfhdiqtGgNaLafVAUD5Wu6wGA2C2Qw" 
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
      fetch(`https://inout-api.octopusteam.net/api/front/deleteEmployee/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMTc3NDA2LCJleHAiOjE3NjM3MTM0MDYsIm5iZiI6MTczMjE3NzQwNiwianRpIjoiR0FMMk5vcVA5TmR6RHpaWCIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.WNmITXIkVJFmUZfhdiqtGgNaLafVAUD5Wu6wGA2C2Qw",
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

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => sorting("id")}>ID {renderSortIcon("id")}</th>
            <th onClick={() => sorting("full_name")}>
              Full Name {renderSortIcon("full_name")}
            </th>
            <th onClick={() => sorting("email")}>
              Email {renderSortIcon("email")}
            </th>
            <th onClick={() => sorting("phone")}>
              Phone {renderSortIcon("phone")}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((i) => {
              return search.toLowerCase() === ""
                ? i
                : i.full_name.toLowerCase().includes(search);
            })
            .map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.full_name}</td>
                <td>{d.email}</td>
                <td>{d.phone}</td>
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
};

export default Employees;
