import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Create = () => {
    const [inputData, setInoutData]= useState({
        id:"",
        name:"",
        email:""

    })

      const navigate = useNavigate()

    const handleSubmit =(event)=>{
        event.preventDefault();
        axios.post('http://localhost:3030/users', inputData )
        .then(res=>{
            alert("Data Posted Successfully")
            navigate("/company/addservices")
        })
    }

  return (
    <div className="bg-gray-100 flex items-center justify-center mt-40">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-10/12">
        <h2 className="text-center text-2xl font-bold mb-4 text-gray-800">Add Services</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Id</label>
          <input
            type="text"
            id="id"
            name="id"
            placeholder="Your id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={e =>setInoutData({...inputData, id:e.target.value})} />
          
        </div>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Name</label>
          <input
            type="name"
            id="name"
            name="name"
            placeholder="Your Name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={e =>setInoutData({...inputData, name:e.target.value})}  />
        </div>

        <div className="mb-4">
          <label htmlFor="phone Number" className="block text-gray-700 font-semibold mb-2">phone Number</label>
          <input
            type="phone Number"
            id="phone Number"
            name="phone Number"
            placeholder="Your phone Number"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-200"
            onChange={e =>setInoutData({...inputData, phoneNumber:e.target.value})}  />
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-indigo-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default Create;
