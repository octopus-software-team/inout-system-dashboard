import React from "react";

const AddEngineer = () => {
  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add Engineer</h1>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="engineerName"
            className="mb-2 font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="engineerName"
            placeholder="Engineer Name"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="email@example.com"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Phone Number */}
        <div className="flex flex-col">
          <label
            htmlFor="phoneNumber"
            className="mb-2 font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            placeholder="Phone Number"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Specialty */}
        <div className="flex flex-col">
          <label htmlFor="specialty" className="mb-2 font-medium text-gray-700">
            Specialty
          </label>
          <select
            id="specialty"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Select Specialty</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label
            htmlFor="dateOfBirth"
            className="mb-2 font-medium text-gray-700"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-2 font-medium text-gray-700">
            Gender
          </label>
          <select
            id="gender"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Select Gender</option>
            {/* Add more options as needed */}
          </select>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col relative">
          <label className="mb-2 font-medium text-gray-700">Upload Image</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-500">
            <span>Drop your file here</span>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col">
          <label
            htmlFor="experience"
            className="mb-2 font-medium text-gray-700"
          >
            Experience
          </label>
          <textarea
            id="experience"
            placeholder="Engineer Experience"
            rows="5"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Contract Start Date */}
        <div className="flex flex-col">
          <label
            htmlFor="contractStartDate"
            className="mb-2 font-medium text-gray-700"
          >
            Contract Start Date
          </label>
          <input
            type="date"
            id="contractStartDate"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contract End Date */}
        <div className="flex flex-col">
          <label
            htmlFor="contractEndDate"
            className="mb-2 font-medium text-gray-700"
          >
            Contract End Date
          </label>
          <input
            type="date"
            id="contractEndDate"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Contract Duration */}
        <div className="flex flex-col">
          <label
            htmlFor="contractDuration"
            className="mb-2 font-medium text-gray-700"
          >
            Contract Duration (in months)
          </label>
          <input
            type="number"
            id="contractDuration"
            placeholder="Contract Duration in Months"
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Upload Engineer Files */}
        <div className="flex flex-col">
          <label className="mb-2 font-medium text-gray-700">
            Upload Engineer Files
          </label>
          <input
            type="file"
            multiple
            className="p-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none w-40 focus:ring-2 focus:ring-blue-500"
          >
            Add Engineer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEngineer;
