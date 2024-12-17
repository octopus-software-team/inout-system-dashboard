import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import toast, { Toaster } from 'react-hot-toast';

const CreateConsultive = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 2,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address.';
    }

    if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone number must be between 10 and 15 digits.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please correct the highlighted errors.');
      return;
    }

    const token = Cookies.get("token");
    if (!token) {
      toast.error('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch('https://inout-api.octopusteam.net/api/front/addCustomer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok && data.status === 200) {
        toast.success('Consultant added successfully!');
        setTimeout(() => {
          navigate("/customers/consaltative");
        }, 2000);
        setFormData({
          name: '',
          email: '',
          phone: '',
          type: 2,
        });
        setErrors({});
      } else if (response.status === 422) {
        setErrors(data.data || {});
        toast.error('Please correct the highlighted errors.');
      } else {
        toast.error(data.msg || 'Failed to add consultant.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-800 py-10 px-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            width: "350px",
            height: "80px",
            fontSize: "1.2rem",
          },
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8"
      >
        <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Create Consultant
        </h2>

        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Consultant Name"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Consultant Email"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="phone"
            className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="Consultant Phone"
            required
            className={`w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-slate-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-200 ${
              errors.phone ? "border-red-500" : "border-gray-300 dark:border-gray-700"
            }`}
            value={formData.phone}
            onChange={handleChange}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        <input type="hidden" name="type" value={formData.type} />

        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 transition duration-300"
        >
          Create Consultant
        </button>
      </form>
    </div>
  );
};

export default CreateConsultive;
