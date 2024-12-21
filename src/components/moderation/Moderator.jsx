import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify"; // 1) Import react-toastify
import "react-toastify/dist/ReactToastify.css";         // 2) Import react-toastify CSS

const Moderator = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");

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

  // 3) Show the custom toast for delete confirmation
  const handleDelete = (adminId) => {
    const token = Cookies.get("token");

    // Create a toast that won't auto-close and has custom buttons
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this admin?</p>
        <div className="flex space-x-2 justify-end mt-2">
          <button
            onClick={() => handleConfirmDelete(adminId, token, confirmToast)}
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
      { 
        autoClose: false, 
        closeButton: false 
      }
    );
  };

  // 4) If the user confirms, proceed with deleting
  const handleConfirmDelete = (adminId, token, confirmToast) => {
    fetch(`https://inout-api.octopusteam.net/api/front/deleteAdmin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: adminId }) // Make sure you send the 'id' in the request body if the endpoint requires it
    })
      .then(async (res) => {
        // We'll parse text first then convert to JSON
        const responseText = await res.text();
        if (!res.ok) {
          throw new Error("Failed to delete admin");
        }
        return JSON.parse(responseText);
      })
      .then((resData) => {
        // Show success toast
        toast.success(resData.msg || "Admin deleted successfully");
        // Remove the deleted admin from local state
        setData((prevData) => prevData.filter((admin) => admin.id !== adminId));
        // Dismiss the confirmation toast
        toast.dismiss(confirmToast);
      })
      .catch((err) => {
        console.error("Error deleting admin:", err);
        toast.error("Failed to delete admin. Please try again.");
        toast.dismiss(confirmToast);
      });
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
          className=" text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Admin
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                #
              </th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                Name
              </th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                Email
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
                  <td className="px-4 py-3 text-gray-800">{item.email}</td>
                  <td className="px-4 py-3 text-right space-x-2">
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
                      onClick={() => handleDelete(item.id)} // 5) Use the new handleDelete for the toast
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

      {/* 6) Include the ToastContainer so that the toasts will appear */}
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

export default Moderator;
