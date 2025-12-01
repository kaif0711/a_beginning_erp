import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AddStudent = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState([]);

  // FORM STATES 
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentFatherName, setStudentFatherName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [fatherMobileNumber, setFatherMobileNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const [gender, setGender] = useState("");
  const [courseid, setCourseid] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [dateOfEnd, setDateOfEnd] = useState("");
  const [enrolledFees, setEnrolledFees] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  // ERROR STATE OBJECT
  const [errors, setErrors] = useState({});

  // Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await Api.get("/course/list");
      const list = res?.data?.data?.courses || [];
      setCourses(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const resetForm = () => {
    setStudentName("");
    setStudentEmail("");
    setStudentFatherName("");
    setMobileNumber("");
    setFatherMobileNumber("");
    setDOB("");
    setGender("");
    setCourseid("");
    setDateOfJoining("");
    setDateOfEnd("");
    setEnrolledFees("");
    setPaymentMode("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  // ADD STUDENT
  const handleAddStudent = async () => {
    setErrors({}); // reset errors

    try {
      const res = await Api.post("/student/create", {
        name: studentName,
        email: studentEmail,
        mobileNumber,
        fatherName: studentFatherName,
        fatherNumber: fatherMobileNumber,
        DOB,
        gender,
        courseId: courseid,
        dateOfJoining,
        ...(dateOfEnd && { dateOfEnd }),
        ...(enrolledFees && { enrolledFees }),
        ...(paymentMode && { paymentMode }),
      });

      toast.success("Student added successfully!");
      handleClose();
    } catch (error) {
      const data = error?.response?.data;

      // 1) Server ne direct message diya ho (jaise: "Mobile number already exists")
      if (data?.message && !Array.isArray(data?.errors)) {
        toast.error(data.message);

        // Agar message mobile se related ho to field ke niche bhi dikha de:
        if (data.message.toLowerCase().includes("mobile")) {
          setErrors((prev) => ({
            ...prev,
            mobileNumber: data.message,
          }));
        }

        return;
      }

      // 2) Validation errors array ka form me
      if (Array.isArray(data?.errors)) {
        const formatted = {};
        data.errors.forEach((err) => {
          formatted[err.fields] = err.message;
        });

        setErrors(formatted);
        toast.error("Validation failed!");
      } else {
        // fallback
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="
        bg-white p-4 rounded-2xl shadow-lg 
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[100vh]
        mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="sm:hidden absolute left-0 text-sm sm:text-lg cursor-pointer pl-4"
      >
        <RxCross2 />
      </button>

      {/* Heading */}
      <div className="pt-5 text-2xl font-semibold">
        <h1>Add Student</h1>
      </div>

      {/* Form */}
      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        <div className="rounded-xl">
          {/* NAME */}
          <label className="text-md text-gray-700 font-semibold block mb-1">
            Student&apos;s Name
          </label>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Enter your name"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}

          {/* FATHER NAME */}
          <label className="text-md text-gray-700 font-semibold block mb-1 mt-4">
            Father&apos;s Name
          </label>
          <input
            value={studentFatherName}
            onChange={(e) => setStudentFatherName(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Enter father's name"
          />
          {errors.fatherName && (
            <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>
          )}

          {/* EMAIL */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Student&apos;s Email
          </label>
          <input
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            type="email"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="name@gmail.com"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}

          {/* GENDER */}
          <label className="text-md text-gray-700 font-semibold block mb-1 mt-4">
            Student&apos;s Gender
          </label>
          <div className="flex flex-wrap gap-5 pl-1 mt-2">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={g}
                  name="gender"
                  checked={gender === g}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}

          {/* MOBILE */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Mobile No.
          </label>
          <input
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Enter mobile number"
          />
          {errors.mobileNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
          )}

          {/* FATHER MOBILE */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Father&apos;s Mobile No.
          </label>
          <input
            value={fatherMobileNumber}
            onChange={(e) => setFatherMobileNumber(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Enter father's mobile number"
          />
          {errors.fatherNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.fatherNumber}</p>
          )}

          {/* DOB */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            DOB
          </label>
          <input
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          />
          {errors.DOB && (
            <p className="text-red-500 text-xs mt-1">{errors.DOB}</p>
          )}

          {/* COURSE */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Course
          </label>
          <div className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md relative">
            <select
              value={courseid}
              onChange={(e) => setCourseid(e.target.value)}
              className="w-full bg-white text-gray-800 outline-none appearance-none cursor-pointer"
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.courseName}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-0 top-3 text-gray-600" />
          </div>
          {errors.courseId && (
            <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>
          )}

          {/* DATE OF JOINING */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Date of Joining
          </label>
          <input
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          />
          {errors.dateOfJoining && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining}</p>
          )}

          {/* DATE OF END */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Date of End
          </label>
          <input
            value={dateOfEnd}
            onChange={(e) => setDateOfEnd(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          />

          {/* FEES */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Enrolled Fees
          </label>
          <input
            value={enrolledFees}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, "");
              setEnrolledFees(raw);
            }}
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Fees"
          />
          {errors.enrolledFees && (
            <p className="text-red-500 text-xs mt-1">{errors.enrolledFees}</p>
          )}

          {/* PAYMENT MODE DROPDOWN */}
          {enrolledFees && (
            <div>
              <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
                Payment Mode
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none bg-white cursor-pointer"
              >
                <option value="">Select Payment Method</option>
                <option value="CASH">CASH</option>
                <option value="UPI">UPI</option>
                <option value="CARD">CARD</option>
                <option value="BANK_TRANSFER">BANK_TRANSFER</option>
              </select>
            </div>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end mt-5">
            <button
              onClick={handleAddStudent}
              className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary px-6 py-2 text-white font-semibold rounded-xl cursor-pointer"
            >
              Add
            </button>
            <button
              onClick={handleClose}
              className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary px-6 py-2 text-white font-semibold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddStudent;
