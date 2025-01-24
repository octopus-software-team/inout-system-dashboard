import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import * as XLSX from 'xlsx';

const ImportFile = ({ tableName, onClose }) => {
  const [file, setFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // حالة التحميل

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(jsonData);
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("يرجى تحديد ملف للرفع.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("table", tableName); 

    const token = Cookies.get("token");

    setIsUploading(true); 

    try {
      const response = await fetch(
        "https://inout-api.octopusteam.net/api/front/import", 
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const resData = await response.json();

      if (response.ok && resData.status === 200) {
        toast.success(resData.msg || "تم رفع الملف بنجاح.");
        // إغلاق المودال بعد نجاح الرفع
        if (onClose) {
          onClose();
        }
      } else {
        toast.error(resData.msg || "فشل في رفع الملف.");
      }
    } catch (error) {
      console.error("خطأ في رفع الملف:", error);
      toast.error("حدث خطأ أثناء رفع الملف.");
    } finally {
      setIsUploading(false); // انتهاء التحميل
    }
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-white rounded-lg shadow-md max-w-md mx-auto">
      <label className="flex flex-col items-center justify-center w-full h-48 border-4 border-dashed border-blue-500 rounded-lg cursor-pointer bg-gray-50 hover:bg-blue-50 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-16 h-16 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="mt-2 text-gray-600">upload your file</span>
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
      
      {file && (
        <div className="mt-4 w-full text-center">
          <p className="text-gray-700">
            selected file <span className="font-semibold">{file.name}</span>
          </p>
        </div>
      )}
      
      <button
        onClick={handleFileUpload}
        className={`mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-300 ${
          !file || isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!file || isUploading}
      >
        {isUploading ? "Loading..." : "pload file "}
      </button>
    </div>
  );
};

export default ImportFile;
