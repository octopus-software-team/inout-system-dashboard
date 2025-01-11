import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "antd";
import ImportFile from "../../ImportFile"; // تأكد من صحة المسار

const AddNewAssets = () => {
  const [data, setData] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    asset_type_id: "",
    branch_id: "",
  });
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const tableName = "assets"; // تحديد اسم الجدول

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

  useEffect(() => {
    const token = Cookies.get("token");

    // Fetch assets
    fetch("https://inout-api.octopusteam.net/api/front/getAssets", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch assets");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData && resData.data) {
          setData(resData.data);
        } else {
          toast.error("No data found");
        }
      })
      .catch((err) => {
        console.error("Error fetching assets:", err);
        toast.error("Failed to fetch assets");
      });

    // Fetch asset types
    fetch("https://inout-api.octopusteam.net/api/front/getAssetTypes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch asset types");
        }
        return response.json();
      })
      .then((assetTypesData) => {
        if (assetTypesData && assetTypesData.status === 200) {
          setAssetTypes(assetTypesData.data);
        } else {
          toast.error(assetTypesData.msg || "Failed to load asset types");
        }
      })
      .catch((error) => {
        console.error("Error fetching asset types:", error);
        toast.error("Error fetching asset types");
      });

    // Fetch branches
    fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch branches");
        }
        return response.json();
      })
      .then((branchData) => {
        if (branchData && branchData.status === 200) {
          setBranches(branchData.data);
        } else {
          toast.error(branchData.msg || "Failed to load branches");
        }
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
        toast.error("Error fetching branches");
      });
  }, []);

  const getAssetTypeNameById = (typeId) => {
    const foundType = assetTypes.find((item) => item.id === typeId);
    return foundType ? foundType.name : "N/A";
  };

  const getBranchNameById = (branchId) => {
    const foundBranch = branches.find((branch) => branch.id === branchId);
    return foundBranch ? foundBranch.name : "N/A";
  };

  const openModal = (id) => {
    setAssetToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setAssetToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (assetToDelete) {
      const token = Cookies.get("token");
      fetch(
        `https://inout-api.octopusteam.net/api/front/deleteAsset/${assetToDelete}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete asset");
          }
          return res.json();
        })
        .then((resData) => {
          toast.success("Asset deleted successfully!");
          setData((prevData) =>
            prevData.filter((asset) => asset.id !== assetToDelete)
          );
          closeModal();
        })
        .catch((err) => {
          console.error("Error deleting asset:", err.message);
          toast.error("Failed to delete asset. Please try again.");
          closeModal();
        });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const applyFilters = () => {
    let filteredData = data;

    if (filters.asset_type_id) {
      filteredData = filteredData.filter(
        (item) => item.asset_type_id === parseInt(filters.asset_type_id)
      );
    }

    if (filters.branch_id) {
      filteredData = filteredData.filter(
        (item) => item.branch_id === parseInt(filters.branch_id)
      );
    }

    return filteredData;
  };

  const filteredData = applyFilters().filter((item) =>
    search === ""
      ? item
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "#",
      selector: (row) => row.id,
      sortable: true,
      width: "60px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Assets Type",
      selector: (row) => getAssetTypeNameById(row.asset_type_id),
      sortable: true,
    },
    {
      name: "Branch",
      selector: (row) => getBranchNameById(row.branch_id),
      sortable: true,
    },
    {
      name: "QR Code",
      cell: (row) =>
        row.qrcode ? (
          <div
            className="svg1"
            dangerouslySetInnerHTML={{ __html: row.qrcode }}
          />
        ) : (
          "No QR Code"
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() =>
              navigate(`/company/assets/updateassets`, { state: row })
            }
            className="edit1"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button onClick={() => openModal(row.id)} className="colors1">
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

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="container mt-5">
      <ToastContainer />

      <h2 className="text-center font-bold text-2xl text-black">Assets</h2>

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
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center bg-blue-800 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
          <Link
            to="/company/assets/createassets"
            className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
          >
            + Create Assets
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="icons bg-blue-800  text-white  rounded-lg "
          >
            Import
          </button>
          <button
            onClick={handleExportFile}
            className="icons bg-blue-800 text-white  rounded-lg "
          >
            Export
          </button>

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
        </div>
      </div>

      {/* <input
        type="text"
        placeholder="Search by name..."
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

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this asset?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isFilterOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Assets</h3>
            <div className="space-y-4">
              <label htmlFor="">select asset type</label>

              <select
                name="asset_type_id"
                value={filters.asset_type_id}
                onChange={handleFilterChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">ALL</option>
                {assetTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>

              <label htmlFor="">select branch </label>

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
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewAssets;
