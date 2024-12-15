import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from 'js-cookie';

const Owner = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = Cookies.get('token');

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
    if (!token) {
      console.log("No token found, cannot fetch data.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          const owners = result.data.filter((item) => item.type === 1);
          setData(owners);
        } else {
          console.log("Failed to fetch data:", result.msg);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  }, [token]);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleDelete = (id) => {
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this owner?</p>
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
    fetch(`https://inout-api.octopusteam.net/api/front/deleteCustomer/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === 200) {
          toast.success("Owner deleted successfully");
          setData(data.filter((item) => item.id !== id));
          toast.dismiss(confirmToast); // إغلاق توست التأكيد
        } else {
          toast.error("Failed to delete owner.");
          toast.dismiss(confirmToast);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("An error occurred while deleting the owner.");
        toast.dismiss(confirmToast);
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold dark:text-white text-3xl">Owners</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search owners..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/customers/createowner"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Owner
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No owners found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("id")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  ID {renderSortIcon("id")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("name")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Name {renderSortIcon("name")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("email")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Email {renderSortIcon("email")}
                </th>
                <th
                  className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                  onClick={() => sorting("phone")}
                  aria-sort={order === "ASC" ? "ascending" : "descending"}
                >
                  Phone {renderSortIcon("phone")}
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right font-semibold text-lg border-b border-gray-300">
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
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                      {d.id}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                      {d.name}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                      {d.email}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                      {d.phone}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-right space-x-2">
                      <Link
                        to={`/customers/editowner/${d.id}`}
                        className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </Link>
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
      )}
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

export default Owner;
