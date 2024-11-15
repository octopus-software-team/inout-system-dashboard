import React from 'react';

const AddNewTask = () => {
  return (
    <div className="flex flex-col items-center pt-20">
      <h1 className="text-2xl font-bold mb-8">Add New Task</h1>

      {/* Name Input */}
      <div className="mb-6 w-1/2">
        <label htmlFor="taskName" className="block text-gray-700 font-semibold mb-2">
          Task Name
        </label>
        <input
          type="text"
          id="taskName"
          placeholder="Enter task name"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Status Select */}
      <div className="mb-6 w-1/2">
        <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">
          Task Status
        </label>
        <select
          id="status"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="inProgress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Employee Select */}
      <div className="mb-6 w-1/2">
        <label htmlFor="employee" className="block text-gray-700 font-semibold mb-2">
          Assign to Employee
        </label>
        <select
          id="employee"
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an employee</option>
          <option value="employee1">Employee 1</option>
          <option value="employee2">Employee 2</option>
          <option value="employee3">Employee 3</option>
        </select>
      </div>

      {/* Submit Button */}
      <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
        Add Task
      </button>
    </div>
  );
};

export default AddNewTask;
