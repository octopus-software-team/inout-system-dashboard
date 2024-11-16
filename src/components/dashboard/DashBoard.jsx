import React, { useRef } from "react";
import { Chart } from "chart.js/auto";
import Chartjs from "../charts/Chartjs";
import NewChart from "../newchart/NewChart";
import pic1 from "../../assests/12.png";
import pic2 from "../../assests/15.png";
import pic3 from "../../assests/13.png";
import pic4 from "../../assests/14.png";

const DashBoard = () => {
  const chartRef = useRef(null);

  return (
    <div className="p-1 dark:bg-slate-950 dark:text-white">
      <div className="text-left md:text-left mt-11">
        <h1 className="text-2xl md:text-4xl font-bold  ml-11">
          Project Manager
        </h1>

        <p className="text-gray-500 dark:text-white py-3 ml-11">
          Here's what's going on at your business right now
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mr-96">
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-28" src={pic1} alt="" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Pending
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              Awaiting process
            </p>
          </div>
        </div>
        <div className="flex items-center mr-10">
          <div className="rounded-full">
            <img className="w-24" src={pic2} alt="" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Processing
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">3 Projects</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-20" src={pic3} alt="" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Completed
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              Out of stock
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="rounded-full">
            <img className="w-20" src={pic4} alt="" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Canceled
            </h3>
            <p className="text-sm text-gray-500 dark:text-white">
              Out of stock
            </p>
          </div>
        </div>
      </div>
      <hr />

      {/* Chart and Sales Section */}
      <div className="bg-gray-100 p-4 rounded-lg dark:bg-slate-950">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-semibold  dark:text-white">
                  Total Sales
                </h2>
                <select className="border  border-gray-300 w-5/12 ml-28 rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none text-lg dark:bg-black dark:text-black dark:border-gray-600">
                  <option>Mar 1 - 31, 2022</option>
                </select>
              </div>
              <span className="block text-sm font-normal text-gray-500 dark:text-white mb-4">
                Payment received across all channels
              </span>
              <NewChart />
            </div>
          </div>
        </div>
        <Chartjs />
        {/* Chart */}
        {/* <div className="w-full h-64">
          <canvas ref={chartRef} id="lineChart"></canvas>
        </div> */}
      </div>
    </div>
  );
};

export default DashBoard;
