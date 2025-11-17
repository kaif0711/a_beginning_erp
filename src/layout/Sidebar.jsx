import {
  FaUser,
  FaUsers,
  FaMoneyBill,
  FaFileInvoice,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#255267] text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* TOP PROFILE CARD */}
      <div className="flex flex-col items-center py-6 border-b border-white/10">
        <img
          src="https://i.pravatar.cc/100?img=12"
          className="w-20 h-20 rounded-full mb-3 border-2 border-white shadow-md"
          alt="profile"
        />
        <h2 className="text-lg font-semibold">Mahesh Patel</h2>
        <p className="text-sm text-gray-300">Manager</p>
      </div>

      {/* MENU ITEMS */}
      <nav className="flex-1 mt-4 pl-10">
        <ul className="space-y-1">
          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaListAlt className="text-lg" />
              <span className="font-medium">Student</span>
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaUsers className="text-lg" />
              <span className="font-medium">Courses</span>
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaFileInvoice className="text-lg" />
              <span className="font-medium">Fees</span>
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaMoneyBill className="text-lg" />
              <span className="font-medium">Certificates</span>
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaListAlt className="text-lg" />
              <span className="font-medium">Internship Letters</span>
            </a>
          </li>

          <li>
            <a className="flex items-center gap-3 px-5 py-3 bg-[#255267] rounded-l-full cursor-pointer hover:bg-white hover:text-[#255267] transition">
              <FaListAlt className="text-lg" />
              <span className="font-medium">Leave Students</span>
            </a>
          </li>
        </ul>
      </nav>

      {/* LOGOUT */}
      <div className="mt-auto mb-6 px-5">
        <button className="flex items-center gap-3 w-full bg-[#255267] hover:bg-white py-3 rounded-lg transition">
          <FaSignOutAlt className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;