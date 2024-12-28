// Clients.js
import React, { useEffect, useState, useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net";

const Clients = () => {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]); // To store branch names
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);
  const dataTable = useRef(null);

  const navigate = useNavigate();

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getBranches",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setBranches(data.data);
        } else {
          console.error("Failed to fetch branches.");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Fetch clients function
  const fetchClients = async () => {
    const token = Cookies.get("token");

    if (!token) {
      console.log("No token found, cannot fetch clients.");
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/getCustomers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const resData = await response.json();
      setData(resData.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError("Failed to fetch clients. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch clients on mount
  useEffect(() => {
    fetchClients();
  }, []);

  // Listen for customer addition and refresh data
  useEffect(() => {
    const handleCustomerAdded = () => {
      fetchClients(); // Refresh the client list
    };

    window.addEventListener("customerAdded", handleCustomerAdded);

    return () => {
      window.removeEventListener("customerAdded", handleCustomerAdded);
    };
  }, []);

  // Initialize DataTable
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          paging: true,
          searching: true,
          info: true,
          ordering: true,
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
          columnDefs: [{ orderable: false, targets: -1 }],
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
  }, [data, isLoading]);

  // Get branch name by ID
  const getBranchName = (branchId) => {
    const branch = branches.find((b) => b.id === branchId);
    return branch ? branch.name : "Unknown Branch"; // Default text if branch is not found
  };

  // Handle Edit
  const handleEdit = (id) => {
    const selectedClient = data.find((client) => client.id === id);
    navigate("/customers/updateclients", { state: selectedClient });
  };

  // Handle Delete
  const handleDelete = (id) => {
    setDeleteId(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    const token = Cookies.get("token");

    if (!token) {
      toast.error("No token found. Please log in.");
      setIsConfirmOpen(false);
      return;
    }

    fetch(
      `https://inout-api.octopusteam.net/api/front/deleteCustomer/${deleteId}`,
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
          throw new Error("Failed to delete client.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.msg || "Client deleted successfully.");
        setData((prevData) =>
          prevData.filter((client) => client.id !== deleteId)
        );
        setIsConfirmOpen(false);
      })
      .catch((error) => {
        console.error("Error deleting client:", error);
        toast.error("Failed to delete the client. Please try again.");
        setIsConfirmOpen(false);
      });
  };

  return (
    <div className="container p-6 mt-5">
      <h2 className="text-center font-bold text-3xl dark:text-white">
        Clients
      </h2>

      <div className="flex justify-end items-center my-4">
        <Link
          to="/customers/createclients"
          className="icons text-white bg-blue-800 rounded p-2 "
        >
          + Create Client
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-700 mt-56 text-xl font-semibold">
            Loading...
          </p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No clients found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table
            ref={tableRef}
            className="display min-w-full divide-y divide-gray-200"
          >
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Name
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Phone
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Branch
                </th>
                <th className="px-4 py-3 text-left font-semibold text-lg border-b border-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-gray-100 transition duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {d.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {d.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {d.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {d.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {getBranchName(d.branch_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex gap-4">
                    <button
                      onClick={() => handleEdit(d.id)}
                      className="edit rounded-lg hover:shadow-md "
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="colors rounded-lg "
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
      )}

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
      />
    </div>
  );
};

export default Clients;
