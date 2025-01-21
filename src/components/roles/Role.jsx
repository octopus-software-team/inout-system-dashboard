import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RolesTable = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // جلب البيانات من الـ API
  useEffect(() => {
    const token = Cookies.get("token");

    fetch("https://inout-api.octopusteam.net/api/front/getRoles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 200 && resData.data) {
          setData(resData.data);
        } else {
          setError("No data found or API error.");
        }
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // دالة البحث
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // تصفية البيانات بناءً على البحث
  const filteredData = data.filter((role) =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  // دالة الحذف
  const handleDelete = (id) => {
    // عرض Toast تأكيد مخصص
    toast.info(
      <div>
        <p>Are you sure you want to delete this role?</p>
        <div className="flex justify-around mt-2">
          <button
            className="bg-red-500 text-white px-4 py-1 rounded"
            onClick={() => {
              confirmDelete(id); // تأكيد الحذف
              toast.dismiss(); // إغلاق Toast
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-1 rounded"
            onClick={() => toast.dismiss()} // إغلاق Toast بدون حذف
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false, // إيقاف الإغلاق التلقائي
        closeButton: false, // إخفاء زر الإغلاق
      }
    );
  };

  // تأكيد الحذف
  const confirmDelete = (id) => {
    const token = Cookies.get("token");

    fetch(`https://inout-api.octopusteam.net/api/front/DeleteRole/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => {
        if (resData.status === 200) {
          toast.success("Role deleted successfully!");
          // تحديث البيانات بعد الحذف
          setData(data.filter((role) => role.id !== id));
        } else {
          toast.error("Failed to delete role.");
        }
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
        toast.error("Failed to delete role. Please try again later.");
      });
  };

  // تعريف أعمدة الجدول
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "250px",
    },
    {
      name: "Role Name",
      selector: (row) => row.name,
      sortable: true,
      width: "350px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() =>
              navigate(`/roles/editrole/${row.id}`, {
                state: { roleData: row },
              })
            }
            className="btn1 edit"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button onClick={() => handleDelete(row.id)} className="btn1 colors">
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

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Roles</h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <input
          type="text"
          placeholder="Search roles..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <Link
          to="/roles/addrole"
          className="icons bg-blue-800 text-white  mr-2 font-semibold rounded-lg "
        >
          + Add Role
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
          defaultSortField="id"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          className="shadow-lg rounded-lg overflow-hidden"
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default RolesTable;
