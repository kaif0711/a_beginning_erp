import {
  FaUser,
  FaUsers,
  FaMoneyBill,
  FaFileInvoice,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import Api from "../utils/apiClient";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const data = await Api.post("/admin/logout");
      if (data.status === 200) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* ⭐ Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden fixed top-2 left-4 z-50 bg-white text-primary px-3 py-1 rounded shadow-md"
      >
        ☰
      </button>

      {/* ⭐ Sidebar wrapper — responsive */}
      <aside
        className={`
          bg-[#255267] text-white h-screen fixed top-0 z-40 flex flex-col
          transition-all duration-300
          w-64
          ${open ? "left-0" : "-left-64"}   // ⭐ Mobile slide animation
          sm:left-0                         // ⭐ Desktop always visible
        `}
      >
        {/* TOP PROFILE CARD */}
        <div className="flex flex-col items-center py-6 border-b border-white/10">
          <img
            src="https://imgs.search.brave.com/BpNWWlad2aQ4zsAAsIUslKXH1hV95CKiXnHqDzCzYGI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9v/ZmZpY2U4MC8xMjAw/L2FkbWluaXN0cmF0/b3ItbWFsZS5qcGc"
            className="w-20 h-20 rounded-full mb-3 border-2 border-white shadow-md"
            alt="profile"
          />
          <h2 className="text-lg font-semibold">
            {localStorage.getItem("userName")}
          </h2>
          <p className="text-sm text-gray-300">Manager</p>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 mt-4 pl-8">
          <ul className="space-y-1">
            {/* Student */}
            <li>
              <NavLink
                to="/students"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaListAlt className="text-lg" />
                <span className="font-medium">Student</span>
              </NavLink>
            </li>

            {/* Courses */}
            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaUsers className="text-lg" />
                <span className="font-medium">Courses</span>
              </NavLink>
            </li>

            {/* Fees */}
            <li>
              <NavLink
                to="/fees"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaFileInvoice className="text-lg" />
                <span className="font-medium">Fees</span>
              </NavLink>
            </li>

            {/* Certificates */}
            <li>
              <NavLink
                to="/certificates"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaMoneyBill className="text-lg" />
                <span className="font-medium">Certificates</span>
              </NavLink>
            </li>

            {/* Internship */}
            <li>
              <NavLink
                to="/internship"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaListAlt className="text-lg" />
                <span className="font-medium">Internship Letters</span>
              </NavLink>
            </li>

            {/* Leave Students */}
            <li>
              <NavLink
                to="/leave"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 rounded-l-full cursor-pointer transition
              ${
                isActive
                  ? "bg-white text-[#255267]"
                  : "hover:bg-white hover:text-[#255267]"
              }`
                }
              >
                <FaListAlt className="text-lg" />
                <span className="font-medium">Leave Students</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* LOGOUT */}
        <div className="mt-auto mb-6 pl-15">
          <button
            className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-full cursor-pointer hover:bg-white hover:text-[#255267] transition"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
