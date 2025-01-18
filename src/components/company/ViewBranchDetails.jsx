import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import DataTable from "react-data-table-component";
import {
  FaBuilding,
  FaUsers,
  FaBoxes,
  FaCity,
  FaGlobe,
  FaUser,
  FaBirthdayCake,
  FaVenusMars,
  FaCalendarAlt,
  FaStickyNote,
  FaBoxOpen,
  FaEdit,
  FaTrash,
  FaFilter,
  FaVoicemail,
  FaEnvelope,
  FaPhone,
  FaBriefcase,
} from "react-icons/fa";
import inout from "../../assests/logo4.png";

const ViewBranchDetails = () => {
  const { id } = useParams();
  const [branchDetails, setBranchDetails] = useState(null);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [materialCategories, setMaterialCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    branch_id: "",
    asset_type_id: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");

    // Function to fetch all data sequentially
    const fetchData = async () => {
      try {
        // Fetch branch details
        const branchResponse = await fetch(
          `https://inout-api.octopusteam.net/api/front/viewBranchDetails/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const branchData = await branchResponse.json();
        setBranchDetails(branchData.data.branch);
        setMaterials(branchData.data.materials);
        setAssets(branchData.data.assets);

        // Fetch countries
        const countriesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCountries",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const countriesData = await countriesResponse.json();
        setCountries(countriesData.data);

        // Fetch cities
        const citiesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getCities",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const citiesData = await citiesResponse.json();
        setCities(citiesData.data);

        // Fetch employees
        const employeesResponse = await fetch(
          `https://inout-api.octopusteam.net/api/front/getEmployees`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const employeesData = await employeesResponse.json();
        setEmployees(employeesData.data);

        // Fetch material categories
        const categoriesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getMaterialCategory",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const categoriesData = await categoriesResponse.json();
        setMaterialCategories(categoriesData.data);

        // Fetch branches
        const branchesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const branchesData = await branchesResponse.json();
        setBranches(branchesData.data);

        // Fetch asset types
        const assetTypesResponse = await fetch(
          "https://inout-api.octopusteam.net/api/front/getAssetTypes",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const assetTypesData = await assetTypesResponse.json();
        setAssetTypes(assetTypesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // تصفية الموظفين بناءً على branch_id
  const filteredEmployees = employees.filter(
    (employee) => employee.branch_id === branchDetails?.id
  );

  // Getters for related data
  const getCountryName = (countryId) => {
    const country = countries.find((country) => country.id === countryId);
    return country ? country.name : "Unknown";
  };

  const getCityName = (cityId) => {
    const city = cities.find((city) => city.id === cityId);
    return city ? city.name : "Unknown";
  };

  const getMaterialCategoryName = (categoryId) => {
    const category = materialCategories.find(
      (category) => category.id === categoryId
    );
    return category ? category.name : "Unknown";
  };

  const getBranchName = (branchId) => {
    const branch = branches.find((branch) => branch.id === branchId);
    return branch ? branch.name : "Unknown";
  };

  const getAssetTypeName = (assetTypeId) => {
    const assetType = assetTypes.find(
      (assetType) => assetType.id === assetTypeId
    );
    return assetType ? assetType.name : "Unknown";
  };

  const getGender = (genderId) => {
    return genderId === 1 ? "Male" : "Female";
  };

  // Handle Filter Change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Apply Filters to Assets
  const applyAssetFilters = () => {
    let filteredAssets = assets;

    if (filters.name) {
      filteredAssets = filteredAssets.filter((asset) =>
        asset.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.branch_id) {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.branch_id === parseInt(filters.branch_id)
      );
    }

    if (filters.asset_type_id) {
      filteredAssets = filteredAssets.filter(
        (asset) => asset.asset_type_id === parseInt(filters.asset_type_id)
      );
    }

    return filteredAssets;
  };

  const filteredAssets = applyAssetFilters();

  // Define columns for Assets DataTable
  const assetColumns = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.name}</span>
      ),
    },
    {
      name: "Branch",
      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700">{getBranchName(row.branch_id)}</span>
      ),
    },
    {
      name: "Asset Type",
      selector: (row) => getAssetTypeName(row.asset_type_id),
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700">
          {getAssetTypeName(row.asset_type_id)}
        </span>
      ),
    },
  ];

  // Define columns for Materials DataTable
  const materialColumns = [
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <span className="font-medium text-gray-800">{row.description}</span>
      ),
    },
    {
      name: "Category",
      selector: (row) => getMaterialCategoryName(row.material_category_id),
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700">
          {getMaterialCategoryName(row.material_category_id)}
        </span>
      ),
    },
    {
      name: "Branch",
      selector: (row) => getBranchName(row.branch_id),
      sortable: true,
      cell: (row) => (
        <span className="text-gray-700">{getBranchName(row.branch_id)}</span>
      ),
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      cell: (row) => <span className="text-gray-700">{row.stock}</span>,
    },
    {
      name: "Type",
      selector: (row) => row.type,
      sortable: true,
      cell: (row) => <span className="text-gray-700">{row.type}</span>,
    },
    {
      name: "Type Label",
      selector: (row) => row.type_label,
      sortable: true,
      cell: (row) => <span className="text-gray-700">{row.type_label}</span>,
    },
  ];

  // Placeholder functions for asset actions (Edit & Delete)
  const handleEditAsset = (id) => {
    // Implement edit functionality or navigation
    console.log(`Edit asset with ID: ${id}`);
  };

  const handleDeleteAsset = (id) => {
    // Implement delete functionality with confirmation
    console.log(`Delete asset with ID: ${id}`);
  };

  if (
    !branchDetails ||
    countries.length === 0 ||
    cities.length === 0 ||
    materialCategories.length === 0 ||
    branches.length === 0 ||
    assetTypes.length === 0
  ) {
    return <div className="mt-56" style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Branch Details</h2>
      <div className="flex">
        <img className="h-30 w-30" src={inout} />

        <div className="cardBranches" style={styles.card}>
          {/* Branch Details Rows */}
          <div style={styles.row}>
            <FaBuilding style={styles.icon} />
            <span style={styles.label}>Name</span>
            <span style={styles.value}>{branchDetails.name}</span>
          </div>
          <div style={styles.row}>
            <FaUsers style={styles.icon} />
            <span style={styles.label}>Employees Count</span>
            <span style={styles.value}>{branchDetails.employees_count}</span>
          </div>
          <div style={styles.row}>
            <FaBoxes style={styles.icon} />
            <span style={styles.label}>Assets Count</span>
            <span style={styles.value}>{branchDetails.assets_count}</span>
          </div>
          <div style={styles.row}>
            <FaBoxes style={styles.icon} />
            <span style={styles.label}>Materials Count</span>
            <span style={styles.value}>{branchDetails.materials_count}</span>
          </div>
          <div style={styles.row}>
            <FaGlobe style={styles.icon} />
            <span style={styles.label}>Country</span>
            <span style={styles.value}>
              {getCountryName(branchDetails.country_id)}
            </span>
          </div>
          <div style={styles.row}>
            <FaCity style={styles.icon} />
            <span style={styles.label}>City</span>
            <span style={styles.value}>
              {getCityName(branchDetails.city_id)}
            </span>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <h2 style={{ ...styles.header, marginTop: "40px" }}>Materials</h2>
      <div style={styles.tableContainer}>
        <DataTable
          columns={materialColumns}
          data={materials}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="Description"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          noDataComponent="No materials found for this branch."
          className="shadow-lg rounded-lg overflow-hidden"
        />
      </div>

      {/* Assets Section with DataTable */}
      <h2 style={{ ...styles.header, marginTop: "40px" }}>Assets</h2>
      <div style={styles.tableContainer}>
        <div style={styles.filterContainer}></div>
        <DataTable
          columns={assetColumns}
          data={filteredAssets}
          pagination
          highlightOnHover
          striped
          responsive
          defaultSortField="Name"
          paginationPerPage={10}
          paginationRowsPerPageOptions={[10, 20, 30]}
          noDataComponent="No assets found for this branch."
          className="shadow-lg rounded-lg overflow-hidden"
        />
      </div>

      {/* Employees Section */}
      <h2 style={{ ...styles.header, marginTop: "40px" }}>Employees</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map((employee) => (
            <div key={employee.id} className="bg-white shadow-lg rounded-lg p-6">
              {/* صورة الموظف */}
              <div className="flex justify-center mb-6">
                <img
                  src={employee.image}
                  alt={employee.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>

              {/* تفاصيل الموظف */}
              <div className="space-y-4">
                {/* الاسم */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaUser className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Name:</span>
                  </div>
                  <span>{employee.full_name}</span>
                </div>

                {/* البريد الإلكتروني */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaEnvelope className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Email:</span>
                  </div>
                  <span>{employee.email}</span>
                </div>

                {/* الهاتف */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaPhone className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Phone:</span>
                  </div>
                  <span>{employee.phone}</span>
                </div>

                {/* تاريخ الميلاد */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaBirthdayCake className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Date of Birth:</span>
                  </div>
                  <span>{employee.date_of_birth}</span>
                </div>

                {/* الجنس */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaVenusMars className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Gender:</span>
                  </div>
                  <span>{getGender(employee.gender)}</span>
                </div>

                {/* تاريخ بدء العقد */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaCalendarAlt className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">
                      Contract Start Date:
                    </span>
                  </div>
                  <span>{employee.contract_start_date}</span>
                </div>

                {/* مدة العقد */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaCalendarAlt className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">
                      Contract Duration:
                    </span>
                  </div>
                  <span>{employee.contract_duration} months</span>
                </div>

                {/* تاريخ انتهاء العقد */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaCalendarAlt className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">
                      Contract End Date:
                    </span>
                  </div>
                  <span>{employee.contract_end_date}</span>
                </div>

                {/* الخبرة */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaBriefcase className="text-blue-500 mr-3" />
                    <span className="font-semibold w-40">Experience:</span>
                  </div>
                  <span>{employee.experience}</span>
                </div>

                {/* الملاحظات */}
                <div className="flex justify-between">
                  <div className="flex">
                    <FaStickyNote className="text-blue-500 mr-3 mt-1" />
                    <span className="font-semibold">Notes:</span>
                  </div>
                  <span className="ml-2">{employee.notes}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No employees found for this branch.
          </p>
        )}
      </div>

      {/* Filter Modal for Assets */}
    </div>
  );
};

// Styles Object
const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
    backgroundColor: "#f3f4f6",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    color: "#4a4a4a",
    fontSize: "2rem",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "24px",
    maxWidth: "800px",
    margin: "0 auto",
    transition: "transform 0.2s ease",
  },
  row: {
    display: "flex",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e0e0e0",
  },
  icon: {
    marginRight: "10px",
    color: "#3b82f6",
  },
  label: {
    color: "#6b7280",
    fontWeight: "600",
    flex: "1",
  },
  value: {
    color: "#374151",
    fontWeight: "500",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2rem",
    color: "#6b7280",
    marginTop: "50px",
  },
  cardsContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  cardItem: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    width: "300px",
    transition: "transform 0.2s ease",
  },
  cardRow: {
    display: "flex",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e0e0e0",
  },
  noData: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: "1.2rem",
    marginTop: "20px",
  },
  employeeImageContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  employeeImage: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  tableContainer: {
    overflowX: "auto",
    maxWidth: "100%",
    padding: "0 20px",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  filterButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 50,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "16px",
    width: "90%",
    maxWidth: "500px",
  },
  modalHeader: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "16px",
    textAlign: "center",
  },
  modalBody: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  modalInput: {
    padding: "8px 12px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    transition: "border-color 0.2s ease",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "24px",
    gap: "12px",
  },
  cancelButton: {
    backgroundColor: "#6b7280",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
};

export default ViewBranchDetails;