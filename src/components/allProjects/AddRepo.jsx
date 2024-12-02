import React from 'react'

const AddRepo = () => {
  return (
    <div className='mt-10 flex justify-center items-center'>
      <form className='w-full max-w-sm'>
        <div className='mb-4'>
          <label htmlFor="repo" className='block text-sm font-medium text-gray-700'>Add Report</label>
          <textarea
            id="repo"
            placeholder="Add Report"
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            rows="4"
          />
        </div>
        <button 
          type="submit"
          className='w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default AddRepo
