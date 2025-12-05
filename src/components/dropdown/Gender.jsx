import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const GenderDropdown = ({ gender, setGender }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["male", "female", "other"];

  // ---- Close on outside click ----
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-400 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between text-gray-700 capitalize"
      >
        {gender || "Select Gender"}
        {open ? (
          <FaChevronUp className="text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-600" />
        )}
      </div>

      {/* Options */}
      {open && (
        <div className="absolute w-full bg-white shadow-md border border-gray-300 mt-1 rounded-lg z-50">
          {options.map((g) => (
            <div
              key={g}
              onClick={() => {
                setGender(g);
                setOpen(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize"
            >
              {g}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenderDropdown;
