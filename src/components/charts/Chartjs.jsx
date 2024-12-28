import React, { useRef, useEffect, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Chart } from "chart.js/auto";
import ReviewsProvider from "./ReviewsProvider";
import Cookies from "js-cookie";
import LatestProject from "./LatestProject";

const Chartjs = () => {
  // تعريف المراجع لكل شارت
  const barChartRef = useRef(null);
  const customerChartRef = useRef(null);
  // لا نستخدم lineChartRef لذا نقوم بإزالته
  // const lineChartRef = useRef(null);
  const [apiData, setApiData] = useState(null);

  // تعريف الحد الأقصى لعرض الدوائر الدائرية (يمكنك تعديل هذه القيم بناءً على احتياجاتك)
  const MAX_EMPLOYEES = 10;
  const MAX_SERVICES = 30;

  const calcColor = (percent, start, end) => {
    let a = percent / 100,
      b = (end - start) * a,
      c = b + start;

    return "hsl(" + c + ", 100%, 50%)";
  };

  // جلب البيانات من الـ API عند تحميل المكون
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token");

        const response = await fetch(
          "https://inout-api.octopusteam.net/api/front/statistics",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setApiData(result.data);
          console.log("API Data fetched successfully:", result.data);
        } else {
          console.error("Failed to fetch data:", result.msg);
        }
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, []);

  // إنشاء شارت البار الأولى: Total Projects باستخدام بيانات الـ API
  useEffect(() => {
    if (!apiData) return; // الانتظار حتى يتم تحميل البيانات

    if (barChartRef.current) {
      const barCtx = barChartRef.current.getContext("2d");
      console.log("Initializing Total Projects Bar Chart");

      const barChartInstance = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Projects", "Completed", "Pending"],
          datasets: [
            {
              label: "Projects Data",
              data: [
                apiData.projects || 0,
                apiData.completedProjects || 0,
                apiData.pendingProjects || 0,
              ],
              backgroundColor: ["#85a9ff", "#4caf50", "#f44336"],
              borderWidth: 7,
            },
          ],
        },
        options: {
          scales: {
            y: {
              ticks: { display: true },
              grid: { display: true },
            },
            x: {
              ticks: { display: true },
              grid: { display: false },
            },
          },
          responsive: true,
          plugins: {
            legend: { display: false }, // إخفاء الليجند
          },
        },
      });

      return () => {
        barChartInstance.destroy();
        console.log("Destroyed Total Projects Bar Chart");
      };
    }
  }, [apiData]);

  // إنشاء شارت البار الثانية: Total Customer باستخدام بيانات الـ API
  useEffect(() => {
    if (!apiData) return; // الانتظار حتى يتم تحميل البيانات

    if (customerChartRef.current) {
      const customerCtx = customerChartRef.current.getContext("2d");
      console.log("Initializing Total Customer Bar Chart");

      const customerChartInstance = new Chart(customerCtx, {
        type: "bar",
        data: {
          labels: ["Clients", "Owners", "Consultants"],
          datasets: [
            {
              label: "Customer Categories",
              data: [
                apiData.clients || 0,
                apiData.owners || 0,
                apiData.consultants || 0,
              ],
              backgroundColor: ["#f8b400", "#34d399", "#60a5fa"],
              borderWidth: 7,
            },
          ],
        },
        options: {
          scales: {
            y: {
              ticks: { display: true },
              grid: { display: true },
            },
            x: {
              ticks: { display: true },
              grid: { display: false },
            },
          },
          responsive: true,
          plugins: {
            legend: { display: false }, // إخفاء الليجند
          },
        },
      });

      return () => {
        customerChartInstance.destroy();
        console.log("Destroyed Total Customer Bar Chart");
      };
    }
  }, [apiData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {/* الشارت الأول: Total Projects */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div>
              <h3 className="project1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Projects
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Last 7 days
              </p>
            </div>
            <div>
              <span className="text-sm ml-8 text-yellow-300 border border-yellow-400 bg-gray-900 px-2 py-1 rounded-full">
                {apiData
                  ? apiData.completedProjects >= apiData.pendingProjects
                    ? `+${(
                        (apiData.completedProjects /
                          (apiData.completedProjects +
                            apiData.pendingProjects)) *
                        100
                      ).toFixed(2)}%`
                    : `-${(
                        (apiData.pendingProjects /
                          (apiData.completedProjects +
                            apiData.pendingProjects)) *
                        100
                      ).toFixed(2)}%`
                  : "Loading..."}
              </span>
            </div>
          </div>
          <div>
            <p className="project1 text-2xl font-bold text-gray-800 dark:text-white">
              {apiData ? apiData.projects : "Loading..."}
            </p>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={barChartRef} width="200" height="200"></canvas>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Completed</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.completedProjects}` : "Loading..."}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Pending</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.pendingProjects}` : "Loading..."}
          </span>
        </div>
      </div>

      {/* الشارت الثاني: Total Customer */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div className="flex">
            <div>
              <h3 className="project1 text-lg font-semibold text-gray-800 dark:text-gray-200">
                Total Customer
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Last 7 days
              </p>
            </div>
            <div>
              <span className="text-sm ml-8 text-yellow-300 border border-yellow-400 bg-gray-900 px-2 py-1 rounded-full">
                {apiData
                  ? `Total: ${
                      apiData.clients + apiData.owners + apiData.consultants
                    }`
                  : "Loading..."}
              </span>
            </div>
          </div>
          <div>
            <p className="project1 text-2xl font-bold text-gray-800 dark:text-white">
              {apiData
                ? apiData.clients + apiData.owners + apiData.consultants
                : "Loading..."}
            </p>
          </div>
        </div>
        <div className="mt-4 h-48 flex justify-center items-center rounded-lg">
          <canvas ref={customerChartRef} width="200" height="200"></canvas>
        </div>
        <div className="mt-4 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Clients</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.clients}` : "Loading..."}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Owners</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.owners}` : "Loading..."}
          </span>
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Consultants
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.consultants}` : "Loading..."}
          </span>
        </div>
      </div>

      {/* الشارت الثالث: Total Employee */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12 h-96 flex flex-col">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Total Employee
          </h3>
          <p className="text-sm text-gray-500 dark:text-white">Last 7 days</p>
        </div>

        <div className="mt-4 flex justify-center w-full">
          <div style={{ width: "150px" }}>
            <CircularProgressbar
              value={
                apiData
                  ? ((apiData.employees +
                      apiData.engineers +
                      apiData.workers +
                      apiData.employeeSpecials +
                      apiData.employeeFiles) /
                      MAX_EMPLOYEES) *
                    100
                  : 0
              }
              text={
                apiData
                  ? `${(
                      ((apiData.employees +
                        apiData.engineers +
                        apiData.workers +
                        apiData.employeeSpecials +
                        apiData.employeeFiles) /
                        MAX_EMPLOYEES) *
                      100
                    ).toFixed(2)}%`
                  : "Loading..."
              }
              styles={buildStyles({
                textColor: "#808080",
                pathColor: "#3b82f6",
                trailColor: "#d1d5db",
                textSize: "24px",
                strokeLinecap: "round",
              })}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">Employees</span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData
              ? `${
                  apiData.employees +
                  apiData.engineers +
                  apiData.workers +
                  apiData.employeeSpecials +
                  apiData.employeeFiles
                }`
              : "Loading..."}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Engineers & Workers
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData ? `${apiData.engineers + apiData.workers}` : "Loading..."}
          </span>
        </div>

        <div className="mt-2 flex justify-between text-sm w-full px-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Specials & Files
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">
            {apiData
              ? `${apiData.employeeSpecials + apiData.employeeFiles}`
              : "Loading..."}
          </span>
        </div>
      </div>

      {/* الشارت الرابع: Total Services */}
      <div className="nav-item dark:bg-slate-800 shadow-md rounded-lg p-6 w-11/12">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Total Services
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Last 7 days
            </p>
          </div>
        </div>

        <div
          className="mt-4 flex justify-center items-center"
          style={{ height: "100px" }}
        >
          <ReviewsProvider
            valueStart={0}
            valueEnd={apiData ? apiData.services : 0}
          >
            {({ value }) => (
              <div
                style={{ width: "100px", height: "50px", overflow: "hidden" }}
              >
                <CircularProgressbar
                  value={apiData ? (apiData.services / MAX_SERVICES) * 100 : 0}
                  circleRatio={0.5}
                  text={
                    apiData
                      ? `${((apiData.services / MAX_SERVICES) * 100).toFixed(
                          2
                        )}%`
                      : "Loading..."
                  }
                  styles={{
                    trail: {
                      strokeLinecap: "butt",
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                    },
                    path: {
                      strokeLinecap: "butt",
                      transform: "rotate(-90deg)",
                      transformOrigin: "center center",
                      stroke: calcColor(
                        apiData ? (apiData.services / MAX_SERVICES) * 100 : 0,
                        0,
                        120
                      ),
                    },
                    text: {
                      fill: "#3b82f6",
                      fontSize: "16px",
                      
                    },
                  }}
                  strokeWidth={10}
                />
              </div>
            )}
          </ReviewsProvider>
        </div>

        <div className="mt-10 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Non-paying customer
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">70%</span>
        </div>

        <div className="mt-2 flex justify-between text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Paying customer
            </span>
          </div>
          <span className="text-gray-600 dark:text-gray-300">30%</span>
        </div>
      </div>
      <LatestProject/>
    </div>
  );
};

export default Chartjs;
