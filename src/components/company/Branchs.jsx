import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import ImportFile from "../ImportFile"; // تأكد من صحة المسار
import { Modal, Select, Input, Button } from "antd"; // Added Input and Button from Ant Design

const { Option } = Select;

const Branches = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchCountry, setSearchCountry] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const tableName = "branches"; // تحديد اسم الجدول

  // Fetch Countries
  const fetchCountries = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCountries",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await response.json();
      setCountries(resData.data || []);
    } catch (error) {
      console.error("Error fetching countries:", error);
      toast.error("Failed to fetch countries.");
    }
  };

  // Fetch Cities
  const fetchCities = async () => {
    const token = Cookies.get("token");
    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCities",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const resData = await response.json();
      setCities(resData.data || []);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to fetch cities.");
    }
  };

  // Fetch Branches
  const fetchBranches = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You are not authenticated. Please log in.");
      setIsLoading(false);
      setError("You are not authenticated. Please log in.");
      return;
    }

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

      if (resData.status === 200 && resData.data) {
        setData(resData.data);
      } else {
        toast.error(resData.msg || "No data found.");
        setError(resData.msg || "No data found.");
      }
    } catch (err) {
      console.error("Error fetching branches:", err);
      toast.error("Failed to fetch branches.");
      setError("Failed to fetch branches.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    fetchCountries();
    fetchCities();
  }, [location]);

  // Handle Edit
  const handleEdit = (id) => {
    const selectedBranch = data.find((branch) => branch.id === id);
    navigate(`/company/updatebranch/${id}`, { state: selectedBranch });
  };

  // Handle Delete Confirmation
  const openConfirmModal = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const closeConfirmModal = () => {
    setDeleteId(null);
    setIsConfirmOpen(false);
  };

  const confirmDelete = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      closeConfirmModal();
      return;
    }

    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteBranch/${deleteId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete branch.");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.status === 200) {
          setData(data.filter((item) => item.id !== deleteId));
          toast.success(resData.msg || "Branch deleted successfully.");
        } else {
          toast.error(resData.msg || "Failed to delete branch.");
        }
      })
      .catch((err) => {
        console.error("Error deleting branch:", err);
        toast.error("Error deleting branch. Please try again.");
      })
      .finally(() => {
        closeConfirmModal();
      });
  };

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

  const [open, setOpen] = useState(false);

  // تعريف أعمدة الجدول
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
      name: "Country",
      selector: (row) => {
        const country = countries.find((c) => c.id === row.country_id);
        return country ? country.name : "N/A";
      },
      sortable: true,
    },
    {
      name: "City",
      selector: (row) => {
        const city = cities.find((c) => c.id === row.city_id);
        return city ? city.name : "N/A";
      },
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row.id)}
            className="edit1 flex items-center justify-center"
          >
            <FaEdit className="mr-2" />
            Edit
          </button>
          <button
            onClick={() => openConfirmModal(row.id)}
            className="colors1 flex items-center justify-center"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
          <button
            onClick={() => navigate(`/company/viewbranchdetails/${row.id}`)}
            className="eye1 flex items-center justify-center"
          >
            <FaEye className="mr-2" />
            View
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "200px",
    },
  ];

  // تصفية الفروع بناءً على المدينة والبلد والنص العام
  const filteredData = data.filter((branch) => {
    const city = cities.find((c) => c.id === branch.city_id);
    const country = countries.find((c) => c.id === branch.country_id);

    const matchesCity = city?.name
      .toLowerCase()
      .includes(searchCity.toLowerCase());
    const matchesCountry = country?.name
      .toLowerCase()
      .includes(searchCountry.toLowerCase());
    const matchesSearch = branch.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return matchesCity && matchesCountry && matchesSearch;
  });

  return (
    <div className="container mt-5">
      <Toaster
        position="top-right"
        richColors={true}
        closeButton
        customStyles={{
          "--sonner-toast-width": "350px",
          "--sonner-toast-height": "80px",
          "--sonner-toast-font-size": "1.2rem",
        }}
      />

      <h2 className="text-center font-bold text-2xl text-black">Branches</h2>

      <div className="flex justify-between items-center my-4 gap-4">
        <input
          type="text"
          placeholder="Search ..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
        />
        <div className="flex items-center gap-4">
        <Link
            to="/company/addbranch"
            className="icons bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg "
          >
            + Create Branch
          </Link>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="icons flex items-center bg-blue-800 text-white py-2 px-4 rounded-lg "
          >
            <FaFilter className="mr-2" />
            Filter
          </button>
         
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

      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg">
            <p>Are you sure you want to delete this branch?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {isFilterModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Filter Branches</h3>
            <div className="space-y-4">
              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Search for a country"
                optionFilterProp="children"
                onChange={(value) => setSearchCountry(value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {countries.map((country) => (
                  <Option key={country.id} value={country.name}>
                    {country.name}
                  </Option>
                ))}
              </Select>

              <Select
                showSearch
                style={{ width: "100%", marginBottom: "20px" }}
                placeholder="Search for a city"
                optionFilterProp="children"
                onChange={(value) => setSearchCity(value)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {cities.map((city) => (
                  <Option key={city.id} value={city.name}>
                    {city.name}
                  </Option>
                ))}
              </Select>

              <Input
                placeholder="Search by branch name"
                prefix={<FaSearch className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2 hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsFilterModalOpen(false)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

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
              <ImportFile tableName={tableName} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;
