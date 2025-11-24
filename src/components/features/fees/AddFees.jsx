// AddFeesEntry.jsx
import { useEffect, useState } from "react";
import { FaChevronDown, FaRupeeSign } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AddFeesEntry = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // FORM STATES
  const [query, setQuery] = useState("");
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [totalFees, setTotalFees] = useState("");
  const [alreadyPaid, setAlreadyPaid] = useState(0);
  const [paidFees, setPaidFees] = useState("");

  
  
  const [paymentMode, setPaymentMode] = useState(""); // ⭐ default
  console.log(paymentMode);

  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});

  console.log(errors);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await Api.get("/student/list");
      const list = res?.data?.data?.students || [];
      setStudents(list);
      setFiltered(list);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const searchStudent = (value) => {
    setQuery(value);
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
    setQuery(stu.name);
    setStudentId(stu.id);
    setFiltered([]);
    setErrors({});

    try {
      const res = await Api.get(`/student/details?id=${stu.id}`);
      const data = res.data?.data;

      setCourseId(data.courseId);

      if (data?.course) {
        setCourseName(data.course.courseName);
        setTotalFees(data.course.coursePrice);
      }

      setAlreadyPaid(data.totalPaid || 0);
    } catch (e) {
      console.log(e);
    }
  };

  const resetForm = () => {
    setQuery("");
    setStudentId("");
    setCourseId("");
    setCourseName("");
    setTotalFees("");
    setAlreadyPaid(0);
    setPaidFees("");
    setPaymentMode("");
    setNote("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const handleAddFees = async () => {
    let newErrors = {};

    if (!studentId) {
      newErrors.student = "Select a student";
    }

    if (!paidFees) {
      newErrors.paidFees = "Enter paid fees";
    }

    let pending = Number(totalFees) - Number(alreadyPaid);

    if (pending <= 0) {
      newErrors.paidFees = "Payment exceeds total course fee";
      setErrors(newErrors);
      return;
    }

    if (Number(paidFees) <= 0) {
      newErrors.paidFees = "Amount must be greater than 0";
      setErrors(newErrors);
      return;
    }

    if (Number(paidFees) > pending) {
      newErrors.paidFees = "Payment exceeds total course fee";
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await Api.post("/fees/create", {
        studentId,
        courseId,
        paymentMode,
        amount: paidFees,
        ...(note && { note }),
      });

      toast.success("Fees entry added successfully!");
      handleClose();
    } catch (error) {
      setErrors({
        paidFees:
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message,
        student:
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message,
        paymentMode:
          error?.response?.data?.message ||
          error?.response?.data?.errors?.[0]?.message,
      });
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Something went wrong";

      if (msg === "amount must be greater than 0") {
        setErrors({ paidFees: "Amount must be greater than 0" });
        return;
      }

      if (msg === "Payment exceeds total course fee.") {
        setErrors({ paidFees: "Payment exceeds total course fee" });
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
        max-h-[100vh]
        mx-auto outline-none relative
        overflow-hidden
      "
      overlayClassName="fixed inset-0 bg-[#00000083] backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={handleClose}
        className="sm:hidden absolute left-0 text-sm sm:text-lg cursor-pointer pl-4"
      >
        <RxCross2 />
      </button>

      <div className="pt-5 text-2xl font-semibold">
        <h1>Add Fees Entry</h1>
      </div>

      {/* Form */}
      <div className="mx-2 sm:mx-4 overflow-y-auto max-h-[70vh] pb-6 mt-5 pr-2">
        {/* STUDENT SEARCH */}
        <label className="text-md text-gray-700 font-semibold block mb-1">
          Student Name
        </label>

        <input
          type="text"
          value={query}
          onChange={(e) => searchStudent(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
          placeholder="Search student..."
        />

        {errors.student && (
          <p className="text-red-500 text-xs mt-1">{errors.student}</p>
        )}

        {query && filtered.length > 0 && (
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

        {/* COURSE NAME */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Course Name
        </label>
        <input
          type="text"
          value={courseName}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* COURSE PRICE */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Total Fees
        </label>
        <div className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md flex items-center gap-2">
          <FaRupeeSign className="text-gray-600" />
          <input value={totalFees} readOnly className="w-full bg-gray-100 outline-none" />
        </div>

        {/* PAID FEES */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Paid Fees
        </label>
        <div className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md flex items-center gap-2">
          <FaRupeeSign className="text-gray-600" />
          <input
            value={paidFees}
            onChange={(e) => setPaidFees(e.target.value)}
            type="number"
            className="w-full outline-none"
            placeholder="Paid amount"
          />
        </div>

        {errors.paidFees && (
          <p className="text-red-500 text-xs mt-1">{errors.paidFees}</p>
        )}

        {/* ⭐ PAYMENT MODE DROPDOWN (added here) */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Payment Mode
        </label>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none bg-white cursor-pointer"
        >
          <option >Select payment mode</option>
          <option value="CASH">CASH</option>
          <option value="UPI">UPI</option>
          <option value="CARD">CARD</option>
          <option value="BANK_TRANSFER">BANK_TRANSFER</option>

        </select>
         {errors.paymentMode && (
          <p className="text-red-500 text-xs mt-1">{errors.paymentMode}</p>
        )}


        {/* NOTE */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Note
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none resize-none"
          rows={3}
          placeholder="Add note (optional)"
        />

        {/* BUTTONS */}
        <div className="flex gap-4 justify-end mt-5">
          <button
            onClick={handleAddFees}
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

export default AddFeesEntry;
