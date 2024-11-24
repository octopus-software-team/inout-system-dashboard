import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const AddMaterials = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // Fetch data from API with headers and token
  useEffect(() => {
    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMzEyMDkzLCJleHAiOjE3NjM4NDgwOTMsIm5iZiI6MTczMjMxMjA5MywianRpIjoiMVdmRWZka3hybmN4V2wycSIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.8kk0U67fvEKT-MKytjKsFlshFOQsj4pE5YpmhiEVszY"

    fetch("https://inout-api.octopusteam.net/api/front/getMaterials", {
      method: "GET",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch materials");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          alert("No materials found");
        }
      })
      .catch((err) => {
        console.error("Error fetching materials:", err);
        alert("Failed to fetch materials");
      });
  }, []);
  const handleDelete = (id) => {
    const token = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2lub3V0LWFwaS5vY3RvcHVzdGVhbS5uZXQvYXBpL2Zyb250L2xvZ2luIiwiaWF0IjoxNzMyMzEyMDkzLCJleHAiOjE3NjM4NDgwOTMsIm5iZiI6MTczMjMxMjA5MywianRpIjoiMVdmRWZka3hybmN4V2wycSIsInN1YiI6IjEiLCJwcnYiOiJkZjg4M2RiOTdiZDA1ZWY4ZmY4NTA4MmQ2ODZjNDVlODMyZTU5M2E5In0.8kk0U67fvEKT-MKytjKsFlshFOQsj4pE5YpmhiEVszY"
    const confirmDelete = window.confirm("Do you really want to delete this material?");
    if (confirmDelete) {
      fetch(`https://inout-api.octopusteam.net/api/front/deleteMaterial/${id}`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete material");
          }
          return res.json();
        })
        .then((resData) => {
          alert(resData.msg || "Material deleted successfully");
          setData((prevData) => prevData.filter((material) => material.id !== id));
        })
        .catch((err) => {
          console.error("Error deleting material:", err);
          alert("Failed to delete material. Please try again.");
        });
    }
  };

  

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Materials</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/assets/creatematerials"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Material
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                ID
              </th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                Stock
              </th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                Type
              </th>
              <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
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
                  <td className="px-4 py-3 text-gray-800">{item.id}</td>
                  <td className="px-4 py-3 text-gray-800">{item.name}</td>
                  <td className="px-4 py-3 text-gray-800">{item.stock}</td>
                  <td className="px-4 py-3 text-gray-800">
                    {item.type === 0 ? "Type A" : "Type B"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/company/assets/updatematerials`, { state: item })
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

export default AddMaterials;
