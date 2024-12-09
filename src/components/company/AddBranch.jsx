// import React, { useState } from "react";

// const AddBranch = () => {
//   const [branchName, setBranchName] = useState("");
//   const [message, setMessage] = useState("");
//   const [branchData, setBranchData] = useState(null);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const data = {
//       name: branchName.trim(),
//     };

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         "https://inout-api.octopusteam.net/api/front/addBranch",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(data),
//         }
//       );

//       const result = await response.json();

//       // عرض التفاصيل إذا حدث خطأ
//       if (!response.ok) {
//         console.error("Error Details:", result);
//         throw new Error(result.msg || "Failed to add branch");
//       }

//       setMessage(result.msg || "Branch added successfully!");
//       setBranchData(result.data);
//     } catch (error) {
//       setMessage("Error: " + error.message);
//       console.error("Error:", error);
//     }
//   };

//   return (
//     <div className="service max-w-lg mt-24  mx-auto p-6  rounded-lg shadow-sm">
//       <h2 className="text-2xl font-semibold text-center mb-4">Add Branch</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-700">
//             Branch Name
//           </label>
//           <input
//             type="text"
//             value={branchName}
//             onChange={(e) => setBranchName(e.target.value)}
//             className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           Add Branch
//         </button>
//       </form>

//       {message && (
//         <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
//       )}

//       {branchData && (
//         <div className="mt-4 p-4 bg-gray-100 rounded-lg">
//           <h3 className="text-lg font-semibold">Branch Details:</h3>
//           <p>
//             <strong>ID:</strong> {branchData.id}
//           </p>
//           <p>
//             <strong>Name:</strong> {branchData.name}
//           </p>
//           <p>
//             <strong>Latitude:</strong> {branchData.latitude}
//           </p>
//           <p>
//             <strong>Longitude:</strong> {branchData.longitude}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddBranch;

import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const googleMapsAPIKey = "AIzaSyD7IXBWO2i9Dc7phqL9uJiqNxKD4Er1zdk";

const AddBranch = () => {
  const [branchName, setBranchName] = useState("");
  const [message, setMessage] = useState("");
  const [branchData, setBranchData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: branchName.trim(),
      latitude: latitude,
      longitude: longitude,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/addBranch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        console.error("Error Details:", result);
        throw new Error(result.msg || "Failed to add branch");
      }

      setMessage(result.msg || "Branch added successfully!");
      setBranchData(result.data);
    } catch (error) {
      setMessage("Error: " + error.message);
      console.error("Error:", error);
    }
  };

  // Handle map click to get latitude and longitude
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <div className="service max-w-lg mt-24 mx-auto p-6 rounded-lg shadow-sm">
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
            className="mt-2 w-full dark:bg-slate-800 dark:text-white px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Click on the Map to Set Location
          </label>
          <div style={{ width: "100%", height: "300px" }}>
            <LoadScript googleMapsApiKey={googleMapsAPIKey}>
              <GoogleMap
                id="map"
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={{ lat: 37.7749, lng: -122.4194 }} // Default map center
                zoom={10}
                onClick={handleMapClick}
              >
                {latitude && longitude && (
                  <Marker position={{ lat: latitude, lng: longitude }} />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add Branch
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
      )}

      {branchData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold">Branch Details:</h3>
          <p>
            <strong>ID:</strong> {branchData.id}
          </p>
          <p>
            <strong>Name:</strong> {branchData.name}
          </p>
          <p>
            <strong>Latitude:</strong> {branchData.latitude}
          </p>
          <p>
            <strong>Longitude:</strong> {branchData.longitude}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddBranch;
