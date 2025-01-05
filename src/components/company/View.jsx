// src/components/ViewEmployee.js
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";

// استيراد Dropify أو الاستغناء عنه إذا لم نحتاج لرفع الملفات
import $ from "jquery";
import "dropify/dist/css/dropify.min.css";
import "dropify/dist/js/dropify.min.js";

const ViewEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState(null);
  const [branches, setBranches] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = Cookies.get("token");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      navigate("/login");
      return;
    }

    const fetchBranches = async () => {
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
        const result = await response.json();
        if (result.status === 200) {
          setBranches(result.data);
        } else {
          console.error("Error fetching branches:", result.msg);
          toast.error(result.msg || "Failed to fetch branches.");
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        toast.error("Error fetching branches.");
      }
    };

    const fetchSpecialties = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployeesSpecials",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setSpecialties(result.data);
        } else {
          console.error("Error fetching specialties:", result.msg);
          toast.error(result.msg || "Failed to fetch specialties.");
        }
      } catch (error) {
        console.error("Error fetching specialties:", error);
        toast.error("Error fetching specialties.");
      }
    };

    const fetchEmployeeData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/getEmployees",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response from the server.");
        }

        const result = await response.json();
        console.log("API Response:", result);

        if (result.status === 200) {
          const employee = result.data.find(
            (emp) => emp.id === parseInt(id, 10)
          );

          if (employee) {
            setEmployeeData(employee);
          } else {
            throw new Error("Requested employee not found.");
          }
        } else {
          console.error("Error fetching employee data:", result.msg);
          toast.error(result.msg || "Failed to fetch employee data.");
        }
      } catch (error) {
        console.error("Error fetching employee data:", error);
        toast.error(error.message || "Error fetching employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBranches();
    fetchSpecialties();
    fetchEmployeeData();
  }, [token, id, navigate]);

  // تهيئة Dropify إذا احتجت لعرض صورة الموظف (Avatar) بصيغة مرفوعة
  useEffect(() => {
    if (fileInputRef.current) {
      $(fileInputRef.current).dropify();
    }
    return () => {
      if (fileInputRef.current) {
        const drEvent = $(fileInputRef.current).data("dropify");
        if (drEvent) {
          drEvent.destroy();
        }
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">View Employee</h1>
        <p>Loading employee data...</p>
      </div>
    );
  }

  if (!employeeData) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">View Employee</h1>
        <p>No data found for this employee.</p>
      </div>
    );
  }

  // تفكيك خصائص الموظف
  const {
    full_name,
    email,
    phone,
    branch_id,
    employee_special_id,
    date_of_birth,
    gender,
    experience,
    contract_start_date,
    contract_duration,
    contract_end_date,
    type,
    notes, 
    image,
  } = employeeData;

  // دوال مساعدة للحصول على أسماء الفرع والتخصص
  const branchName = branches.find((b) => b.id === branch_id)?.name || "N/A";
  const specialtyName =
    specialties.find((s) => s.id === employee_special_id)?.name || "N/A";
  const typeDisplay = type === 0 ? "Engineer" : "Employee";
  const genderDisplay = gender === 1 ? "Female" : "Male";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <ToastContainer />

      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-4 text-blue-600">
          Employee Details
        </h1>

        {/* صورة المستخدم (أفاتار) مع الاسم */}
        <div className="flex items-center mb-8">
          {/* إن كنت تريد إظهار صورة الموظف */}
          {image ? (
            <img
              src={image}
              alt="Employee Avatar"
              className="w-24 h-24 rounded-full object-cover mr-6 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mr-6 shadow-md">
              <span className="text-gray-500">No Image</span>
            </div>
          )}
          <div>
            <p className="text-xl font-semibold">{full_name}</p>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        {/* عرض المعلومات في جدول أو مجموعة حقول */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-gray-600 font-medium">Phone:</label>
            <p className="text-black">{phone || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Branch:</label>
            <p className="text-black">{branchName}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Specialty:</label>
            <p className="text-black">{specialtyName}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Date of Birth:</label>
            <p className="text-black">{date_of_birth || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Gender:</label>
            <p className="text-black">{genderDisplay}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Experience:</label>
            <p className="text-black">{experience || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">notes:</label>
            <p className="text-black">{notes || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">
              Contract Start Date:
            </label>
            <p className="text-black">{contract_start_date || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">
              Contract Duration (months):
            </label>
            <p className="text-black">{contract_duration || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Contract End Date:</label>
            <p className="text-black">{contract_end_date || "N/A"}</p>
          </div>

          <div>
            <label className="text-gray-600 font-medium">Type:</label>
            <p className="text-black">{typeDisplay}</p>
          </div>
        </div>

        {/* زر العودة إلى قائمة الموظفين */}
        <div className="mt-8">
          <button
            onClick={() => navigate("/company/employees")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Back to Employees List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployee;
