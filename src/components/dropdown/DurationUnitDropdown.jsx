import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const DurationUnitDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const units = [
    { value: "DAYS", label: "DAYS" },
    { value: "MONTHS", label: "MONTHS" },
    { value: "YEARS", label: "YEARS" },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = units.find((u) => u.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-400 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between text-gray-700"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {selected ? selected.label : "Select Duration Unit"}
        </span>

        {open ? (
          <FaChevronUp className="text-gray-600" />
        ) : (
          <FaChevronDown className="text-gray-600" />
        )}
      </div>

      {/* Options */}
      {open && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-md z-50">
          {units.map((unit) => (
            <div
              key={unit.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(unit.value);
                setOpen(false);
              }}
            >
              {unit.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DurationUnitDropdown;
