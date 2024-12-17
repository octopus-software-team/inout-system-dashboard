// import Cookies from "js-cookie";

// export default function ExportFile({ tableName }) {
//   const handleExportFile = async () => {
//     const formData = new FormData();
//     formData.append("table", tableName);

//     const token = Cookies.get("token");

//     try {
//       const response = await fetch(
//         "https://inout-api.octopusteam.net/api/front/export",
//         {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         throw new Error("Failed to export file");
//       }

//       const blob = await response.blob();

//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;

//       link.download = `${tableName}.xlsx`;
//       document.body.appendChild(link);
//       link.click();

//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error("Error exporting file:", error);
//     }
//   };

//   return (
//     <button
//       onClick={handleExportFile}
//       className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105"
//     >
//       Export
//     </button>
//   );
// }


import React from 'react'

const ExportFile = () => {
  return (
    <div>
      
    </div>
  )
}

export default ExportFile
