import React from "react";

const AddReport = () => {
  return (
    <div className="container mx-auto p-5">
      {/* Page Title */}
      <h1 className="text-center font-bold text-3xl mb-5">Hospital x Project</h1>

      {/* Project Details */}
      <div className="flex justify-between mb-5 text-sm">
        <div>
          <p><strong>Owner:</strong> Hospital Administration</p>
          <p><strong>Consultive:</strong> Heath Consulting Ltd</p>
          <p><strong>Services:</strong> Building, Electrical, HVAC</p>
        </div>
        <div className="text-right">
          <p><strong>Customer / Contractor:</strong> XYZ Construction</p>
          <p><strong>Inspection Engineer:</strong> Dr. John Doe</p>
          <p><strong>Team Members:</strong> [Dropdown with names]</p>
        </div>
      </div>

      {/* General Inspection Section */}
      <div className="border-t border-b py-4">
        <h2 className="font-bold text-xl mb-2">General Inspection</h2>

        {/* Title Section */}
        <h3 className="font-semibold text-lg">Title</h3>
        <div className="border border-gray-300 rounded-lg p-3 h-10 w-80 mb-3 bg-white"></div>

        {/* Description Section */}
        <h3 className="font-semibold text-lg">Description</h3>
        <div className="border border-gray-300 rounded-lg p-3 h-10 w-80 mb-3 bg-white"></div>

        {/* Image Section */}
        <h3 className="font-semibold text-lg">Image</h3>
        <div className="border border-gray-300 rounded-lg p-3 h-10 w-80 bg-white"></div>
      </div>

      {/* Logistic Inspection Section */}
      <div className="border-t py-4">
        <h2 className="font-bold text-xl mb-2">Logistic Inspection</h2>
        <div className="border border-gray-300 rounded-lg p-3 h-24 w-80 bg-white"></div>
      </div>

      {/* Safety Inspection Section */}
      <div className="border-t py-4">
        <h2 className="font-bold text-xl mb-2">Safety Inspection</h2>
        <div className="border border-gray-300 rounded-lg p-3 h-24 w-80 bg-white"></div>
      </div>

      {/* Reports Section */}
      <div className="border-t py-4">
        <h2 className="font-bold text-xl mb-2">Reports</h2>
        <div className="border border-gray-300 rounded-lg p-3 h-24 w-80 bg-white"></div>
      </div>

      {/* Tasks Section */}
      <div className="border-t py-4">
        <h2 className="font-bold text-xl mb-2">Tasks</h2>
        <ul className="list-disc pl-5">
          <li>Finalize the construction site layout</li>
          <li>Conduct the initial safety briefing</li>
          <li>Schedule the next inspection date</li>
          <li>Update the project risk assessment document</li>
        </ul>
      </div>
    </div>
  );
};

export default AddReport;





// import React from "react";

// const AddReport = () => {
//   return (
//     <>
//       <div>
//         <h1 className="mt-10 text-center font-bold text-3xl"></h1>
//       </div>

//       <div className="flex space-x-8 ml-5">
//         {/* القسم الأول */}
//         <div className="w-1/2">
//           <h1 className="font-bold text-3xl">General Inspection</h1>
//           <h1 className="font-bold mt-3 text-2xl">Title</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>

//           <h1 className="font-bold mt-3 text-2xl">Description</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>

//           <h1 className="font-bold mt-3 text-2xl">Image</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>
//         </div>

//         {/* القسم الثاني الجديد */}
//         <div className="w-1/2">
//           <h1 className="font-bold mt-5 text-2xl">Logistic Inspection</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>

//           <h1 className="font-bold mt-3 text-2xl">Safety</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>

//           <h1 className="font-bold mt-3 text-2xl">Reports</h1>
//           <textarea className="border border-gray-300 rounded-lg p-4 h-32 w-10/12 bg-white overflow-y-auto resize-none"></textarea>
//         </div>
//       </div>

//       <br />
//       <br />

//       <hr />
//     </>
//   );
// };

// export default AddReport;
