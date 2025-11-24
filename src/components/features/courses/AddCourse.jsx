import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

Modal.setAppElement("#root");

const AddCourse = ({ isOpen, onClose }) => {
  const [courseName, setCourseName] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseDurationUnit, setCourseDurationUnit] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

  // ERROR object
  const [errors, setErrors] = useState({});

  // disable scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const resetForm = () => {
    setCourseName("");
    setCoursePrice("");
    setCourseDuration("");
    setCourseDurationUnit("");
    setCourseDescription("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose(false);
  };

  const handleAddCourse = async () => {
    setErrors({});

    try {
      const res = await Api.post("/course/create", {
        courseName,
        coursePrice,
        courseDuration,
        courseDurationUnit,
        courseDescription,
      });

      toast.success("Course added successfully!");
      handleClose();
    } catch (error) {
      const data = error?.response?.data;
      console.log(data);
      // Direct message
      if (data?.message && !Array.isArray(data?.errors)) {
        toast.error(data.message);
        return;
      }

      // Validation errors
      if (Array.isArray(data?.errors)) {
        const formatted = {};
        data.errors.forEach((err) => {
          formatted[err.fields] = err.message;
        });
        setErrors(formatted);
        toast.error("Validation failed!");
        return;
      }

      toast.error("Something went wrong!");
    }
  };
  

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="
        bg-white p-4 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[100vh] mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute left-0 top-4 pl-4 cursor-pointer sm:hidden text-md"
      >
        <RxCross2 />
      </button>

      <h1 className="text-2xl font-semibold pt-5 justify-center flex">
        Add Course
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
          placeholder="Enter course name"
        />
        {errors.courseName && (
          <p className="text-red-500 text-md mt-1">{errors.courseName}</p>
        )}

        {/* PRICE */}
        <label className="text-md text-gray-700 font-semibold mt-4 block">
          Course Price
        </label>
        <input
          value={coursePrice}
          onChange={(e) => setCoursePrice(e.target.value)}
          type="number"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
          placeholder="Enter price"
        />
        {errors.coursePrice && (
          <p className="text-red-500 text-sm mt-1">{errors.coursePrice}</p>
        )}

        {/* DURATION */}
        <label className="text-md text-gray-700 font-semibold mt-4 block">
          Course Duration
        </label>
        <input
          value={courseDuration}
          onChange={(e) => setCourseDuration(e.target.value)}
          type="text"
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
          placeholder="Ex: 3 months"
        />
        {errors.courseDuration && (
          <p className="text-red-500 text-sm mt-1">{errors.courseDuration}</p>
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
          <p className="text-red-500 text-sm mt-1">
            {errors.courseDurationUnit}
          </p>
        )}

        {/* DESCRIPTION */}
        <label className="text-md text-gray-700 font-semibold mt-4 block">
          Description
        </label>
        <textarea
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md"
          rows={3}
          placeholder="Enter course description"
        />
        {errors.courseDescription && (
          <p className="text-red-500 text-sm mt-1">
            {errors.courseDescription}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleAddCourse}
            className="bg-primary font-semibold text-white px-6 py-2 rounded-xl hover:bg-white hover:text-primary hover:border hover:border-primary"
          >
            Add
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

export default AddCourse;
