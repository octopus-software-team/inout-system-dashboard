import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const ShowAllProjects = () => {
  const [data, setData] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [sortedColumn, setSortedColumn] = useState(null);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const handleViewClick = () => {
    navigate("/allprojects/addreport");
  };

  const sorting = (col) => {
    let sorted = [];
    if (order === "ASC") {
      sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
      );
      setOrder("DSC");
    } else {
      sorted = [...data].sort((a, b) =>
        a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
      );
      setOrder("ASC");
    }
    setData(sorted);
    setSortedColumn(col);
  };

  useEffect(() => {
    axios
      .get("http://localhost:3030/users")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const renderSortIcon = (col) => {
    if (sortedColumn === col) {
      return order === "ASC" ? <span>&#9650;</span> : <span>&#9660;</span>;
    }
    return "";
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center font-bold text-2xl">Show All Project</h2>

      <div className="flex justify-end my-3">
        <input
          className="mr-auto border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-96"
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="search"
        />
        <Link
          to="/create"
          className="bg-slate-500 text-white font-semibold py-2 px-4 rounded hover:bg-slate-700 w-80 text-center"
        >
          Create +
        </Link>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th onClick={() => sorting("id")}>ID {renderSortIcon("id")}</th>
            <th onClick={() => sorting("name")}>
              Name {renderSortIcon("name")}
            </th>
            <th onClick={() => sorting("phoneNumber")}>
              Phone Number {renderSortIcon("phoneNumber")}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((i) => {
              return search.toLowerCase() === ""
                ? i
                : i.name.toLowerCase().includes(search);
            })
            .map((d, i) => (
              <tr key={i}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.phoneNumber}</td>
                <td>
                  <Link
                    to={`/update/${d.id}`}
                    className="bg-green-800 text-white font-semibold py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 inline-flex items-center"
                  >
                    <FaEdit className="mr-2 text-white w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-red-600 text-white font-semibold py-2 px-4 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-700 ml-2 inline-flex items-center"
                  >
                    <FaTrash className="mr-2 text-white w-4 h-4" />
                    Delete
                  </button>

                  <button
                    onClick={handleViewClick}
                    className="bg-blue-400 text-white font-semibold py-2 px-4 rounded hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2 inline-flex items-center"
                  >
                    <FaEye className="mr-2 text-white w-4 h-4" />
                    View
                  </button>

                  <button
                    onClick={() => handleDelete(d.id)}
                    className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 ml-2 inline-flex items-center"
                  >
                  
                    Add Report
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
        navigate("/company/services");
      });
    }
  }
};

export default ShowAllProjects;

// import React, { useState } from "react";
// import DataTable from "react-data-table-component";
// import { FaCheck, FaTrash, FaEllipsisH } from "react-icons/fa";
// import { Menu } from "@headlessui/react";
// import axios from "axios";

// const initialData = [
//   {
//     id: 1,
//     name: "Villa Mr.Mickel",
//     email: "Richard Dawkins",
//     age: "This Fitbit is fantastic! I was trying to be in better shape and needed some motivation, so I decided to treat myself to a new Fitbit.",
//   },
//   {
//     id: 4,
//     name: "emma wastonn",
//     email: "2021 Apple 12.9-inch iPad Pro-...",
//     age: "The response time and service I received when contacted the designers were phenomenal!",
//   },
//   {
//     id: 2,
//     name: "Madina Hospital under construction",
//     email: "Woodrow Burton",
//     age: "Gone Mac, there’s no going back. My first Mac lasted over nine years and this is my second.",
//   },
//   {
//     id: 3,
//     name: "Al Manara Hospital",
//     email: "Ashley Garrett",
//     age: "The order was delivered ahead of schedule. To give us additional time, you should leave the packaging sealed with plastic.",
//   },
// ];

// const ShowAllProjects = () => {
//   const [records, setRecords] = useState(initialData);
//   const [data] = useState(initialData);

//   const handleCheck = (row) => {
//     alert(`Checked project: ${row.name}`);
//   };

//   const handleDelete = (row) => {
//     if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
//       axios
//         .delete(`http://localhost:3030/projects/${row.id}`)
//         .then(() => {
//           alert("Project deleted successfully");
//           setRecords((prevRecords) => prevRecords.filter((r) => r.id !== row.id));
//         })
//         .catch((err) => console.error("Error deleting project:", err));
//     }
//   };

//   const columns = [
//     {
//       name: "PROJECTS",
//       selector: (row) => row.name,
//       sortable: true,
//       cell: (row) => (
//         <span className="text-blue-600 font-medium">{row.name}</span>
//       ),
//     },
//     {
//       name: "CUSTOMER",
//       selector: (row) => row.email,
//       sortable: true,
//       cell: (row) => (
//         <span className="flex items-center space-x-2 text-gray-800">
//           <span className="font-medium">{row.email}</span>
//         </span>
//       ),
//     },
//     {
//       name: "DETAILS",
//       selector: (row) => row.age,
//       sortable: true,
//       cell: (row) => <span className="text-gray-600">{row.age}</span>,
//     },
//     {
//       name: "ACTIONS",
//       cell: (row) => (
//         <div className="flex gap-2 justify-center">
//           <Menu as="div" className="relative inline-block text-left">
//             <Menu.Button className="bg-gray-100 border border-gray-300 text-gray-700 rounded-md p-2 hover:bg-gray-200 transition duration-200">
//               <FaEllipsisH size={14} />
//             </Menu.Button>
//             <Menu.Items className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg">
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? "bg-gray-100" : ""
//                     } w-full flex items-center px-4 py-2 text-sm text-gray-700`}
//                     onClick={() => handleCheck(row)}
//                   >
//                     <FaCheck className="mr-2 text-green-500" /> Check
//                   </button>
//                 )}
//               </Menu.Item>
//               <Menu.Item>
//                 {({ active }) => (
//                   <button
//                     className={`${
//                       active ? "bg-gray-100" : ""
//                     } w-full flex items-center px-4 py-2 text-sm text-gray-700`}
//                     onClick={() => handleDelete(row)}
//                   >
//                     <FaTrash className="mr-2 text-red-500" /> Delete
//                   </button>
//                 )}
//               </Menu.Item>
//             </Menu.Items>
//           </Menu>
//         </div>
//       ),
//       ignoreRowClick: true,
//       allowOverflow: true,
//       button: true,
//     },
//   ];

//   function handleFilter(event) {
//     const searchTerm = event.target.value.toLowerCase();
//     const filteredData = data.filter((row) => {
//       return (
//         row.name.toLowerCase().includes(searchTerm) ||
//         row.email.toLowerCase().includes(searchTerm) ||
//         row.age.toLowerCase().includes(searchTerm)
//       );
//     });
//     setRecords(filteredData);
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="container mx-auto p-6 shadow-lg rounded-lg">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h2 className="text-3xl font-bold text-gray-800">Latest Projects</h2>
//             <p className="text-gray-500">Payment received across all channels</p>
//           </div>
//           <input
//             type="text"
//             placeholder="Search"
//             onChange={handleFilter}
//             className="border border-gray-300 rounded-xl py-2 px-4 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         <DataTable
//           columns={columns}
//           data={records}
//           selectableRows
//           fixedHeader
//           pagination
//           className="overflow-x-auto"
//         />
//       </div>
//     </div>
//   );
// };

// export default ShowAllProjects;
