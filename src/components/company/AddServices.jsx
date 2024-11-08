import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddServices = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:3030/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Add Services</h2>

      <div className="flex justify-end my-3">
        <Link
          to="/create"
          className="bg-slate-600 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr key={i}>
              <td>{d.id}</td>
              <td>{d.name}</td>
              <td>{d.phoneNumber}</td>
              <td>
                <Link
                  to={`/update/${d.id}`}
                  className="bg-green-800 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700"
                >
                  Update
                </Link>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function handleDelete(id) {
    const confirm = window.confirm("Do you like to delete");
    if (confirm) {
      axios.delete("http://localhost:3030/users/" + id).then((res) => {
        alert("record deleted");
        navigate("/company/addservices");
      });
    }
  }
};

export default AddServices;
