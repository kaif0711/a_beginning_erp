import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";
import CustomDropdown from "../../dropdown/Dropdown";
import GenderDropdown from "../../dropdown/Gender";
import PaymentModeDropdown from "../../dropdown/PaymentModeDropdown";

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

  const [selectedCourse, setSelectedCourse] = useState(null);

  const [customCourseFees, setCustomCourseFees] = useState("");

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
    setCustomCourseFees("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  // ⭐ Auto Calculate End Date
  const calculateEndDate = (start, duration, unit) => {
    if (!start || !duration || !unit) return "";

    const date = new Date(start);

    if (unit === "DAYS") date.setDate(date.getDate() + Number(duration));
    if (unit === "MONTHS") date.setMonth(date.getMonth() + Number(duration));
    if (unit === "YEARS")
      date.setFullYear(date.getFullYear() + Number(duration));

    return date.toISOString().split("T")[0]; // yyyy-mm-dd
  };

  // ADD STUDENT
  const handleAddStudent = async () => {
    setErrors({});

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
        customCourseFees,

        ...(enrolledFees && { enrolledFees }),
        ...(paymentMode && { paymentMode }),
      });

      toast.success("Student added successfully!");
      handleClose();
    } catch (error) {
      const data = error?.response?.data;

      if (data?.message && !Array.isArray(data?.errors)) {
        toast.error(data.message);

        if (data.message.toLowerCase().includes("mobile")) {
          setErrors((prev) => ({
            ...prev,
            mobileNumber: data.message,
          }));
        }
        return;
      }

      if (Array.isArray(data?.errors)) {
        const formatted = {};
        data.errors.forEach((err) => {
          formatted[err.fields] = err.message;
        });

        setErrors(formatted);
        toast.error("Validation failed!");
      } else {
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
          <GenderDropdown gender={gender} setGender={setGender} />
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

          <CustomDropdown
            options={courses.map((c) => ({ value: c.id, label: c.courseName }))}
            value={courseid}
            onChange={(val) => {
              setCourseid(val);

              const selected = courses.find((c) => c.id === val);
              setSelectedCourse(selected);

              if (selected) {
                // 1️⃣ Aaj ki date set karna
                const today = new Date().toISOString().split("T")[0];
                setDateOfJoining(today);

                // 2️⃣ Course ke hisab se end date auto calculate
                const end = calculateEndDate(
                  today,
                  selected.courseDuration,
                  selected.courseDurationUnit
                );
                setDateOfEnd(end);

                // 3️⃣ Default price set
                setCustomCourseFees(selected.coursePrice?.toString() || "");
              } else {
                setCustomCourseFees("");
                setDateOfJoining("");
                setDateOfEnd("");
              }
            }}
            placeholder="Select Course"
          />

          {errors.courseId && (
            <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>
          )}

          {/* COURSE Price */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Course Price
          </label>

          <input
            value={customCourseFees}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setCustomCourseFees(raw);
            }}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
            placeholder="Enter course price"
          />

          {/* DATE OF JOINING */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Date of Joining
          </label>
          <input
            value={dateOfJoining}
            onChange={(e) => {
              const val = e.target.value;
              setDateOfJoining(val);

              if (selectedCourse) {
                const end = calculateEndDate(
                  val,
                  selectedCourse.courseDuration,
                  selectedCourse.courseDurationUnit
                );
                setDateOfEnd(end);
              }
            }}
            type="date"
            max="31-12-9999"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          />

          {/* DATE OF END */}
          <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
            Date of End
          </label>
          <input
            value={dateOfEnd}
            onChange={(e) => setDateOfEnd(e.target.value)}
            type="date"
            max="31-12-9999"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none bg-gray-50"
            readOnly
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
              <PaymentModeDropdown
                value={paymentMode}
                onChange={setPaymentMode}
              />
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
