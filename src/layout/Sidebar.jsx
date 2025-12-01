import {
  FaUser,
  FaUsers,
  FaMoneyBill,
  FaFileInvoice,
  FaListAlt,
  FaSignOutAlt,
  FaBook,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Api from "../utils/apiClient";
import { PiCertificateFill } from "react-icons/pi";
import { MdWatchLater } from "react-icons/md";
import { RiFileTextFill } from "react-icons/ri";
import { IoMenu } from "react-icons/io5";

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const sidebarRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (open && sidebarRef.current && sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => document.removeEventListener("mousedown", handleClickOutSide);
  },[open]);


  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden fixed top-2 left-4 z-50 bg-white text-primary px-3 py-1 rounded shadow-md"
      >
        <IoMenu />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 sm:hidden z-30" onClick={()=>setOpen(false)}></div>
      )

      }

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          bg-[#255267] text-white h-screen fixed top-0 z-40 flex flex-col
          transition-all duration-300 w-64 overflow-y-auto scrollbar-hide
          ${open ? "left-0" : "-left-64"}
          sm:left-0
        `}
      >
        {/* Profile */}
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
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : "hover:text-black"}`
                }
              >
                <FaUsers className="text-lg" />
                <span className="font-medium">Students</span>
              </NavLink>
            </li>

            {/* Courses */}
            <li>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : "hover:text-black"}`
                }
              >
                <FaBook className="text-lg" />
                <span className="font-medium">Courses</span>
              </NavLink>
            </li>

            {/* Fees */}
            <li>
              <NavLink
                to="/fees"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : "hover:text-black"}`
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
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : "hover:text-black"}`
                }
              >
                <PiCertificateFill className="text-lg" />
                <span className="font-medium">Certificates</span>
              </NavLink>
            </li>

            {/* Internship */}
            <li>
              <NavLink
                to="/internship"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : "hover:text-black"}`
                }
              >
                <RiFileTextFill className="text-lg" />
                <span className="font-medium">Internship Letters</span>
              </NavLink>
            </li>

            {/* Leave Students */}
            <li>
              <NavLink
                to="/leave"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 cursor-pointer 
                  ${isActive ? "active-menu" : " hover:text-black"}`
                }
              >
                <MdWatchLater className="text-lg" />
                <span className="font-medium">Leave Students</span>
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Logout */}
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
