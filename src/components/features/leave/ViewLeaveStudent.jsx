// ViewLeaveStudentDetail.jsx
import { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";

Modal.setAppElement("#root");

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const [year, month, day] = dateString.split("T")[0].split("-");
  return `${day}-${month}-${year}`;
};

const ViewLeaveStudentDetail = ({ isOpen, onClose, leaveStudent  }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!leaveStudent) return null;

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
        Leave Student Details
      </h1>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Detail
            label="Student Name"
            value={leaveStudent.student?.name || leaveStudent.studentName || "N/A"}
          />
          <Detail
            label="Phone Number"
            value={leaveStudent.student?.mobileNumber || leaveStudent.mobileNumber || "N/A"}
          />
          <Detail
            label="Email"
            value={leaveStudent.student?.email || leaveStudent.email || "N/A"}
          />
          <Detail
            label="Course Name"
            value={leaveStudent.course?.courseName || leaveStudent.courseName || "N/A"}
          />

          <Detail
            label="Total Fees"
            value={
              <span className="flex items-center gap-1 text-blue-700">
                <FaRupeeSign />
                {leaveStudent.totalFees != null
                  ? Number(leaveStudent.totalFees).toLocaleString("en-IN")
                  : leaveStudent.course?.coursePrice != null
                  ? Number(leaveStudent.course.coursePrice).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />
          <Detail
            label="Paid Fees"
            value={
              <span className="flex items-center gap-1 text-green-700">
                <FaRupeeSign />
                {leaveStudent.totalPaidFees != null
                  ? Number(leaveStudent.totalPaidFees).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />
          <Detail
            label="Pending Fees"
            value={
              <span className="flex items-center gap-1 text-red-700">
                <FaRupeeSign />
                {leaveStudent.pendingFees != null
                  ? Number(leaveStudent.pendingFees).toLocaleString("en-IN")
                  : (leaveStudent.course?.coursePrice != null && leaveStudent.paidFees != null)
                  ? Number(leaveStudent.course.coursePrice - leaveStudent.paidFees).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />

          {/* leave date */}
          <Detail
            label="Leave Date"
            value={formatDate(leaveStudent.createdAt || leaveStudent.createdAt) }
          />
          <Detail
            label="Reason"
            value={leaveStudent.reason || "N/A"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewLeaveStudentDetail;

/* Reusable Component */
const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
