import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net"; // Import DataTables

const Owner = () => {
  const [data, setData] = useState([]);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  const navigate = useNavigate();

  const token = Cookies.get("token");

  // Fetch Owners
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
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          const owners = result.data.filter((item) => item.type === 1);
          setData(owners);
        } else {
          setError(result.msg || "Failed to fetch data.");
          toast.error(result.msg || "Failed to fetch data.");
        }
      })
      .catch((err) => {
        console.error("Error fetching owners:", err);
        setError("Failed to fetch owners. Please try again later.");
        toast.error("Failed to fetch owners. Please try again later.");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  // Initialize DataTable
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      // Initialize DataTable
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
          ordering: true,
          language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
              first: "First",
              last: "Last",
              next: "Next",
              previous: "Previous",
            },
          },
          // Prevent ordering on the Actions column
          columnDefs: [
            { orderable: false, targets: -1 },
          ],
        });
      } else {
        // If DataTable already initialized, just update the data
        dataTable.current.clear();
        dataTable.current.rows.add(data);
        dataTable.current.draw();
      }
    }

    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
        dataTable.current = null;
      }
    };
  }, [data, isLoading]);

  // Handle Edit
  const handleEdit = (id) => {
    const selectedOwner = data.find((owner) => owner.id === id);
    navigate("/customers/updateowner", { state: selectedOwner });
  };

  // Handle Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (!token) {
      toast.error("No token found. Please log in.");
      setIsConfirmOpen(false);
      return;
    }

    fetch(`https://inout-api.octopusteam.net/api/front/deleteCustomer/${deleteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete owner.");
        }
        return res.json();
      })
      .then((result) => {
        if (result.status === 200) {
          toast.success(result.msg || "Owner deleted successfully.");
          setData((prevData) => prevData.filter((item) => item.id !== deleteId));
        } else {
          toast.error(result.msg || "Failed to delete owner.");
        }
      })
      .catch((err) => {
        console.error("Error deleting owner:", err);
        toast.error("An error occurred while deleting the owner.");
      })
      .finally(() => setIsConfirmOpen(false));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold dark:text-white text-3xl">Owners</h2>

      <div className="flex justify-end items-center my-4">
        {/* <input
          className="border border-gray-300 dark:bg-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search owners..."
          value={""} 
          onChange={() => {}}
          disabled
        /> */}
        <Link
          to="/customers/createowner"
          className="text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Owner
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No owners found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table ref={tableRef} className="display table-auto w-full border border-gray-200 bg-white rounded-lg">
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  #
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Email
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Phone
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3  font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, index) => (
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
                  <td className="px-4 dark:bg-slate-900 dark:text-white py-3  space-x-2">
                    <Link
                      to={`/customers/editowner/${d.id}`}
                      className="edit rounded-lg "
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="colors  rounded-lg"
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

      {/* Confirm Deletion Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this owner?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                No
              </button>
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

export default Owner;
