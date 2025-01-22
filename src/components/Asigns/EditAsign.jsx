import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditAsign = () => {
  const location = useLocation();
  const { adminId, roleId } = location.state || {}; // استخراج adminId و roleId من state
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]); // بيانات المشرفين
  const [roles, setRoles] = useState([]); // بيانات الأدوار
  const [selectedAdmin, setSelectedAdmin] = useState(""); // المشرف المختار
  const [selectedRoles, setSelectedRoles] = useState([]); // الأدوار المختارة
  const [error, setError] = useState(null); // رسائل الخطأ

  // جلب بيانات المشرفين
  useEffect(() => {
    const fetchAdmins = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getAdmins",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch admins");
        }

        const data = await response.json();
        if (data.status === 200) {
          setAdmins(data.data);
        }
      } catch (error) {
        console.error("Error fetching admins:", error);
        setError("Failed to fetch admins. Please try again later.");
      }
    };

    fetchAdmins();
  }, []);

  // جلب بيانات الأدوار
  useEffect(() => {
    const fetchRoles = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getRoles",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch roles");
        }

        const data = await response.json();
        if (data.status === 200) {
          setRoles(data.data);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles. Please try again later.");
      }
    };

    fetchRoles();
  }, []);

  // تعيين القيم المختارة بناءً على adminId و roleId
  useEffect(() => {
    if (adminId && roleId) {
      setSelectedAdmin(adminId);
      setSelectedRoles([roleId]);
    }
  }, [adminId, roleId]);

  // دالة تحديث الأدوار للمشرف
  const handleUpdateRolesToAdmin = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    if (!selectedAdmin) {
      setError("Please select an admin.");
      return;
    }

    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/UpdateRolesToAdmin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            admin_id: selectedAdmin,
            role_id: selectedRoles,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.data) {
          setError(data.data.admin_id || data.data.role_id);
        } else {
          setError("Failed to update roles. Please try again.");
        }
        return;
      }

      if (data.status === 200) {
        toast.success("Roles updated successfully!");
        setTimeout(() => {
          navigate("/asigns/asignroletoadmin");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating roles:", error);
      setError("Failed to update roles. Please try again.");
    }
  };

  const handleAdminSelection = (adminId) => {
    setSelectedAdmin(adminId);
  };

  const handleRoleSelection = (roleId) => {
    if (selectedRoles.includes(roleId)) {
      setSelectedRoles(selectedRoles.filter((id) => id !== roleId));
    } else {
      setSelectedRoles([...selectedRoles, roleId]);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10 bg-gray-100">
      <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Edit Assigned Roles
        </h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg">
            {Array.isArray(error) ? error.join(", ") : error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Select Admin</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {admins.map((admin) => (
              <div
                key={admin.id}
                className="flex items-center space-x-2"
                onClick={() => handleAdminSelection(admin.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedAdmin === admin.id}
                  onChange={() => handleAdminSelection(admin.id)}
                  className="custom-checkbox"
                />
                <span className="text-sm">{admin.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Select Roles</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center space-x-2"
                onClick={() => handleRoleSelection(role.id)}
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => handleRoleSelection(role.id)}
                  className="custom-checkbox"
                />
                <span className="text-sm">{role.name}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleUpdateRolesToAdmin}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Roles
        </button>
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
      />

      <style>
        {`
          .custom-checkbox {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            width: 20px;
            height: 20px;
            border: 2px solid #4a90e2;
            border-radius: 4px;
            cursor: pointer;
            position: relative;
          }

          .custom-checkbox:checked {
            background-color: #4a90e2;
          }

          .custom-checkbox:checked::after {
            content: "✔";
            font-size: 14px;
            color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `}
      </style>
    </div>
  );
};

export default EditAsign;