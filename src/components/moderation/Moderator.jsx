import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from 'react-data-table-component';

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

  const handleDelete = (adminId) => {
    const token = Cookies.get("token");

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

  const handleConfirmDelete = (adminId, token, confirmToast) => {
    fetch(`https://inout-api.octopusteam.net/api/front/deleteAdmin`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: adminId })
    })
      .then(async (res) => {
        const responseText = await res.text();
        if (!res.ok) {
          throw new Error("Failed to delete admin");
        }
        return JSON.parse(responseText);
      })
      .then((resData) => {
        toast.success(resData.msg || "Admin deleted successfully");
        setData((prevData) => prevData.filter((admin) => admin.id !== adminId));
        toast.dismiss(confirmToast);
      })
      .catch((err) => {
        console.error("Error deleting admin:", err);
        toast.error("Failed to delete admin. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  const columns = [
    {
      name: '#',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="space-x-2">
          <button
            onClick={() => navigate(`/moderation/editadmin`, { state: row })}
            className="edit rounded-lg"
          >
            <FaEdit className="inline mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="colors rounded-lg"
          >
            <FaTrash className="inline mr-2" />
            Delete
          </button>
        </div>
      ),
    },
  ];

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Moderators</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 dark:bg-slate-900 dark:text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96 shadow-md"
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/moderation/createadmin/"
          className=" text-white bg-blue-800 font-semibold py-2 px-6 rounded-lg "
        >
          + Create Admin
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
      />

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