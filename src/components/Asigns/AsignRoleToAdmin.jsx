import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";

const AsignRoleToAdmin = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // جلب البيانات من الـ API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getRolesToAdmin",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData = await response.json();

      if (resData.status === 200 && resData.data) {
        setData(resData.data);
      } else {
        setError("No data found or API error.");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      setError("Failed to fetch roles. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // دالة البحث
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // تصفية البيانات بناءً على البحث
  const filteredData = data.filter(
    (item) =>
      item.admin_name.toLowerCase().includes(search.toLowerCase()) ||
      item.role_name.toLowerCase().includes(search.toLowerCase())
  );

  // تعريف أعمدة الجدول
  const columns = [
    {
      name: "Admin ID",
      selector: (row) => row.admin_id,
      sortable: true,
      width: "150px",
    },
    {
      name: "Admin Name",
      selector: (row) => row.admin_name,
      sortable: true,
      width: "250px",
    },
    {
      name: "Role Name",
      selector: (row) => row.role_name,
      sortable: true,
      width: "250px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.admin_id, row.role_id)}
            className="btn1 edit"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.admin_id, row.role_id)}
            className="btn1 colors"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "300px",
    },
  ];

  // دالة التعديل
  const handleEdit = (adminId, roleId) => {
    navigate(`/asigns/editasign`, {
      state: { adminId, roleId },
    });
  };

  // دالة الحذف
  const handleDelete = (adminId, roleId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete?</p>
        <div className="flex justify-around mt-2">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => confirmDelete(adminId, roleId)}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-1 rounded"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  // تأكيد الحذف
  const confirmDelete = async (adminId, roleId) => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/deleteRoleFromAdmin/${roleId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resData = await response.json();

      if (resData.status === 200) {
        toast.success("Role deleted successfully!");
        fetchData(); // إعادة تحميل البيانات بعد الحذف
      } else {
        toast.error("Failed to delete role. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role. Please try again.");
    }
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">
        Assign Roles to Admin
      </h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <input
          type="text"
          placeholder="Search by admin or role..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Link
          to="/asigns/addasign"
          className="icons bg-blue-800 text-white  mr-2 font-semibold rounded-lg "
        >
          + Add Role to Admin
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center mt-56">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="admin_id"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          className="shadow-lg rounded-lg overflow-hidden"
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default AsignRoleToAdmin;