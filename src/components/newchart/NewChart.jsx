import React, { useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Cookies from "js-cookie";

const NewChart = () => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // جلب البيانات من الـ API باستخدام fetch
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

        if (response.ok) {
          const data = result.data;

          const formattedData = [
            { name: "Projects", value: data.projects },
            { name: "Not Started", value: data.notStartedProjects },
            { name: "In Progress", value: data.InProgressProjects },
            { name: "Completed", value: data.completedProjects },
            { name: "Pending", value: data.pendingProjects },
            { name: "Under Review", value: data.underReview },
            { name: "Cancelled", value: data.cancelledProjects },
          ];

          setChartData(formattedData);
        } else {
          setError("error ocured");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center"> Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="px-[25px] pb-[40px]">
      <div className="flex mt-[22px] w-full gap-[30px]">
        <div className="cursor-pointer rounded-[4px] w-full">
          <div className="flex items-center justify-between py-[15px] px-[20px] mb-[20px]">
            <FaEllipsisV color="gray" className="cursor-pointer" />
          </div>

          <div className="chart" style={{ height: "600px"}}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3874FF"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewChart;
