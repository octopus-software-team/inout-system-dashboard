import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";
import Chartjs from "../charts/Chartjs";
import NewChart from "../newchart/NewChart";
import pic1 from "../../assests/12.png";
import pic2 from "../../assests/15.png";
import pic3 from "../../assests/13.png";
import pic4 from "../../assests/14.png";
import Cookies from "js-cookie";

const DashBoard = () => {
  const [responseData, setResponseData] = useState({
    pendingProjects: 0,
    InProgressProjects: 0,
    completedProjects: 0,
    cancelledProjects: 0,
  });

  useEffect(() => {
    const token = Cookies.get("token");

    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/statistics",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setResponseData({
            pendingProjects: result.data.pendingProjects,
            InProgressProjects: result.data.InProgressProjects,
            completedProjects: result.data.completedProjects,
            cancelledProjects: result.data.cancelledProjects,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-1 dark:text-white">
      <div className="text-left md:text-left mt-11">
        <h1 className="project1 text-2xl md:text-4xl font-bold  ml-11">
          Project Manager
        </h1>

        <p className="text-gray-500 text-xl dark:text-white py-3 ml-11">
          Here's what's going on at your business right now
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mr-96">
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-28" src={pic1} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Pending
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              {responseData.pendingProjects} Projects
            </p>
          </div>
        </div>
        <div className="flex items-center mr-10">
          <div className="rounded-full">
            <img className="w-40" src={pic2} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Processing
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              {responseData.InProgressProjects} Projects
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-24" src={pic3} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Completed
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              {responseData.completedProjects} Projects
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-20" src={pic4} alt="" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Canceled
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              {responseData.cancelledProjects} Projects
            </p>
          </div>
        </div>
      </div>
      <div className="my-1">
        <hr className="border-t border-gray-300 mx-auto w-11/12" />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg dark:bg-slate-950">
        <div className="flex flex-col ml-5 md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div>
              <div className="flex dark:text-white items-center justify-between mb-4">
                <h2 className="total mt-7 text-3xl md:text-3xl font-bold">
                  Statistic
                </h2>
              </div>
              <span className="block text-sm font-normal text-gray-500 dark:text-white">
                Payment received across all channels
              </span>
              <NewChart />
            </div>
          </div>
        </div>
        <Chartjs />
      </div>
    </div>
  );
};

export default DashBoard;
