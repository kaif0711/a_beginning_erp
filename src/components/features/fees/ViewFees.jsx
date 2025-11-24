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

const ViewFeesDetail = ({ isOpen3, onClose3, fee }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen3 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen3]);

  if (!fee) return null;

  return (
    <Modal
      isOpen={isOpen3}
      onRequestClose={() => onClose3(false)}
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
        onClick={() => onClose3(false)}
        className="absolute top-4 left-4 cursor-pointer text-xl"
      >
        <RxCross2 />
      </button>

      {/* Heading */}
      <h1 className="text-2xl font-semibold text-center mb-6">Fees Details</h1>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Detail
            label="Student Name"
            value={fee.student?.name || fee.studentName || "N/A"}
          />

          <Detail
            label="Course Name"
            value={fee.course?.courseName || fee.courseName || "N/A"}
          />

          <Detail
            label="Total Fees"
            value={
              <span className="flex items-center gap-1">
                <FaRupeeSign className="text-gray-700" />
                {fee.totalFees != null
                  ? Number(fee.totalFees).toLocaleString("en-IN")
                  : fee.course?.coursePrice != null
                  ? Number(fee.course.coursePrice).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />

          <Detail
            label="Paid Fees"
            value={
              <span className="flex items-center gap-1">
                <FaRupeeSign className="text-gray-700" />
                {fee.paidFees != null
                  ? Number(fee.paidFees).toLocaleString("en-IN")
                  : fee.amount != null
                  ? Number(fee.amount).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />

          <Detail
            label="Pending Fees"
            value={
              <span className="flex items-center gap-1">
                <FaRupeeSign className="text-gray-700" />
                {fee.pendingFees != null
                  ? Number(fee.pendingFees).toLocaleString("en-IN")
                  : fee.pending != null
                  ? Number(fee.pending).toLocaleString("en-IN")
                  : "N/A"}
              </span>
            }
          />

          <Detail
            label="Payment Date"
            value={formatDate(fee.date || fee.paymentDate)}
          />

          <Detail label="Payment Method" value={fee.paymentMode || "N/A"} />

          <Detail label="Note" value={fee.note || "N/A"} />
        </div>
      </div>
    </Modal>
  );
};

export default ViewFeesDetail;

/* Reusable Component */
const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
