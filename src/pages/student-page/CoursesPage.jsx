// Final CoursePage.jsx with Pagination + Search Pagination
import React, { useEffect, useRef, useState } from "react";
import { FaRupeeSign, FaSearch } from "react-icons/fa";
import AddCourse from "../../components/features/courses/AddCourse";
import EditCourse from "../../components/features/courses/EditCourse";
import DeleteCourse from "../../components/features/courses/DeleteCourse";
import ViewCourseDetail from "../../components/features/courses/ViewCourse";
import Api from "../../utils/apiClient";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { GrView } from "react-icons/gr";
import { LiaRupeeSignSolid } from "react-icons/lia";

const CoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [coursesdata, setCoursesdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  // Modals
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);

  // Table drag scroll
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Fetch courses with pagination
  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.get(`/course/list?page=${page}&limit=${limit}`);
      const courses = data.data?.data?.courses || [];
      setCoursesdata(courses);
      setPagination(data.data?.data?.pagination || {});
      if (courses.length === 0) setError("No courses found");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  // Search with pagination
  const searchCourses = async (query) => {
    if (!query.trim()) {
      fetchCourses();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await Api.get(
        `/course/search?q=${query}&page=${page}&limit=${limit}`
      );
      const courses = data.data?.data?.course || [];

      setCoursesdata(courses);
      setPagination(data.data?.data?.pagination || {});
      if (courses.length === 0) setError(`No results for "${query}"`);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page changes
  useEffect(() => {
    if (searchQuery.trim()) searchCourses(searchQuery);
    else fetchCourses();
  }, [page]);

  // Events
  const handleEditClick = (id) => {
    setSelectedCourseId(id);
    setShowModal1(true);
  };
  const handleDeleteClick = (id) => {
    setSelectedCourseId(id);
    setShowModal2(true);
  };
  const handleViewClick = (course) => {
    setViewCourse(course);
    setShowModal3(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setShowModal1(false);
    setShowModal2(false);
    setShowModal3(false);
    setSelectedCourseId(null);

    if (searchQuery.trim()) searchCourses(searchQuery);
    else fetchCourses();
  };

  // Render Pagination
  const renderPageNumbers = () => {
    const total = pagination.totalPage;
    const current = pagination.pageNo;

    if (!total) return null;

    let pages = [];

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - current) <= 2) {
        pages.push(
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 rounded ${
              i === current ? "bg-primary text-white" : "bg-gray-200"
            }`}
          >
            {i}
          </button>
        );
      } else if (i === current - 3 || i === current + 3) {
        pages.push(
          <span key={`dots-${i}`} className="px-2">
            ...
          </span>
        );
      }
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-8 md:px-16 lg:px-20 overflow-hidden">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Courses Page</h1>

      {/* Search + Add */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setPage(1);
              const val = e.target.value;
              setSearchQuery(val);
              searchCourses(val);
            }}
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-white font-semibold rounded-lg px-6 py-3 shadow-md"
        >
          Add Course
        </button>
      </div>

      {error && !loading && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
          Loading...
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="overflow-x-auto"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Course Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {coursesdata.length > 0
                ? coursesdata.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{course.courseName}</td>
                      <td className="px-4 py-3 flex items-center">
                        <FaRupeeSign className="text-sm" />
                        {(Number(course.coursePrice) ?? 0).toLocaleString(
                          "en-IN"
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {course.courseDuration +
                          " " +
                          course.courseDurationUnit}
                      </td>
                      <td className="px-4 py-3 capitalize">
                        {course.courseDescription}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewClick(course)}
                            className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                          >
                            <GrView />
                          </button>

                          <button
                            onClick={() => handleEditClick(course.id)}
                            className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                          >
                            <TiEdit />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(course.id)}
                            className="bg-red-500 text-white rounded px-3 py-1 cursor-pointer"
                          >
                            <RiDeleteBin6Line />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-6 text-gray-500"
                      >
                        {error || "No courses available"}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPage > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Prev
          </button>

          {renderPageNumbers()}

          <button
            disabled={page >= pagination.totalPage}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      {showModal && <AddCourse isOpen={showModal} onClose={handleModalClose} />}
      {showModal1 && (
        <EditCourse
          isOpen1={showModal1}
          courseId={selectedCourseId}
          onClose1={handleModalClose}
        />
      )}
      {showModal2 && (
        <DeleteCourse
          isOpen2={showModal2}
          courseId={selectedCourseId}
          onClose2={handleModalClose}
        />
      )}
      {showModal3 && (
        <ViewCourseDetail
          isOpen3={showModal3}
          onClose3={handleModalClose}
          course={viewCourse}
        />
      )}
    </div>
  );
};

export default CoursesPage;
