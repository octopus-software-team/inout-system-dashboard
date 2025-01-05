import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaEye, FaTrash, FaFilter, FaSearch } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net";
import ImportFile from "../ImportFile"; // Ensure this path is correct
import { Modal, Select, Table, Input, Button } from "antd"; // Added Input and Button from Ant Design

const { Option } = Select;

const Branchs = () => {
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  const [branchName, setBranchName] = useState([]);
  const [branchCountry, setBranchCountry] = useState([]);
  const [branchCity, setBranchCity] = useState([]);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // State for Filter Modal
  const [searchCity, setSearchCity] = useState(""); // State for City Search
  const [searchCountry, setSearchCountry] = useState(""); // State for Country Search
  const [searchText, setSearchText] = useState(""); // State for General Search

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

  // Initialize DataTable
  useEffect(() => {
    if (data.length > 0) {
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
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
        });
      } else {
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
  }, [data]);

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
        "https://inout-api.octopusteam.net/api/front/searchInAnyTable",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch file");
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

  // تعريف أعمدة الجدول في الـ Modal
  const columns = [
    {
      title: "Branch Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "City",
      dataIndex: "city_id",
      key: "city_id",
      render: (cityId) => {
        const city = cities.find((c) => c.id === cityId);
        return city ? city.name : "N/A";
      },
    },
    {
      title: "Country",
      dataIndex: "country_id",
      key: "country_id",
      render: (countryId) => {
        const country = countries.find((c) => c.id === countryId);
        return country ? country.name : "N/A";
      },
    },
  ];

  // تصفية الفروع بناءً على المدينة والبلد والنص العام
  const filteredBranches = data.filter((branch) => {
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
    <div className="container p-5 mt-5 border-collapse">
      <h2 className="text-center font-bold text-2xl text-black">Branches</h2>

      <div className="flex justify-end items-center my-4">
        <Link
          to="/company/addbranch"
          className="icons bg-blue-800 text-white   ml-4 font-semibold py-2 px-6 rounded-lg "
        >
          + Create Branch
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="icons bg-blue-800 text-white  ml-4 px-4 py-2 rounded"
        >
          Import
        </button>

        <button
          onClick={handleExportFile}
          className="icons bg-blue-800 ml-4 text-white rounded-lg"
        >
          Export
        </button>

        {/* Filter Button */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="icons bg-blue-800 text-white  ml-4 px-4 py-2 rounded"
        >
          <FaFilter className="inline mr-2" />
          Filter
        </button>
      </div>

      {/* Filter Modal */}
      <Modal
        title="Filter Branches"
        visible={isFilterModalOpen}
        onCancel={() => setIsFilterModalOpen(false)}
        footer={[
          <Button
            key="search"
            type="primary"
            icon={<FaSearch />}
            onClick={() => setIsFilterModalOpen(false)}
          >
            Search
          </Button>,
        ]}
        width={800}
      >
        <div className="space-y-4">
          {/* Country Select Box */}
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

          {/* City Select Box */}
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

          {/* General Search Input */}
          <Input
            placeholder="Search by branch name"
            prefix={<FaSearch className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          {/* Table */}
          <Table
            columns={columns}
            dataSource={filteredBranches}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </div>
      </Modal>

      {isLoading ? (
        <div className="flex justify-center mt-56 t items-center">
          <p className="text-gray-600 ext-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No branches found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table
            ref={tableRef}
            className="display table-auto w-full border border-gray-200 bg-white rounded-lg"
          >
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  #
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Country
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  City
                </th>
                <th className="px-4 dark:bg-slate-900 dark:text-white py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, index) => {
                const country = countries.find(
                  (c) => c.id === Number(d.country_id)
                );
                const city = cities.find((c) => c.id === Number(d.city_id));

                return (
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
                      {country ? country.name : "N/A"}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 text-gray-800">
                      {city ? city.name : "N/A"}
                    </td>
                    <td className="px-4 dark:bg-slate-900 dark:text-white py-3 space-x-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(d.id)}
                        className="edit font-semibold py-2 px-4 rounded-lg "
                      >
                        <FaEdit className="inline mr-2" />
                        Edit
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => openConfirmModal(d.id)}
                        className="colors rounded-lg hover:shadow-md transform "
                      >
                        <FaTrash className="inline mr-2" />
                        Delete
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/company/viewbranchdetails/${d.id}`)
                        }
                        className="eye"
                      >
                        <FaEye className="inline mr-2" />
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm Deletion Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-80">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">Are you sure you want to delete this branch?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-slate-600 transition duration-300"
              >
                No
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
    </div>
  );
};

export default Branchs;
