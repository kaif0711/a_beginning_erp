// FeesPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { FaRupeeSign, FaSearch } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import Api from "../../utils/apiClient";

// ==== MODALS (adjust path if needed) ====
import AddFeesEntry from "../../components/features/fees/AddFees";
import ViewFeesDetail from "../../components/features/fees/ViewFees";

const FeesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [feesData, setFeesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [pagination, setPagination] = useState({});

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

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

  // Format Date (DD-MM-YYYY)
  const toDDMMYYYY = (dateString) => {
    if (!dateString) return "N/A";
    const [yyyy, mm, dd] = dateString.split("T")[0].split("-");
    return `${dd}-${mm}-${yyyy}`;
  };

  // ===== Fetch fees with pagination =====
  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await Api.get(`/fees/list?page=${page}&limit=${limit}`);
      const fees = res.data?.data?.fees || [];
      const pag = res.data?.data?.pagination || {};

      // ➤ CHANGE: If current page > total pages (after delete), reset page to last valid
      if (pag.totalPage && page > pag.totalPage) {
        setPage(pag.totalPage);
      }

      setFeesData(fees);
      setPagination(pag);

      if (fees.length === 0) setError("No fees records found");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch fees records.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Search with pagination =====
  const searchStudents = async (query) => {
    if (!query.trim()) {
      fetchStudents();
      return;
    }
    setLoading(true);
    setError("");
    try {
      // BACKEND: change URL / query params as per your API
      const res = await Api.get(
        `/fees/search?q=${query}&page=${page}&limit=${limit}`
      );
      const fees = res.data?.data?.fees || [];
      setFeesData(fees);
      setPagination(res.data?.data?.pagination || {});
      if (fees.length === 0) setError(`No results for "${query}"`);
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when page changes
  useEffect(() => {
    if (searchQuery.trim()) {
      searchStudents(searchQuery);
    } else {
      fetchStudents();
    }
    // ➤ ADD dependency on page so that when page updates (after reset), fetch fires
  }, [page, searchQuery]);

  // Events
  const handleViewClick = (fee) => {
    setSelectedFee(fee);
    setShowViewModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setShowViewModal(false);
    setSelectedFee(null);

    // refresh list after add (or in future edit/delete)
    if (searchQuery.trim()) searchStudents(searchQuery);
    else fetchStudents();
  };

  // -------------------------------
  // PAGINATION NUMBER BUTTONS
  // -------------------------------
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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Fees Page</h1>

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
              searchStudents(val);
            }}
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary text-white font-semibold rounded-lg px-6 py-3 shadow-md"
        >
          Add Fees Entry
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
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Course Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Total Fees
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Paid Fees
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Pending Fees
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {feesData.length > 0
                ? feesData.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      {/* Student */}
                      <td className="px-4 py-3">
                        {fee.student?.name || "N/A"}
                      </td>

                      {/* Course */}
                      <td className="px-4 py-3">
                        {fee.course?.courseName || "N/A"}
                      </td>

                      {/* Total Fees */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FaRupeeSign className="text-sm" />
                          {Number(fee.course?.coursePrice ?? 0).toLocaleString(
                            "en-IN"
                          )}
                        </div>
                      </td>

                      {/* Paid Fees */}
                      <td className="px-4 py-3 ">
                        <div className="flex items-center gap-1">
                          <FaRupeeSign className="text-sm" />
                          {Number(fee.amount ?? 0).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Pending Fees */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <FaRupeeSign className="text-sm" />
                          {Number(
                            fee.pending ?? fee.course?.coursePrice - fee.amount
                          ).toLocaleString("en-IN")}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3">
                        {toDDMMYYYY(fee.date || fee.paymentDate)}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleViewClick(fee)}
                          className="bg-primary text-white rounded px-3 py-1 cursor-pointer"
                        >
                          <GrView />
                        </button>
                      </td>
                    </tr>
                  ))
                : !loading && (
                    <tr>
                      <td
                        colSpan="10"
                        className="text-center py-6 text-gray-500"
                      >
                        {error || "No fees records available"}
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NUMBERED PAGINATION */}
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
        <AddFeesEntry isOpen={showAddModal} onClose={handleModalClose} />
      )}

      {showViewModal && (
        <ViewFeesDetail
          isOpen3={showViewModal}
          onClose3={handleModalClose}
          fee={selectedFee}
        />
      )}
    </div>
  );
};

export default FeesPage;
