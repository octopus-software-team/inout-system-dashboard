import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import "react-toastify/dist/ReactToastify.css";
import ImportFile from "../../ImportFile"; // تأكد من صحة المسار
import DataTable from "react-data-table-component";
import { Input } from "antd";

const AddMaterials = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    branch_id: "",
    material_category_id: "",
  });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const tableName = "materials";




  // Fetch branches
  const fetchBranches = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getBranches",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch branches.");
      }
      const resData = await response.json();
      setBranches(resData.data || []);
    } catch (err) {
      toast.error("Failed to fetch branches.");
    }
  };

  // Fetch material categories
  const fetchMaterialCategories = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getMaterialCategory",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch material categories.");
      }
      const resData = await response.json();
      setMaterialCategories(resData.data || []);
    } catch (err) {
      toast.error("Failed to fetch material categories.");
    }
  };

  // Fetch materials
  const fetchMaterials = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getMaterials",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch materials.");
      }
      const resData = await response.json();
      setData(resData.data || []);
    } catch (err) {
      toast.error("Failed to fetch materials.");
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchMaterialCategories();
    fetchMaterials();
  }, []);

  // Handle delete confirmation
  const confirmDelete = () => {
    const token = Cookies.get("token");
    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteMaterial/${materialToDelete}`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete material");
        return res.json();
      })
      .then(() => {
        setData((prevData) =>
          prevData.filter((material) => material.id !== materialToDelete)
        );
        toast.success("Material deleted successfully");
        setMaterialToDelete(null);
      })
      .catch(() => toast.error("Failed to delete material"));
  };

  // Get branch name by ID
  const getBranchName = (branch_id) => {
    const branch = branches.find((b) => b.id === branch_id);
    return branch ? branch.name : "Unknown";
  };

  // Get material category name by ID
  const getMaterialCategoryName = (category_id) => {
    const category = materialCategories.find((c) => c.id === category_id);
    return category ? category.name : "Unknown";
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply filters to data
  const applyFilters = () => {
    let filteredData = data;

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (item) => item.branch_id === parseInt(filters.branch_id)
      );
    }

    if (filters.material_category_id) {
      filteredData = filteredData.filter(
        (item) =>
          item.material_category_id === parseInt(filters.material_category_id)
      );
    }

    return filteredData;
  };

  // Filter data based on search and filters
  const filteredData = applyFilters().filter((item) =>
    search === ""
      ? item
      : item.description.toLowerCase().includes(search.toLowerCase())
  );

  // Handle export file
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

  // Table columns
  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      width: "100px",

    },
    {
      name: "Type",
      selector: (row) => row.type_label,
      sortable: true,
      width: "150px",

    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      width: "150px",

    },
    {
      name: "Material Category",
      selector: (row) => getMaterialCategoryName(row.material_category_id),
      sortable: true,
      width: "150px",

    },
    {
      name: "Branch",
      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
      width: "150px",

    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() =>
              navigate(`/company/assets/updatematerials`, { state: row })
            }
            className="edit1 rounded-lg"
          >
            <FaEdit className="inline mr-2" />
            Edit
          </button>
          <button
            onClick={() => setMaterialToDelete(row.id)}
            className="colors1  rounded-lg"
          >
            <FaTrash className="inline mr-2" />
            Delete
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",

    },
  ];

  // دالة البحث داخل الجدول
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };
  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center font-bold text-2xl text-black">Materials</h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <input
          type="text"
          placeholder="Search ..."
          value={search}
          onChange={handleSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        {/* <FaSearch className="ml-2 text-gray-500" /> */}
        <div className="flex items-center gap-4">
          <Link
            to="/company/assets/creatematerials"
            className="icons bg-blue-800 text-white"
          >
            + Create Material
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="icons bg-blue-800 text-white "
          >
            Import
          </button>
          <button
            onClick={handleExportFile}
            className="icons bg-blue-800 text-white "
          >
            Export
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="icons flex items-center bg-blue-800 text-white "
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
        </div>
      </div>
      {/* <input
        type="text"
        placeholder="Search by description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg mb-4"
      /> */}

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

      {/* Confirmation Modal */}
      {materialToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this material?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setMaterialToDelete(null)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Filter Materials</h3>
            <div className="space-y-4">
              <label htmlFor="">select branch</label>
              <select
                name="branch_id"
                value={filters.branch_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>

              <label htmlFor="">select material category</label>

              <select
                name="material_category_id"
                value={filters.material_category_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                {materialCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-300 mr-3 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 mr-3 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {open && (
        <div
          className="fixed top-0 left-0 z-30 w-full h-full bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-[350px] h-auto bg-white rounded-lg shadow-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-center text-xl font-semibold mb-4">
              Import File
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <ImportFile tableName={tableName} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMaterials;
