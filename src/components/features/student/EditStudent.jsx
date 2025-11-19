import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const EditStudent = ({ isOpen1, onClose1, studentId }) => {
  const [courses, setCourses] = useState([]);

  // ---- FORM STATES ---- //
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

  // ---- ERROR STATE OBJECT ---- //
  const [errors, setErrors] = useState({});

  // ---------- Fetch Courses ----------- //
  const fetchCourses = async () => {
    try {
      const res = await Api.get("/course/list");
      setCourses(res?.data?.data?.courses || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ---------- Fetch Student Data For Editing ----------- //
  const fetchStudentDetail = async () => {
    if (!studentId) return;

    try {
      const res = await Api.get(`/student/details?id=${studentId}`);
      const s = res.data.data;
      console.log(s);

      if (s) {
        setStudentName(s.name || "");
        setStudentEmail(s.email || "");
        setStudentFatherName(s.fatherName || "");
        setMobileNumber(s.mobileNumber || "");
        setFatherMobileNumber(s.fatherNumber || "");
        setDOB(s.DOB ? s.DOB.split("T")[0] : "");
        setGender(s.gender || "");
        setCourseid(s.courseId || "");
        setDateOfJoining(s.dateOfJoining ? s.dateOfJoining.split("T")[0] : "");
        setDateOfEnd(s.dateOfEnd ? s.dateOfEnd.split("T")[0] : "");
        setEnrolledFees(s.enrolledFees || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Load courses + student data on modal open
  useEffect(() => {
    if (isOpen1) {
      fetchCourses();
      fetchStudentDetail();
      setErrors({});
    }
  }, [isOpen1, studentId]);

  // ---- Disable scroll when modal open ---- //
  useEffect(() => {
    document.body.style.overflow = isOpen1 ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen1]);

  // ---- Handle Close ---- //
  const handleClose = () => {
    onClose1 && onClose1(false);
    setErrors({});
  };

  // ---- UPDATE STUDENT ---- //
  const handleUpdateStudent = async () => {
    setErrors({});

    try {
      const res = await Api.put(`/student/update?id=${studentId}`, {
        name: studentName,
        fatherName: studentFatherName,
        fatherNumber: fatherMobileNumber,
        DOB,
        gender,
        courseId: courseid,
        dateOfJoining,
        ...(dateOfEnd && { dateOfEnd }),
        ...(enrolledFees && { enrolledFees }),
      });

      toast.success("Student updated successfully! 🎉");
      handleClose();
    } catch (error) {
      const data = error?.response?.data;

      // Direct message (e.g., "Course not found")
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
        console.log(formatted);
        

        setErrors(formatted);
        toast.error("Validation failed!");
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen1}
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
        <h1>Edit Student</h1>
      </div>

      {/* Form */}
      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        <div className="rounded-xl">
          {/* NAME */}
          <label className="text-xs text-gray-500 block mb-1">
            Student&apos;s Name
          </label>
          <input
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}

          {/* FATHER NAME */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">
            Father&apos;s Name
          </label>
          <input
            value={studentFatherName}
            onChange={(e) => setStudentFatherName(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2 outline-none"
          />
          {errors.fatherName && (
            <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>
          )}

          {/* EMAIL */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Email (not editable)
          </label>
          <input
            value={studentEmail}
            disabled
            type="email"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
          />

          {/* MOBILE */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Mobile Number (not editable)
          </label>
          <input
            value={mobileNumber}
            disabled
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-600"
          />

          {/* FATHER MOBILE */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Father Mobile No.
          </label>
          <input
            value={fatherMobileNumber}
            onChange={(e) => setFatherMobileNumber(e.target.value)}
            type="text"
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {errors.fatherNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.fatherNumber}</p>
          )}

          {/* DOB */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">DOB</label>
          <input
            value={DOB}
            onChange={(e) => setDOB(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {errors.DOB && (
            <p className="text-red-500 text-xs mt-1">{errors.DOB}</p>
          )}

          {/* GENDER */}
          <label className="text-xs text-gray-500 block mb-1 mt-4">
            Gender
          </label>
          <div className="flex gap-5 pl-1 mt-2">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  value={g}
                  name="gender"
                  checked={gender === g}
                  onChange={() => setGender(g)}
                />
                <span>{g}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}

          {/* COURSE */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Course
          </label>
          <div className="relative w-full border border-gray-400 rounded-lg px-3 py-2">
            <select
              value={courseid}
              onChange={(e) => setCourseid(e.target.value)}
              className="w-full outline-none"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.courseName}
                </option>
              ))}
            </select>
            <FaChevronDown className="absolute right-0 top-3 text-gray-500" />
          </div>
          {errors.courseId && (
            <p className="text-red-500 text-xs mt-1">{errors.courseId}</p>
          )}

          {/* DATE OF JOINING */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Date of Joining
          </label>
          <input
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {errors.dateOfJoining && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining}</p>
          )}

          {/* DATE OF END */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Date of End
          </label>
          <input
            value={dateOfEnd}
            onChange={(e) => setDateOfEnd(e.target.value)}
            type="date"
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {errors.dateOfEnd && (
            <p className="text-red-500 text-xs mt-1">{errors.dateOfEnd}</p>
          )}

          {/* FEES */}
          <label className="text-xs text-gray-500 block mt-4 mb-1">
            Enrolled Fees
          </label>
          <input
            value={enrolledFees}
            onChange={(e) => setEnrolledFees(e.target.value)}
            type="number"
            className="w-full border border-gray-400 rounded-lg px-3 py-2"
          />
          {errors.enrolledFees && (
            <p className="text-red-500 text-xs mt-1">{errors.enrolledFees}</p>
          )}

          {/* BUTTONS */}
          <div className="flex gap-4 justify-end mt-5">
            <button
              onClick={handleUpdateStudent}
              className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary px-6 py-2 text-white font-semibold rounded-xl"
            >
              Update
            </button>

            <button
              onClick={handleClose}
              className="bg-primary hover:bg-white hover:text-primary hover:border hover:border-primary px-6 py-2 text-white font-semibold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditStudent;
