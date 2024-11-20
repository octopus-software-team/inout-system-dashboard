import React, { useState } from 'react';

const AddBranch = () => {
  const [branchName, setBranchName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [message, setMessage] = useState('');
  const [branchData, setBranchData] = useState(null); // لحفظ بيانات الفرع المضافة

  const token = localStorage.getItem('authToken');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Parse latitude and longitude to ensure they are numbers
    const parsedLatitude = parseFloat(latitude);
    const parsedLongitude = parseFloat(longitude);

    // Check if latitude and longitude are valid numbers
    if (isNaN(parsedLatitude) || isNaN(parsedLongitude)) {
      setMessage('Latitude and Longitude must be valid numbers.');
      return;
    }

    const data = {
      name: branchName,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
    };

    try {
        const response = await fetch('https://inout-api.octopusteam.net/api/front/addBranch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Ensure the token is correct
          },
          body: JSON.stringify(data),
        });
      
        const text = await response.text(); // Use text() instead of json() for debugging
        console.log('Raw Response:', text); // Log the raw response for analysis
      
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
      
        const result = JSON.parse(text); // Parse manually if needed
        setMessage(result.msg);
        setBranchData(result.data);
        console.log('Branch added successfully:', result.data);
      } catch (error) {
        setMessage('Error: ' + error.message);
        console.error('Error:', error);
      }
      
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Add Branch</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Branch Name
          </label>
          <input
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            name="name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            name="latitude"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
            name="longitude"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Branch
        </button>
      </form>
      {/* {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )} */}
      {branchData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Branch Details:</h3>
          <p><strong>ID:</strong> {branchData.id}</p>
          <p><strong>Name:</strong> {branchData.name}</p>
          <p><strong>Latitude:</strong> {branchData.latitude}</p>
          <p><strong>Longitude:</strong> {branchData.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default AddBranch;
