import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import Api from "../../utils/apiClient";

// Modals (adjust import paths if needed)
import AddLeaveStudent from "../../components/features/leave/AddLeaveStudent";
import ViewLeaveStudentDetail from "../../components/features/leave/ViewLeaveStudent";


const LeaveStudentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  // Fetch leave-student list with pagination
  const fetchLeaves = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Api.get(`/leave-student/list?page=${page}&limit=${limit}`);
      const leaves = res.data?.data?.leaveStudent || [];
      const pag = res.data?.data?.pagination || {};

      if (pag.totalPage && page > pag.totalPage) {
        setPage(pag.totalPage);
      }

      setLeaveData(leaves);
      setPagination(pag);

      if (leaves.length === 0) setError("No leave-student records found");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch leave-student records.");
    } finally {
      setLoading(false);
    }
  };

  // Search with pagination 
  const searchLeaves = async (query) => {
    if (!query.trim()) {
      fetchLeaves();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await Api.get(
        `/leave-student/search?q=${query}&page=${page}&limit=${limit}`
      );
      const leaves = res.data?.data?.leaves || [];
      setLeaveData(leaves);
      setPagination(res.data?.data?.pagination || {});
      if (leaves.length === 0) setError(`No results for "${query}"`);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim()) {
      searchLeaves(searchQuery);
    } else {
      fetchLeaves();
    }
  }, [page, searchQuery]);

  // Events
  const handleViewClick = (leave) => {
    setSelectedLeave(leave);
    setShowViewModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setSelectedLeave(null);

    if (searchQuery.trim()) searchLeaves(searchQuery);
    else fetchLeaves();
  };

  // Pagination buttons logic
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
      } else if (
        (i === current - 3 && i > 1) ||
        (i === current + 3 && i < total)
      ) {
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Leave Students</h1>

      {/* Search + Add */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              setPage(1);
              const val = e.target.value;
              setSearchQuery(val);
              searchLeaves(val);
            }}
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white font-semibold rounded-lg px-6 py-3 shadow-md cursor-pointer"
        >
          Add Leave Student
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
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-2">
        <div
          className="overflow-x-auto"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Student Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Course Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Total Fees</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Paid Fees</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Pending Fees</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {leaveData.length > 0
                ? leaveData.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{leave.student?.name || "N/A"}</td>
                      <td className="px-4 py-3">{leave.student?.mobileNumber || "N/A"}</td>
                      <td className="px-4 py-3">{leave.student?.email || "N/A"}</td>
                      <td className="px-4 py-3">{leave.course?.courseName || "N/A"}</td>
                      <td className="px-4 py-3">{Number(leave.course?.coursePrice ?? 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">{Number(leave.totalPaidFees ?? 0).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">{Number((leave.pendingFees ?? 0)).toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewClick(leave)}
                          className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                        >
                          <GrView />
                        </button>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td colSpan="8" className="text-center py-6 text-gray-500">
                        {error || "No leave-student records available"}
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
      {showAddModal && (
        <AddLeaveStudent isOpen={showAddModal} onClose={handleModalClose} />
      )}
      {showViewModal && (
        <ViewLeaveStudentDetail
          isOpen={showViewModal}
          onClose={handleModalClose}
          leaveStudent={selectedLeave}
        />
      )}
    </div>
  );
};

export default LeaveStudentsPage;
