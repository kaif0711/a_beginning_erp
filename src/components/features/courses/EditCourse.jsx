import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

Modal.setAppElement("#root");

const EditCourse = ({ isOpen1, onClose1, courseId }) => {
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDurationUnit, setCourseDurationUnit] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [errors, setErrors] = useState({});

  const fetchCourseDetail = async () => {
    try {
      const res = await Api.get(`/course/details?id=${courseId}`);
      const c = res.data.data;

      setCourseName(c.courseName);
      setCoursePrice(c.coursePrice);
      setCourseDuration(c.courseDuration);
      setCourseDurationUnit(c.courseDurationUnit);
      setCourseDescription(c.courseDescription);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (isOpen1 && courseId) {
      fetchCourseDetail();
      setErrors({});
    }
  }, [isOpen1, courseId]);

  useEffect(() => {
    document.body.style.overflow = isOpen1 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen1]);

  const handleClose = () => {
    onClose1(false);
    setErrors({});
  };

  const handleUpdateCourse = async () => {
    setErrors({});

    try {
      await Api.put(`/course/update?id=${courseId}`, {
        courseName,
        coursePrice,
        courseDuration,
        courseDurationUnit,
        courseDescription,
      });

      toast.success("Course updated successfully!");
      handleClose();
    } catch (error) {
      const data = error?.response?.data;

      if (data?.message && !Array.isArray(data?.errors)) {
        toast.error(data.message);
        return;
      }

      if (Array.isArray(data?.errors)) {
        const formatted = {};
        data.errors.forEach((err) => (formatted[err.fields] = err.message));
        setErrors(formatted);
        toast.error("Validation failed!");
        return;
      }

      toast.error("Something went wrong!");
    }
  };

  return (
    <Modal
      isOpen={isOpen1}
      onRequestClose={handleClose}
      className="
        bg-white p-4 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[100vh] mx-auto outline-none relative
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={handleClose}
        className="absolute left-0 top-4 pl-4 cursor-pointer text-xl sm:hidden"
      >
        <RxCross2 />
      </button>

      <h1 className="text-2xl font-semibold pt-5">
        Edit Course
      </h1>

      <div className="mt-5 max-h-[70vh] overflow-y-auto pr-2">
        {/* NAME */}
        <label className="text-md text-gray-700 font-semibold">
          Course Name
        </label>
        <input
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          type="text"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
        />
        {errors.courseName && (
          <p className="text-red-500 text-md mt-1">{errors.courseName}</p>
        )}

        {/* PRICE */}
        <label className="text-md text-gray-700 font-semibold block mt-4">
          Course Price
        </label>
        <input
          value={coursePrice}
          onChange={(e) => setCoursePrice(e.target.value)}
          type="number"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
        />
        {errors.coursePrice && (
          <p className="text-red-500 text-md mt-1">{errors.coursePrice}</p>
        )}

        {/* DURATION */}
        <label className="text-md text-gray-700 font-semibold block mt-4">
          Course Duration
        </label>
        <input
          value={courseDuration}
          onChange={(e) => setCourseDuration(e.target.value)}
          type="text"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
        />
        {errors.courseDuration && (
          <p className="text-red-500 text-md mt-1">{errors.courseDuration}</p>
        )}

        {/* DURATION Unit */}
        <label className="text-md text-gray-700 font-semibold mt-4 block">
          Course Duration Unit
        </label>

        <div className="w-full border border-gray-400 rounded-lg px-3 py-2 relative">
          <select
            value={courseDurationUnit}
            onChange={(e) => setCourseDurationUnit(e.target.value)}
            className="w-full bg-white text-gray-800 outline-none cursor-pointer appearance-none"
          >
            <option value="">Select Duration Unit</option>
            <option value="DAYS">DAYS</option>
            <option value="MONTHS">MONTHS</option>
            <option value="YEARS">YEARS</option>
          </select>
          <FaChevronDown className="absolute right-2 top-3 text-gray-600 pointer-events-none" />
        </div>
        {errors.courseDurationUnit && (
          <p className="text-red-500 text-xs mt-1">
            {errors.courseDurationUnit}
          </p>
        )}

        {/* DESCRIPTION */}
        <label className="text-md text-gray-700 font-semibold block mt-4 text-md">
          Course Description
        </label>
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          rows={3}
          className="w-full border border-gray-400 rounded-lg px-3 py-2"
        />
        {errors.courseDescription && (
          <p className="text-red-500 text-md mt-1">
            {errors.courseDescription}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleUpdateCourse}
            className="bg-primary font-semibold text-white px-6 py-2 rounded-xl hover:bg-white hover:text-primary hover:border hover:border-primary"
          >
            Update
          </button>

          <button
            onClick={handleClose}
            className="bg-primary font-semibold text-white px-6 py-2 rounded-xl hover:bg-white hover:text-primary hover:border hover:border-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditCourse;
