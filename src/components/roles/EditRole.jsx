import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditRole = () => {
  const { roleId } = useParams(); // الحصول على roleId من الـ URL
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // جلب بيانات الدور الحالي
  useEffect(() => {
    const fetchRoleData = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/UpdateRole/${roleId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch role data");
        }

        const data = await response.json();
        if (data.status === 200) {
          setRoleName(data.data.name);
          setSelectedPermissions(data.data.permissions.map((p) => p.id));
        }
      } catch (error) {
        console.error("Error fetching role data:", error);
      }
    };

    fetchRoleData();
  }, [roleId]);

  // جلب جميع الصلاحيات المتاحة
  useEffect(() => {
    const fetchPermissions = async () => {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getPermissions",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data = await response.json();
        if (data.status === 200) {
          setPermissions(data.data);
        }
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, []);

  // تحديث الدور
  const handleUpdateRole = async () => {
    const token = Cookies.get("token");
    if (!token) {
      console.error("No token found. Please log in.");
      return;
    }

    if (!roleName) {
      setError("Role name is required.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setError("Please select at least one permission.");
      return;
    }

    try {
      const response = await fetch(
        `https://inout-api.octopusteam.net/api/front/UpdateRole/${roleId}`,
        {
          method: "PUT", // أو PATCH
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roleName,
            permission_id: selectedPermissions,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.data) {
          setError(data.data.name || data.data.permission_id);
        } else {
          setError("Failed to update role. Please try again.");
        }
        return;
      }

      if (data.status === 200) {
        toast.success("Role updated successfully!");
        setTimeout(() => {
          navigate("/roles/role");
        }, 3000);
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setError("Failed to update role. Please try again.");
    }
  };

  // تحديد أو إلغاء تحديد جميع الصلاحيات
  const handleSelectAll = () => {
    if (selectedPermissions.length === permissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(permissions.map((permission) => permission.id));
    }
  };

  // تجميع الصلاحيات حسب المجموعات
  const groupPermissions = (permissions) => {
    const grouped = {};
    permissions.forEach((permission) => {
      const key = permission.name.split("_")[1]; // افتراض أن الاسم يكون مثل "create_admin"
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(permission);
    });
    return grouped;
  };

  const groupedPermissions = groupPermissions(permissions);

  return (
    <div className="flex justify-center items-center mt-10 bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Edit Role</h1>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded-lg">
            {Array.isArray(error) ? error.join(", ") : error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Role Name</label>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter role name"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Permissions</label>
          <div className="flex justify-between items-center mb-4">
            <span>Select All Permissions</span>
            <input
              type="checkbox"
              checked={selectedPermissions.length === permissions.length}
              onChange={handleSelectAll}
              className="custom-checkbox"
            />
          </div>

          {Object.entries(groupedPermissions).map(([group, permissions]) => (
            <div key={group} className="mb-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">{group}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {permissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="permission-item"
                    onClick={() => {
                      if (selectedPermissions.includes(permission.id)) {
                        setSelectedPermissions(selectedPermissions.filter((id) => id !== permission.id));
                      } else {
                        setSelectedPermissions([...selectedPermissions, permission.id]);
                      }
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(permission.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPermissions([...selectedPermissions, permission.id]);
                        } else {
                          setSelectedPermissions(selectedPermissions.filter((id) => id !== permission.id));
                        }
                      }}
                      className="custom-checkbox"
                    />
                    <span className="text-sm">{permission.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleUpdateRole}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Update Role
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
    </div>
  );
};

export default EditRole;