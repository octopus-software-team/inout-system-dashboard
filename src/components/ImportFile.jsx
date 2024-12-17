// import { useState } from 'react';
// import Cookies from "js-cookie";
// import * as XLSX from "xlsx";

// export default function ImportFile({ tableName }) {
//   const [excelData, setExcelData] = useState([]); // make sure to use setExcelData correctly

//   const handleFileUpload = async (event) => {
//     event.preventDefault();
//     const file = event.target.files?.[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('table', tableName);  

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target?.result;
//       if (!data) return;

//       const workbook = XLSX.read(data, { type: 'binary' });
//       const worksheetName = workbook.SheetNames[0];
//       const worksheet = workbook.Sheets[worksheetName];
//       const jsonData = XLSX.utils.sheet_to_json(worksheet);

//       // Here, use setExcelData to update the state correctly
//       setExcelData(jsonData);
//     };
//     reader.readAsBinaryString(file);

//     const token = Cookies.get("token");
//     const response = await fetch('https://inout-api.octopusteam.net/api/front/import', {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       body: formData,
//     });

//     const result = await response.json();
//     if (response.ok) {
//       console.log('File uploaded successfully:', result);
//     } else {
//       console.error('File upload failed:', result);
//     }
//   };

//   return (
//     <form>
//       <input
//         type="file"
//         accept=".xlsx, .xls"
//         name="file"
//         onChange={handleFileUpload}
//         className="mt-3 w-[100px] h-10 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
//       />
//     </form>
//   );
// }



import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const ImportFile = ({ tableName }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("table", tableName); // Send table name as part of the form data

    const token = Cookies.get("token");

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/import", // Endpoint for importing the file
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const resData = await response.json();

      if (resData.status === 200) {
        toast.success(resData.msg || "File uploaded successfully.");
      } else {
        toast.error(resData.msg || "Failed to upload file.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file.");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleFileUpload}
        className="bg-blue-500 text-white py-2 px-6 rounded-lg"
      >
        Upload File
      </button>
    </div>
  );
};

export default ImportFile;
