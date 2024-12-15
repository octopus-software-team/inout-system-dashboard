import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';


const Consultative = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setData(res.data);
        } else {
          alert("No data found in the response.");
        }
      })
      .catch((err) => console.error("Error fetching consultative data:", err));
  }, []);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // هنا نستخدم Toast للتأكيد بدلاً من confirm
    const confirmToast = toast(
      <div>
        <p>Do you like to delete?</p>
        <div className="flex space-x-2 justify-end mt-2">
          <button
            onClick={() => handleConfirmDelete(id, token, confirmToast)}
            className="bg-red-600 text-white py-1 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)}
            className="bg-gray-600 text-white py-1 px-4 rounded-lg"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };

  const handleConfirmDelete = (id, token, confirmToast) => {
    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteProjectConsultive/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(() => {
        toast.success("Record deleted successfully.");
        setData((prevData) => prevData.filter((item) => item.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((err) => {
        console.error("Error deleting consultative:", err);
        toast.error("Failed to delete the record.");
        toast.dismiss(confirmToast);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-gray-800">
        Consultatives
      </h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/customers/createconsultive"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Consultive
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border-collapse border border-gray-200 rounded-lg">
          <thead>
            <tr className="text-white bg-gradient-to-r from-blue-600 to-blue-400">
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer">
                ID
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer">
                Name
              </th>
              <th
                className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
              >
                Phone Number
              </th>
              <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-center font-semibold text-lg border-b border-gray-300">
                Actions
              </th>
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
                <tr
                  key={item.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-4 py-3 dark:text-white text-gray-800">
                    {item.id}
                  </td>
                  <td className="px-4 py-3 dark:text-white text-gray-800">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 dark:text-white text-gray-800">
                    {item.phone}
                  </td>
                  <td className="px-4 py-3 dark:text-white text-center">
                    <Link
                      to={`/customers/editconsultive/${item.id}`}
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-500 transform hover:scale-105 transition duration-300"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-500 ml-2 transform hover:scale-105 transition duration-300"
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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Consultative;
