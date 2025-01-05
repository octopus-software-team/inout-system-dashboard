import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import ImportFile from "../ImportFile"; // تأكد من صحة المسار
import { Modal, Input, Button } from "antd"; // استخدام مكونات من Ant Design

const AddServices = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    // يمكنك إضافة المزيد من الحقول إذا كنت تحتاجها
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // حالة فتح نافذة الفلترة
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const tableName = "services"; // تعريف اسم الجدول
  const [search, setSearch] = useState(""); // حالة البحث

  // جلب البيانات عند التحميل
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found, cannot fetch services.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getServices", {
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
        console.error("Error fetching services:", error);
        setError("Failed to fetch services. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // دالة حذف الخدمة
  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("No token found. Please log in.");
      return;
    }

    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this service?</p>
        <div className="flex space-x-2 justify-end">
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
    fetch(`https://inout-api.octopusteam.net/api/front/deleteService/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete service.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Service deleted successfully.");
        setData(data.filter((service) => service.id !== id));
        toast.dismiss(confirmToast);
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete the service. Please try again.");
        toast.dismiss(confirmToast);
      });
  };

  // دالة تعديل الخدمة
  const handleEdit = (id) => {
    const selectedService = data.find((service) => service.id === id);
    navigate(`/company/editservice`, { state: selectedService });
  };

  // دالة تصفية البيانات
  const applyFilters = () => {
    let filteredData = data;

    if (filters.name) {
      filteredData = filteredData.filter((service) =>
        service.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // أضف المزيد من شروط الفلترة إذا لزم الأمر

    if (search) {
      filteredData = filteredData.filter((service) =>
        service.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return filteredData;
  };

  const filteredData = applyFilters();

  // تعريف أعمدة الجدول
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "200px",
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.id}</span>
      ),
    },
    {
      name: "Name",
      width: "400px",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.name}</span>
      ),
    },
    // يمكنك إضافة المزيد من الأعمدة إذا لزم الأمر
    {
      name: "Actions",

      cell: (row) => (
        <div className="flex space-x-2">
          <button onClick={() => handleEdit(row.id)} className="btn1 edit">
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
      width: "150px",
    },
  ];

  // دالة تطبيق الفلترة
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
    // يمكنك إضافة أي منطق إضافي عند تطبيق الفلترة إذا لزم الأمر
  };

  const handleResetFilters = () => {
    setFilters({
      name: "",
      // إعادة تعيين المزيد من الحقول إذا كانت موجودة
    });
    setIsFilterModalOpen(false);
  };

  // دالة تصدير الملف
  const handleExportFile = async () => {
    const formData = new FormData();
    formData.append("table", tableName);

    const token = Cookies.get("token");

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/export",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      link.download = `${tableName}.xlsx`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting file:", error);
      toast.error("Failed to export file.");
    }
  };

  // دالة فرز الأعمدة
  const handleSort = (column, sortDirection) => {
    const sorted = [...data].sort((a, b) => {
      if (a[column.selector] < b[column.selector]) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (a[column.selector] > b[column.selector]) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });
    setData(sorted);
    setSortedColumn(column.selector);
    setOrder(sortDirection === "asc" ? "ASC" : "DSC");
  };

  // دالة البحث داخل الجدول
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl text-black">Services</h2>

      <div className="flex justify-between items-center my-4 space-x-2 flex-wrap">
        <Input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={handleSearch}
          style={{ width: "300px" }}
          prefix={<FaSearch />}
          className="border border-gray-300 rounded p-2"
        />

        <div>
          <Link
            to="/company/createservices"
            className="icons bg-blue-800 text-white ml-3 font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            + Create Service
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="icons bg-blue-800 ml-3 text-white px-4 py-2 rounded "
          >
            Import
          </button>
          <button
            onClick={handleExportFile}
            className="icons bg-blue-800 px-6 py-3 ml-3 text-white rounded-lg shadow-md "
          >
            Export
          </button>
          {/* زر الفلترة الجديد */}
          {/* <button
            onClick={() => setIsFilterModalOpen(true)}
            className="icons bg-blue-800 text-white ml-3 px-4 py-2 rounded"
          >
            <FaFilter className="inline mr-2" />
            Filter
          </button> */}
        </div>
      </div>

      {/* نافذة الفلترة */}
      <Modal
        title="Filter Services"
        open={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        footer={[
          <Button key="reset" onClick={handleResetFilters}>
            Reset
          </Button>,
          <Button
            key="search"
            type="primary"
            icon={<FaSearch />}
            onClick={handleApplyFilters}
          >
            Search
          </Button>,
        ]}
        width={400}
      >
        <div className="space-y-4">
          {/* البحث حسب الاسم */}
          <Input
            name="name"
            placeholder="Search by name"
            prefix={<FaSearch className="text-gray-400" />}
            value={filters.name}
            onChange={handleFilterChange}
          />
        </div>
      </Modal>

      {open && (
        <div
          className="fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[350px] h-[350px] bg-white rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl font-semibold mb-4">
              Import File
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <ImportFile tableName={tableName} /> {/* مكون الاستيراد */}
            </div>
          </div>
        </div>
      )}

      {/* شريط البحث مدمج داخل DataTable */}
      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
        responsive
        defaultSortField="#"
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        onSort={handleSort}
        sortServer
        className="shadow-lg rounded-lg overflow-hidden"
      />

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="w-full text-center mt-56 h-full text-gray-700 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No services found.</p>
      ) : null}

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
        style={{ zIndex: 9999 }}
      />
    </div>
  );
};

export default AddServices;
