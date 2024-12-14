import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateMaterialCategory = () => {
  const [serviceName, setServiceName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://inout-api.octopusteam.net/api/front/addService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: serviceName }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || 'Service added successfully!');
        setServiceName('');
        setTimeout(() => navigate('/company/assets/materialcategory'), 2000);
      } else {
        toast.error(result.msg || 'An error occurred while adding the service.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while adding the service.');
    }
  };

  return (
    <div className="flex dark:bg-slate-950 justify-center items-center mt-20 bg-gray-100">
      <ToastContainer />
      <div className="service dark:bg-slate-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Material Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700">
            Create Material Category
            </label>
            <input
              type="text"
              id="serviceName"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="mt-1 dark:bg-slate-800 dark:text-white block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:ring-4 focus:ring-blue-300"
          >
            Create Material Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateMaterialCategory;
