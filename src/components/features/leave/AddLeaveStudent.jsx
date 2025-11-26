// AddLeaveStudent.jsx
import { useEffect, useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AddLeaveStudent = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // Selected student details
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [paidFees, setPaidFees] = useState("");
  const [pendingFees, setPendingFees] = useState("");

  // Additional fields for leave entry
  const [leaveDate, setLeaveDate] = useState("");
  const [reason, setReason] = useState("");

  // Field-specific errors from backend
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await Api.get("/student/search?q=");
      const list = res.data?.data?.students || [];
      setStudents(list);
      setFiltered(list);
    } catch (err) {
      console.error(err);
    }
  };

  const searchStudent = (value) => {
    setStudentName(value);
    if (!value.trim()) {
      setFiltered(students);
      return;
    }
    const f = students.filter((s) =>
      s.name.toLowerCase().includes(value.toLowerCase())
    );
    setFiltered(f);
  };

  const selectStudent = async (stu) => {
    setStudentId(stu.id);
    setStudentName(stu.name);
    setPhone(stu.mobileNumber || stu.phone || "");
    setEmail(stu.email || "");
    setFiltered([]);
    setFieldErrors({});  // clear errors on new selection

    try {
      const res = await Api.get(`/student/details?id=${stu.id}`);
      const data = res.data?.data;

      setCourseId(data.courseId || "");
      setCourseName(data.course?.courseName || "");
      const price = data.course?.coursePrice || 0;
      setTotalFees(price.toString());

      // fetch last paid fees
      try {
        const res2 = await Api.get(`/fees/get-paid-fees?id=${stu.id}`);
        const totalPaid = res2.data?.data?.totalPaid || 0;
        setPaidFees(totalPaid.toString());
        const pending = price - totalPaid;
        setPendingFees(pending.toString());
      } catch (err2) {
        console.error("Error fetch paid fees:", err2);
        setPaidFees("0");
        setPendingFees(price.toString());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setStudentId("");
    setStudentName("");
    setPhone("");
    setEmail("");
    setCourseId("");
    setCourseName("");
    setTotalFees("");
    setPaidFees("");
    setPendingFees("");
    setLeaveDate("");
    setReason("");
    setFieldErrors({});
    onClose && onClose();
  };

  const handleAddLeaveStudent = async () => {
    // Clear previous errors
    setFieldErrors({});

    // Local validation (optional)
    const localErrs = {};

    try {
      const res = await Api.post("/leave-student/create", {
        studentId,
        courseId,
        pendingFees: Number(pendingFees),
        totalPaidFees: Number(paidFees),
        leaveDate,
        reason,
      });

      toast.success("Leave student entry added!");
      handleClose();
    } catch (err) {
      const errs = err?.response?.data?.errors || [];
      const errObj = {};
      errs.forEach(e => {
        errObj[e.fields] = e.message;
      });
      setFieldErrors(errObj);
      const msg = err?.response?.data?.message || "Something went wrong";
      toast.error(msg);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      className="bg-white p-4 rounded-2xl shadow-lg
        w-[95%] sm:w-[90%] md:w-[70%] lg:w-[50%]
        max-h-[100vh] mx-auto outline-none relative overflow-hidden"
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={handleClose}
        className="sm:hidden absolute left-0 text-sm sm:text-lg cursor-pointer pl-4"
      >
        <RxCross2 />
      </button>

      <div className="pt-5 text-2xl font-semibold">
        <h1>Add Leave Student</h1>
      </div>

      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        {/* Student Name Search */}
        <label className="text-md text-gray-700 font-semibold block mb-1">
          Student Name
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => searchStudent(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          placeholder="Search student..."
        />
        {fieldErrors.studentId && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.studentId}</p>
        )}
        {studentName && filtered.length > 0 && (
          <div className="border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto bg-white shadow">
            {filtered.map((stu) => (
              <div
                key={stu.id}
                onClick={() => selectStudent(stu)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100"
              >
                {stu.name}
              </div>
            ))}
          </div>
        )}

        {/* Phone */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* Email */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Email
        </label>
        <input
          type="text"
          value={email}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* Course Name */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Course Name
        </label>
        <input
          type="text"
          value={courseName}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* Total Fees */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Total Fees
        </label>
        <div className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md flex items-center gap-2">
          <FaRupeeSign className="text-gray-600" />
          <input
            value={totalFees}
            readOnly
            className="w-full bg-gray-100 outline-none"
          />
        </div>

        {/* Paid Fees */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Paid Fees
        </label>
        <div className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md flex items-center gap-2">
          <FaRupeeSign className="text-gray-600" />
          <input
            value={paidFees}
            readOnly
            className="w-full bg-gray-100 outline-none"
          />
        </div>
        {fieldErrors.totalPaidFees && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.totalPaidFees}</p>
        )}

        {/* Pending Fees */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Pending Fees
        </label>
        <div className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md flex items-center gap-2">
          <FaRupeeSign className="text-gray-600" />
          <input
            value={pendingFees}
            readOnly
            className="w-full bg-gray-100 outline-none"
          />
        </div>
        {fieldErrors.pendingFees && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.pendingFees}</p>
        )}

        {/* Reason */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Reason
        </label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none resize-none"
          rows={3}
          placeholder="Enter reason for leave"
        />
        {fieldErrors.reason && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.reason}</p>
        )}

        {/* Buttons */}
        <div className="flex gap-4 justify-end mt-5">
          <button
            onClick={handleAddLeaveStudent}
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
    </Modal>
  );
};

export default AddLeaveStudent;
