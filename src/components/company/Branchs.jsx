import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Branchs = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBranches = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
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
          console.log(resData);
          setData(resData.data);
        } else {
          toast.error(resData.msg || "No data found.");
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
        toast.error("Failed to fetch branches.");
      }
    };

    fetchBranches();
  }, []);


  useEffect(() => {
    console.log(data)
  },[])


  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
  
    // Display confirmation toast
    const confirmToast = toast(
      <div>
        <p>Are you sure you want to delete this branch?</p>
        <div className="flex space-x-2 justify-end mt-2">
          <button
            onClick={() => handleConfirmDelete(id, token, confirmToast)}
            className="bg-red-600 text-white py-1 px-4 rounded-lg"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(confirmToast)} // Close toast if "No" is selected
            className="bg-gray-600 text-white py-1 px-4 rounded-lg"
          >
            No
          </button>
        </div>
      </div>,
      { autoClose: false, closeButton: false }
    );
  };
  
  const handleConfirmDelete = async (id, token, confirmToast) => {
    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/deleteBranch/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to delete branch.");
      }
  
      const resData = await response.json();
  
      if (resData.status === 200) {
        toast.success(resData.msg || "Branch deleted successfully.");
        setData((prevData) => prevData.filter((branch) => branch.id !== id));
        toast.dismiss(confirmToast); // Close confirmation toast
      } else {
        toast.error(resData.msg || "Failed to delete branch.");
      }
    } catch (err) {
      console.error("Error deleting branch:", err);
      toast.error("An error occurred while deleting the branch.");
      toast.dismiss(confirmToast); // Close confirmation toast
    }
  };
  

  // Sorting logic
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
        if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
        return 0;
      })
    );
  };

  const openMap = (locationUrl) => {
    window.open(locationUrl, "_blank");
  };

  return (
    <div className="container p-5 mt-5">
      <h2 className="text-center font-bold text-2xl text-black">Branches</h2>

      <div className="flex justify-between items-center my-4">
        <input
          className="border border-gray-300  rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-2/3 shadow-md"
          type="text"
          placeholder="Search branches..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/addbranch"
          className="bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          + Create Branch
        </Link>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
        <table className="table-auto w-full border border-gray-200 bg-white rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
              <th
                className="px-4  py-3 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                onClick={() => handleSort("id")}
              >
                ID {sortConfig.key === "id" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
              </th>
              <th
                className="px-4 text-left font-semibold text-lg border-b border-gray-300 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                Name {sortConfig.key === "name" ? (sortConfig.direction === "ascending" ? "↑" : "↓") : ""}
              </th>
              <th className="px-4 text-left font-semibold text-lg border-b border-gray-300">
                Location
              </th>
              <th className="px-4 text-right font-semibold text-lg border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter((i) => {
                return search.toLowerCase() === ""
                  ? i
                  : i.name.toLowerCase().includes(search.toLowerCase());
              })
              .map((d, index) => (
                <tr
                  key={d.id}
                  className={`hover:bg-gray-100 transition dark:bg-slate-900 duration-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 dark:bg-slate-900 py-3 dark:text-white text-gray-800">
                    {d.id}
                  </td>
                  <td className="px-4 dark:bg-slate-900 py-3 dark:text-white text-gray-800">
                    {d.name}
                  </td>
                  <td className="px-4 dark:bg-slate-900 py-3 dark:text-white text-gray-800">
                    <button
                      onClick={() => openMap(d.location)}
                      className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      View on Map
                    </button>
                  </td>
                  <td className="px-4 dark:bg-slate-900 text-right space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/company/updatebranch/${d.id}`, { state: d })
                      }
                      className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
                    >
                      <FaEdit className="inline mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
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
        style={{ zIndex: 9999 }} // Ensure toast appears above other elements
      />
    </div>
  );
};

export default Branchs;
