import { useEffect } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ViewCourseDetail = ({ isOpen3, onClose3, course }) => {
  useEffect(() => {
    document.body.style.overflow = isOpen3 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen3]);

  if (!course) return null;

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
      <button
        onClick={() => onClose3(false)}
        className="absolute left-4 top-4 text-xl cursor-pointer"
      >
        <RxCross2 />
      </button>

      <h1 className="text-2xl font-semibold text-center mb-6">
        Course Details
      </h1>

      <div className="overflow-y-auto max-h-[70vh] px-2 space-y-4">
        <Detail label="Course Name" value={course.courseName} />
        <Detail label="Price" value={
          <span className="flex items-center gap-1">
            <FaRupeeSign className="text-gray-700" />
            {Number(course.coursePrice ?? 0).toLocaleString("en-IN")}
          </span>
        } />
        <Detail label="Duration" value={course.courseDuration} />
        <Detail label="DurationUnit" value={course.courseDurationUnit} />
        <Detail label="Description" value={course.courseDescription} />
      </div>
    </Modal>
  );
};

const Detail = ({ label, value }) => (
  <div className="border p-4 rounded-lg bg-gray-50 shadow-sm">
    <p className="text-md text-gray-500 font-semibold">{label}</p>
    <p className="text-md font-semibold text-gray-900 mt-1">{value}</p>
  </div>
);

export default ViewCourseDetail;
