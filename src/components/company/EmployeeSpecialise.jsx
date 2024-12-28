import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import $ from "jquery";
import "datatables.net";
import { FaEdit, FaTrash } from "react-icons/fa";

const EmployeesSpecials = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const tableRef = useRef(null);
  const dataTable = useRef(null); // لإدارة مثيل DataTables

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token found. Please log in.");
      setIsLoading(false);
      return;
    }

    fetch("https://inout-api.octopusteam.net/api/front/getEmployeesSpecials", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // إرسال التوكن في الهيدر
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data.");
        }
        return response.json();
      })
      .then((res) => {
        if (res.status === 200) {
          setData(res.data); // تخزين البيانات في الحالة
        } else {
          setError("Failed to load employees specials.");
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError("Error loading data.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isLoading && !error && data.length > 0) {
      // تهيئة DataTables فقط إذا لم يكن هناك مثيل سابق
      if (!dataTable.current) {
        dataTable.current = $(tableRef.current).DataTable({
          // يمكنك إضافة إعدادات DataTables هنا حسب الحاجة
          paging: true,
          searching: false, // نعطل البحث المدمج لأننا نستخدم خاصية البحث الخاصة بنا
          info: false,
        });
      } else {
        // إذا كان مثيل DataTables موجوداً، قم بتحديث البيانات
        dataTable.current.clear();
        dataTable.current.rows.add(data);
        dataTable.current.draw();
      }
    }

    // تنظيف مثيل DataTables عند إزالة المكون
    return () => {
      if (dataTable.current) {
        dataTable.current.destroy();
        dataTable.current = null;
      }
    };
  }, [isLoading, error, data]);

  const handleEdit = (id) => {
    const selectedEmployee = data.find((employee) => employee.id === id);
    navigate(`/company/updatespecialise`, { state: selectedEmployee });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      const token = Cookies.get("token"); // الحصول على التوكن من التخزين المحلي

      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      try {
        const response = await fetch(
          `https://inout-api.octopusteam.net/api/front/deleteEmployeesSpecials/${id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // تمرير التوكن في الهيدر
            },
          }
        );

        const result = await response.json();

        if (response.ok && result.status === 200) {
          // تحديث البيانات محليًا بعد الحذف
          setData(data.filter((item) => item.id !== id));
          alert("Employee deleted successfully!");
        } else {
          setError(result.msg || "Failed to delete employee.");
        }
      } catch (err) {
        console.error("Error deleting employee:", err);
        setError("Error deleting employee. Please try again.");
      }
    }
  };

  // فلترة البيانات بناءً على البحث
  const filteredData = data.filter((item) =>
    search === ""
      ? item
      : item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto mt-5 p-4">
      <h2 className="text-center font-bold text-2xl mb-5">
        Employees Specials
      </h2>

      <div className="flex justify-between items-center mb-5">
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Link
          to="/company/createSpecialise"
          className="icons bg-blue-800 text-white font-semibold py-2 px-6 rounded-lg hover:shadow-md transform hover:scale-105 transition duration-300"
        >
          + Create Employee
        </Link>
      </div>

      {/* الجدول */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <p className="text-gray-600 mt-56 text-xl font-semibold">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No data found.</p>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg w-full mx-auto">
          <table
            ref={tableRef}
            className="display table-auto w-full border border-gray-200 bg-white rounded-lg"
          >
            <thead>
              <tr className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.type === 0 ? "Engineer" : "Employee"}</td>
                  <td className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(item.id)}
                      className="edit  py-2 px-4 rounded-lg "
                    >
                      <FaEdit className="inline" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="colors  py-2 px-4 rounded-lg "
                    >
                      <FaTrash className="inline" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeesSpecials;
