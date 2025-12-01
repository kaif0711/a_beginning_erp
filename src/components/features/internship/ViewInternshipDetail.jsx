// ViewInternshipDetail.jsx
import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";

Modal.setAppElement("#root");

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
};

const ViewInternshipDetail = ({ isOpen, onClose, internship }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!internship) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onClose(false)}
      className="
        bg-white p-6 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[90vh] mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      {/* Close button */}
      <button
        onClick={() => onClose(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-center mb-6">
        Internship Details
      </h1>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <Detail
            label="Student Name"
            value={
              internship.student?.name ||
              internship.studentName ||
              "N/A"
            }
          />

          <Detail
            label="Phone Number"
            value={
              internship.student?.mobileNumber ||
              internship.mobileNumber ||
              "N/A"
            }
          />

          <Detail
            label="Email"
            value={
              internship.student?.email ||
              internship.email ||
              "N/A"
            }
          />

          <Detail
            label="Course Name"
            value={
              internship.course?.courseName ||
              internship.courseName ||
              "N/A"
            }
          />

          {/* ADDED START DATE */}
          <Detail
            label="Start Date"
            value={
              internship.startDate
                ? formatDate(internship.startDate)
                : "N/A"
            }
          />

          {/* ADDED END DATE */}
          <Detail
            label="End Date"
            value={
              internship.endDate
                ? formatDate(internship.endDate)
                : "N/A"
            }
          />

          <Detail
            label="Issue Date"
            value={
              internship.createdAt
                ? formatDate(internship.createdAt)
                : "N/A"
            }
          />

        </div>
      </div>
    </Modal>
  );
};

export default ViewInternshipDetail;

/* Reusable Component */
const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
