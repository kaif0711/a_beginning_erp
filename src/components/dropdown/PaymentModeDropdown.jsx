import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PaymentModeDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const modes = [
    { value: "CASH", label: "CASH" },
    { value: "UPI", label: "UPI" },
    { value: "CARD", label: "CARD" },
    { value: "BANK_TRANSFER", label: "BANK TRANSFER" },
  ];

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = modes.find((m) => m.value === value);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Dropdown Button */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-400 rounded-lg px-3 py-2 cursor-pointer flex items-center justify-between text-gray-700"
      >
        <span className={selected ? "text-gray-900" : "text-gray-500"}>
          {selected ? selected.label : "Select Payment Mode"}
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
          {modes.map((mode) => (
            <div
              key={mode.value}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(mode.value);
                setOpen(false);
              }}
            >
              {mode.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentModeDropdown;
