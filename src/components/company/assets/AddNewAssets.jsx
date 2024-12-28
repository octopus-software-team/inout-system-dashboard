import React, { useEffect, useState, useRef } from "react"; 
import { FaEdit, FaTrash } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom"; 
import Cookies from 'js-cookie'; 
import $ from "jquery"; 
import "datatables.net"; 
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddNewAssets = () => {
  const [data, setData] = useState([]);    
  const [assetTypes, setAssetTypes] = useState([]); 
  const [branches, setBranches] = useState([]); // State to store branches
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState(null);
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  useEffect(() => {
    const token = Cookies.get('token');

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

  useEffect(() => {
    if (data.length > 0) {
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: false,
          info: false,
          language: {
            search: "Search:",
            lengthMenu: "Show _MENU_ entries",
            info: "Showing _START_ to _END_ of _TOTAL_ entries",
            paginate: {
              first: "First",
              last: "Last",
              next: "Next",
              previous: "Previous"
            }
          }
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
      const token = Cookies.get('token');
      fetch(`https://inout-api.octopusteam.net/api/front/deleteAsset/${assetToDelete}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to delete asset");
          }
          return res.json();
        })
        .then((resData) => {
          toast.success("Asset deleted successfully!");
          setData((prevData) => prevData.filter((asset) => asset.id !== assetToDelete));
          closeModal();
        })
        .catch((err) => {
          console.error("Error deleting asset:", err.message);
          toast.error("Failed to delete asset. Please try again.");
          closeModal();
        });
    }
  };

  const filteredData = data.filter((item) =>
    search === ""
      ? item
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <ToastContainer />

      <h2 className="text-center font-bold text-2xl text-black">Assets</h2>

      <div className="flex justify-end items-center my-4">
        <Link
          to="/company/assets/createassets"
          className="bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Assets
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table
          ref={tableRef}
          className="display table-auto w-full border border-gray-200 bg-white rounded-lg"
        >
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">#</th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">Assets Type</th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">Branch</th>
              <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((d, index) => (
              <tr
                key={d.id}
                className={`hover:bg-gray-100 transition duration-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 text-gray-800">{d.id}</td>
                <td className="px-4 py-3 text-gray-800">{d.name}</td>
                <td className="px-4 py-3 text-gray-800">{getAssetTypeNameById(d.asset_type_id)}</td>
                <td className="px-4 py-3 text-gray-800">{getBranchNameById(d.branch_id)}</td>
                <td className="px-4 py-3 text-left space-x-2">
                  <button
                    onClick={() =>
                      navigate(`/company/assets/updateassets`, { state: d })
                    }
                    className="edit py-2 px-4 rounded-lg "
                  >
                    <FaEdit className="inline mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => openModal(d.id)}
                    className="colors py-2 px-4 rounded-lg "
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
    </div>
  );
};

export default AddNewAssets;
