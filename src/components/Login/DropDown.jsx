// DropDown.js
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import ProfileImage from "../../assests/11.jpg";
import Logout from "../logout/Logout";
import DarkModeToggle from "../../theme/DarkMode";
import Cookies from "js-cookie";
import { FaBell } from "react-icons/fa";

export default function DropDown() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isMarkingAll, setIsMarkingAll] = useState(false); // حالة التحميل
  const notificationsRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const notificationsAPI = "https://inout-api.octopusteam.net/api/front/getNotifications";
  const markAllAsReadAPI = "https://inout-api.octopusteam.net/api/front/markAllAsRead";

  // جلب الإشعارات
  useEffect(() => {
    fetch(notificationsAPI, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setNotifications(data.data || []))
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        setNotifications([]);
      });
  }, []);

  // تبديل قائمة الإشعارات
  const toggleNotifications = () => setNotificationsOpen((prev) => !prev);

  // تبديل قائمة الملف الشخصي
  const toggleProfileDropdown = () => setProfileDropdownOpen((prev) => !prev);

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // دالة لتحديد جميع الإشعارات كمقروءة
  const markAllAsRead = () => {
    setIsMarkingAll(true); // بدء حالة التحميل

    fetch(markAllAsReadAPI, {
      method: "POST", // تأكد من نوع الطلب المطلوب (POST أو PUT أو GET بناءً على الـ API)
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      // إذا كان الـ API يحتاج إلى جسم الطلب، قم بإضافته هنا
      // body: JSON.stringify({ /* بيانات إضافية إذا لزم الأمر */ }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setNotifications([]); // تفريغ قائمة الإشعارات
          // يمكنك إضافة إشعار نجاح هنا إذا رغبت
        } else {
          console.error("Failed to mark all as read:", data.msg);
          // يمكنك إضافة إشعار خطأ هنا إذا رغبت
        }
      })
      .catch((error) => {
        console.error("Error marking all as read:", error);
        // يمكنك إضافة إشعار خطأ هنا إذا رغبت
      })
      .finally(() => {
        setIsMarkingAll(false); // إنهاء حالة التحميل
      });
  };

  return (
    <div className="flex gap-3 items-center justify-between">
      {/* مفتاح الوضع الداكن */}
      <DarkModeToggle />

      {/* أيقونة الإشعارات والقائمة المنسدلة */}
      <div className="relative flex items-center" ref={notificationsRef}>
        <FaBell
          className="w-6 h-6 text-gray-600 cursor-pointer mr-3"
          onClick={toggleNotifications}
        />

        {notificationsOpen && (
          <div
            className="absolute top-12 right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50"
            style={{ top: "calc(100% + 10px)", right: "0" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Notifications</h3>
              {notifications.length > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={isMarkingAll}
                  className="text-sm text-blue-500 hover:underline focus:outline-none"
                >
                  {isMarkingAll ? "Loading..." : "Mark All as Read"}
                </button>
              )}
            </div>
            {notifications.length > 0 ? (
              <ul>
                {notifications.map((notification, index) => (
                  <li
                    key={index}
                    className="p-3 border-b border-gray-200 hover:bg-gray-100 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium">
                        {notification.employee}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mt-1">{notification.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No notifications.</p>
            )}
          </div>
        )}
      </div>

      {/* صورة الملف الشخصي والقائمة المنسدلة */}
      <div className="relative flex items-center" ref={profileDropdownRef}>
        <img
          src={ProfileImage}
          alt="Profile"
          className="w-10 h-10 rounded-full cursor-pointer"
          onClick={toggleProfileDropdown}
        />

        {profileDropdownOpen && (
          <div
            className="absolute top-12 right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-50"
            style={{ top: "calc(100% + 10px)", right: "0" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src={ProfileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full"
              />
            </div>

            <ul className="space-y-2 text-gray-700">
              <li>
                <Link
                  to="/login/admindetails"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="w-full text-left flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                >
                  <i className="fas fa-user"></i> Profile
                </Link>
              </li>
            </ul>

            <div className="border-t border-gray-200 my-3"></div>

            <Logout />
          </div>
        )}
      </div>
    </div>
  );
}
