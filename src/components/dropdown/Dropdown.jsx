import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({ options, value, onChange, placeholder = "Select…" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      <div
        className="
          border border-gray-400
          rounded-lg px-3 py-2 bg-white
          flex justify-between items-center
          cursor-pointer
          hover:border-gray-500
          transition-colors duration-150
        "
        onClick={() => setOpen(o => !o)}
      >
        <span className={selectedOption ? "text-gray-900" : "text-gray-500"} >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div
          className="
            absolute z-20 w-full bg-white border border-gray-300
            rounded-lg mt-1 shadow-lg
            max-h-60 overflow-auto
          "
        >
          {options.map(opt => (
            <div
              key={opt.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
