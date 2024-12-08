import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateProject = () => {
  const { id } = useParams(); // جلب id من URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    branch_id: "",
    project_owner_id: "",
    customer_constructor_id: "",
    inspection_date: "",
    inspection_time: "",
    notes: "",
    inspection_location_lat: "",
    inspection_location_long: "",
    status: "",
    inspection_engineer_id: "",
  });
  const [loading, setLoading] = useState(true);  // حالة التحميل
  const [error, setError] = useState(null);  // حالة الخطأ

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch("https://inout-api.octopusteam.net/api/front/getProjects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          const project = res.data.find((item) => item.id === parseInt(id));
          if (project) {
            setFormData(project); // تعيين بيانات المشروع
          } else {
            setError("Project not found");
          }
        } else {
          setError(`Failed to fetch projects: ${res.msg}`);
        }
      })
      .catch((err) => setError(`Error fetching projects: ${err.message}`))
      .finally(() => setLoading(false));  // انتهاء التحميل
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();

    // تحقق من أن جميع الحقول الأساسية مليئة
    if (!formData.name) {
      alert("Please enter the project name");
      return;
    }

    setLoading(true);  // تفعيل حالة التحميل

    fetch(`https://inout-api.octopusteam.net/api/front/updateProject/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.status === 200) {
          alert("Project updated successfully!");
          navigate("/allprojects");
        } else {
          alert(`Failed to update project: ${res.msg}`);
        }
      })
      .catch((err) => setError(`Error updating project: ${err.message}`))
      .finally(() => setLoading(false));  // انتهاء التحميل
  };

  if (loading) {
    return <div>Loading...</div>;  // عرض النص أثناء التحميل
  }

  if (error) {
    return <div className="error">{error}</div>;  // عرض رسالة الخطأ إذا كان هناك خطأ
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Update Project</h2>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Project Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleChange}
            className="w-full dark:bg-slate-900 dark:text-white border  border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default UpdateProject;
