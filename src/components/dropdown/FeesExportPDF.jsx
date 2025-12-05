import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaFileExcel, FaFilePdf } from "react-icons/fa";
import Api from "../../utils/apiClient";

const ExportDropdown = ({ exportType = "fees" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Dropdown options
  const options = [
    { id: "excel", label: "Export Excel" },
    { id: "pdf", label: "Export PDF" },
  ];

  // Backend paths
  const PATHS = {
    fees: {
      excel: "/fees/fees-export-data",
      pdf: "/fees/fees-export-pdf",
    },
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handle = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Main export function
  const exportData = async (mode) => {
    const urlPath = PATHS[exportType][mode];

    try {
      const res = await Api.get(urlPath, {
        responseType: "blob",
      });

      const ext = mode === "excel" ? "xlsx" : "pdf";
      const fileName = `fees_export.${ext}`;

      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      link.click();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.log("EXPORT FAILED:", err);
    }
  };

  return (
    <div className="relative w-52" ref={ref}>
      {/* Button */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-400 bg-white rounded-lg px-3 py-2 cursor-pointer flex justify-between items-center"
      >
        <span className="text-gray-700">Export</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Menu */}
      {open && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md z-50">
          {options.map((op) => (
            <div
              key={op.id}
              onClick={() => {
                setOpen(false);
                exportData(op.id);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {/* ICONS */}
              {op.id === "excel" && (
                <FaFileExcel className="text-green-600 text-lg" />
              )}
              {op.id === "pdf" && (
                <FaFilePdf className="text-red-600 text-lg" />
              )}

              {/* LABEL */}
              <span>{op.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExportDropdown;
