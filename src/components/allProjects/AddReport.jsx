import React from "react";

const AddReport = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="bg-white rounded-lg shadow-lg p-8 w-11/12 md:w-3/4 lg:w-1/2">
        <h1 className="text-center font-bold text-3xl mb-5 text-gray-700">
          Hospital x Project
        </h1>

        <div className="flex justify-between mb-5 text-sm text-gray-700">
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

        <div className="border-t border-b py-4">
          <h2 className="font-bold text-xl mb-2">General Inspection</h2>

          <h3 className="font-semibold text-lg">Title</h3>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>

          <h3 className="font-semibold text-lg mt-3">Description</h3>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>

          <h3 className="font-semibold text-lg mt-3">Image</h3>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>
        </div>

        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Logistic Inspection</h2>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>
        </div>

        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Safety Inspection</h2>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>
        </div>

        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Reports</h2>
          <textarea className="border border-gray-300 rounded-lg p-3 w-full h-32 bg-white"></textarea>
        </div>

        <div className="border-t py-4">
          <h2 className="font-bold text-xl mb-2">Tasks</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Finalize the construction site layout</li>
            <li>Conduct the initial safety briefing</li>
            <li>Schedule the next inspection date</li>
            <li>Update the project risk assessment document</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddReport;
