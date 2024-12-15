import Cookies from 'js-cookie';
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";


const EmployeesSpecials = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getEmployeesSpecials", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        return response.json();
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data); // تخزين البيانات في الحالة
        } else {
          setError("Failed to load employees specials.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error loading data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleEdit = (id) => {
    const selectedEmployee = data.find((employee) => employee.id === id);
    navigate(`/company/updatespecialise`, { state: selectedEmployee });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const token = Cookies.get('token'); // الحصول على التوكن من التخزين المحلي

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/deleteEmployeesSpecials/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // تمرير التوكن في الهيدر
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.status === 200) {
          // تحديث البيانات محليًا بعد الحذف
          setData(data.filter((item) => item.id !== id));
          alert("Employee deleted successfully!");
        } else {
          setError(result.msg || "Failed to delete employee.");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Error deleting employee. Please try again.");
      }
    }
  };

  return (
    <div className="container mx-auto mt-5 p-4">
      <h2 className="text-center font-bold text-2xl mb-5">
        Employees Specials
      </h2>

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/2"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/createSpecialise"
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          + Create Employee
        </Link>
      </div>

      {/* الجدول */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No data found.</p>
      ) : (
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
                  Type
                </th>
                <th className="px-4 py-3 text-right font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter((item) =>
                  search === ""
                    ? item
                    : item.name.toLowerCase().includes(search.toLowerCase())
                )
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">
                      {item.type === 0 ? "Engineer" : "Employee"}
                    </td>
                    <td className="px-4 py-3 flex justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(item.id)}
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
      )}
    </div>
  );
};

export default EmployeesSpecials;
