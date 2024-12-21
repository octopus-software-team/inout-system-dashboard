// import React, { useEffect, useState } from "react";
// import Cookies from "js-cookie";

// function AdminDetails() {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const token = Cookies.get("token");

//     const fetchUserData = async () => {
//       try {
//         const response = await fetch("https://inout-api.octopusteam.net/api/front/login", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setUserData(data.data);
//         } else {
//           setError(data.msg || "فشل في جلب البيانات");
//         }
//       } catch (err) {
//         setError("حدث خطأ أثناء جلب البيانات");
//       }
//       setLoading(false);
//     };

//     fetchUserData();
//   }, []);

//   if (loading) return <p>جارٍ التحميل...</p>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   return (
//     <div className="admin-details-page p-6">
//       <h1 className="text-2xl font-bold mb-4">تفاصيل المدير</h1>
//       {userData ? (
//         <div className="bg-white shadow-md rounded p-4">
//           <p><strong>الاسم:</strong> {userData.name}</p>
//           <p><strong>البريد الإلكتروني:</strong> {userData.email}</p>
//         </div>
//       ) : (
//         <p>لا توجد بيانات لعرضها.</p>
//       )}
//     </div>
//   );
// }

// export default AdminDetails;


import React from 'react'

const AdminDetails = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdminDetails
