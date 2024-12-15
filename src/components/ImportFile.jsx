import { useState } from 'react';
import Cookies from "js-cookie";
import * as XLSX from "xlsx";

export default function ImportFile({tableName}) {
  const [setExcelData] = useState([]);

  const handleFileUpload = async (event) => {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;

    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('table', tableName);  

    
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;

    
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);

    
    const token = Cookies.get("token");
    const response = await fetch('https://inout-api.octopusteam.net/api/front/import', {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    
    const result = await response.json();
    if (response.ok) {
      console.log('File uploaded successfully:', result);
    } else {
      console.error('File upload failed:', result);
    }
  };

  return (
    <form>
      <input
        type="file"
        accept=".xlsx, .xls"
        name="file"
        onChange={handleFileUpload}
        className="mt-3 w-[100px] h-10 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
      />
    </form>
  );
}
