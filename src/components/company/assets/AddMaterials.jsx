import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import $ from "jquery";
import "datatables.net";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddMaterials = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [search, setSearch] = useState("");
  const [materialToDelete, setMaterialToDelete] = useState(null); // Material to delete
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchBranches = fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => setBranches(resData.data || []))
      .catch((err) => toast.error("Failed to fetch branches"));

    const fetchMaterials = fetch("https://inout-api.octopusteam.net/api/front/getMaterials", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((resData) => setData(resData.data || []))
      .catch((err) => toast.error("Failed to fetch materials"));

    Promise.all([fetchBranches, fetchMaterials]);
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

  const confirmDelete = () => {
    const token = Cookies.get("token");
    fetch(`https://inout-api.octopusteam.net/api/front/deleteMaterial/${materialToDelete}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete material");
        return res.json();
      })
      .then(() => {
        setData((prevData) => prevData.filter((material) => material.id !== materialToDelete));
        toast.success("Material deleted successfully");
        setMaterialToDelete(null);
      })
      .catch(() => toast.error("Failed to delete material"));
  };

  const getBranchName = (branch_id) => {
    const branch = branches.find((b) => b.id === branch_id);
    return branch ? branch.name : "Unknown";
  };

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2 className="text-center font-bold text-2xl text-black">Materials</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300 rounded-lg px-4 py-2 w-96"
          type="text"
          placeholder="Search materials..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/assets/creatematerials"
          className="icons bg-blue-800 text-white py-2 px-6 rounded-lg"
        >
          + Create Material
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table
          ref={tableRef}
          className="display table-auto w-full border border-gray-200 bg-white rounded-lg"
        >
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((item) =>
                search === ""
                  ? item
                  : item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item, index) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-100 ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                >
                  <td className="px-4 py-3">{item.id}</td>
                  <td className="px-4 py-3">{item.name}</td>
                  <td className="px-4 py-3">{item.stock}</td>
                  <td className="px-4 py-3">{item.type_label}</td>
                  <td className="px-4 py-3">{getBranchName(item.branch_id)}</td>
                  <td className="px-4 py-3  space-x-2">
                    <button
                      onClick={() => navigate(`/company/assets/updatematerials`, { state: item })}
                      className="edit rounded-lg"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setMaterialToDelete(item.id)}
                      className="colors rounded-lg"
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
    </div>
  );
};

export default AddMaterials;
