// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const CreateProject = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: "",
//     branch_id: "",
//     project_owner_id: "",
//     project_owner_type: "",
//     customer_constructor_id: "",
//     inspection_date: "",
//     inspection_time: "",
//     notes: "",
//     inspection_location_lat: "",
//     inspection_location_long: "",
//     status: "",
//     inspection_engineer_id: "",
//   });

//   const [branches, setBranches] = useState([]);
//   const [owners, setOwners] = useState([]);
//   const [customers, setCustomers] = useState([]);

//   useEffect(() => {
//     const fetchBranches = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch("https://inout-api.octopusteam.net/api/front/getBranches", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (data.status === 200) {
//           setBranches(data.data);
//         } else {
//           console.error("Failed to fetch branches");
//         }
//       } catch (error) {
//         console.error("Error fetching branches:", error);
//       }
//     };

//     const fetchOwners = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch("https://inout-api.octopusteam.net/api/front/addCustomer", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (data.status === 200) {
//           setOwners(data.data);
//         } else {
//           console.error("Failed to fetch owners");
//         }
//       } catch (error) {
//         console.error("Error fetching owners:", error);
//       }
//     };

//     const fetchCustomers = async () => {
//       const token = localStorage.getItem('token');
//       try {
//         const response = await fetch("https://inout-api.octopusteam.net/api/front/getCustomers", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (data.status === 200) {
//           setCustomers(data.data);
//         } else {
//           console.error("Failed to fetch customers");
//         }
//       } catch (error) {
//         console.error("Error fetching customers:", error);
//       }
//     };

//     fetchBranches();
//     fetchOwners();
//     fetchCustomers();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     const token = localStorage.getItem('token');
//     e.preventDefault();
    
//     fetch("https://inout-api.octopusteam.net/api/front/addProject", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(formData),
//     })
//       .then((response) => response.json())
//       .then((res) => {
//         if (res.status === 200) {
//           alert("Project added successfully!");
//           navigate("/allprojects/showallprojects");
//         } else {
//           alert("Failed to add project");
//         }
//       })
//       .catch((err) => console.error("Error:", err));
//   };

//   return (
//     <div className="container mx-auto mt-10">
//       <h2 className="text-center font-semibold text-3xl text-gray-800 mb-8">Create New Project</h2>
//       <form onSubmit={handleSubmit} className="form1  dark:bg-slate-900 p-8 rounded-lg shadow-lg max-w-3xl mx-auto">
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Project Name */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Project Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Branch */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Branch</label>
//             <select
//               name="branch_id"
//               value={formData.branch_id}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             >
//               <option value="">Select Branch</option>
//               {branches.map((branch) => (
//                 <option key={branch.id} value={branch.id}>
//                   {branch.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Project Owner Type */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Project Owner</label>
//             <select
//               name="project_owner_type"
//               value={formData.project_owner_type}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             >
//               <option value="">Select Project Owner Type</option>
//               <option value="1">Owner</option>
//               <option value="0">Client</option>
//               <option value="2">Consultant</option>
//             </select>
//           </div>

//           {/* Project Owner ID */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Project Owner ID</label>
//             <select
//               name="project_owner_id"
//               value={formData.project_owner_id}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             >
//               <option value="">Select Project Owner</option>
//               {owners.map((owner) => (
//                 <option key={owner.id} value={owner.id}>
//                   {owner.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Customer Constructor */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Customer Constructor</label>
//             <select
//               name="customer_constructor_id"
//               value={formData.customer_constructor_id}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             >
//               <option value="">Select Customer Constructor</option>
//               {customers.map((customer) => (
//                 <option key={customer.id} value={customer.id}>
//                   {customer.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Inspection Date */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Inspection Date</label>
//             <input
//               type="date"
//               name="inspection_date"
//               value={formData.inspection_date}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Inspection Time */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Inspection Time</label>
//             <input
//               type="time"
//               name="inspection_time"
//               value={formData.inspection_time}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div className="form-group md:col-span-2">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Notes</label>
//             <textarea
//               name="notes"
//               value={formData.notes || ""}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               rows="4"
//             />
//           </div>

//           {/* Latitude */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Latitude</label>
//             <input
//               type="text"
//               name="inspection_location_lat"
//               value={formData.inspection_location_lat}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Longitude */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Longitude</label>
//             <input
//               type="text"
//               name="inspection_location_long"
//               value={formData.inspection_location_long}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Status */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Status</label>
//             <input
//               type="number"
//               name="status"
//               value={formData.status}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>

//           {/* Inspection Engineer ID */}
//           <div className="form-group">
//             <label className="block text-gray-700 dark:text-white font-semibold mb-2">Inspection Engineer ID</label>
//             <input
//               type="number"
//               name="inspection_engineer_id"
//               value={formData.inspection_engineer_id}
//               onChange={handleInputChange}
//               className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
//               required
//             />
//           </div>
//         </div>

//         {/* Submit Button */}
//         <div className="mt-6 text-center">
//           <button type="submit" className="bg-blue-500 dark:bg-blue-700 text-white rounded-lg px-6 py-2 text-lg">
//             Create Project
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateProject;


import React from 'react'

const CreateProject = () => {
  return (
    <div>
      
    </div>
  )
}

export default CreateProject
