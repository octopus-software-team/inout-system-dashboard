import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';


const CreateEmpFiles = () => {
  const [files, setFiles] = useState([]); // لحفظ الملفات المرفوعة
  const [employees, setEmployees] = useState([]); // لحفظ بيانات الموظفين
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(""); // لحفظ ID الموظف المحدد
  const [message, setMessage] = useState(""); // لعرض الرسائل

  // Fetch files and employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');

        // Fetch employees data (تأكد من استبدال هذا بالـ API الخاص بك)
        const employeesResponse = await fetch("https://inout-api.octopusteam.net/api/front/getEmployees", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const employeesData = await employeesResponse.json();
        if (employeesData.status === 200) {
          setEmployees(employeesData.data);
        } else {
          setMessage("Failed to fetch employees.");
        }
      } catch (error) {
        setMessage("Error fetching data.");
      }
    };

    fetchData();
  }, []);

  // Handle file change
  const handleFileChange = (e) => {
    setFiles(e.target.files); // حفظ الملفات المرفوعة
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare FormData to send files and employee_id
    const formData = new FormData();
    // إضافة الملفات إلى FormData
    Array.from(files).forEach((file) => {
      formData.append("files[]", file); // "files[]" اسم الحقل في الـ API
    });
    formData.append("employee_id", selectedEmployeeId); // إضافة ID الموظف

    try {
      const token = Cookies.get('token');
      const response = await fetch("https://inout-api.octopusteam.net/api/front/addEmployeeFile", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData, // إرسال البيانات كـ FormData
      });
      const result = await response.json();
      if (result.status === 200) {
        setMessage("Files added successfully!");
      } else {
        setMessage("Failed to add files.");
      }
    } catch (error) {
      setMessage("Error submitting the form.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Create Employee File</h2>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-5">
        {message && <div className="text-center mb-4 text-red-500">{message}</div>}

        {/* Input for file upload */}
        <div className="mb-4">
          <label htmlFor="files" className="block text-lg font-semibold">Upload Files</label>
          <input
            type="file"
            id="files"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>

        {/* Select Employee */}
        <div className="mb-4">
          <label htmlFor="employee_id" className="block text-lg font-semibold">Select Employee</label>
          <select
            id="employee_id"
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select an Employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="mb-4 text-center">
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmpFiles;
