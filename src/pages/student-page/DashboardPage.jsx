import React, { useEffect, useState } from "react";
import Api from "../../utils/apiClient"; // adjust path if needed
import {
  FaUserGraduate,
  FaBook,
  FaRupeeSign,
  FaCertificate,
} from "react-icons/fa";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { MdVerified } from "react-icons/md";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudent: 0,
    totalCourse: 0,
    totalFees: 0,
    totalCertificate: 0,
  });
  const [admissionsData, setAdmissionsData] = useState({});
  const [feesCollectionData, setFeesCollectionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await Api.get("/dashboard");
      const d = res.data.data;

      setStats({
        totalStudent: d.totalStudent,
        totalCourse: d.totalCourse,
        totalFees: d.totalFees,
        totalCertificate: d.totalCertificate,
      });
      setAdmissionsData(d.monthlyAdmissions || {});
      setFeesCollectionData(d.monthlyFeesCollection || {});
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // prepare chart data
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const enrollmentChartData = {
    labels: months,
    datasets: [
      {
        label: "New Students",
        data: months.map((m) => admissionsData[m] ?? 0),
        backgroundColor: "#255267",
        borderWidth: 1,
      },
    ],
  };

  const feesChartData = {
    labels: months,
    datasets: [
      {
        label: "Fees Collected (₹)",
        data: months.map((m) => feesCollectionData[m] ?? 0),
        backgroundColor: "#255267",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto md:mx-130 my-100 px-4 sm:px-6 md:px-8 ">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto md:mx-120 my-100 px-4 sm:px-6 md:px-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
          <FaUserGraduate className="text-4xl text-primary" />
          <div>
            <p className="text-gray-500">Total Students</p>
            <p className="text-2xl font-semibold">{stats.totalStudent}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
          <FaBook className="text-4xl text-primary" />
          <div>
            <p className="text-gray-500">Total Courses</p>
            <p className="text-2xl font-semibold">{stats.totalCourse}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
          <FaRupeeSign className="text-4xl text-primary" />
          <div>
            <p className="text-gray-500">Total Fees Collected</p>
            <p className="text-2xl font-semibold">
              ₹ {stats.totalFees.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center gap-4">
          <MdVerified className="text-4xl text-primary" />
          <div>
            <p className="text-gray-500">Total Certificates</p>
            <p className="text-2xl font-semibold">{stats.totalCertificate}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Monthly Enrollments</h2>
          <Bar data={enrollmentChartData} />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Fees Collection
          </h2>
          <Line data={feesChartData} />
        </div>
      </div>

      {/* You can add more widgets, stats, lists, etc. */}
    </div>
  );
};

export default DashboardPage;
