// AddInternshipEntry.jsx
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Modal from "react-modal";
import Api from "../../../utils/apiClient";
import { toast } from "react-toastify";

Modal.setAppElement("#root");

const AddInternshipEntry = ({ isOpen, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);

  // FORM STATES
  const [query, setQuery] = useState("");
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courseName, setCourseName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Manual inputs only
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [courses, setCourses] = useState([]); // ⭐ NEW
  const [errors, setErrors] = useState({});

  // FETCH STUDENTS
  useEffect(() => {
    fetchStudents();
    fetchCourses(); // ⭐ NEW
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await Api.get("/student/search?q=");
      const list = res?.data?.data?.students || [];
      setStudents(list);
      setFiltered(list);
    } catch (err) {
      console.log(err);
    }
  };

  // ⭐ Fetch full course list (for duration + unit)
  const fetchCourses = async () => {
    try {
      const res = await Api.get("/course/list");
      const list = res?.data?.data?.courses || [];
      setCourses(list);
    } catch (err) {
      console.log("Course load error");
    }
  };

  // Lock scroll
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

  // ⭐ calculateEndDate (same as AddStudent)
  const calculateEndDate = (start, duration, unit) => {
    if (!start || !duration || !unit) return "";

    const date = new Date(start);

    if (unit === "DAYS") date.setDate(date.getDate() + Number(duration));
    if (unit === "MONTHS") date.setMonth(date.getMonth() + Number(duration));
    if (unit === "YEARS")
      date.setFullYear(date.getFullYear() + Number(duration));

    return date.toISOString().split("T")[0];
  };

  // ⭐ Full working selectStudent()
  const selectStudent = async (stu) => {
    setQuery(stu.name);
    setStudentId(stu.id);
    setCourseId(stu.courseId);
    setFiltered([]);
    setErrors({});

    try {
      const res = await Api.get(`/student/details?id=${stu.id}`);
      const data = res.data?.data;

      if (data?.course) setCourseName(data.course.courseName);
      setPhone(data?.mobileNumber || "");
      setEmail(data?.email || "");

      // ⭐ Get full course details from course list
      const selectedCourse = courses.find((c) => c.id === stu.courseId);

      // ⭐ Auto Start Date = today
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);

      // ⭐ Auto End Date using selectedCourse duration
      if (selectedCourse) {
        const end = calculateEndDate(
          today,
          selectedCourse.courseDuration,
          selectedCourse.courseDurationUnit
        );
        setEndDate(end);
      } else {
        setEndDate("");
      }
    } catch (e) {
      console.log(e);
    }
  };

  const resetForm = () => {
    setQuery("");
    setStudentId("");
    setCourseName("");
    setCourseId("");
    setPhone("");
    setEmail("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose && onClose();
  };

  const handleAddInternship = async () => {
    try {
      await Api.post("/intershipletter/create", {
        studentId,
        courseId,
        courseName,
        phone,
        email,
        startDate,
        endDate,
      });

      toast.success("Internship letter generated successfully!");
      handleClose();
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        "Something went wrong";

      toast.error(msg);
      setErrors({ form: msg });
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
        <h1>Add Internship Letter</h1>
      </div>

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

        {/* PHONE NUMBER */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* EMAIL */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Email
        </label>
        <input
          type="text"
          value={email}
          readOnly
          className="w-full border bg-gray-100 border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

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

        {/* START DATE */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          Start Date
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* END DATE */}
        <label className="text-md text-gray-700 font-semibold block mt-4 mb-1">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border border-gray-400 rounded-lg px-3 py-2 text-md outline-none"
        />

        {/* BUTTONS */}
        <div className="flex gap-4 justify-end mt-5">
          <button
            onClick={handleAddInternship}
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

export default AddInternshipEntry;
