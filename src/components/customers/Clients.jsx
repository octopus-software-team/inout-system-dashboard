import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';


const Clients = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      console.log("No token found, cannot fetch clients.");
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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          setError("No data found in the response");
        }
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setError("Failed to fetch clients. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] > b[col] ? 1 : -1;
      });
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) => {
        if (typeof a[col] === "string") {
          return a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1;
        }
        return a[col] < b[col] ? 1 : -1;
      });
      setOrder("ASC");
    }
    setData(sorted);
    setSortedColumn(col);
  };

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  const handleEdit = (id) => {
    const selectedClient = data.find((client) => client.id === id);
    navigate("/customers/updateclients", { state: selectedClient });
  };

  const handleDelete = (id) => {
    const token = Cookies.get('token');
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }

    // إظهار توست التأكيد
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this client?</p>
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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete client.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Client deleted successfully.");
        setData(data.filter((client) => client.id !== id));
        toast.dismiss(confirmToast); // إغلاق توست التأكيد
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete the client. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl dark:text-white">Clients</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/customers/createclients"
          className="text-white bg-blue-500 rounded p-2 transform hover:scale-105 transition duration-300"
        >
          Create Client
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-blue-600 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No clients found.</p>
      ) : (
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-600 to-blue-400">
                      <th
                        className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("id")}
                        aria-sort={order === "ASC" ? "ascending" : "descending"}
                      >
                        ID {renderSortIcon("id")}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer dark:bg-slate-900 dark:text-white"
                        onClick={() => sorting("name")}
                        aria-sort={order === "ASC" ? "ascending" : "descending"}
                      >
                        Name {renderSortIcon("name")}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("email")}
                        aria-sort={order === "ASC" ? "ascending" : "descending"}
                      >
                        Email {renderSortIcon("email")}
                      </th>
                      <th
                        className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                        onClick={() => sorting("phone")}
                        aria-sort={order === "ASC" ? "ascending" : "descending"}
                      >
                        Phone {renderSortIcon("phone")}
                      </th>
                      <th className="px-4 py-3 text-start font-semibold text-lg border-b border-gray-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data
                      .filter((i) => {
                        return search.toLowerCase() === ""
                          ? i
                          : i.name.toLowerCase().includes(search.toLowerCase());
                      })
                      .map((d, index) => (
                        <tr key={d.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {d.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {d.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {d.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                            {d.phone}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex gap-4">
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
          </div>
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

export default Clients;
