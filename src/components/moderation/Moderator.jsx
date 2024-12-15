import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


const Moderator = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      alert("Please log in first");
      navigate("/moderation/moderators");
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getAdmins", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch admins");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          // Only keep the necessary fields (id, name, email)
          const filteredData = resData.data.map(({ id, name, email }) => ({
            id,
            name,
            email,
          }));
          setData(filteredData);
        } else {
          alert("No admins found");
        }
      })
      .catch((err) => {
        console.error("Error fetching admins:", err);
        alert("Failed to fetch admins");
      });
  }, [navigate]);

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    const confirmDelete = window.confirm(
      "Do you really want to delete this admin?"
    );
    if (confirmDelete) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteAdmin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then(async (res) => {
          console.log("Response status:", res.status);
          const responseText = await res.text();
          console.log("Response text:", responseText);
          if (!res.ok) {
            throw new Error("Failed to delete admin");
          }
          return JSON.parse(responseText);
        })
        .then((resData) => {
          alert(resData.msg || "Admin deleted successfully");
          localStorage.removeItem("token")
          setData((prevData) => prevData.filter((admin) => admin.id !== id));
        })
        .catch((err) => {
          console.error("Error deleting admin:", err);
          alert("Failed to delete admin. Please try again.");
        });
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Moderators</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search admins..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/moderation/createadmin/"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Admin
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                ID
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                Name
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                Email
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold text-lg border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) => {
                return search.toLowerCase() === ""
                  ? item
                  : item.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-100 transition duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {item.id}
                  </td>
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                    {item.email}
                  </td>
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/moderation/editadmin`, { state: item })
                      }
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
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

export default Moderator;
