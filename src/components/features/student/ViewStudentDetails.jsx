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

const ViewStudentDetail = ({ isOpen3, onClose3, student }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen3 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen3]);

  if (!student) return null;

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
      <h1 className="text-2xl font-semibold text-center mb-6">
        Student Details
      </h1>

      {/* Scrollable Content */}
      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        {/* GRID VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Detail label="Student Name" value={student.name} />
          <Detail label="Father's Name" value={student.fatherName} />

          <Detail label="Gender" value={student.gender} />
          <Detail label="Mobile Number" value={student.mobileNumber} />

          <Detail label="Father Number" value={student.fatherNumber} />

          <Detail label="Date of Birth" value={formatDate(student.DOB)} />
          <Detail label="Course" value={student.course?.courseName || "N/A"} />

          <Detail
            label="Date of Joining"
            value={formatDate(student.dateOfJoining)}
          />
          <Detail label="Date of End" value={formatDate(student.dateOfEnd)} />

          <Detail
            label="Enrolled Fees"
            value={
              <span className="flex items-center gap-1 text-green-800">
                <FaRupeeSign />
                {student.enrolledFees
                          ? Number(student.enrolledFees).toLocaleString("en-IN")
                          : "N/A"}
              </span>
            }
          />
          <Detail label="Email" value={student.email || "N/A"} />
        </div>
      </div>
    </Modal>
  );
};

export default ViewStudentDetail;

/* Reusable Component */
const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-base font-medium text-gray-900 mt-1">{value}</p>
  </div>
);
